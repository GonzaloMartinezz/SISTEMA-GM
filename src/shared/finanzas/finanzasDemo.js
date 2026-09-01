// ============================================================================
// SISTEMA GM · CAPA COMPARTIDA · FINANZAS (datos demo)
// ----------------------------------------------------------------------------
// Todo en USD salvo indicación contraria. El tipo de cambio convierte a ARS.
// ============================================================================

export const PARAMETROS = {
  sueldoFijoUsd: 900,
  comisionPct: 8, // sobre la venta cerrada
  tipoCambio: 1450, // ARS por USD
  ivaPct: 21,
  ingresosBrutosPct: 3.5,
  retencionesPct: 2,
};

/** Últimos 6 meses cerrados + el mes en curso. */
export const MESES = [
  { mes: '2026-03', etiqueta: 'Mar', ventasUsd: 18400, costoMercaderiaUsd: 11800, gastosLogisticaUsd: 620, gastosOperativosUsd: 780 },
  { mes: '2026-04', etiqueta: 'Abr', ventasUsd: 21200, costoMercaderiaUsd: 13500, gastosLogisticaUsd: 710, gastosOperativosUsd: 820 },
  { mes: '2026-05', etiqueta: 'May', ventasUsd: 16900, costoMercaderiaUsd: 10900, gastosLogisticaUsd: 540, gastosOperativosUsd: 760 },
  { mes: '2026-06', etiqueta: 'Jun', ventasUsd: 24800, costoMercaderiaUsd: 15600, gastosLogisticaUsd: 880, gastosOperativosUsd: 910 },
  { mes: '2026-07', etiqueta: 'Jul', ventasUsd: 27300, costoMercaderiaUsd: 17100, gastosLogisticaUsd: 950, gastosOperativosUsd: 940 },
  { mes: '2026-08', etiqueta: 'Ago', ventasUsd: 29650, costoMercaderiaUsd: 18400, gastosLogisticaUsd: 1020, gastosOperativosUsd: 985 },
];

/** Gastos con periodicidad, para el control de egresos. */
export const GASTOS = [
  { id: 'G-01', concepto: 'Combustible y peajes', categoria: 'Logística', periodicidad: 'semanal', montoUsd: 58 },
  { id: 'G-02', concepto: 'Fletes de entrega', categoria: 'Logística', periodicidad: 'semanal', montoUsd: 95 },
  { id: 'G-03', concepto: 'Publicidad y redes', categoria: 'Comercial', periodicidad: 'mensual', montoUsd: 180 },
  { id: 'G-04', concepto: 'Telefonía y datos', categoria: 'Operativo', periodicidad: 'mensual', montoUsd: 45 },
  { id: 'G-05', concepto: 'Depósito y seguro', categoria: 'Operativo', periodicidad: 'mensual', montoUsd: 320 },
  { id: 'G-06', concepto: 'Contador', categoria: 'Administrativo', periodicidad: 'mensual', montoUsd: 140 },
  { id: 'G-07', concepto: 'Herramientas y software', categoria: 'Operativo', periodicidad: 'mensual', montoUsd: 65 },
  { id: 'G-08', concepto: 'Viáticos de visitas', categoria: 'Comercial', periodicidad: 'semanal', montoUsd: 40 },
];

/** Compromisos de cobro y pago de los próximos 6 períodos (flujo de caja). */
export const FLUJO_PROYECTADO = [
  { etiqueta: 'Sem 1', ingresosUsd: 4100, egresosUsd: 2350 },
  { etiqueta: 'Sem 2', ingresosUsd: 2800, egresosUsd: 3100 },
  { etiqueta: 'Sem 3', ingresosUsd: 6200, egresosUsd: 2450 },
  { etiqueta: 'Sem 4', ingresosUsd: 3400, egresosUsd: 4800 },
  { etiqueta: 'Sem 5', ingresosUsd: 5100, egresosUsd: 2300 },
  { etiqueta: 'Sem 6', ingresosUsd: 4600, egresosUsd: 2900 },
];

export const CAPITAL = {
  ahorroUsd: 14200,
  liquidezUsd: 5350,
  reservaImpuestosUsd: 3180,
  inversionInicialUsd: 26000,
};

export default MESES;
