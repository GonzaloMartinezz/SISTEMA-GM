// ============================================================================
// SISTEMA GM · CAPA COMPARTIDA · FICHA DE INDICADOR
// ----------------------------------------------------------------------------
// Un número que se lee solo: no hace falta un gráfico para un dato único.
// ============================================================================

import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function KpiTile({ label, valor, detalle, variacion, acento = '#3987e5', icon: Icon }) {
  const sube = Number(variacion) > 0;
  const baja = Number(variacion) < 0;

  return (
    <div className="flex min-w-0 flex-col rounded-md border border-gray-800 bg-gray-900/60 p-3">
      <div className="mb-1.5 flex items-center gap-1.5">
        <span className="h-2 w-2 shrink-0 rounded-sm" style={{ background: acento }} />
        <p className="truncate font-mono text-[9px] uppercase tracking-[0.18em] text-gray-500">
          {label}
        </p>
        {Icon && <Icon className="ml-auto h-3.5 w-3.5 shrink-0 text-gray-700" />}
      </div>

      <p className="truncate font-mono text-lg font-bold tabular-nums text-gray-100">{valor}</p>

      <div className="mt-1 flex items-center gap-2">
        {detalle && (
          <span className="truncate font-mono text-[10px] text-gray-600">{detalle}</span>
        )}
        {variacion != null && (
          <span
            className={`ml-auto inline-flex shrink-0 items-center gap-1 font-mono text-[10px] font-bold tabular-nums ${
              sube ? 'text-emerald-400' : baja ? 'text-orange-400' : 'text-gray-500'
            }`}
          >
            {sube ? (
              <TrendingUp className="h-3 w-3" />
            ) : baja ? (
              <TrendingDown className="h-3 w-3" />
            ) : null}
            {Math.abs(Number(variacion)).toFixed(1)}%
          </span>
        )}
      </div>
    </div>
  );
}
