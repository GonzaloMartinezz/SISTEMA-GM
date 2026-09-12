// ============================================================================
// SISTEMA GM · M-07 COBRANZAS · ACCESO A DATOS
// ----------------------------------------------------------------------------
// Todas las lecturas van contra vistas, nunca contra las tablas crudas. El
// saldo de una venta, el estado de una cuota y el resultado del mes se
// calculan en la base y llegan ya resueltos: si cada pantalla los recalculara
// por su cuenta, tarde o temprano dos pantallas mostrarían números distintos
// para la misma plata.
//
// Las dos escrituras que tienen reglas —armar el plan de cuotas e imputar un
// cobro— tampoco se hacen acá: son funciones de la base. Este archivo las
// llama, no las reimplementa.
// ============================================================================

import { supabase, isSupabaseConfigured } from '../../../services/supabaseClient';
import {
  VENTAS_DEMO, CUOTAS_DEMO, CAJA_DEMO, RESULTADO_DEMO,
  CLIENTES_DEMO, EQUIPOS_DEMO, GASTOS_DEMO,
} from '../data/cobranzasDemo';

const modoDemo = () => !isSupabaseConfigured;
const demora = (ms) => new Promise((r) => setTimeout(r, ms));

const num = (v) => (v === null || v === undefined || v === '' ? null : Number(v));
const n0 = (v) => Number(v) || 0;

// ---------------------------------------------------------------------------
// Lecturas
// ---------------------------------------------------------------------------

const aVenta = (r) => ({
  codigo: r.codigo,
  clienteCodigo: r.cliente_codigo || null,
  cliente: r.cliente || 'Sin cliente',
  titular: r.titular || null,
  rubro: r.rubro || null,
  localidad: r.localidad || null,
  telefono: r.telefono || r.celular || null,
  celular: r.celular || null,
  email: r.email || null,
  leadCodigo: r.lead_codigo || null,
  equipoCodigo: r.equipo_codigo || null,
  detalle: r.detalle || 'Sin detalle',
  fecha: r.fecha,
  moneda: r.moneda || 'USD',
  tipoCambio: num(r.tipo_cambio),
  totalUsd: n0(r.total_usd),
  costoUsd: n0(r.costo_usd),
  margenUsd: n0(r.margen_usd),
  margenPct: n0(r.margen_pct),
  anticipoUsd: n0(r.anticipo_usd),
  anticipoCobradoUsd: n0(r.anticipo_cobrado_usd),
  financiadoUsd: n0(r.financiado_usd),
  cuotasPactadas: n0(r.cuotas_pactadas),
  cuotasTotal: n0(r.cuotas_total),
  cuotasPagadas: n0(r.cuotas_pagadas),
  cuotasVencidas: n0(r.cuotas_vencidas),
  vencidoUsd: n0(r.vencido_usd),
  cobradoUsd: n0(r.cobrado_usd),
  saldoUsd: n0(r.saldo_usd),
  avancePct: n0(r.avance_pct),
  ultimoCobro: r.ultimo_cobro || null,
  proximoVencimiento: r.proximo_vencimiento || null,
  ultimoVencimiento: r.ultimo_vencimiento || null,
  diasAtraso: num(r.dias_atraso),
  primerVencimiento: r.primer_vencimiento || null,
  interesPct: n0(r.interes_pct),
  estado: r.estado,
  estadoCobro: r.estado_cobro,
  vendedor: r.vendedor || null,
  nota: r.nota || null,
});

export async function listarVentas() {
  if (modoDemo()) {
    await demora(110);
    return VENTAS_DEMO.map((v) => ({ ...v }));
  }
  const { data, error } = await supabase
    .from('gm_v_ventas')
    .select('*')
    .order('fecha', { ascending: false });
  if (error) {
    console.error('[cobranzas] listarVentas', error.message);
    return [];
  }
  return (data || []).map(aVenta);
}

const aCuota = (r) => ({
  codigo: r.codigo,
  ventaCodigo: r.venta_codigo,
  numero: n0(r.numero),
  vencimiento: r.vencimiento,
  montoUsd: n0(r.monto_usd),
  cobradoUsd: n0(r.cobrado_usd),
  saldoUsd: n0(r.saldo_usd),
  ultimoCobro: r.ultimo_cobro || null,
  dias: num(r.dias),
  estado: r.estado,
  anulada: !!r.anulada,
  nota: r.nota || null,
  clienteCodigo: r.cliente_codigo || null,
  cliente: r.cliente || 'Sin cliente',
  titular: r.titular || null,
  telefono: r.telefono || r.celular || null,
  celular: r.celular || null,
  email: r.email || null,
  localidad: r.localidad || null,
  ventaDetalle: r.venta_detalle || '',
  ventaTotalUsd: n0(r.venta_total_usd),
  ventaEstado: r.venta_estado,
});

export async function listarCuotas() {
  if (modoDemo()) {
    await demora(90);
    return CUOTAS_DEMO.map((c) => ({ ...c }));
  }
  const { data, error } = await supabase
    .from('gm_v_cuotas')
    .select('*')
    .order('vencimiento');
  if (error) {
    console.error('[cobranzas] listarCuotas', error.message);
    return [];
  }
  return (data || []).map(aCuota);
}

