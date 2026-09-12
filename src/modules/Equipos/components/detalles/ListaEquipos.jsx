// ============================================================================
// SISTEMA GM · M-02 EQUIPAMIENTOS · SELECTOR DE EQUIPO
// ----------------------------------------------------------------------------
// Columna izquierda de la sección de detalles: buscador y lista agrupada por
// rubro. El equipo elegido manda sobre la ficha de la derecha.
// ============================================================================

import React, { useMemo } from 'react';
import Buscador from '../../../../shared/gm-ui/Buscador';
import EstadoVacio from '../../../../shared/gm-ui/EstadoVacio';
import { RUBRO_COLOR } from '../../../../shared/gm-ui/tokens';
import { usd } from '../../../../shared/gm-ui/graficos';

export default function ListaEquipos({ equipos = [], seleccionado, onSeleccionar, busqueda, onBuscar }) {
  const grupos = useMemo(() => {
    const mapa = new Map();
    equipos.forEach((e) => {
      const k = e.rubro || 'Sin rubro';
      if (!mapa.has(k)) mapa.set(k, []);
      mapa.get(k).push(e);
    });
    return [...mapa.entries()].sort((a, b) => a[0].localeCompare(b[0], 'es'));
  }, [equipos]);

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-[var(--gm-borde-fuerte)] dark:border-[#333333] px-5 py-4">
        <Buscador valor={busqueda} onChange={onBuscar} placeholder="Buscar equipo…" />
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {!grupos.length && (
          <EstadoVacio
            titulo="Sin resultados"
            texto="Probá con otro nombre, marca o modelo."
          />
        )}

        {grupos.map(([rubro, lista]) => (
          <section key={rubro}>
            <p className="sticky top-0 z-10 flex items-center gap-2 bg-[#FCFAF6] dark:bg-[#2D2D2D] px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#948A7C]">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: RUBRO_COLOR[rubro] || '#948A7C' }}
              />
              {rubro}
              <span className="ml-auto font-normal normal-case tracking-normal">{lista.length}</span>
            </p>

            <ul>
              {lista.map((e) => {
                const activo = e.codigo === seleccionado;
                return (
                  <li key={e.codigo}>
                    <button
                      type="button"
                      onClick={() => onSeleccionar(e.codigo)}
                      className={`flex w-full flex-col items-start gap-0.5 border-l-[3px] px-5 py-3 text-left transition ${
                        activo
                          ? 'border-[#B4551A] bg-[#FBE5C8] dark:bg-[#2A1608]'
                          : 'border-transparent hover:bg-[#F6F1E9] dark:hover:bg-[#2D2D2D]'
                      }`}
                    >
                      <span
                        className={`w-full truncate text-[14px] ${
                          activo ? 'font-medium text-[#8A3F11]' : 'text-[#2A2118] dark:text-[#F9FAFB]'
                        }`}
                      >
                        {e.nombre}
                      </span>
                      <span className="w-full truncate text-[12px] text-[var(--gm-texto-medio)] dark:text-[#6B7280]">
                        {usd(e.precioUsd)} · {e.stock > 0 ? `${e.stock} en stock` : 'sin stock'}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
