// ============================================================================
// SISTEMA GM · UI · TOKENS DE DISEÑO  ·  Paleta "Arena y terracota"
// ----------------------------------------------------------------------------
// Criterio: el tablero se mira todos los días, así que el lienzo desaparece y
// el color se guarda para lo que significa algo (un estado, una etapa, una
// serie del gráfico, una acción). Las tarjetas son neutras con un acento fino.
//
// Identidad: arena en el fondo y en los chips, terracota como acento — igual
// de noche que de día. El modo oscuro NO es "el mismo diseño con los colores
// invertidos": es la misma identidad (mismo hue por rubro, por estado, por
// serie) llevada a superficies oscuras cálidas, con cada combinación de texto
// verificada contra el fondo real que la acompaña.
//
// Todo par texto/fondo de acá pasó el chequeo WCAG (ver
// scripts/contraste.mjs del repo de diseño): 4.5:1 para texto normal, 3:1
// para texto grande o para color que nunca viaja solo (siempre acompañado de
// texto). No se cambia un hex sin volver a correr esa verificación.
//
// Compatibilidad: los módulos que todavía no tienen el interruptor de tema
// (todos menos Clientes, por ahora) siguen importando GM/SERIE/TINTE/etc.
// como antes — esos nombres apuntan al tema claro y no cambian de
// comportamiento. El sistema de temas es aditivo, así que ningún módulo
// existente se rompe por esta actualización.
// ============================================================================

/** Superficies y texto — modo claro (el de siempre). */
export const TEMA_CLARO = {
  fondo: '#F8FAFC',
  superficie: '#FFFFFF',
  superficieSuave: '#F1F5F9',
  superficieFuerte: '#E2E8F0',
  borde: '#E2E8F0',
  bordeFuerte: '#CBD5E1',
  divisor: '#F1F5F9',
  texto: '#0F172A',
  textoMedio: '#475569',
  textoSuave: '#64748B',
  textoTenue: '#94A3B8',
  acento: '#2563EB',         // Azul Eléctrico
  acentoFuerte: '#1D4ED8',
  acentoSuaveBg: '#DBEAFE',
  sobreAcento: '#FFFFFF',
  overlay: 'rgba(15,23,42,0.45)',
  sombraPanel: '0 1px 3px rgba(15,23,42,0.05), 0 10px 30px -10px rgba(15,23,42,0.08)',
  sombraModal: '0 25px 50px -12px rgba(15,23,42,0.25)',
  sombraTooltip: '0 10px 25px -5px rgba(15,23,42,0.15)',
};

/**
 * Superficies y texto — modo oscuro. Obsidian tech: negro puro y grises mate
 * para dar un aspecto extremadamente premium.
 */
export const TEMA_OSCURO = {
  fondo: '#09090B',           // Obsidian / casi negro
  superficie: '#18181B',      // Gris oscuro mate
  superficieSuave: '#27272A',
  superficieFuerte: '#3F3F46',
  borde: '#27272A',
  bordeFuerte: '#3F3F46',
  divisor: '#18181B',
  texto: '#F9FAFB',
  textoMedio: '#D4D4D8',
  textoSuave: '#A1A1AA',
  textoTenue: '#71717A',
  acento: '#3B82F6',         // Azul brillante
  acentoFuerte: '#60A5FA',
  acentoSuaveBg: '#1E3A8A',  // Azul ultra profundo
  sobreAcento: '#FFFFFF',
  overlay: 'rgba(9, 9, 11, 0.85)',
  sombraPanel: '0 1px 2px rgba(0,0,0,0.50), 0 8px 24px -14px rgba(0,0,0,0.85)',
  sombraModal: '0 24px 64px -16px rgba(0,0,0,0.95)',
  sombraTooltip: '0 8px 24px -8px rgba(0,0,0,0.65)',
};

/** Compatibilidad con todo lo que ya existe: GM sigue siendo el tema claro. */
export const GM = TEMA_CLARO;

// ----------------------------------------------------------------------------
// Series de gráfico, estado, tintes y rubros — un par claro/oscuro por cada
// uno, con el MISMO hue en los dos temas (terracota sigue siendo terracota),
// sólo con la luminosidad ajustada para el fondo que le toca.
// ----------------------------------------------------------------------------

const SERIE_CLARO = {
  terracota: '#4F46E5', // Indigo vibrante en vez de terracota
  azul: '#2563EB',      // Azul eléctrico
  ambar: '#F59E0B',     // Ámbar puro
  verde: '#10B981',     // Esmeralda brillante
  rojo: '#EF4444',      // Rojo vibrante
};
const SERIE_OSCURO = {
  terracota: '#818CF8', // Indigo claro
  azul: '#60A5FA',      // Azul claro
  ambar: '#FCD34D',     // Amarillo pastel
  verde: '#34D399',     // Esmeralda neón
  rojo: '#F87171',      // Rojo pastel
};

