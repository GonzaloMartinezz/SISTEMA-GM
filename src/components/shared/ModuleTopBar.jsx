// ============================================================================
// SISTEMA GM · CABECERA PERSISTENTE DE MÓDULO
// ----------------------------------------------------------------------------
// Se renderiza SOLO dentro de un módulo autorizado. No expone ningún acceso a
// otras áreas: la única salida es volver al Hub (cerrando la sesión del módulo).
// ============================================================================

import React, { useEffect, useState } from 'react';
import { ChevronLeft, ShieldCheck, Timer } from 'lucide-react';

const formatRemaining = (expiresAt) => {
  const ms = Math.max(0, expiresAt - Date.now());
  const mins = Math.floor(ms / 60000);
  const secs = Math.floor((ms % 60000) / 1000);
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

export default function ModuleTopBar({ module, session, onExit }) {
  const [, forceTick] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => forceTick((n) => n + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!module) return null;

  const Icon = module.icon;
  const accent = module.accent;

  return (
    <header className="z-40 flex h-14 shrink-0 items-center justify-between gap-4 border-b border-white/[0.07] bg-[#08090c] px-4 md:px-6">
      <div className="flex min-w-0 items-center gap-4">
        <button
          type="button"
          onClick={onExit}
          title="Salir del módulo y volver al Portal Hub"
          className="flex items-center gap-1.5 rounded-lg border border-white/10 py-1.5 pl-1.5 pr-3 text-xs font-medium text-textMuted transition-colors hover:border-white/25 hover:text-white"
        >
          <ChevronLeft className="h-4 w-4" />
          Hub
        </button>

        <div className="h-5 w-px bg-white/10" />

        <div className="flex min-w-0 items-center gap-2.5">
          <Icon className={`h-4 w-4 shrink-0 ${accent.text}`} strokeWidth={1.75} />
          <span className="truncate text-sm font-bold tracking-tight text-white">
            {module.name}
          </span>
          <span className="hidden font-mono text-[10px] uppercase tracking-[0.2em] text-white/25 sm:inline">
            {module.code}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {session?.expiresAt && (
          <span className="hidden items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.15em] text-textMuted sm:flex">
            <Timer className="h-3.5 w-3.5" />
            {formatRemaining(session.expiresAt)}
          </span>
        )}

        <span className="flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/[0.08] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.15em] text-emerald-400">
          <ShieldCheck className="h-3.5 w-3.5" />
          {session?.user?.displayName || session?.user?.username || 'Operador'}
        </span>
      </div>
    </header>
  );
}
