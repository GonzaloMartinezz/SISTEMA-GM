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
        <span className="mr-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#B0A697] dark:text-[#6B7280]">
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
                <span className={activo ? 'text-[#6E6559] dark:text-[#9CA3AF]' : 'text-[#C6BCAC]'}>
                  {conteoTipo[t.id]}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="mr-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#B0A697] dark:text-[#6B7280]">
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
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#B4551A66] bg-[#FBE5C8] dark:bg-[#2A1608] px-3 py-1.5 text-[12px] font-medium text-[#8A3F11]">
            #{etiquetaActiva}
            <button
              type="button"
              onClick={() => setEtiquetaActiva(null)}
              aria-label="Quitar la etiqueta"
              className="text-[#8A3F11]/70 transition hover:text-[#8A3F11]"
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
    </div>
  );
}
