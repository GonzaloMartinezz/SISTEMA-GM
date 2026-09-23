// ============================================================================
// SISTEMA GM · M-03 SEGUIMIENTOS · ACCESO A DATOS
// ----------------------------------------------------------------------------
// Todo lo que el módulo le pide a Supabase pasa por acá. Las vistas nunca ven
// un nombre de columna: hablan en el idioma del negocio (lead.clinica) y este
// archivo traduce a la base (negocio). Cuando una planilla de Drive corrige un
// dato, entra por la misma tabla y sale por la misma traducción.
//
// La clave de negocio es `codigo` (LD-001), no el uuid: es lo que se ve en la
// planilla y lo que el usuario reconoce. Todos los update y delete van por ahí.
// ============================================================================

import { supabase, isSupabaseConfigured } from '../../../services/supabaseClient';
import { LEADS_DEMO } from '../data/leadsDemo';
import { PLANTILLAS as PLANTILLAS_DEMO } from '../data/plantillas';

const modoDemo = () => !isSupabaseConfigured;
const demora = (ms) => new Promise((r) => setTimeout(r, ms));

const HOY = () => new Date().toISOString().slice(0, 10);

/** Días desde una fecha. Sin fecha devuelve 99: nunca contactado es lo más frío. */
const diasDesde = (fecha) => {
  if (!fecha) return 99;
  return Math.max(0, Math.floor((Date.now() - new Date(fecha).getTime()) / 86400000));
};

// ---------------------------------------------------------------------------
// Traducción base <-> tablero
// ---------------------------------------------------------------------------

const aLead = (r) => ({
  id: r.codigo || r.id,
  uuid: r.id,
  cuentaId: r.cuenta_codigo || null,
  nombre: r.nombre,
  apellido: r.apellido,
  clinica: r.negocio,
  especialidad: r.rubro,
  telefono: r.telefono,
  email: r.email,
  zona: r.zona,
  etapa: r.etapa,
  equipo: r.equipo,
  montoUsd: Number(r.monto_usd || 0),
  prioridad: r.prioridad,
  interacciones: r.interacciones || 0,
  ultimoContactoIso: r.ultimo_contacto || null,
  ultimoContacto: r.ultimo_contacto
    ? new Date(r.ultimo_contacto).toLocaleDateString('es-AR')
    : null,
  diasSinContacto: diasDesde(r.ultimo_contacto),
  proximoPaso: r.proximo_paso,
  altaIso: r.created_at ? String(r.created_at).slice(0, 10) : null,
});

const aFila = (l) => ({
  codigo: l.id,
  nombre: l.nombre,
  apellido: l.apellido,
  negocio: l.clinica,
  rubro: l.especialidad,
  telefono: l.telefono || null,
  email: l.email || null,
  zona: l.zona || null,
  etapa: l.etapa || 'comienzo',
  equipo: l.equipo || null,
  monto_usd: Number(l.montoUsd || 0),
  prioridad: l.prioridad || 'media',
  proximo_paso: l.proximoPaso || null,
});

// ---------------------------------------------------------------------------
// Leads
// ---------------------------------------------------------------------------

export async function listarLeads() {
  if (modoDemo()) {
    await demora(120);
    return LEADS_DEMO.map((l) => ({ ...l }));
  }

  const { data, error } = await supabase
    .from('gm_leads')
    .select('*, gm_clientes(codigo)')
    .order('codigo');

  if (error) throw new Error(error.message);

  return (data || []).map((r) =>
    aLead({
      ...r,
      cuenta_codigo: r.gm_clientes?.codigo?.startsWith('CTA-') ? r.gm_clientes.codigo : null,
    })
  );
}

export async function moverLead(codigo, etapaId) {
  if (modoDemo()) return true;
  const { error } = await supabase.from('gm_leads').update({ etapa: etapaId }).eq('codigo', codigo);
  if (error) throw new Error(error.message);
  return true;
}

export async function crearLead(lead) {
  if (modoDemo()) return { ...lead, diasSinContacto: 99, interacciones: 0 };
  const { data, error } = await supabase.from('gm_leads').insert(aFila(lead)).select().single();
  if (error) throw new Error(error.message);
  return aLead(data);
}

export async function actualizarLead(codigo, cambios) {
  if (modoDemo()) return { ...cambios };
  const { data, error } = await supabase
    .from('gm_leads')
    .update(aFila(cambios))
    .eq('codigo', codigo)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return aLead(data);
}

export async function eliminarLead(codigo) {
  if (modoDemo()) return true;
  const { error } = await supabase.from('gm_leads').delete().eq('codigo', codigo);
  if (error) throw new Error(error.message);
  return true;
}

// ---------------------------------------------------------------------------
// Historial de etapas
// ---------------------------------------------------------------------------
// Lo escribe un trigger en la base cada vez que un lead cambia de etapa. Acá
// sólo se lee. El tramo abierto (sin `hasta`) es la etapa de hoy.

const aTramo = (r) => {
  const desde = r.desde;
  const hasta = r.hasta || null;
  const fin = hasta ? new Date(hasta) : new Date();
  const dias = Math.max(0, Math.round((fin - new Date(desde)) / 86400000));
  return {
    codigo: r.codigo,
    leadCodigo: r.lead_codigo,
    etapa: r.etapa,
    desde,
    hasta,
    enCurso: !hasta,
    dias,
    nota: r.nota || null,
  };
};

