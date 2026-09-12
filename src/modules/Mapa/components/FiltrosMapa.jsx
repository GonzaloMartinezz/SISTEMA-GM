// ============================================================================
// SISTEMA GM · M-06 · FILTROS DEL MAPA
// ----------------------------------------------------------------------------
// Por estado de la relación y por rubro. Ninguno prendido quiere decir "todos".
// El chip de zona aparece solo cuando venís de tocar una zona en Cobertura.
// ============================================================================

import React from 'react';
import { RotateCcw } from 'lucide-react';
import { ESTADOS } from '../config/mapa.config';
import { useMapa } from '../context/MapaContext';
import { useTema } from '../../../shared/gm-ui/TemaProvider';
import { RUBRO_TONO } from '../../../shared/gm-ui/tokens';

export default function FiltrosMapa({ conteoEstado = {}, conteoRubro = {} }) {
  const { tinte, rubroColor } = useTema();
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
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] font-medium transition ${
              !activo ? 'bg-[var(--gm-superficie)] border-[var(--gm-borde)] text-[var(--gm-texto-medio)] hover:bg-[var(--gm-superficie-suave)]' : ''
            }`}
            style={
              activo
                ? { backgroundColor: `${e.color}1A`, borderColor: `${e.color}66`, color: 'var(--gm-texto)' }
                : {}
            }
          >
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: activo ? e.color : 'var(--gm-divisor)' }}
            />
            {e.nombre}
            <span className={activo ? 'text-[var(--gm-texto-suave)]' : 'text-[var(--gm-texto-suave)]'}>{total}</span>
          </button>
        );
      })}

      {rubros.length > 1 && (
        <>
          <span className="mx-1 hidden h-5 w-px bg-[var(--gm-borde)] sm:block" aria-hidden="true" />
          {rubros.map((r) => {
            const activo = rubrosVisibles.includes(r);
            const tono = RUBRO_TONO[r] || 'gris';
            const t = tinte[tono];
            return (
              <button
                key={r}
                type="button"
                onClick={() => toggleRubro(r)}
                aria-pressed={activo}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] font-medium transition ${
                  !activo ? 'bg-[var(--gm-superficie)] border-[var(--gm-borde)] text-[var(--gm-texto-medio)] hover:bg-[var(--gm-superficie-suave)]' : ''
                }`}
                style={
                  activo
                    ? { backgroundColor: t.bg, borderColor: t.borde || t.bg, color: t.fg }
                    : {}
                }
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: activo ? (rubroColor[r] || 'var(--gm-texto-medio)') : 'var(--gm-divisor)' }}
                />
                {r}{' '}
                <span className={activo ? 'opacity-70' : 'text-[var(--gm-texto-suave)]'}>
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
