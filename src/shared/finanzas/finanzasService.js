// ============================================================================
// SISTEMA GM · CAPA COMPARTIDA · SERVICIO DE FINANZAS
// ----------------------------------------------------------------------------
// Toda la aritmética del módulo Tesorería vive acá: las vistas solo muestran.
// ============================================================================

import { supabase, isSupabaseConfigured } from '../../services/supabaseClient';
import { MESES, GASTOS, FLUJO_PROYECTADO, CAPITAL, PARAMETROS } from './finanzasDemo';

const modoDemo = () => !isSupabaseConfigured;

/** Trae parámetros, meses, gastos y flujo desde Supabase (o los datos demo). */
async function cargarFuentes(paramsOverride) {
  if (modoDemo()) {
    return {
      params: { ...PARAMETROS, ...paramsOverride },
      meses: MESES,
      gastos: GASTOS_SRC,
      flujo: FLUJO_PROYECTADO,
      capital: CAPITAL_SRC,
    };
  }

  const [p, m, g, f] = await Promise.all([
    supabase.from('gm_parametros').select('*').eq('id', 1).maybeSingle(),
    supabase.from('gm_meses').select('*').order('mes'),
    supabase.from('gm_gastos').select('*').eq('activo', true).order('codigo'),
    supabase.from('gm_flujo').select('*').order('orden'),
  ]);

  const fila = p.data;
  const params = {
    sueldoFijoUsd: Number(fila?.sueldo_fijo_usd ?? PARAMETROS.sueldoFijoUsd),
    comisionPct: Number(fila?.comision_pct ?? PARAMETROS.comisionPct),
    tipoCambio: Number(fila?.tipo_cambio ?? PARAMETROS.tipoCambio),
    ivaPct: Number(fila?.iva_pct ?? PARAMETROS.ivaPct),
    ingresosBrutosPct: Number(fila?.ingresos_brutos_pct ?? PARAMETROS.ingresosBrutosPct),
    retencionesPct: Number(fila?.retenciones_pct ?? PARAMETROS.retencionesPct),
    ...paramsOverride,
  };

  return {
    params,
    meses: (m.data || []).map((r) => ({
      mes: r.mes,
      etiqueta: r.etiqueta,
      ventasUsd: Number(r.ventas_usd),
      costoMercaderiaUsd: Number(r.costo_mercaderia_usd),
      gastosLogisticaUsd: Number(r.gastos_logistica_usd),
      gastosOperativosUsd: Number(r.gastos_operativos_usd),
    })),
    gastos: (g.data || []).map((r) => ({
      id: r.codigo || r.id,
      uuid: r.id,
      concepto: r.concepto,
      categoria: r.categoria,
      periodicidad: r.periodicidad,
      montoUsd: Number(r.monto_usd),
    })),
    flujo: (f.data || []).map((r) => ({
      etiqueta: r.etiqueta,
      ingresosUsd: Number(r.ingresos_usd),
      egresosUsd: Number(r.egresos_usd),
    })),
    capital: {
      ahorroUsd: Number(fila?.ahorro_usd ?? CAPITAL.ahorroUsd),
      liquidezUsd: Number(fila?.liquidez_usd ?? CAPITAL.liquidezUsd),
      reservaImpuestosUsd: Number(fila?.reserva_impuestos_usd ?? CAPITAL.reservaImpuestosUsd),
      inversionInicialUsd: Number(fila?.inversion_inicial_usd ?? CAPITAL.inversionInicialUsd),
    },
  };
}

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

/** Liquidación de un mes: sueldo fijo + comisión, egresos y resultado. */
export function liquidarMes(mes, params = PARAMETROS) {
  const comisionUsd = (mes.ventasUsd * params.comisionPct) / 100;
  const ingresosUsd = params.sueldoFijoUsd + comisionUsd;
  const egresosUsd = mes.gastosLogisticaUsd + mes.gastosOperativosUsd;
  const margenBrutoUsd = mes.ventasUsd - mes.costoMercaderiaUsd;
  const resultadoUsd = margenBrutoUsd - egresosUsd - params.sueldoFijoUsd;

  return {
    ...mes,
    comisionUsd,
    sueldoFijoUsd: params.sueldoFijoUsd,
    ingresosUsd,
    egresosUsd,
    margenBrutoUsd,
    resultadoUsd,
    margenPct: mes.ventasUsd ? (margenBrutoUsd / mes.ventasUsd) * 100 : 0,
  };
}

