// ============================================================================
// SISTEMA GM · UI · BOTÓN
// ----------------------------------------------------------------------------
// Tres variantes y nada más: sólido (acción principal), suave (secundaria) y
// fantasma (terciaria). Altura fija para que las barras de herramientas queden
// siempre alineadas.
//
// Las clases de Tailwind son SIEMPRE las mismas (bg-[var(--gm-btn-bg)],
// hover:bg-[var(--gm-btn-bg-hover)]...); lo único que cambia por variante y
// por tema es a qué color apunta cada variable, fijada por instancia con
// `style`. Así el :hover sigue siendo CSS de verdad — nada de recalcularlo a
// mano — y cada botón queda ya teñido para el tema activo.
// ============================================================================

import React from 'react';
import { useTema } from './TemaProvider';

const TAMANOS = {
  sm: 'h-9 px-3 text-[13px] gap-1.5',
  md: 'h-11 px-4 text-[14px] gap-2',
};

const CLASES_BASE =
  'inline-flex items-center justify-center rounded-xl font-medium outline-none transition ' +
  'bg-[var(--gm-btn-bg)] text-[var(--gm-btn-fg)] border border-[var(--gm-btn-borde)] ' +
  'hover:bg-[var(--gm-btn-bg-hover)] hover:text-[var(--gm-btn-fg-hover)] ' +
  'focus-visible:ring-4 focus-visible:ring-[var(--gm-btn-ring)] ' +
  'disabled:cursor-not-allowed disabled:opacity-50';

function variablesDeVariante(variante, t, tinte) {
  switch (variante) {
    case 'solido':
      return {
        '--gm-btn-bg': t.acento,
        '--gm-btn-fg': t.sobreAcento,
        '--gm-btn-bg-hover': t.acentoFuerte,
        '--gm-btn-fg-hover': t.sobreAcento,
        '--gm-btn-borde': 'transparent',
        '--gm-btn-ring': `${t.acento}55`,
      };
    case 'suave':
      return {
        '--gm-btn-bg': t.acentoSuaveBg,
        '--gm-btn-fg': t.acentoFuerte,
        '--gm-btn-bg-hover': t.borde,
        '--gm-btn-fg-hover': t.acentoFuerte,
        '--gm-btn-borde': 'transparent',
        '--gm-btn-ring': `${t.acento}40`,
      };
    case 'fantasma':
      return {
        '--gm-btn-bg': 'transparent',
        '--gm-btn-fg': t.textoMedio,
        '--gm-btn-bg-hover': t.superficieFuerte,
        '--gm-btn-fg-hover': t.texto,
        '--gm-btn-borde': 'transparent',
        '--gm-btn-ring': `${t.acento}30`,
      };
    case 'peligro':
      return {
        '--gm-btn-bg': tinte.peligro.bg,
        '--gm-btn-fg': tinte.peligro.fg,
        '--gm-btn-bg-hover': tinte.rosa.bg,
        '--gm-btn-fg-hover': tinte.peligro.fg,
        '--gm-btn-borde': 'transparent',
        '--gm-btn-ring': `${t.acento}35`,
      };
    case 'contorno':
    default:
      return {
        '--gm-btn-bg': t.superficie,
        '--gm-btn-fg': t.textoMedio,
        '--gm-btn-bg-hover': t.superficieSuave,
        '--gm-btn-fg-hover': t.texto,
        '--gm-btn-borde': t.borde,
        '--gm-btn-ring': `${t.acento}30`,
      };
  }
}

export default function BotonGm({
  variante = 'contorno',
  tamano = 'md',
  icono: Icono,
  children,
  className = '',
  style,
  ...props
}) {
  const { t, tinte } = useTema();
  const variables = variablesDeVariante(variante, t, tinte);

  return (
    <button
      type="button"
      {...props}
      style={{ ...variables, ...style }}
      className={`${CLASES_BASE} ${TAMANOS[tamano]} ${className}`}
    >
      {Icono && <Icono size={tamano === 'sm' ? 15 : 16} strokeWidth={2} />}
      {children}
    </button>
  );
}
