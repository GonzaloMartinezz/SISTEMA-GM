// ============================================================================
// SISTEMA GM · CAPA COMPARTIDA · PANEL BASE DE ALTA DENSIDAD
// ----------------------------------------------------------------------------
// Primitiva visual de todos los módulos operativos: encabezado tipo terminal
// y cuerpo con scroll propio.
// ============================================================================

import React from 'react';

export default function PanelTerminal({
  titulo,
  acento = 'cyan',
  acciones = null,
  className = '',
  bodyClassName = '',
  children,
}) {
  const acentos = {
    cyan: 'text-cyan-400',
    gris: 'text-gray-400',
    ambar: 'text-amber-400',
    rojo: 'text-rose-400',
    verde: 'text-emerald-400',
  };

  return (
    <section
      className={`flex min-h-0 flex-col overflow-hidden rounded-md border border-gray-800 bg-gray-900 ${className}`}
    >
      {titulo && (
        <div className="flex shrink-0 items-center justify-between gap-2 border-b border-gray-800 bg-gray-800/70 px-3 py-1.5">
          <h4
            className={`font-mono text-[10px] font-bold uppercase tracking-[0.2em] ${acentos[acento] || acentos.cyan}`}
          >
            {titulo}
          </h4>
          {acciones}
        </div>
      )}
      <div className={`min-h-0 flex-1 overflow-auto ${bodyClassName}`}>{children}</div>
    </section>
  );
}

/** Fila etiqueta/valor para grillas de datos. */
export function Campo({ label, children, className = '' }) {
  return (
    <div className={className}>
      <span className="mb-0.5 block font-mono text-[9px] uppercase tracking-[0.18em] text-gray-600">
        {label}
      </span>
      <span className="block font-mono text-xs text-gray-200">{children ?? '—'}</span>
    </div>
  );
}

/** Estado vacío coherente en todas las pestañas. */
export function SinDatos({ mensaje = 'Sin registros en el período' }) {
  return (
    <div className="flex h-full min-h-[120px] items-center justify-center px-4 py-8 text-center">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-gray-600">{mensaje}</p>
    </div>
  );
}