export async function listarHistorial() {
  if (modoDemo()) {
    await demora(80);
    // En demo se arma un tramo abierto por lead desde su último contacto: no se
    // inventan pasos anteriores, porque un historial inventado no sirve.
    return LEADS_DEMO.map((l, i) => {
      const desde = new Date(Date.now() - (l.diasSinContacto + 3) * 86400000)
        .toISOString()
        .slice(0, 10);
      return {
        codigo: `HE-${String(i + 1).padStart(3, '0')}`,
        leadCodigo: l.id,
        etapa: l.etapa,
        desde,
        hasta: null,
        enCurso: true,
        dias: l.diasSinContacto + 3,
        nota: 'Tramo inicial (demo).',
      };
    });
  }

  const { data, error } = await supabase
    .from('gm_lead_etapas')
    .select('*')
    .order('lead_codigo')
    .order('desde');

  if (error) throw new Error(error.message);
  return (data || []).map(aTramo);
}

// ---------------------------------------------------------------------------
// Contacto: cada mensaje que sale queda anotado
// ---------------------------------------------------------------------------

/**
 * Suma una interacción al lead, corre su fecha de último contacto y deja el
 * mensaje registrado. Los tres pasos van juntos a propósito: si el envío no
 * quedara anotado, la sección de mensajería mostraría una lista incompleta y
 * el semáforo de temperatura mentiría.
 */
export async function registrarInteraccion(codigo, { canal = 'WhatsApp', texto = '', asunto = null, plantilla = null } = {}) {
  if (modoDemo()) return true;

  const { data } = await supabase
    .from('gm_leads')
    .select('interacciones')
    .eq('codigo', codigo)
    .maybeSingle();

  const { error } = await supabase
    .from('gm_leads')
    .update({ interacciones: (data?.interacciones || 0) + 1, ultimo_contacto: HOY() })
    .eq('codigo', codigo);

  if (error) throw new Error(error.message);

  if (texto) {
    const { error: errMsg } = await supabase.from('gm_mensajes').insert({
      lead_codigo: codigo,
      canal,
      direccion: 'enviado',
      plantilla,
      asunto,
      texto,
    });
    // Si esto falla, el contacto ya quedó registrado en el lead pero el mensaje
    // no quedó en el historial: se avisa igual, para que se vuelva a mandar.
    if (errMsg) throw new Error(`Se registró el contacto pero no el mensaje: ${errMsg.message}`);
  }

  return true;
}

const aMensaje = (r) => ({
  id: r.codigo || r.id,
  leadCodigo: r.lead_codigo,
  fecha: r.fecha,
  canal: r.canal,
  direccion: r.direccion,
  plantilla: r.plantilla,
  asunto: r.asunto,
  texto: r.texto,
  respondido: r.respondido,
  operador: r.operador,
});

export async function listarMensajesDeLeads(limite = 200) {
  if (modoDemo()) return [];
  const { data, error } = await supabase
    .from('gm_mensajes')
    .select('*')
    .not('lead_codigo', 'is', null)
    .order('fecha', { ascending: false })
    .limit(limite);

  if (error) throw new Error(error.message);
  return (data || []).map(aMensaje);
}

export async function marcarRespondido(id, valor = true) {
  if (modoDemo()) return true;
  const { error } = await supabase.from('gm_mensajes').update({ respondido: valor }).eq('codigo', id);
  if (error) throw new Error(error.message);
  return true;
}

// ---------------------------------------------------------------------------
// Respuestas rápidas
// ---------------------------------------------------------------------------

const aPlantilla = (p) => ({
  id: p.codigo,
  titulo: p.titulo,
  canal: p.canal,
  etapa: p.etapa,
  asunto: p.asunto,
  texto: p.texto,
});

export async function listarPlantillas() {
  if (modoDemo()) {
    await demora(80);
    return PLANTILLAS_DEMO.map((p) => ({ ...p }));
  }
  const { data, error } = await supabase
    .from('gm_plantillas')
    .select('*')
    .eq('activa', true)
    .order('codigo');

  if (error) throw new Error(error.message);
  return (data || []).map(aPlantilla);
}

export async function guardarPlantilla(plantilla) {
  if (modoDemo()) return { ...plantilla };
  const fila = {
    titulo: plantilla.titulo,
    canal: plantilla.canal,
    etapa: plantilla.etapa || null,
    asunto: plantilla.asunto || null,
    texto: plantilla.texto,
  };
  // Sin código es un alta: el trigger de la base le pone el número que sigue.
  if (plantilla.id) fila.codigo = plantilla.id;

  const { data, error } = plantilla.id
    ? await supabase.from('gm_plantillas').upsert(fila, { onConflict: 'codigo' }).select().single()
    : await supabase.from('gm_plantillas').insert(fila).select().single();

  if (error) throw new Error(error.message);
  return aPlantilla(data);
}

export async function eliminarPlantilla(codigo) {
  if (modoDemo()) return true;
  const { error } = await supabase.from('gm_plantillas').delete().eq('codigo', codigo);
  if (error) throw new Error(error.message);
  return true;
}