const aMovimiento = (r) => ({
  codigo: r.codigo,
  flujo: r.flujo,
  fecha: r.fecha,
  concepto: r.concepto,
  categoria: r.categoria,
  montoUsd: n0(r.monto_usd),
  montoArs: num(r.monto_ars),
  tipoCambio: num(r.tipo_cambio),
  medio: r.medio,
  comprobante: r.comprobante || null,
  contraparte: r.contraparte || '—',
  referencia: r.referencia || null,
  referencia2: r.referencia_2 || null,
  nota: r.nota || null,
});

export async function listarCaja(desde, hasta) {
  if (modoDemo()) {
    await demora(100);
    return CAJA_DEMO.filter((m) => (!desde || m.fecha >= desde) && (!hasta || m.fecha <= hasta))
      .map((m) => ({ ...m }));
  }
  let q = supabase.from('gm_v_caja').select('*');
  if (desde) q = q.gte('fecha', desde);
  if (hasta) q = q.lte('fecha', hasta);
  const { data, error } = await q.order('fecha', { ascending: false });
  if (error) {
    console.error('[cobranzas] listarCaja', error.message);
    return [];
  }
  return (data || []).map(aMovimiento);
}

const aMes = (r) => ({
  mes: r.mes,
  inicio: r.inicio,
  mesCorto: r.mes_corto,
  etiqueta: r.etiqueta,
  cobradoUsd: n0(r.cobrado_usd),
  egresosUsd: n0(r.egresos_usd),
  cajaUsd: n0(r.caja_usd),
  mercaderiaUsd: n0(r.mercaderia_usd),
  logisticaUsd: n0(r.logistica_usd),
  sueldoUsd: n0(r.sueldo_usd),
  impuestosUsd: n0(r.impuestos_usd),
  operativoUsd: n0(r.operativo_usd),
  retiroUsd: n0(r.retiro_usd),
  otroUsd: n0(r.otro_usd),
  ventasCantidad: n0(r.ventas_cantidad),
  vendidoUsd: n0(r.vendido_usd),
  costoVendidoUsd: n0(r.costo_vendido_usd),
  margenUsd: n0(r.margen_usd),
  porCobrarUsd: n0(r.por_cobrar_usd),
  cuotasPorCobrar: n0(r.cuotas_por_cobrar),
  esMesActual: !!r.es_mes_actual,
  esFuturo: !!r.es_futuro,
});

export async function listarResultado() {
  if (modoDemo()) {
    await demora(80);
    return RESULTADO_DEMO.map((m) => ({ ...m }));
  }
  const { data, error } = await supabase.from('gm_v_resultado').select('*').order('mes');
  if (error) {
    console.error('[cobranzas] listarResultado', error.message);
    return [];
  }
  return (data || []).map(aMes);
}

// ---------------------------------------------------------------------------
// Catálogos para los formularios
// ---------------------------------------------------------------------------

export async function listarClientes() {
  if (modoDemo()) return CLIENTES_DEMO.map((c) => ({ ...c }));
  const { data, error } = await supabase
    .from('gm_clientes')
    .select('codigo, negocio, profesional_apellido, profesional_nombre, rubro, localidad')
    .eq('activo', true)
    .order('negocio');
  if (error) {
    console.error('[cobranzas] listarClientes', error.message);
    return [];
  }
  return (data || []).map((r) => ({
    codigo: r.codigo,
    nombre: r.negocio,
    titular: [r.profesional_apellido, r.profesional_nombre].filter(Boolean).join(', ') || null,
    rubro: r.rubro,
    localidad: r.localidad,
  }));
}

export async function listarEquipos() {
  if (modoDemo()) return EQUIPOS_DEMO.map((e) => ({ ...e }));
  const { data, error } = await supabase
    .from('gm_equipos')
    .select('codigo, nombre, marca, categoria, costo_usd, precio_usd')
    .eq('activo', true)
    .order('nombre');
  if (error) {
    console.error('[cobranzas] listarEquipos', error.message);
    return [];
  }
  return (data || []).map((r) => ({
    codigo: r.codigo,
    nombre: r.nombre,
    marca: r.marca,
    categoria: r.categoria,
    costoUsd: n0(r.costo_usd),
    precioUsd: n0(r.precio_usd),
  }));
}

export async function listarGastosRecurrentes() {
  if (modoDemo()) return GASTOS_DEMO.map((g) => ({ ...g }));
  const { data, error } = await supabase
    .from('gm_gastos')
    .select('codigo, concepto, categoria, periodicidad, monto_usd')
    .eq('activo', true)
    .order('concepto');
  if (error) {
    console.error('[cobranzas] listarGastosRecurrentes', error.message);
    return [];
  }
  return (data || []).map((r) => ({
    codigo: r.codigo,
    concepto: r.concepto,
    categoria: r.categoria,
    periodicidad: r.periodicidad,
    montoUsd: n0(r.monto_usd),
  }));
}

