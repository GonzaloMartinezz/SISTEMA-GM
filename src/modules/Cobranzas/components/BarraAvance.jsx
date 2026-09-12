// ============================================================================
// SISTEMA GM · M-07 · BARRA DE AVANCE DE COBRO
// ----------------------------------------------------------------------------
// Cuánto de una venta ya entró. Tres tramos, no dos: cobrado, vencido y lo que
// falta pero todavía no venció. Mostrar sólo "cobrado vs falta" esconde
// justamente el dato que importa —cuánto de lo que falta ya debería estar—.
// ============================================================================

import React from 'react';
import { ESTADO_COLOR } from '../../../shared/gm-ui/tokens';

export default function BarraAvance({
  total = 0,
  cobrado = 0,
  vencido = 0,
  alto = 'h-2',
  mostrarPct = false,
}) {
  const t = Math.max(Number(total) || 0, 0.01);
  const pctCobrado = Math.min((Number(cobrado) || 0) / t, 1) * 100;
  const pctVencido = Math.min((Number(vencido) || 0) / t, 1 - pctCobrado / 100) * 100;
  const pctResto = Math.max(100 - pctCobrado - pctVencido, 0);

  return (
    <div className="flex items-center gap-2">
      <div className={`flex flex-1 overflow-hidden rounded-full bg-[#F3EDE4] ${alto}`}>
        {pctCobrado > 0 && (
          <span
            className="h-full"
            style={{ width: `${pctCobrado}%`, backgroundColor: ESTADO_COLOR.bien }}
            title={`Cobrado: ${Math.round(pctCobrado)}%`}
          />
        )}
        {pctVencido > 0 && (
          <span
            className="h-full"
            style={{ width: `${pctVencido}%`, backgroundColor: ESTADO_COLOR.critico }}
            title={`Vencido sin cobrar: ${Math.round(pctVencido)}%`}
          />
        )}
        {pctResto > 0 && <span className="h-full" style={{ width: `${pctResto}%` }} />}
      </div>
      {mostrarPct && (
        <span className="w-9 shrink-0 text-right text-[12px] tabular-nums text-[#6E6559]">
          {Math.round(pctCobrado)}%
        </span>
      )}
    </div>
  );
}
