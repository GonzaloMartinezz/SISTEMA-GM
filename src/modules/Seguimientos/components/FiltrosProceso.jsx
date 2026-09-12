// ============================================================================
// SISTEMA GM · M-03 · FILTROS DE PROCESO
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
      <span className="mr-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--gm-texto-tenue)]">
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
                : { backgroundColor: '#FFFFFF', borderColor: 'var(--gm-borde)', color: 'var(--gm-texto-medio)' }
            }
          >
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: activo ? e.color : '#DDD3C4' }}
            />
            {e.nombre}
            {conteo[e.id] != null && (
              <span className={activo ? 'text-[var(--gm-texto-medio)] ' : 'text-[var(--gm-texto-suave)]'}>{conteo[e.id]}</span>
            )}
          </button>
        );
      })}

      <span className="mx-1 hidden h-5 w-px bg-[var(--gm-borde)] sm:block" aria-hidden="true" />

      <button
        type="button"
        onClick={() => setSoloPrioridadAlta(!soloPrioridadAlta)}
        aria-pressed={soloPrioridadAlta}
        title="Recorta la cartera: cambia también los indicadores de arriba."
        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] font-medium transition ${
          soloPrioridadAlta
            ? 'border-[#A63A0C66] bg-[#F5DDCC] text-[var(--gm-acento)]'
            : 'border-[var(--gm-borde)]  bg-[var(--gm-superficie)]  text-[var(--gm-texto-suave)] hover:bg-[var(--gm-superficie-suave)] '
        }`}
      >
        <Flame size={13} />
        Sólo prioridad alta
      </button>

      {hayFiltro && (
        <button
          type="button"
          onClick={limpiarFiltros}
          className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[12px] text-[var(--gm-texto-suave)] transition hover:bg-[var(--gm-superficie-fuerte)] hover:text-[var(--gm-texto)]"
        >
          <RotateCcw size={13} />
          Limpiar
        </button>
      )}
    </div>
  );
}