// ---------------------------------------------------------------------------
// Escrituras
// ---------------------------------------------------------------------------

/** Alta de venta. Si lleva cuotas, la base arma el plan en el mismo viaje. */
export async function crearVenta(v) {
  if (modoDemo()) {
    await demora(200);
    return { codigo: `VT-DEMO-${Date.now().toString().slice(-4)}`, cuotas: Number(v.cuotas) || 0 };
  }

  let clienteId = null;
  if (v.clienteCodigo) {
    const { data: c } = await supabase
      .from('gm_clientes').select('id').eq('codigo', v.clienteCodigo).maybeSingle();
    clienteId = c?.id || null;
  }

  let equipoId = null;
  if (v.equipoCodigo) {
    const { data: e } = await supabase
      .from('gm_equipos').select('id').eq('codigo', v.equipoCodigo).maybeSingle();
    equipoId = e?.id || null;
  }

  const fila = {
    cliente_id: clienteId,
    equipo_id: equipoId,
    detalle: v.detalle || null,
    fecha: v.fecha,
    total_usd: Number(v.totalUsd) || 0,
    costo_usd: Number(v.costoUsd) || 0,
    anticipo_usd: Number(v.anticipoUsd) || 0,
    cuotas: Number(v.cuotas) || 0,
    primer_vencimiento: v.primerVencimiento || null,
    interes_pct: Number(v.interesPct) || 0,
    vendedor: v.vendedor || null,
    nota: v.nota || null,
  };

  const { data, error } = await supabase.from('gm_ventas').insert(fila).select('codigo').single();
  if (error) throw new Error(error.message);

  let cuotasCreadas = 0;
  if (fila.cuotas > 0) {
    const { data: n, error: e2 } = await supabase.rpc('gm_generar_cuotas', {
      p_venta: data.codigo,
      p_reemplazar: false,
    });
    if (e2) console.error('[cobranzas] gm_generar_cuotas', e2.message);
    else cuotasCreadas = Number(n) || 0;
  }

  // El anticipo pactado no es plata cobrada. Sólo se registra como cobro si el
  // usuario dijo que ya lo tiene en la mano.
  if (v.anticipoCobrado && fila.anticipo_usd > 0) {
    const { error: e3 } = await supabase.rpc('gm_registrar_cobro', {
      p_venta: data.codigo,
      p_monto: fila.anticipo_usd,
      p_fecha: fila.fecha,
      p_medio: v.medioAnticipo || 'transferencia',
      p_comprobante: v.comprobanteAnticipo || null,
      p_concepto: 'anticipo',
    });
    if (e3) console.error('[cobranzas] anticipo', e3.message);
  }

  return { codigo: data.codigo, cuotas: cuotasCreadas };
}

/** Registra plata que entró. La imputación a cuotas la hace la base. */
export async function registrarCobro(datos) {
  if (modoDemo()) {
    await demora(180);
    return { cobros: 1, sinImputar: 0 };
  }
  const { data, error } = await supabase.rpc('gm_registrar_cobro', {
    p_venta: datos.ventaCodigo,
    p_monto: Number(datos.montoUsd) || 0,
    p_fecha: datos.fecha,
    p_medio: datos.medio || 'transferencia',
    p_comprobante: datos.comprobante || null,
    p_concepto: datos.concepto || 'cuota',
    p_nota: datos.nota || null,
    p_tipo_cambio: datos.tipoCambio ? Number(datos.tipoCambio) : null,
  });
  if (error) throw new Error(error.message);
  return {
    cobros: Number(data?.cobros) || 0,
    cuotas: data?.cuotas || [],
    saldo: Number(data?.saldo) || 0,
    sinImputar: Number(data?.sin_imputar) || 0,
  };
}

/** Registra plata que salió. */
export async function crearEgreso(e) {
  if (modoDemo()) {
    await demora(180);
    return { codigo: `EG-DEMO-${Date.now().toString().slice(-4)}` };
  }
  const fila = {
    fecha: e.fecha,
    concepto: e.concepto,
    categoria: e.categoria || 'operativo',
    monto_usd: Number(e.montoUsd) || 0,
    monto_ars: e.montoArs ? Number(e.montoArs) : null,
    tipo_cambio: e.tipoCambio ? Number(e.tipoCambio) : null,
    medio: e.medio || 'transferencia',
    comprobante: e.comprobante || null,
    proveedor: e.proveedor || null,
    gasto_codigo: e.gastoCodigo || null,
    venta_codigo: e.ventaCodigo || null,
    nota: e.nota || null,
  };
  const { data, error } = await supabase.from('gm_egresos').insert(fila).select('codigo').single();
  if (error) throw new Error(error.message);
  return { codigo: data.codigo };
}

/** Rehace el plan de cuotas de una venta, respetando las que ya tienen pagos. */
export async function regenerarPlan(ventaCodigo) {
  if (modoDemo()) {
    await demora(150);
    return 0;
  }
  const { data, error } = await supabase.rpc('gm_generar_cuotas', {
    p_venta: ventaCodigo,
    p_reemplazar: true,
  });
  if (error) throw new Error(error.message);
  return Number(data) || 0;
}
