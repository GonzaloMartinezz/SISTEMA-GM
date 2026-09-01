// ============================================================================
// SISTEMA GM · TILE DE SALIDA DEL PORTAL
// ----------------------------------------------------------------------------
// Cierra todas las sesiones modulares abiertas y deja el Hub en frío.
// ============================================================================

import React from 'react';
import { Power } from 'lucide-react';

export default function ExitTile({ sesionesActivas = 0, onSalir }) {
  return (
    <button
      type="button"
      onClick={onSalir}
      title="Cerrar todas las sesiones abiertas"
      className="group relative flex h-full min-h-0 flex-col items-center justify-center gap-[clamp(0.35rem,1.1vh,0.7rem)] overflow-hidden rounded-lg border border-white/[0.09] bg-gradient-to-b from-white/[0.03] to-transparent p-[clamp(0.4rem,1.3vh,0.9rem)] transition-all duration-300 hover:-translate-y-0.5 hover:border-rose-500/50 hover:shadow-[0_0_40px_-8px_rgba(244,63,94,0.4)] focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400/60"
    >
      <span className="absolute left-2 top-1.5 font-mono text-[9px] tracking-[0.18em] text-white/20">
        SYS
      </span>

      <span className="flex items-center justify-center rounded-md border border-white/[0.07] bg-black/30 p-[clamp(0.35rem,1.1vh,0.7rem)] transition-transform duration-300 group-hover:scale-105">
        <Power
          className="h-[clamp(1.15rem,3.2vh,1.9rem)] w-[clamp(1.15rem,3.2vh,1.9rem)] text-white/40 transition-colors group-hover:text-rose-400"
          strokeWidth={1.5}
        />
      </span>

      <span className="border-b border-transparent pb-0.5 text-center text-[clamp(0.6rem,1.5vh,0.78rem)] font-bold uppercase leading-tight tracking-[0.13em] text-white/45 transition-colors group-hover:border-current group-hover:text-rose-400">
        Salir
      </span>

      <span className="gm-card-desc hidden max-w-[24ch] sm:block text-center text-[clamp(0.53rem,1.15vh,0.65rem)] leading-snug text-white/25">
        {sesionesActivas
          ? `Cerrar ${sesionesActivas} sesión${sesionesActivas === 1 ? '' : 'es'} activa${sesionesActivas === 1 ? '' : 's'}`
          : 'Sin sesiones abiertas'}
      </span>
    </button>
  );
}
