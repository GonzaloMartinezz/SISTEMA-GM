// ============================================================================
// SISTEMA GM · M-04 · EMBUDO
// ----------------------------------------------------------------------------
// Barras horizontales, no un triángulo. El triángulo clásico es lindo pero
// miente: el ancho de cada franja depende de la altura del dibujo y no se puede
// comparar de un vistazo. Una barra que arranca del mismo margen sí.
//
// El ancho es la plata, no la cantidad. Diez leads de mil dólares no son lo
// mismo que uno de veinte mil, y el número de oportunidades va al costado.
// ============================================================================

import React from 'react';
import EstadoVacio from '../../../../shared/gm-ui/EstadoVacio';

const usd = (v) => `US$ ${Math.round(Number(v || 0)).toLocaleString('es-AR')}`;

export default function EmbudoEtapas({ etapas, onEtapa }) {
  const maximo = Math.max(...etapas.map((e) => e.valor), 1);
  const totalValor = etapas.reduce((a, e) => a + e.valor, 0);

  if (!totalValor) {
    return (
      <EstadoVacio
        titulo="Sin montos cargados"
        texto="Poné el monto estimado de cada oportunidad y el embudo se arma solo."
      />
    );
  }

  return (
    <ul className="space-y-3.5">
      {etapas.map((e) => (
        <li key={e.id}>
          <button
            type="button"
            onClick={() => onEtapa?.(e.id)}
            className="w-full rounded-lg px-1 py-1 text-left transition hover:bg-[var(--gm-superficie-suave)]"
          >
            <div className="flex items-baseline justify-between gap-3">
              <span className="flex items-center gap-2 text-[13px] font-medium text-[var(--gm-texto)]">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: e.color }} />
                {e.nombre}
                <span className="text-[12px] font-normal text-[var(--gm-texto-tenue)]">
                  {e.cantidad} {e.cantidad === 1 ? 'oportunidad' : 'oportunidades'}
                </span>
              </span>
              <span className="whitespace-nowrap text-[13px] font-semibold text-[var(--gm-texto)]">
                {usd(e.valor)}
              </span>
            </div>

            <div className="mt-1.5 h-3 overflow-hidden rounded-full bg-[var(--gm-superficie-fuerte)]">
              <span
                className="block h-full rounded-full transition-all"
                style={{ width: `${(e.valor / maximo) * 100}%`, backgroundColor: e.color }}
              />
            </div>

            <p className="mt-1 text-[11px] text-[var(--gm-texto-tenue)]">
              {e.probabilidad}% de probabilidad · {usd(e.ponderado)} ponderado
            </p>
          </button>
        </li>
      ))}
    </ul>
  );
}
