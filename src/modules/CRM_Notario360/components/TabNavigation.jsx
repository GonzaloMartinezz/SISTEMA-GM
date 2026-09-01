// ============================================================================
// SISTEMA GM · NOTARIO 360° · NAVEGACIÓN POR PESTAÑAS
// ----------------------------------------------------------------------------
// Sub-menú interno: cambia de vista sin recargar la página ni perder la
// cabecera persistente.
// ============================================================================

import React from 'react';
import { NOTARIO_TABS } from '../config/tabs.config';

export default function TabNavigation({ activa, onCambiar }) {
  return (
    <nav
      role="tablist"
      aria-label="Secciones de la cuenta"
      className="flex shrink-0 items-stretch gap-0.5 overflow-x-auto border-b border-gray-800 bg-gray-950 px-2 md:px-4"
    >
      {NOTARIO_TABS.map((tab) => {
        const Icon = tab.icon;
        const activo = tab.id === activa;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activo}
            title={tab.desc}
            onClick={() => onCambiar(tab.id)}
            className={[
              'relative flex shrink-0 items-center gap-2 whitespace-nowrap px-3 py-2.5 font-mono text-[11px] font-bold uppercase tracking-[0.14em] transition-colors md:px-4',
              activo ? 'text-cyan-400' : 'text-gray-500 hover:text-gray-300',
            ].join(' ')}
          >
            <Icon className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{tab.label}</span>
            <span className="sm:hidden">{tab.short}</span>
            {activo && (
              <span className="absolute inset-x-1 -bottom-px h-0.5 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.6)]" />
            )}
          </button>
        );
      })}
    </nav>
  );
}
