// ============================================================================
// SISTEMA GM · TILE DEL PORTAL HUB
// ----------------------------------------------------------------------------
// Botonera tipo terminal operativa: ícono arriba, rótulo abajo, marco fino.
// Compacta por diseño: se adapta a la altura disponible sin generar scroll.
// ============================================================================

import React from 'react';
import { ShieldCheck } from 'lucide-react';

export default function ModuleLauncherCard({ module, active = false, remaining = '', onLaunch }) {
  const Icon = module.icon;
  const accent = module.accent;

  return (
    <button
      type="button"
      onClick={() => onLaunch(module)}
      title={`${module.code} · ${module.desc}`}
      className={[
        'group relative flex h-full min-h-0 flex-col items-center justify-center',
        'gap-[clamp(0.35rem,1.1vh,0.7rem)] overflow-hidden rounded-lg border border-white/[0.09]',
        'bg-gradient-to-b from-white/[0.055] to-white/[0.015] p-[clamp(0.4rem,1.3vh,0.9rem)]',
        'transition-all duration-300 hover:-translate-y-0.5 hover:from-white/[0.09]',
        'focus:outline-none focus-visible:ring-2',
        accent.border,
        accent.glow,
        accent.ring,
      ].join(' ')}
    >
      {/* Código operativo */}
      <span className="absolute left-2 top-1.5 font-mono text-[9px] tracking-[0.18em] text-white/20 transition-colors group-hover:text-white/35">
        {module.code}
      </span>

      {/* Sesión viva */}
      {active && (
        <span className="absolute right-1.5 top-1.5 flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-1.5 py-0.5 font-mono text-[8px] uppercase tracking-widest text-emerald-400">
          <ShieldCheck className="h-2.5 w-2.5" />
          {remaining}
        </span>
      )}

      {/* Ícono */}
      <span className="flex items-center justify-center rounded-md border border-white/[0.07] bg-black/30 p-[clamp(0.35rem,1.1vh,0.7rem)] transition-transform duration-300 group-hover:scale-105">
        <Icon
          className={`h-[clamp(1.15rem,3.2vh,1.9rem)] w-[clamp(1.15rem,3.2vh,1.9rem)] ${accent.text}`}
          strokeWidth={1.5}
        />
      </span>

      {/* Rótulo */}
      <span
        className={`border-b border-transparent pb-0.5 text-center text-[clamp(0.6rem,1.5vh,0.78rem)] font-bold uppercase leading-tight tracking-[0.13em] transition-colors group-hover:border-current ${accent.text}`}
      >
        {module.name}
      </span>

      {/* Descripción (se oculta en pantallas bajas) */}
      <span className="gm-card-desc hidden max-w-[24ch] sm:block text-center text-[clamp(0.53rem,1.15vh,0.65rem)] leading-snug text-white/30 transition-colors group-hover:text-white/55">
        {module.desc}
      </span>
    </button>
  );
}
