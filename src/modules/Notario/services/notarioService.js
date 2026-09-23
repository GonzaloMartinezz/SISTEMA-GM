// ============================================================================
// SISTEMA GM · M-05 NOTARIO 360 · ACCESO A DATOS
// ----------------------------------------------------------------------------
// Cuatro fuentes, tres de ellas de sólo lectura:
//
//   gm_notas          -> lo único que este módulo escribe. Es tu cuaderno.
//   gm_v_entidades    -> el índice de todo lo que se puede anotar (lectura)
//   gm_v_bitacora     -> lo que pasó, juntado de todos los módulos (lectura)
//   gm_cuentas        -> el padrón financiero (lectura desde acá)
//
// Que la bitácora sea una vista y no una tabla es la decisión importante del
// módulo: no hay nada que sincronizar ni que pueda quedar desactualizado. Si
// mañana Seguimientos registra un mensaje, acá aparece sin tocar una línea.
// ============================================================================

import { supabase, isSupabaseConfigured } from '../../../services/supabaseClient';
import { NOTAS_DEMO, ENTIDADES_DEMO, BITACORA_DEMO } from '../data/notarioDemo';

const modoDemo = () => !isSupabaseConfigured;
const demora = (ms) => new Promise((r) => setTimeout(r, ms));

// ---------------------------------------------------------------------------
// Notas
// ---------------------------------------------------------------------------

const aNota = (r) => ({
  id: r.codigo || r.id,
  uuid: r.id,
  titulo: r.titulo || '',
  texto: r.texto,
  tipo: r.tipo || 'operativa',
  entidad: r.entidad || null,
  entidadCodigo: r.entidad_codigo || null,
  etiquetas: r.etiquetas || [],
  fijada: Boolean(r.fijada),
  operador: r.operador || 'G. Martínez',
  creada: r.created_at,
  actualizada: r.updated_at || r.created_at,
});

/**
 * Las etiquetas llegan del formulario como texto suelto ("precio, urgente").
 * Se normalizan acá y no en la vista: si cada pantalla las partiera a su
 * manera, "Precio" y "precio" terminarían siendo dos etiquetas distintas.
 */
export const parsearEtiquetas = (valor) => {
  if (Array.isArray(valor)) return valor;
  return String(valor || '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)
    .filter((e, i, a) => a.indexOf(e) === i);
};

const aFila = (n) => ({
  titulo: n.titulo || null,
  texto: n.texto,
  tipo: n.tipo || 'operativa',
  entidad: n.entidad || null,
  entidad_codigo: n.entidadCodigo || null,
  etiquetas: parsearEtiquetas(n.etiquetas),
  operador: n.operador || 'G. Martínez',
});

export async function listarNotas() {
  if (modoDemo()) {
    await demora(110);
    return NOTAS_DEMO.map((n) => ({ ...n }));
  }
  const { data, error } = await supabase
    .from('gm_notas')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[notario] listarNotas', error.message);
    return [];
  }
  return (data || []).map(aNota);
}

export async function crearNota(nota) {
  if (modoDemo()) {
    return { ...nota, id: `NT-${Date.now()}`, creada: new Date().toISOString() };
  }
  const { data, error } = await supabase.from('gm_notas').insert(aFila(nota)).select().single();
  if (error) throw new Error(error.message);
  return aNota(data);
}

export async function actualizarNota(codigo, cambios) {
  if (modoDemo()) return { ...cambios, id: codigo };
  const { data, error } = await supabase
    .from('gm_notas')
    .update(aFila(cambios))
    .eq('codigo', codigo)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return aNota(data);
}

/** Fijar es lo que más se toca, así que va por su propia función. */
export async function fijarNota(codigo, fijada) {
  if (modoDemo()) return true;
  const { error } = await supabase.from('gm_notas').update({ fijada }).eq('codigo', codigo);
  if (error) throw new Error(error.message);
  return true;
}

export async function eliminarNota(codigo) {
  if (modoDemo()) return true;
  const { error } = await supabase.from('gm_notas').delete().eq('codigo', codigo);
  if (error) throw new Error(error.message);
  return true;
}

// ---------------------------------------------------------------------------
// Índice de entidades
// ---------------------------------------------------------------------------

const aEntidad = (r) => ({
  entidad: r.entidad,
  codigo: r.codigo,
  nombre: r.nombre,
  detalle: r.detalle,
  busqueda: r.busqueda,
});

