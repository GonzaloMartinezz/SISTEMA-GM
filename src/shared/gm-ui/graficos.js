// ============================================================================
// SISTEMA GM · UI · CONFIGURACIÓN COMPARTIDA DE GRÁFICOS
// ----------------------------------------------------------------------------
// Props comunes de Recharts. Ejes recesivos, grilla apenas visible, sin
// animación (evita el artefacto de líneas que no se pintan).
//
// EJE_CLARO/GRILLA_CLARA quedan para los módulos que todavía no tienen
// interruptor de tema (siguen viéndose igual que siempre). Un módulo con
// tema activo usa ejeDeTema(t)/grillaDeTema(t), que arma el mismo objeto con
// los tokens del tema que esté puesto en ese momento.
// ============================================================================

export const EJE_CLARO = {
  stroke: '#E8E0D5',
  tick: { fill: '#948A7C', fontSize: 11 },
  tickLine: false,
  axisLine: false,
};

export const GRILLA_CLARA = {
  stroke: '#F0EAE1',
  strokeDasharray: '0',
  vertical: false,
};

/** Igual que EJE_CLARO/GRILLA_CLARA, pero con los colores del tema activo. */
export function ejeDeTema(t) {
  return {
    stroke: t.borde,
    tick: { fill: t.textoSuave, fontSize: 11 },
    tickLine: false,
    axisLine: false,
  };
}

export function grillaDeTema(t) {
  return {
    stroke: t.divisor,
    strokeDasharray: '0',
    vertical: false,
  };
}

/** Sin animación: Recharts a veces deja la serie sin pintar al re-montar. */
export const SIN_ANIMACION = { isAnimationActive: false };

export const numero = (v) => Number(v || 0).toLocaleString('es-AR');

export const usd = (v) =>
  `US$ ${Number(v || 0).toLocaleString('es-AR', { maximumFractionDigits: 0 })}`;

export const usdCorto = (v) => {
  const n = Number(v || 0);
  const abs = Math.abs(n);
  if (abs >= 1e6) return `${(n / 1e6).toFixed(abs >= 1e7 ? 0 : 1)}M`;
  if (abs >= 1000) return `${(n / 1000).toFixed(abs >= 1e5 ? 0 : 1)}k`;
  return String(Math.round(n));
};

export const pct = (v, dec = 0) => `${Number(v || 0).toFixed(dec)}%`;
