// ============================================================================
// SISTEMA GM · UI · INTERRUPTOR DE TEMA (SOL / LUNA)
// ----------------------------------------------------------------------------
// Un botón, un ícono, sin texto: sol cuando está oscuro (toca para aclarar),
// luna cuando está claro (toca para apagar la luz). Vive en el encabezado de
// cada módulo que adoptó el tema — EncabezadoSeccion lo agrega solo.
// ============================================================================

import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTema } from './TemaProvider';

export default function InterruptorTema({ className = '' }) {
  const { esOscuro, alternar } = useTema();

  return (
    <button
      type="button"
      onClick={alternar}
      title={esOscuro ? 'Modo claro (de día)' : 'Modo oscuro (de noche)'}
      aria-label={esOscuro ? 'Pasar a modo claro' : 'Pasar a modo oscuro'}
      aria-pressed={esOscuro}
      className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-[var(--gm-borde)] bg-[var(--gm-superficie)] text-[var(--gm-texto-suave)] transition hover:border-[var(--gm-acento)]/40 hover:text-[var(--gm-acento)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--gm-acento)]/20 ${className}`}
    >
      {esOscuro ? <Sun size={17} strokeWidth={2} /> : <Moon size={17} strokeWidth={2} />}
    </button>
  );
}
