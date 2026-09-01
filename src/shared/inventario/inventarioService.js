// ============================================================================
// SISTEMA GM · CAPA COMPARTIDA · SERVICIO DE INVENTARIO
// ----------------------------------------------------------------------------
// Conectado a Supabase (gm_equipos + gm_equipo_specs), con caída a demo.
// ============================================================================

import { supabase, isSupabaseConfigured } from '../../services/supabaseClient';
import { EQUIPOS } from './inventarioDemo';

const delay = (ms) => new Promise((r) => setTimeout(r, ms));
const modoDemo = () => !isSupabaseConfigured;

/** Enriquece cada equipo con márgenes, rotación y estado de stock. */
export function enriquecer(e) {
  const margenUsd = e.precioUsd - e.costoUsd;
  const margenPct = e.precioUsd ? (margenUsd / e.precioUsd) * 100 : 0;
  const disponible = e.stock + e.transito;
  const rotacionMensual = (e.vendidos12m || 0) / 12;
  const mesesDeStock = rotacionMensual ? disponible / rotacionMensual : Infinity;

  let estadoStock = 'normal';
  if (e.stock === 0) estadoStock = 'sin-stock';
  else if (e.stock <= e.minStock) estadoStock = 'bajo';
  else if (mesesDeStock > 12) estadoStock = 'sobrestock';

  return {
    ...e,
    margenUsd,
    margenPct,
    disponible,
    rotacionMensual,
    mesesDeStock,
    estadoStock,
    facturacion12m: (e.vendidos12m || 0) * e.precioUsd,
  };
}

/** Fila de Supabase -> forma que usa el módulo. */
const aEquipo = (r) => ({
  id: r.codigo || r.id,
  uuid: r.id,
  nombre: r.nombre,
  marca: r.marca,
  modelo: r.modelo,
  categoria: r.categoria,
  tipo: r.tipo,
  costoUsd: Number(r.costo_usd || 0),
  precioUsd: Number(r.precio_usd || 0),
  stock: Number(r.stock || 0),
  transito: Number(r.transito || 0),
  minStock: Number(r.min_stock || 0),
  vendidos12m: Number(r.vendidos_12m || 0),
  ficha: {
    garantiaMeses: r.garantia_meses || 0,
    dimensiones: r.dimensiones || '—',
    consumo: r.consumo || '—',
    specs: (r.gm_equipo_specs || [])
      .slice()
      .sort((a, b) => a.orden - b.orden)
      .map((s) => ({ label: s.label, valor: s.valor })),
  },
  catalogoUrl: r.catalogo_url || null,
});

export async function listarEquipos() {
  if (modoDemo()) {
    await delay(120);
    return EQUIPOS.map(enriquecer);
  }

  const { data, error } = await supabase
    .from('gm_equipos')
    .select('*, gm_equipo_specs(label, valor, orden)')
    .eq('activo', true)
    .order('codigo');

  if (error) {
    console.error('[inventarioService] listarEquipos:', error.message);
    return [];
  }
  return (data || []).map((r) => enriquecer(aEquipo(r)));
}

/** Resumen de cartera de productos. */
export function resumirInventario(equipos) {
  const valorCosto = equipos.reduce((a, e) => a + e.costoUsd * e.stock, 0);
  const valorVenta = equipos.reduce((a, e) => a + e.precioUsd * e.stock, 0);
  const enTransito = equipos.reduce((a, e) => a + e.transito, 0);
  const alertas = equipos.filter((e) => e.estadoStock === 'bajo' || e.estadoStock === 'sin-stock');
  const facturacion = equipos.reduce((a, e) => a + e.facturacion12m, 0);

  return {
    valorCosto,
    valorVenta,
    margenPotencial: valorVenta - valorCosto,
    enTransito,
    alertas,
    facturacion,
    unidades: equipos.reduce((a, e) => a + e.stock, 0),
  };
}

// ---------------------------------------------------------------------------
// ABM de equipos
// ---------------------------------------------------------------------------

const aFila = (e) => ({
  codigo: e.id,
  nombre: e.nombre,
  marca: e.marca || null,
  modelo: e.modelo || null,
  categoria: e.categoria,
  tipo: e.tipo,
  costo_usd: Number(e.costoUsd || 0),
  precio_usd: Number(e.precioUsd || 0),
  stock: Number(e.stock || 0),
  transito: Number(e.transito || 0),
  min_stock: Number(e.minStock || 0),
  vendidos_12m: Number(e.vendidos12m || 0),
  garantia_meses: Number(e.ficha?.garantiaMeses || 0),
  dimensiones: e.ficha?.dimensiones || null,
  consumo: e.ficha?.consumo || null,
  catalogo_url: e.catalogoUrl || null,
});

export async function crearEquipo(equipo) {
  const { data, error } = await supabase.from('gm_equipos').insert(aFila(equipo)).select().single();
  if (error) throw new Error(error.message);

  if (equipo.ficha?.specs?.length) {
    await supabase.from('gm_equipo_specs').insert(
      equipo.ficha.specs.map((s, i) => ({
        equipo_id: data.id,
        label: s.label,
        valor: s.valor,
        orden: i + 1,
      }))
    );
  }
  return aEquipo(data);
}

export async function actualizarEquipo(codigo, cambios) {
  const { data, error } = await supabase
    .from('gm_equipos')
    .update(aFila({ ...cambios, id: codigo }))
    .eq('codigo', codigo)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return aEquipo(data);
}

export async function eliminarEquipo(codigo, { definitivo = false } = {}) {
  const { error } = definitivo
    ? await supabase.from('gm_equipos').delete().eq('codigo', codigo)
    : await supabase.from('gm_equipos').update({ activo: false }).eq('codigo', codigo);
  if (error) throw new Error(error.message);
  return true;
}

/** Ajuste de stock con traza en gm_movimientos_stock. */
export async function ajustarStock(codigo, { tipo, cantidad, motivo, operador = 'G. Martínez' }) {
  const { data: equipo, error } = await supabase
    .from('gm_equipos')
    .select('id, stock, transito')
    .eq('codigo', codigo)
    .maybeSingle();
  if (error || !equipo) throw new Error(error?.message || 'Equipo no encontrado');

  const delta = tipo === 'egreso' ? -Math.abs(cantidad) : Math.abs(cantidad);
  const campos =
    tipo === 'transito'
      ? { transito: Math.max(0, equipo.transito + delta) }
      : { stock: Math.max(0, equipo.stock + delta) };

  const { error: e2 } = await supabase.from('gm_equipos').update(campos).eq('id', equipo.id);
  if (e2) throw new Error(e2.message);

  await supabase.from('gm_movimientos_stock').insert({
    equipo_id: equipo.id,
    tipo,
    cantidad,
    motivo,
    operador,
  });

  return true;
}
