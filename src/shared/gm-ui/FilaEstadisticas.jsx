// ============================================================================
// SISTEMA GM · UI · FILA DE ESTADÍSTICAS
// ----------------------------------------------------------------------------
// Seis números chicos en una sola fila, separados por líneas verticales. Es la
// franja de resumen del período: se lee de un barrido horizontal, sin que cada
// dato reclame una tarjeta propia. Cuando un número necesita una advertencia,
// va abajo en su color; si no, va el detalle en gris.
// ============================================================================

import React from 'react';
import { useTema } from './TemaProvider';

export default function FilaEstadisticas({ items = [] }) {
  const { t } = useTema();
  return (
    <div className="grid grid-cols-2 divide-y divide-[var(--gm-divisor)] sm:grid-cols-3 sm:divide-y-0 xl:grid-cols-6">
      {items.map((it, i) => (
        <div
          key={it.etiqueta}
          className={`px-5 py-4 ${i > 0 ? 'xl:border-l xl:border-[var(--gm-divisor)]' : ''} ${
            i % 2 === 1 ? 'border-l border-[var(--gm-divisor)] sm:border-l-0' : ''
          } ${i % 3 !== 0 ? 'sm:border-l sm:border-[var(--gm-divisor)]' : ''}`}
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--gm-texto-medio)]">
            {it.etiqueta}
          </p>
          <p
            className="mt-1.5 text-[24px] leading-none tracking-tight"
            style={{ color: it.color || t.texto }}
          >
            {it.valor}
          </p>
          {it.detalle && (
            <p className="mt-1.5 text-[12px]" style={{ color: it.detalleColor || t.textoSuave }}>
              {it.detalle}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
