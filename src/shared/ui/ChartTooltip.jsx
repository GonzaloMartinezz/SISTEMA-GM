// ============================================================================
// SISTEMA GM · CAPA COMPARTIDA · TOOLTIP DE GRÁFICOS
// ----------------------------------------------------------------------------
// Un único tooltip para todos los gráficos del sistema: el valor viaja en tinta
// neutra y el color solo aparece en la marca que identifica la serie.
// ============================================================================

import React from 'react';
import { usd } from './viz';

export default function ChartTooltip({ active, payload, label, formato = usd }) {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="rounded-md border border-gray-700 bg-gray-950/95 px-3 py-2 shadow-xl backdrop-blur">
      <p className="mb-1.5 font-mono text-[10px] uppercase tracking-[0.15em] text-gray-500">
        {label}
      </p>
      <ul className="space-y-1">
        {payload.map((p) => (
          <li key={p.dataKey} className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5">
              <span
                className="h-2 w-2 shrink-0 rounded-sm"
                style={{ background: p.color || p.stroke || p.fill }}
              />
              <span className="text-[11px] text-gray-400">{p.name}</span>
            </span>
            <span className="font-mono text-[11px] font-bold tabular-nums text-gray-100">
              {formato(p.value)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
