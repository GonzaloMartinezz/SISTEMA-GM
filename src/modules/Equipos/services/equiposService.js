// ============================================================================
// SISTEMA GM · M-02 EQUIPAMIENTOS · SERVICIO
// ----------------------------------------------------------------------------
// Fuente de verdad: Supabase. El catálogo se lee de la vista gm_v_stock, que
// ya trae el margen, el inmovilizado y el estado de stock calculados: así el
// frontend no reimplementa esas cuentas y el tablero, los informes y las
// alertas dicen siempre lo mismo.
//
// El movimiento de stock NO se hace acá con dos consultas: se llama a la
// función gm_mover_stock, que descuenta y registra en una sola transacción.
// ============================================================================

import { supabase, isSupabaseConfigured } from '../../../services/supabaseClient';

const modoDemo = () => !isSupabaseConfigured;

// ---------------------------------------------------------------------------
// LECTURA
// ---------------------------------------------------------------------------

/** Fila de gm_v_stock -> forma que consumen las vistas. */
const aEquipo = (r) => ({
  id: r.id,
  codigo: r.codigo,
  nombre: r.nombre,
  marca: r.marca,
  modelo: r.modelo,
  rubro: r.categoria,
  tipo: r.tipo,
  costoUsd: Number(r.costo_usd || 0),
  precioUsd: Number(r.precio_usd || 0),
  margenUsd: Number(r.margen_usd || 0),
  margenPct: Number(r.margen_pct || 0),
  stock: Number(r.stock || 0),
  transito: Number(r.transito || 0),
  minStock: Number(r.min_stock || 0),
  vendidos12m: Number(r.vendidos_12m || 0),
  inmovilizadoUsd: Number(r.inmovilizado_usd || 0),
  estadoStock: r.estado_stock,
  mesesCobertura: r.meses_cobertura == null ? null : Number(r.meses_cobertura),
});

export async function listarEquipos() {
  if (modoDemo()) return [];

  const { data, error } = await supabase.from('gm_v_stock').select('*').order('codigo');
  if (error) {
    console.error('[equiposService] listarEquipos:', error.message);
    return [];
  }
  return (data || []).map(aEquipo);
}

/** Ficha técnica completa: todas las specs de todos los equipos, en un viaje. */
export async function listarSpecs() {
  if (modoDemo()) return [];

  const { data, error } = await supabase
    .from('gm_equipo_specs')
    .select('id, codigo, equipo_id, label, valor, orden, gm_equipos(codigo)')
    .order('orden');

  if (error) {
    console.error('[equiposService] listarSpecs:', error.message);
    return [];
  }

  return (data || []).map((s) => ({
    id: s.id,
    codigo: s.codigo,
    equipoId: s.equipo_id,
    equipoCodigo: s.gm_equipos?.codigo || null,
    label: s.label,
    valor: s.valor,
    orden: s.orden ?? 0,
  }));
}

export async function listarMovimientos({ limite = 200 } = {}) {
  if (modoDemo()) return [];

  const { data, error } = await supabase
    .from('gm_movimientos_stock')
    .select('id, codigo, equipo_id, tipo, cantidad, motivo, operador, created_at, gm_equipos(codigo, nombre)')
    .order('created_at', { ascending: false })
    .limit(limite);

  if (error) {
    console.error('[equiposService] listarMovimientos:', error.message);
    return [];
  }

  return (data || []).map((m) => ({
    id: m.id,
    codigo: m.codigo,
    equipoCodigo: m.gm_equipos?.codigo || null,
    equipoNombre: m.gm_equipos?.nombre || 'Equipo dado de baja',
    tipo: m.tipo,
    cantidad: Number(m.cantidad || 0),
    motivo: m.motivo,
    operador: m.operador,
    fecha: m.created_at,
  }));
}

// ---------------------------------------------------------------------------
// ABM del catálogo
// ---------------------------------------------------------------------------

/** Objeto del formulario -> fila de gm_equipos. */
const aFila = (e) => ({
  codigo: e.codigo || null,
  nombre: e.nombre,
  marca: e.marca || null,
  modelo: e.modelo || null,
  categoria: e.rubro,
  tipo: e.tipo,
  costo_usd: Number(e.costoUsd || 0),
  precio_usd: Number(e.precioUsd || 0),
  stock: Number(e.stock || 0),
  transito: Number(e.transito || 0),
  min_stock: Number(e.minStock || 0),
  vendidos_12m: Number(e.vendidos12m || 0),
  garantia_meses: e.garantiaMeses === '' ? null : Number(e.garantiaMeses),
  dimensiones: e.dimensiones || null,
  consumo: e.consumo || null,
  catalogo_url: e.catalogoUrl || null,
});

export async function crearEquipo(equipo) {
  const fila = aFila(equipo);
  if (!fila.codigo) delete fila.codigo; // el numerador de la base le pone el suyo

  const { data, error } = await supabase.from('gm_equipos').insert(fila).select().single();
  if (error) throw new Error(error.message);
  return data;
}

export async function actualizarEquipo(id, equipo) {
  const { data, error } = await supabase
    .from('gm_equipos')
    .update(aFila(equipo))
    .eq('id', id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

/** Baja lógica: el equipo sale del catálogo pero su historial se conserva. */
export async function eliminarEquipo(id) {
  const { error } = await supabase.from('gm_equipos').update({ activo: false }).eq('id', id);
  if (error) throw new Error(error.message);
  return true;
}

// ---------------------------------------------------------------------------
// Ficha técnica
// ---------------------------------------------------------------------------

export async function guardarSpec(spec) {
  const fila = {
    equipo_id: spec.equipoId,
    label: spec.label,
    valor: spec.valor,
    orden: Number(spec.orden || 0),
  };

  const { data, error } = spec.id
    ? await supabase.from('gm_equipo_specs').update(fila).eq('id', spec.id).select().single()
    : await supabase.from('gm_equipo_specs').insert(fila).select().single();

  if (error) throw new Error(error.message);
  return data;
}

export async function eliminarSpec(id) {
  const { error } = await supabase.from('gm_equipo_specs').delete().eq('id', id);
  if (error) throw new Error(error.message);
  return true;
}

// ---------------------------------------------------------------------------
// Movimientos de stock
// ---------------------------------------------------------------------------

/**
 * Registra un movimiento y ajusta el stock en la misma transacción.
 * tipo: 'ingreso' | 'egreso' | 'transito'
 */
export async function moverStock({ codigo, tipo, cantidad, motivo, operador }) {
  const { data, error } = await supabase.rpc('gm_mover_stock', {
    p_codigo: codigo,
    p_tipo: tipo,
    p_cantidad: Number(cantidad),
    p_motivo: motivo || null,
    p_operador: operador || null,
  });

  if (error) throw new Error(error.message);
  return data;
}