export async function listarEntidades() {
  if (modoDemo()) {
    await demora(80);
    return ENTIDADES_DEMO.map((e) => ({ ...e }));
  }
  const { data, error } = await supabase.from('gm_v_entidades').select('*').order('entidad');
  if (error) {
    console.error('[notario] listarEntidades', error.message);
    return [];
  }
  return (data || []).map(aEntidad);
}

// ---------------------------------------------------------------------------
// Bitácora
// ---------------------------------------------------------------------------

const aHecho = (r, i) => ({
  // La bitácora es una unión de tablas distintas: el código solo no alcanza
  // como clave (puede repetirse entre módulos). La clave junta las tres cosas
  // que sí lo identifican.
  clave: `${r.modulo}:${r.clase}:${r.codigo || i}`,
  fecha: r.fecha,
  modulo: r.modulo,
  clase: r.clase,
  titulo: r.titulo,
  detalle: r.detalle,
  entidad: r.entidad,
  entidadCodigo: r.entidad_codigo,
  codigo: r.codigo,
  operador: r.operador,
});

export async function listarBitacora(limite = 400) {
  if (modoDemo()) {
    await demora(120);
    return BITACORA_DEMO.map(aHecho);
  }
  const { data, error } = await supabase
    .from('gm_v_bitacora')
    .select('*')
    .order('fecha', { ascending: false })
    .limit(limite);

  if (error) {
    console.error('[notario] listarBitacora', error.message);
    return [];
  }
  return (data || []).map(aHecho);
}

// ---------------------------------------------------------------------------
// Cuentas
// ---------------------------------------------------------------------------

const aCuenta = (r) => ({
  id: r.numero,
  numero: r.numero,
  cliente: r.gm_clientes?.negocio || null,
  clienteCodigo: r.gm_clientes?.codigo || null,
  clienteId: r.cliente_id || null,
  tipo: r.tipo,
  estado: r.estado,
  etapa: r.etapa,
  progreso: Number(r.progreso) || 0,
  responsable: r.responsable,
  montoNegociado: Number(r.monto_negociado) || 0,
  moneda: r.moneda || 'ARS',
  alta: r.alta,
  vencimiento: r.vencimiento,
  ultimaVisita: r.ultima_visita,
  proximoPaso: r.proximo_paso,
  sucursal: r.sucursal,
  convenio: r.convenio,
  bloqueos: r.bloqueos,
  avisos: r.avisos || [],
});

export async function listarCuentas() {
  if (modoDemo()) return [];
  const { data, error } = await supabase
    .from('gm_cuentas')
    .select('*, gm_clientes(codigo, negocio)')
    .order('numero');

  if (error) {
    console.error('[notario] listarCuentas', error.message);
    return [];
  }
  return (data || []).map(aCuenta);
}

/** Formulario de cuenta -> fila de gm_cuentas. Sin `numero`: lo pone el trigger. */
const aFilaCuenta = (c) => ({
  cliente_id: c.clienteId || null,
  tipo: c.tipo || null,
  estado: c.estado || null,
  etapa: c.etapa || null,
  progreso: c.progreso === '' || c.progreso == null ? 0 : Number(c.progreso),
  responsable: c.responsable || null,
  monto_negociado: c.montoNegociado === '' || c.montoNegociado == null ? 0 : Number(c.montoNegociado),
  moneda: c.moneda || 'ARS',
  alta: c.alta || null,
  vencimiento: c.vencimiento || null,
  proximo_paso: c.proximoPaso || null,
  sucursal: c.sucursal || null,
  convenio: c.convenio || null,
  bloqueos: c.bloqueos || null,
});

export async function crearCuenta(cuenta) {
  if (modoDemo()) return { ...cuenta, numero: `CTA-${Date.now()}` };
  const { data, error } = await supabase
    .from('gm_cuentas')
    .insert(aFilaCuenta(cuenta))
    .select('*, gm_clientes(codigo, negocio)')
    .single();
  if (error) throw new Error(error.message);
  return aCuenta(data);
}

export async function actualizarCuenta(numero, cambios) {
  if (modoDemo()) return { ...cambios, numero };
  const { data, error } = await supabase
    .from('gm_cuentas')
    .update(aFilaCuenta(cambios))
    .eq('numero', numero)
    .select('*, gm_clientes(codigo, negocio)')
    .single();
  if (error) throw new Error(error.message);
  return aCuenta(data);
}
