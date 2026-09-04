// ============================================================================
// SISTEMA GM · UI · TOOLTIP DE GRÁFICOS
// ----------------------------------------------------------------------------
// Tarjeta con borde suave, ya teñida para el tema activo. Cada serie muestra
// su color, su nombre y su valor ya formateado: el gráfico nunca depende sólo
// del color.
// ============================================================================

import React from 'react';
import { useTema } from './TemaProvider';

export default function TooltipGm({ active, payload, label, formato = (v) => v, sufijo = '' }) {
  const { t } = useTema();
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-xl border border-[var(--gm-borde)] bg-[var(--gm-superficie)] px-3.5 py-2.5 shadow-[var(--gm-sombra-tooltip)]">
      {label != null && (
        <p className="mb-1.5 text-[12px] font-semibold text-[var(--gm-texto)]">{String(label)}</p>
      )}
      <ul className="space-y-1">
        {payload.map((p, i) => (
          <li key={`${p.dataKey}-${i}`} className="flex items-center gap-2 text-[12px]">
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-[3px]"
              style={{ backgroundColor: p.color || p.payload?.color || t.textoTenue }}
            />
            <span className="text-[var(--gm-texto-medio)]">{p.name}</span>
            <span className="ml-auto font-semibold text-[var(--gm-texto)]">
              {formato(p.value)}
              {sufijo}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