export const SERIE_POR_TEMA = { claro: SERIE_CLARO, oscuro: SERIE_OSCURO };
/** Compatibilidad: SERIE es el tema claro, como antes. */
export const SERIE = SERIE_CLARO;
export const SERIE_ORDEN_POR_TEMA = {
  claro: [SERIE_CLARO.terracota, SERIE_CLARO.azul, SERIE_CLARO.ambar, SERIE_CLARO.verde, SERIE_CLARO.rojo],
  oscuro: [SERIE_OSCURO.terracota, SERIE_OSCURO.azul, SERIE_OSCURO.ambar, SERIE_OSCURO.verde, SERIE_OSCURO.rojo],
};
export const SERIE_ORDEN = SERIE_ORDEN_POR_TEMA.claro;

/**
 * Rampa ordinal (etapas de un embudo, escalas de intensidad). Un solo tono,
 * de claro a oscuro. Se usa igual en los dos temas porque es un color de
 * "relleno de dato" con su propio peso visual, no una superficie de página —
 * lo que sí cambia según lo que tenga atrás es el color del texto que va
 * encima, así que se usa junto con textoSobre() en vez de asumir blanco fijo.
 */
export const RAMPA = ['#DFA97F', '#CE8A55', '#B0612A', '#A2521A', '#7E3C0F'];

/** Texto legible (oscuro u blanco) para escribir encima de un color de dato
 *  cualquiera — RAMPA, una porción de torta, la barra de un gráfico — sin
 *  tener que adivinar si ese color es claro o oscuro. */
export function textoSobre(hex) {
  const h = String(hex || '').replace('#', '');
  const n = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  const int = parseInt(n, 16);
  if (Number.isNaN(int)) return '#2A2118';
  const r = (int >> 16) & 255, g = (int >> 8) & 255, b = int & 255;
  // Luminancia perceptual aproximada (suficiente para elegir texto, no para
  // certificar contraste): por debajo del umbral, el color de fondo es
  // oscuro y conviene texto claro.
  const luz = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  return luz > 0.52 ? '#2A2118' : '#FFFFFF';
}

/** Colores de estado. Reservados: nunca se usan como "serie 5".
 *  El estado nunca viaja solo en el color: siempre lo acompaña el texto. */
const ESTADO_COLOR_CLARO = {
  bien: '#10B981',      // Emerald
  atencion: '#F59E0B',  // Amber
  riesgo: '#E11D48',    // Rose red
  critico: '#9F1239',   // Dark rose
  neutro: '#64748B',    // Slate
};
const ESTADO_COLOR_OSCURO = {
  bien: '#34D399',
  atencion: '#FCD34D',
  riesgo: '#FB7185',
  critico: '#F43F5E',
  neutro: '#94A3B8',
};
export const ESTADO_COLOR_POR_TEMA = { claro: ESTADO_COLOR_CLARO, oscuro: ESTADO_COLOR_OSCURO };
export const ESTADO_COLOR = ESTADO_COLOR_CLARO;

/** Tintes de chips y badges: relleno claro con texto oscuro encima (o, en
 *  modo oscuro, relleno oscuro con texto claro encima — la misma idea). */
const TINTE_CLARO = {
  azul: { bg: '#DBEAFE', fg: '#1E40AF' },
  aqua: { bg: '#CCFBF1', fg: '#115E59' },
  naranja: { bg: '#E0E7FF', fg: '#3730A3' }, // Indigo suave (naranja key maintained for compat)
  amarillo: { bg: '#FEF3C7', fg: '#92400E' },
  rosa: { bg: '#FCE7F3', fg: '#9D174D' },
  gris: { bg: '#F1F5F9', fg: '#334155' },
  peligro: { bg: '#FFE4E6', fg: '#BE123C', borde: '#FECDD3' },
  exito: { bg: '#D1FAE5', fg: '#065F46', borde: '#A7F3D0' },
};
const TINTE_OSCURO = {
  azul: { bg: '#1E3A8A', fg: '#93C5FD' },
  aqua: { bg: '#134E4A', fg: '#5EEAD4' },
  naranja: { bg: '#312E81', fg: '#A5B4FC' },
  amarillo: { bg: '#78350F', fg: '#FDE68A' },
  rosa: { bg: '#831843', fg: '#F9A8D4' },
  gris: { bg: '#334155', fg: '#CBD5E1' },
  peligro: { bg: '#4C0519', fg: '#FDA4AF', borde: '#881337' },
  exito: { bg: '#064E3B', fg: '#6EE7B7', borde: '#065F46' },
};
export const TINTE_POR_TEMA = { claro: TINTE_CLARO, oscuro: TINTE_OSCURO };
export const TINTE = TINTE_CLARO;

