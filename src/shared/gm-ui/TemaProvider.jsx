// ============================================================================
// SISTEMA GM · UI · MOTOR DE TEMA (CLARO / OSCURO)
// ----------------------------------------------------------------------------
// Cada módulo es una aplicación aislada (así está pensado todo Sistema GM), y
// el tema sigue esa misma regla: el interruptor de Clientes no mueve el de
// Cobranzas. Cada módulo que lo adopta guarda su propia preferencia bajo su
// propia clave, así Gonzalo puede tener un módulo en oscuro de noche y otro
// en claro sin que se pisen.
//
// Un módulo que todavía NO envuelve su contenido en <TemaProvider> sigue
// funcionando exactamente igual que siempre: useTema() devuelve el tema claro
// por defecto en cualquier lugar del árbol sin proveedor. Por eso esta pieza
// es 100% aditiva — no hay riesgo de romper un módulo que no la usa todavía.
// ============================================================================

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  TEMA_CLARO,
  TEMA_OSCURO,
  SERIE_POR_TEMA,
  SERIE_ORDEN_POR_TEMA,
  ESTADO_COLOR_POR_TEMA,
  TINTE_POR_TEMA,
  ACENTO_TONO_POR_TEMA,
  RUBRO_COLOR_POR_TEMA,
  RAMPA,
  textoSobre,
} from './tokens';

const claveStorage = (idModulo) => `gm.tema.${idModulo || 'sistema'}`;

function leerGuardado(idModulo) {
  try {
    const v = window.localStorage.getItem(claveStorage(idModulo));
    return v === 'oscuro' || v === 'claro' ? v : null;
  } catch {
    return null;
  }
}

function prefiereOscuroElSistema() {
  try {
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches === true;
  } catch {
    return false;
  }
}

/** Junta cada bloque de tokens del tema activo en un solo objeto cómodo de
 *  usar, más las variables CSS que LayoutModulo aplica en la raíz. */
function armarValor(tema, idModulo, alternar) {
  const base = tema === 'oscuro' ? TEMA_OSCURO : TEMA_CLARO;
  return {
    tema,
    esOscuro: tema === 'oscuro',
    idModulo,
    alternar,
    t: base,
    serie: SERIE_POR_TEMA[tema],
    serieOrden: SERIE_ORDEN_POR_TEMA[tema],
    estado: ESTADO_COLOR_POR_TEMA[tema],
    tinte: TINTE_POR_TEMA[tema],
    acentoTono: ACENTO_TONO_POR_TEMA[tema],
    rubroColor: RUBRO_COLOR_POR_TEMA[tema],
    rampa: RAMPA,
    textoSobre,
    variablesCss: {
      '--gm-fondo': base.fondo,
      '--gm-superficie': base.superficie,
      '--gm-superficie-suave': base.superficieSuave,
      '--gm-superficie-fuerte': base.superficieFuerte,
      '--gm-borde': base.borde,
      '--gm-borde-fuerte': base.bordeFuerte,
      '--gm-divisor': base.divisor,
      '--gm-texto': base.texto,
      '--gm-texto-medio': base.textoMedio,
      '--gm-texto-suave': base.textoSuave,
      '--gm-texto-tenue': base.textoTenue,
      '--gm-acento': base.acento,
      '--gm-acento-fuerte': base.acentoFuerte,
      '--gm-acento-suave-bg': base.acentoSuaveBg,
      '--gm-sobre-acento': base.sobreAcento,
      '--gm-overlay': base.overlay,
      '--gm-sombra-panel': base.sombraPanel,
      '--gm-sombra-modal': base.sombraModal,
      '--gm-sombra-tooltip': base.sombraTooltip,
    },
  };
}

const ContextoTema = createContext(null);

/** Se calcula una sola vez: el valor que ve cualquier componente que se
 *  renderiza fuera de un <TemaProvider> (todos los módulos que todavía no lo
 *  adoptaron). Siempre tema claro, sin escribir nada en el almacenamiento. */
const VALOR_SIN_PROVEEDOR = armarValor('claro', null, () => {});

export function TemaProvider({ idModulo, children }) {
  const [tema, setTema] = useState(
    () => leerGuardado(idModulo) || (prefiereOscuroElSistema() ? 'oscuro' : 'claro')
  );

  useEffect(() => {
    try {
      window.localStorage.setItem(claveStorage(idModulo), tema);
    } catch {
      /* almacenamiento bloqueado: el módulo sigue andando, sólo no recuerda */
    }
  }, [idModulo, tema]);

  const alternar = useCallback(() => {
    setTema((actual) => (actual === 'oscuro' ? 'claro' : 'oscuro'));
  }, []);

  const valor = useMemo(() => armarValor(tema, idModulo, alternar), [tema, idModulo, alternar]);

  return <ContextoTema.Provider value={valor}>{children}</ContextoTema.Provider>;
}

/** Tema y tokens del tema activo. Fuera de un TemaProvider, siempre claro. */
export function useTema() {
  return useContext(ContextoTema) || VALOR_SIN_PROVEEDOR;
}

/** true sólo dentro de un módulo que adoptó el interruptor. Sirve para que
 *  piezas compartidas (como el encabezado) muestren el botón de tema nada
 *  más que donde de verdad hace algo. */
export function useTemaDisponible() {
  return useContext(ContextoTema) !== null;
}
