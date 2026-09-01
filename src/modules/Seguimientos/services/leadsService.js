// ============================================================================
// SISTEMA GM · SEGUIMIENTOS · SERVICIO DE LEADS
// ----------------------------------------------------------------------------
// Conectado a Supabase (gm_leads y gm_plantillas), con caída a datos demo.
// ============================================================================

import { supabase, isSupabaseConfigured } from '../../../services/supabaseClient';
import { LEADS_DEMO } from '../data/leadsDemo';
import { PLANTILLAS as PLANTILLAS_DEMO } from '../data/plantillas';

const delay = (ms) => new Promise((r) => setTimeout(r, ms));
const modoDemo = () => !isSupabaseConfigured;

const diasDesde = (fecha) => {
  if (!fecha) return 99;
  const ms = Date.now() - new Date(fecha).getTime();
  return Math.max(0, Math.floor(ms / 86400000));
};

/** Fila de Supabase -> forma que usa el tablero. */
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
  ultimoContacto: r.ultimo_contacto
    ? new Date(r.ultimo_contacto).toLocaleDateString('es-AR')
    : null,
  diasSinContacto: diasDesde(r.ultimo_contacto),
  proximoPaso: r.proximo_paso,
});

export async function listarLeads() {
  if (modoDemo()) {
    await delay(120);
    return LEADS_DEMO.map((l) => ({ ...l }));
  }

  const { data, error } = await supabase
    .from('gm_leads')
    .select('*, gm_clientes(codigo)')
    .order('codigo');

  if (error) {
    console.error('[leadsService] listarLeads:', error.message);
    return [];
  }

  return (data || []).map((r) =>
    aLead({ ...r, cuenta_codigo: r.gm_clientes?.codigo?.startsWith('CTA-') ? r.gm_clientes.codigo : null })
  );
}

export async function moverLead(leadCodigo, etapaId) {
  if (modoDemo()) return { leadCodigo, etapaId };
  const { error } = await supabase
    .from('gm_leads')
    .update({ etapa: etapaId })
    .eq('codigo', leadCodigo);
  if (error) throw new Error(error.message);
  return { leadCodigo, etapaId };
}

export async function registrarInteraccion(leadCodigo, canal) {
  if (modoDemo()) return true;

  const { data, error } = await supabase
    .from('gm_leads')
    .select('interacciones')
    .eq('codigo', leadCodigo)
    .maybeSingle();
  if (error) return false;

  const { error: e2 } = await supabase
    .from('gm_leads')
    .update({
      interacciones: (data?.interacciones || 0) + 1,
      ultimo_contacto: new Date().toISOString().slice(0, 10),
    })
    .eq('codigo', leadCodigo);
  if (e2) console.warn('[leadsService] interacción no registrada:', e2.message, canal);
  return true;
}

// ---------------------------------------------------------------------------
// ABM de leads
// ---------------------------------------------------------------------------

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

export async function crearLead(lead) {
  const { data, error } = await supabase.from('gm_leads').insert(aFila(lead)).select().single();
  if (error) throw new Error(error.message);
  return aLead(data);
}

export async function actualizarLead(codigo, cambios) {
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
  const { error } = await supabase.from('gm_leads').delete().eq('codigo', codigo);
  if (error) throw new Error(error.message);
  return true;
}

// ---------------------------------------------------------------------------
// Respuestas rápidas
// ---------------------------------------------------------------------------

export async function listarPlantillas() {
  if (modoDemo()) return PLANTILLAS_DEMO;

  const { data, error } = await supabase
    .from('gm_plantillas')
    .select('*')
    .eq('activa', true)
    .order('codigo');

  if (error) {
    console.error('[leadsService] listarPlantillas:', error.message);
    return PLANTILLAS_DEMO;
  }

  return (data || []).map((p) => ({
    id: p.codigo,
    titulo: p.titulo,
    canal: p.canal,
    etapa: p.etapa,
    asunto: p.asunto,
    texto: p.texto,
  }));
}

export async function guardarPlantilla(plantilla) {
  const fila = {
    codigo: plantilla.id,
    titulo: plantilla.titulo,
    canal: plantilla.canal,
    etapa: plantilla.etapa,
    asunto: plantilla.asunto || null,
    texto: plantilla.texto,
  };
  const { data, error } = await supabase
    .from('gm_plantillas')
    .upsert(fila, { onConflict: 'codigo' })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function eliminarPlantilla(codigo) {
  const { error } = await supabase.from('gm_plantillas').delete().eq('codigo', codigo);
  if (error) throw new Error(error.message);
  return true;
}
