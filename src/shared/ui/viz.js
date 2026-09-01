// ============================================================================
// SISTEMA GM · CAPA COMPARTIDA · SISTEMA DE VISUALIZACIÓN
// ----------------------------------------------------------------------------
// Paleta categórica validada para fondo oscuro (#030712): banda de luminosidad,
// piso de croma, separación para daltonismo, piso de visión normal y contraste
// contra la superficie. No cambiar los hex sin volver a validar el set completo.
// ============================================================================

/** Slots categóricos, en orden fijo. Nunca se ciclan ni se generan al vuelo. */
export const SERIES = {
  ingresos: '#3987e5', // azul
  egresos: '#d95926', // naranja
  neto: '#199e70', // aqua
  impuestos: '#c98500', // amarillo
};

export const SERIES_ORDEN = [SERIES.ingresos, SERIES.egresos, SERIES.neto, SERIES.impuestos];

/** Colores de estado: reservados, nunca se usan como "serie 5". */
export const ESTADO = {
  bien: '#199e70',
  atencion: '#c98500',
  grave: '#d95926',
  critico: '#e66767',
};

/** Ejes y grilla recesivos. */
export const EJE = {
  grid: 'rgba(255,255,255,0.05)',
  tick: '#6b7280',
  tickSize: 10,
  superficie: '#030712',
};

export const ejeProps = {
  stroke: 'rgba(255,255,255,0.08)',
  tick: { fill: EJE.tick, fontSize: EJE.tickSize, fontFamily: 'ui-monospace, monospace' },
  tickLine: false,
  axisLine: false,
};

/** Formateadores compartidos. */
export const usd = (v) =>
  `US$ ${Number(v || 0).toLocaleString('es-AR', { maximumFractionDigits: 0 })}`;

export const usdCorto = (v) => {
  const n = Number(v || 0);
  const abs = Math.abs(n);
  if (abs >= 1e6) return `${(n / 1e6).toFixed(abs >= 1e7 ? 0 : 1)}M`;
  if (abs >= 1000) return `${(n / 1000).toFixed(abs >= 1e5 ? 0 : 1)}k`;
  return String(Math.round(n));
};

export const pct = (v, dec = 1) => `${Number(v || 0).toFixed(dec)}%`;