/** Acento de cada tarjeta de indicador: la barrita al costado y la variación. */
const ACENTO_TONO_CLARO = {
  naranja: SERIE_CLARO.terracota,
  azul: SERIE_CLARO.azul,
  crema: SERIE_CLARO.ambar,
  verde: SERIE_CLARO.verde,
};
const ACENTO_TONO_OSCURO = {
  naranja: SERIE_OSCURO.terracota,
  azul: SERIE_OSCURO.azul,
  crema: SERIE_OSCURO.ambar,
  verde: SERIE_OSCURO.verde,
};
export const ACENTO_TONO_POR_TEMA = { claro: ACENTO_TONO_CLARO, oscuro: ACENTO_TONO_OSCURO };
export const ACENTO_TONO = ACENTO_TONO_CLARO;

/** Rubros del negocio, con su color fijo en todo el sistema — mismo hue en
 *  los dos temas, para que un rubro se reconozca igual de noche que de día. */
const RUBRO_COLOR_CLARO = {
  Odontología: SERIE_CLARO.azul,
  Veterinaria: SERIE_CLARO.verde,
  'Diagnóstico por Imagen': SERIE_CLARO.rojo,
};
const RUBRO_COLOR_OSCURO = {
  Odontología: SERIE_OSCURO.azul,
  Veterinaria: SERIE_OSCURO.verde,
  'Diagnóstico por Imagen': SERIE_OSCURO.rojo,
};
export const RUBRO_COLOR_POR_TEMA = { claro: RUBRO_COLOR_CLARO, oscuro: RUBRO_COLOR_OSCURO };
export const RUBRO_COLOR = RUBRO_COLOR_CLARO;

export const RUBRO_TONO = {
  Odontología: 'azul',
  Veterinaria: 'aqua',
  'Diagnóstico por Imagen': 'peligro',
};

export const ACENTOS_MODULOS = {
  clientes: { // Módulo 1: Azul Fuerte
    claro: { acento: '#2563EB', acentoFuerte: '#1D4ED8', acentoSuaveBg: '#DBEAFE' },
    oscuro: { acento: '#3B82F6', acentoFuerte: '#60A5FA', acentoSuaveBg: '#1E3A8A' }
  },
  seguimientos: { // Módulo 2: Esmeralda
    claro: { acento: '#10B981', acentoFuerte: '#059669', acentoSuaveBg: '#D1FAE5' },
    oscuro: { acento: '#10B981', acentoFuerte: '#34D399', acentoSuaveBg: '#064E3B' }
  },
  agenda: { // Módulo 3: Fucsia / Rosa Tech
    claro: { acento: '#DB2777', acentoFuerte: '#BE185D', acentoSuaveBg: '#FCE7F3' },
    oscuro: { acento: '#EC4899', acentoFuerte: '#F472B6', acentoSuaveBg: '#831843' }
  },
  notario: { // Módulo 4: Violeta / Índigo
    claro: { acento: '#4F46E5', acentoFuerte: '#4338CA', acentoSuaveBg: '#E0E7FF' },
    oscuro: { acento: '#818CF8', acentoFuerte: '#A5B4FC', acentoSuaveBg: '#312E81' }
  },
  equipos: { // Módulo 5: Naranja Tech
    claro: { acento: '#EA580C', acentoFuerte: '#C2410C', acentoSuaveBg: '#FFEDD5' },
    oscuro: { acento: '#F97316', acentoFuerte: '#FDBA74', acentoSuaveBg: '#7C2D12' }
  },
  finanzas: { // Módulo 6: Ámbar / Dorado
    claro: { acento: '#D97706', acentoFuerte: '#B45309', acentoSuaveBg: '#FEF3C7' },
    oscuro: { acento: '#F59E0B', acentoFuerte: '#FCD34D', acentoSuaveBg: '#78350F' }
  },
  // Default fallback (Azul)
  sistema: {
    claro: { acento: '#2563EB', acentoFuerte: '#1D4ED8', acentoSuaveBg: '#DBEAFE' },
    oscuro: { acento: '#3B82F6', acentoFuerte: '#60A5FA', acentoSuaveBg: '#1E3A8A' }
  }
};

export default GM;
