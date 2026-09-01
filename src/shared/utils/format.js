// ============================================================================
// SISTEMA GM · CAPA COMPARTIDA · FORMATEO DE VALORES
// ============================================================================

/** 1234.5 -> "1.234,50" */
export const num = (valor, decimales = 2) =>
  Number(valor ?? 0).toLocaleString('es-AR', {
    minimumFractionDigits: decimales,
    maximumFractionDigits: decimales,
  });

/** 1234.5 -> "US$ 1.234,50" | "$ 1.234,50" */
export const money = (valor, moneda = 'USD') =>
  `${moneda === 'USD' ? 'US$' : '$'} ${num(valor)}`;

/** Devuelve la clase de color según el signo del importe. */
export const colorImporte = (valor) =>
  Number(valor) > 0 ? 'text-gray-200' : Number(valor) < 0 ? 'text-emerald-400' : 'text-gray-600';
