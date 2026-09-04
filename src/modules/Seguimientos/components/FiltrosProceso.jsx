// ============================================================================
// SISTEMA GM · M-04 · FILTROS DE PROCESO
// ----------------------------------------------------------------------------
// Los chips de etapa apagan columnas del tablero; el de prioridad recorta la
// cartera de verdad. Es una diferencia real y por eso están separados por un
// divisor y con leyendas distintas: si estuvieran mezclados, apagar "Cerrado"
// parecería cambiar el valor de la cartera, y no lo cambia.
// ============================================================================

import React from 'react';
import { Flame, RotateCcw } from 'lucide-react';
import { ETAPAS } from '../config/pipeline.config';
import { useSeguimientos } from '../context/SeguimientosContext';

export default function FiltrosProceso({ conteo = {} }) {
  const {
    etapasVisibles, toggleEtapa, soloPrioridadAlta, setSoloPrioridadAlta,
    hayFiltro, limpiarFiltros,
  } = useSeguimientos();

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#B0A697] dark:text-[#6B7280]">
        Nivel de proceso
      </span>

      {ETAPAS.map((e) => {
        const activo = etapasVisibles.includes(e.id);
        return (
          <button
            key={e.id}
            type="button"
            onClick={() => toggleEtapa(e.id)}
            title={e.bajada}
            aria-pressed={activo}
            className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[12px] font-medium transition"
            style={
              activo
                ? { backgroundColor: `${e.color}1F`, borderColor: `${e.color}66`, color: '#4A3520' }
                : { backgroundColor: '#FFFFFF', borderColor: '#E8E0D5', color: '#B0A697' }
            }
          >
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: activo ? e.color : '#DDD3C4' }}
            />
            {e.nombre}
            {conteo[e.id] != null && (
              <span className={activo ? 'text-[#6E6559] dark:text-[#9CA3AF]' : 'text-[#C6BCAC]'}>{conteo[e.id]}</span>
            )}
          </button>
        );
      })}

      <span className="mx-1 hidden h-5 w-px bg-[#E8E0D5] sm:block" aria-hidden="true" />

      <button
        type="button"
        onClick={() => setSoloPrioridadAlta(!soloPrioridadAlta)}
        aria-pressed={soloPrioridadAlta}
        title="Recorta la cartera: cambia también los indicadores de arriba."
        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] font-medium transition ${
          soloPrioridadAlta
            ? 'border-[#A63A0C66] bg-[#F5DDCC] text-[#A63A0C]'
            : 'border-[#E8E0D5] dark:border-[#333333] bg-white dark:bg-[#1E1E1E] text-[#948A7C] hover:bg-[#FCFAF6] dark:hover:bg-[#2D2D2D]'
        }`}
      >
        <Flame size={13} />
        Sólo prioridad alta
      </button>

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
