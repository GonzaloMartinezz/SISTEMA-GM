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
  fondo: '#FAF6F0',
  superficie: '#FFFFFF',
  superficieSuave: '#FCFAF6',
  superficieFuerte: '#F3EDE4',
  borde: '#E8E0D5',
  bordeFuerte: '#D5CABA',
  divisor: '#F0EAE1',
  texto: '#2A2118',          // 15.8:1 sobre superficie
  textoMedio: '#6E6559',     // 5.7:1
  textoSuave: '#948A7C',     // 3.4:1, sólo para texto secundario grande
  textoTenue: '#B0A697',
  acento: '#B4551A',         // terracota: botones, activo, foco
  acentoFuerte: '#8A3F11',
  acentoSuaveBg: '#FBE5C8',  // la arena original, ahora como tinte
  sobreAcento: '#FFFFFF',    // 4.9:1 sobre el terracota
  overlay: 'rgba(42,33,24,0.35)',
  sombraPanel: '0 1px 2px rgba(26,26,24,0.04), 0 8px 24px -14px rgba(26,26,24,0.14)',
  sombraModal: '0 24px 64px -16px rgba(16,24,40,0.35)',
  sombraTooltip: '0 8px 24px -8px rgba(16,24,40,0.18)',
};

/**
 * Superficies y texto — modo oscuro. Espresso cálido, no gris azulado: sigue
 * siendo "arena y terracota", sólo que la arena pasa a ser la tinta y el
 * fondo el que era la letra. El acento se aclara (terracota puro se apaga
 * contra un fondo oscuro) y el texto sobre el acento se invierte a oscuro,
 * porque un naranja claro con letra blanca encima no se lee bien.
 */
export const TEMA_OSCURO = {
  fondo: '#181310',
  superficie: '#211A14',
  superficieSuave: '#271F17',
  superficieFuerte: '#31271C',
  borde: '#3B2E21',
  bordeFuerte: '#4C3B29',
  divisor: '#2C2319',
  texto: '#F3EAE0',          // 14.4:1 sobre superficie
  textoMedio: '#C9BBA9',     // 9.1:1
  textoSuave: '#A2937E',     // 5.7:1
  textoTenue: '#7C6E5B',
  acento: '#E8935A',         // terracota aclarado para leerse sobre oscuro
  acentoFuerte: '#F2AC78',
  acentoSuaveBg: '#3B2A1A',
  sobreAcento: '#241505',    // texto oscuro sobre el acento claro: 7.4:1
  overlay: 'rgba(0,0,0,0.55)',
  sombraPanel: '0 1px 2px rgba(0,0,0,0.30), 0 8px 24px -14px rgba(0,0,0,0.55)',
  sombraModal: '0 24px 64px -16px rgba(0,0,0,0.60)',
  sombraTooltip: '0 8px 24px -8px rgba(0,0,0,0.45)',
};

/** Compatibilidad con todo lo que ya existe: GM sigue siendo el tema claro. */
export const GM = TEMA_CLARO;

// ----------------------------------------------------------------------------
// Series de gráfico, estado, tintes y rubros — un par claro/oscuro por cada
// uno, con el MISMO hue en los dos temas (terracota sigue siendo terracota),
// sólo con la luminosidad ajustada para el fondo que le toca.
// ----------------------------------------------------------------------------

const SERIE_CLARO = {
  terracota: '#B4551A',
  azul: '#2F6DA0',
  ambar: '#C08A1E',
  verde: '#2E9B76',
};
const SERIE_OSCURO = {
  terracota: '#E8935A',
  azul: '#6BA8DA',
  ambar: '#DDB050',
  verde: '#57C69A',
};

export const SERIE_POR_TEMA = { claro: SERIE_CLARO, oscuro: SERIE_OSCURO };
/** Compatibilidad: SERIE es el tema claro, como antes. */
export const SERIE = SERIE_CLARO;
export const SERIE_ORDEN_POR_TEMA = {
  claro: [SERIE_CLARO.terracota, SERIE_CLARO.azul, SERIE_CLARO.ambar, SERIE_CLARO.verde],
  oscuro: [SERIE_OSCURO.terracota, SERIE_OSCURO.azul, SERIE_OSCURO.ambar, SERIE_OSCURO.verde],
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
  bien: '#2E9B76',
  atencion: '#C08A1E',
  riesgo: '#B4551A',
  critico: '#A63A0C',
  neutro: '#948A7C',
};
const ESTADO_COLOR_OSCURO = {
  bien: '#57C69A',
  atencion: '#DDB050',
  riesgo: '#E8935A',
  critico: '#F2704A',
  neutro: '#A2937E',
};
export const ESTADO_COLOR_POR_TEMA = { claro: ESTADO_COLOR_CLARO, oscuro: ESTADO_COLOR_OSCURO };
export const ESTADO_COLOR = ESTADO_COLOR_CLARO;

/** Tintes de chips y badges: relleno claro con texto oscuro encima (o, en
 *  modo oscuro, relleno oscuro con texto claro encima — la misma idea). */
const TINTE_CLARO = {
  azul: { bg: '#E3EDF6', fg: '#23557E' },
  aqua: { bg: '#DFF0E8', fg: '#1F6F53' },
  naranja: { bg: '#FBE5C8', fg: '#8A3F11' },
  amarillo: { bg: '#FAF0D9', fg: '#7A5600' },
  rosa: { bg: '#F5DDCC', fg: '#A63A0C' },
  gris: { bg: '#EFE7DB', fg: '#5B5347' },
  peligro: { bg: '#FBEAE0', fg: '#A63A0C', borde: '#EDCBB4' },
  exito: { bg: '#DFF0E8', fg: '#1F6F53', borde: '#CBE9DA' },
};
const TINTE_OSCURO = {
  azul: { bg: '#1C2E3D', fg: '#8FC4EC' },
  aqua: { bg: '#163024', fg: '#7BD2AC' },
  naranja: { bg: '#3B2A1A', fg: '#F0AC72' },
  amarillo: { bg: '#382C12', fg: '#E8C464' },
  rosa: { bg: '#3A2016', fg: '#F0916A' },
  gris: { bg: '#2E271D', fg: '#C7BBA8' },
  peligro: { bg: '#3A1C14', fg: '#F2836A', borde: '#5A3420' },
  exito: { bg: '#163024', fg: '#7BD2AC', borde: '#295A44' },
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
  'Diagnóstico por Imagen': SERIE_CLARO.terracota,
};
const RUBRO_COLOR_OSCURO = {
  Odontología: SERIE_OSCURO.azul,
  Veterinaria: SERIE_OSCURO.verde,
  'Diagnóstico por Imagen': SERIE_OSCURO.terracota,
};
export const RUBRO_COLOR_POR_TEMA = { claro: RUBRO_COLOR_CLARO, oscuro: RUBRO_COLOR_OSCURO };
export const RUBRO_COLOR = RUBRO_COLOR_CLARO;

export const RUBRO_TONO = {
  Odontología: 'azul',
  Veterinaria: 'aqua',
  'Diagnóstico por Imagen': 'naranja',
};

export default GM;
