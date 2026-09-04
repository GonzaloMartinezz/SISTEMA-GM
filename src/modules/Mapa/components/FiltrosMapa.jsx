// ============================================================================
// SISTEMA GM · M-07 · FILTROS DEL MAPA
// ----------------------------------------------------------------------------
// Por estado de la relación y por rubro. Ninguno prendido quiere decir "todos".
// El chip de zona aparece solo cuando venís de tocar una zona en Cobertura.
// ============================================================================

import React from 'react';
import { RotateCcw } from 'lucide-react';
import { ESTADOS } from '../config/mapa.config';
import { useMapa } from '../context/MapaContext';

export default function FiltrosMapa({ conteoEstado = {}, conteoRubro = {} }) {
  const {
    estadosVisibles, toggleEstado, rubrosVisibles, toggleRubro, rubros,
    zonaActiva, setZonaActiva, hayFiltro, limpiarFiltros,
  } = useMapa();

  return (
    <div className="flex flex-wrap items-center gap-2">
      {Object.entries(ESTADOS).map(([id, e]) => {
        const activo = estadosVisibles.includes(id);
        const total = conteoEstado[id] || 0;
        if (!total && !activo) return null;
        return (
          <button
            key={id}
            type="button"
            onClick={() => toggleEstado(id)}
            aria-pressed={activo}
            className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] font-medium transition"
            style={
              activo
                ? { backgroundColor: `${e.color}1A`, borderColor: `${e.color}66`, color: '#3D3225' }
                : { backgroundColor: '#FFFFFF', borderColor: '#E8E0D5', color: '#948A7C' }
            }
          >
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: activo ? e.color : '#DDD3C4' }}
            />
            {e.nombre}
            <span className={activo ? 'text-[#6E6559] dark:text-[#9CA3AF]' : 'text-[#C6BCAC]'}>{total}</span>
          </button>
        );
      })}

      {rubros.length > 1 && (
        <>
          <span className="mx-1 hidden h-5 w-px bg-[#E8E0D5] sm:block" aria-hidden="true" />
          {rubros.map((r) => {
            const activo = rubrosVisibles.includes(r);
            return (
              <button
                key={r}
                type="button"
                onClick={() => toggleRubro(r)}
                aria-pressed={activo}
                className={`rounded-full border px-3 py-1.5 text-[12px] font-medium transition ${
                  activo
                    ? 'border-[#B4551A66] bg-[#FBE5C8] dark:bg-[#2A1608] text-[#8A3F11]'
                    : 'border-[#E8E0D5] dark:border-[#333333] bg-white dark:bg-[#1E1E1E] text-[#948A7C] hover:bg-[#FCFAF6] dark:hover:bg-[#2D2D2D]'
                }`}
              >
                {r}{' '}
                <span className={activo ? 'text-[#8A3F11]/70' : 'text-[#C6BCAC]'}>
                  {conteoRubro[r] || 0}
                </span>
              </button>
            );
          })}
        </>
      )}

      {zonaActiva && (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#2F6DA066] bg-[#E3EDF6] px-3 py-1.5 text-[12px] font-medium text-[#23557E]">
          {zonaActiva}
          <button
            type="button"
            onClick={() => setZonaActiva(null)}
            aria-label="Quitar la zona"
            className="text-[#23557E]/70 transition hover:text-[#23557E]"
          >
            ×
          </button>
        </span>
      )}

      {hayFiltro && (
        <button
          type="button"
          onClick={limpiarFiltros}
          className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[12px] text-[#948A7C] transition hover:bg-[#F3EDE4] dark:hover:bg-[#121212] hover:text-[#2A2118] dark:text-[#F9FAFB]"
        >
          <RotateCcw size={13} />
          Limpiar
        </button>
      )}
    </div>
  );
}
