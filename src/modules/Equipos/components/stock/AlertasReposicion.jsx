// ============================================================================
// SISTEMA GM · M-02 EQUIPAMIENTOS · QUÉ HAY QUE REPONER
// ----------------------------------------------------------------------------
// Lo único que importa de esta lista es que sea corta y accionable: el equipo,
// cuánto falta para volver al mínimo y si ya hay algo en camino. Ordenado por
// urgencia real, no alfabéticamente.
// ============================================================================

import React, { useMemo } from 'react';
import { PackageCheck, Truck } from 'lucide-react';
import EstadoVacio from '../../../../shared/gm-ui/EstadoVacio';
import { usd } from '../../../../shared/gm-ui/graficos';

export default function AlertasReposicion({ equipos = [], onReponer }) {
  const criticos = useMemo(
    () =>
      equipos
        .filter((e) => e.stock <= e.minStock)
        .sort((a, b) => {
          // Primero lo que está en cero y sin nada en camino.
          const urgencia = (e) => e.stock * 10 + (e.transito > 0 ? 5 : 0);
          return urgencia(a) - urgencia(b);
        }),
    [equipos]
  );

  if (!criticos.length) {
    return (
      <EstadoVacio
        icono={PackageCheck}
        titulo="Todo por encima del mínimo"
        texto="No hay nada urgente para reponer. Los mínimos se ajustan desde la ficha de cada equipo."
      />
    );
  }

  return (
    <ul className="space-y-2.5">
      {criticos.map((e) => {
        const faltan = Math.max(e.minStock - e.stock, 0);
        const sinNadaEnCamino = e.transito === 0;
        const grave = e.stock === 0 && sinNadaEnCamino;

        return (
          <li
            key={e.codigo}
            className="rounded-xl border p-4 transition"
            style={{
              borderColor: grave ? '#EDCBB4' : '#E8E0D5',
              backgroundColor: grave ? '#FBEAE0' : 'transparent',
            }}
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate text-[14px] font-medium text-[#2A2118] dark:text-[#F9FAFB]">{e.nombre}</p>
                <p className="truncate text-[12px] text-[#948A7C]">
                  {e.codigo} · {e.rubro}
                </p>
              </div>
              <p
                className="shrink-0 text-[13px] font-semibold"
                style={{ color: grave ? '#A63A0C' : '#B4551A' }}
              >
                {e.stock === 0 ? 'Sin stock' : `Quedan ${e.stock}`}
              </p>
            </div>

            <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-[#6E6559] dark:text-[#9CA3AF]">
              {faltan > 0 && (
                <span>
                  Faltan <span className="font-semibold text-[#2A2118] dark:text-[#F9FAFB]">{faltan}</span> para el mínimo
                </span>
              )}
              {e.transito > 0 ? (
                <span className="inline-flex items-center gap-1.5 text-[#23557E]">
                  <Truck size={13} />
                  {e.transito} en camino
                </span>
              ) : (
                <span className="text-[#B0A697] dark:text-[#6B7280]">nada en camino</span>
              )}
              <span className="text-[#B0A697] dark:text-[#6B7280]">reponer ≈ {usd(faltan * e.costoUsd)}</span>
            </div>

            {e.transito > 0 && (
              <button
                type="button"
                onClick={() => onReponer(e, 'transito')}
                className="mt-3 text-[13px] font-medium text-[#B4551A] underline-offset-2 hover:underline"
              >
                Ya llegó · pasar a depósito
              </button>
            )}
          </li>
        );
      })}
    </ul>
  );
}