export async function obtenerFinanzas(paramsOverride = {}) {
  const fuentes = await cargarFuentes(paramsOverride);
  const params = fuentes.params;
  const GASTOS_SRC = fuentes.gastos;
  const CAPITAL_SRC = fuentes.capital;

  const meses = fuentes.meses.map((m) => liquidarMes(m, params));
  const ultimo = meses[meses.length - 1];

  const gastoSemanal = GASTOS_SRC.filter((g) => g.periodicidad === 'semanal').reduce(
    (a, g) => a + g.montoUsd,
    0
  );
  const gastoMensual = GASTOS_SRC.filter((g) => g.periodicidad === 'mensual').reduce(
    (a, g) => a + g.montoUsd,
    0
  );
  const egresoMensualTotal = gastoMensual + gastoSemanal * 4.33;

  // ROI: resultado acumulado sobre la inversión inicial
  const resultadoAcumulado = meses.reduce((a, m) => a + m.resultadoUsd, 0);
  const roiPct = (resultadoAcumulado / CAPITAL_SRC.inversionInicialUsd) * 100;

  // Crecimiento mensual promedio de las ventas
  const variaciones = meses.slice(1).map((m, i) => m.ventasUsd / meses[i].ventasUsd - 1);
  const crecimientoMensual =
    variaciones.reduce((a, v) => a + v, 0) / (variaciones.length || 1);

  // Más allá de los 12 meses la tasa reciente no se sostiene: se amortigua a un
  // techo conservador para que la proyección a 5 años sea defendible.
  const TASA_LARGO_PLAZO = 0.015; // 1,5% mensual
  const tasaPara = (n) => (n <= 12 ? crecimientoMensual : Math.min(crecimientoMensual, TASA_LARGO_PLAZO));

  const proyecciones = [1, 3, 6, 12, 60].map((n) => {
    const tasa = tasaPara(n);
    const factor = (1 + tasa) ** n;
    return {
      etiqueta: n === 60 ? '5 años' : `${n} mes${n === 1 ? '' : 'es'}`,
      meses: n,
      tasaUsada: tasa,
      amortiguada: n > 12 && tasa < crecimientoMensual,
      ventasUsd: ultimo.ventasUsd * factor,
      resultadoMensualUsd: ultimo.resultadoUsd * factor,
      resultadoAcumuladoUsd:
        tasa === 0
          ? ultimo.resultadoUsd * n
          : ultimo.resultadoUsd * ((factor - 1) / tasa),
    };
  });

  const impuestos = {
    ivaUsd: (ultimo.ventasUsd * params.ivaPct) / (100 + params.ivaPct),
    ingresosBrutosUsd: (ultimo.ventasUsd * params.ingresosBrutosPct) / 100,
    retencionesUsd: (ultimo.ventasUsd * params.retencionesPct) / 100,
  };
  impuestos.totalUsd = impuestos.ivaUsd + impuestos.ingresosBrutosUsd + impuestos.retencionesUsd;
  impuestos.netoUsd = ultimo.ventasUsd - impuestos.totalUsd;

  return {
    params,
    meses,
    ultimo,
    gastos: GASTOS_SRC,
    gastoSemanal,
    gastoMensual,
    egresoMensualTotal,
    flujo: fuentes.flujo.map((f, i, arr) => ({
      ...f,
      netoUsd: f.ingresosUsd - f.egresosUsd,
      acumuladoUsd: arr
        .slice(0, i + 1)
        .reduce((a, x) => a + (x.ingresosUsd - x.egresosUsd), 0),
    })),
    capital: CAPITAL_SRC,
    resultadoAcumulado,
    roiPct,
    crecimientoMensual,
    proyecciones,
    impuestos,
  };
}

/**
 * Simulador de rentabilidad: cuánto margen queda si se aplica un descuento.
 */
export function simularOperacion({ precioUsd, costoUsd, descuentoPct, logisticaUsd, comisionPct }) {
  const precioFinal = precioUsd * (1 - descuentoPct / 100);
  const margenUsd = precioFinal - costoUsd - logisticaUsd;
  const comisionUsd = (precioFinal * comisionPct) / 100;
  const margenNetoUsd = margenUsd - comisionUsd;
  return {
    precioFinal,
    margenUsd,
    comisionUsd,
    margenNetoUsd,
    margenPct: precioFinal ? (margenNetoUsd / precioFinal) * 100 : 0,
    markupPct: costoUsd ? (margenNetoUsd / costoUsd) * 100 : 0,
  };
}


// ---------------------------------------------------------------------------
// ABM de Tesorería
// ---------------------------------------------------------------------------

export async function guardarParametros(cambios) {
  const fila = {
    id: 1,
    sueldo_fijo_usd: cambios.sueldoFijoUsd,
    comision_pct: cambios.comisionPct,
    tipo_cambio: cambios.tipoCambio,
    iva_pct: cambios.ivaPct,
    ingresos_brutos_pct: cambios.ingresosBrutosPct,
    retenciones_pct: cambios.retencionesPct,
    inversion_inicial_usd: cambios.inversionInicialUsd,
    ahorro_usd: cambios.ahorroUsd,
    liquidez_usd: cambios.liquidezUsd,
    reserva_impuestos_usd: cambios.reservaImpuestosUsd,
  };
  Object.keys(fila).forEach((k) => fila[k] === undefined && delete fila[k]);
  const { error } = await supabase.from('gm_parametros').upsert(fila, { onConflict: 'id' });
  if (error) throw new Error(error.message);
  return true;
}

export async function guardarMes(mes) {
  const { error } = await supabase.from('gm_meses').upsert(
    {
      mes: mes.mes,
      etiqueta: mes.etiqueta,
      ventas_usd: mes.ventasUsd,
      costo_mercaderia_usd: mes.costoMercaderiaUsd,
      gastos_logistica_usd: mes.gastosLogisticaUsd,
      gastos_operativos_usd: mes.gastosOperativosUsd,
    },
    { onConflict: 'mes' }
  );
  if (error) throw new Error(error.message);
  return true;
}

export async function eliminarMes(mes) {
  const { error } = await supabase.from('gm_meses').delete().eq('mes', mes);
  if (error) throw new Error(error.message);
  return true;
}

export async function guardarGasto(gasto) {
  const { error } = await supabase.from('gm_gastos').upsert(
    {
      codigo: gasto.id,
      concepto: gasto.concepto,
      categoria: gasto.categoria,
      periodicidad: gasto.periodicidad,
      monto_usd: gasto.montoUsd,
    },
    { onConflict: 'codigo' }
  );
  if (error) throw new Error(error.message);
  return true;
}

export async function eliminarGasto(codigo) {
  const { error } = await supabase.from('gm_gastos').delete().eq('codigo', codigo);
  if (error) throw new Error(error.message);
  return true;
}
