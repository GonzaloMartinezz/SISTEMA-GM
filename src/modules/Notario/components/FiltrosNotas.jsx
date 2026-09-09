// ============================================================================
// SISTEMA GM · M-06 · FILTROS DE LAS NOTAS
// ----------------------------------------------------------------------------
// Dos filas: por clase de nota y por de qué habla. Ninguno seleccionado quiere
// decir "todos", no "ninguno" — es la convención que hace que el estado inicial
// muestre todo sin obligar a prender siete chips.
// ============================================================================

import React from 'react';
import { RotateCcw, StickyNote } from 'lucide-react';
import { TIPOS_NOTA, ENTIDADES } from '../config/notario.config';
import { TINTE } from '../../../shared/gm-ui/tokens';
import { useNotario } from '../context/NotarioContext';

export default function FiltrosNotas({ conteoTipo = {}, conteoEntidad = {} }) {
  const {
    tiposVisibles, toggleTipo, entidadesVisibles, toggleEntidad,
    etiquetaActiva, setEtiquetaActiva, hayFiltro, limpiarFiltros,
  } = useNotario();

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="mr-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--gm-texto-tenue)]">
          Clase
        </span>
        {TIPOS_NOTA.map((t) => {
          const activo = tiposVisibles.includes(t.id);
          return (
            <button
              key={t.id}
              type="button"
              title={t.bajada}
              onClick={() => toggleTipo(t.id)}
              aria-pressed={activo}
              className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] font-medium transition"
              style={
                activo
                  ? { backgroundColor: `${t.color}1A`, borderColor: `${t.color}66`, color: '#3D3225' }
                  : { backgroundColor: '#FFFFFF', borderColor: '#E8E0D5', color: '#948A7C' }
              }
            >
              <t.icono size={13} style={{ color: activo ? t.color : '#C6BCAC' }} />
              {t.nombre}
              {conteoTipo[t.id] != null && (
                <span className={activo ? 'text-[var(--gm-texto-medio)] ' : 'text-[#C6BCAC]'}>
                  {conteoTipo[t.id]}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="mr-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--gm-texto-tenue)]">
          Habla de
        </span>
        {[...ENTIDADES, { id: 'general', nombre: 'Sueltas', icono: StickyNote, tono: 'gris' }].map((e) => {
          const activo = entidadesVisibles.includes(e.id);
          const t = TINTE[e.tono] || TINTE.gris;
          return (
            <button
              key={e.id}
              type="button"
              onClick={() => toggleEntidad(e.id)}
              aria-pressed={activo}
              className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] font-medium transition"
              style={
                activo
                  ? { backgroundColor: t.bg, borderColor: `${t.fg}55`, color: t.fg }
                  : { backgroundColor: '#FFFFFF', borderColor: '#E8E0D5', color: '#948A7C' }
              }
            >
              <e.icono size={13} />
              {e.plural || e.nombre}
              {conteoEntidad[e.id] != null && (
                <span className={activo ? '' : 'text-[#C6BCAC]'}>{conteoEntidad[e.id]}</span>
              )}
            </button>
          );
        })}

        {etiquetaActiva && (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#B4551A66] bg-[var(--gm-acento-suave-bg)] px-3 py-1.5 text-[12px] font-medium text-[var(--gm-acento-fuerte)]">
            #{etiquetaActiva}
            <button
              type="button"
              onClick={() => setEtiquetaActiva(null)}
              aria-label="Quitar la etiqueta"
              className="text-[var(--gm-acento-fuerte)]/70 transition hover:text-[var(--gm-acento-fuerte)]"
            >
              ×
            </button>
          </span>
        )}

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
    </div>
  );
}
