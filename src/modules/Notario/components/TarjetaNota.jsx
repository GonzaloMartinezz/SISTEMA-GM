// ============================================================================
// SISTEMA GM · M-06 · LA NOTA
// ----------------------------------------------------------------------------
// Tarjeta blanca con la barrita del color de su tipo. El texto se muestra
// entero: una nota recortada obliga a abrirla para saber si es la que buscabas,
// y la mayoría son de tres renglones. Las que sí son largas se recortan a seis
// líneas y avisan.
// ============================================================================

import React, { useState } from 'react';
import { Pencil, Pin, Trash2 } from 'lucide-react';
import { getTipoNota } from '../config/notario.config';
import ChipEntidad from './ChipEntidad';

const cuando = (iso) => {
  const d = new Date(iso);
  const dias = Math.floor((Date.now() - d.getTime()) / 86400000);
  if (dias === 0) return 'hoy';
  if (dias === 1) return 'ayer';
  if (dias < 7) return `hace ${dias} días`;
  return d.toLocaleDateString('es-AR', { day: 'numeric', month: 'short', year: '2-digit' });
};

export default function TarjetaNota({
  nota, resuelta, onEditar, onFijar, onEliminar, onEtiqueta, onEntidad,
}) {
  const [expandida, setExpandida] = useState(false);
  const tipo = getTipoNota(nota.tipo);
  const largo = (nota.texto || '').length > 320;

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-[#E8E0D5] bg-white p-5 pl-6 shadow-[0_1px_2px_rgba(26,26,24,0.04)] transition hover:border-[#D5CABA] hover:shadow-[0_8px_24px_-14px_rgba(26,26,24,0.2)]">
      <span
        className="absolute inset-y-0 left-0 w-[3px]"
        style={{ backgroundColor: tipo.color }}
        aria-hidden="true"
      />

      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[12px] font-medium leading-none"
              style={{
                backgroundColor: `${tipo.color}1A`,
                borderColor: `${tipo.color}55`,
                color: '#3D3225',
              }}
            >
              <tipo.icono size={12} style={{ color: tipo.color }} />
              {tipo.nombre}
            </span>
            <ChipEntidad
              entidad={nota.entidad}
              codigo={nota.entidadCodigo}
              resuelta={resuelta}
              onClick={nota.entidad ? () => onEntidad?.(nota) : undefined}
            />
            {nota.fijada && (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#8A3F11]">
                <Pin size={11} />
                fijada
              </span>
            )}
          </div>

          {nota.titulo && (
            <h3 className="mt-2.5 text-[15px] font-semibold leading-snug text-[#2A2118]">
              {nota.titulo}
            </h3>
          )}
        </div>

        {/* En celular no hay hover: los botones quedan siempre visibles. Recién
            a partir de sm se ocultan y aparecen con hover/foco, como en escritorio. */}
        <div className="flex shrink-0 items-center gap-0.5 opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100 sm:focus-within:opacity-100">
          <BotonIcono
            etiqueta={nota.fijada ? 'Soltar' : 'Fijar arriba'}
            icono={Pin}
            activo={nota.fijada}
            onClick={() => onFijar?.(nota.id, !nota.fijada)}
          />
          <BotonIcono etiqueta="Editar" icono={Pencil} onClick={() => onEditar?.(nota)} />
          <BotonIcono etiqueta="Eliminar" icono={Trash2} peligro onClick={() => onEliminar?.(nota)} />
        </div>
      </header>

      <p
        className={`mt-2 whitespace-pre-line text-[14px] leading-relaxed text-[#6E6559] ${
          largo && !expandida ? 'line-clamp-6' : ''
        }`}
      >
        {nota.texto}
      </p>

      {largo && (
        <button
          type="button"
          onClick={() => setExpandida((v) => !v)}
          className="mt-1 text-[12px] font-medium text-[#B4551A] transition hover:text-[#8A3F11]"
        >
          {expandida ? 'Ver menos' : 'Ver la nota completa'}
        </button>
      )}

      <footer className="mt-3.5 flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-[#F4EFE7] pt-3">
        {(nota.etiquetas || []).map((e) => (
          <button
            key={e}
            type="button"
            onClick={() => onEtiqueta?.(e)}
            className="rounded-md bg-[#F3EDE4] px-2 py-0.5 text-[11px] text-[#6E6559] transition hover:bg-[#FBE5C8] hover:text-[#8A3F11]"
          >
            #{e}
          </button>
        ))}
        <span className="ml-auto text-[11px] text-[#B0A697]">
          {nota.id} · {cuando(nota.creada)}
        </span>
      </footer>
    </article>
  );
}

function BotonIcono({ etiqueta, icono: Icono, onClick, peligro, activo }) {
  return (
    <button
      type="button"
      title={etiqueta}
      aria-label={etiqueta}
      onClick={onClick}
      className={`grid h-8 w-8 place-items-center rounded-lg transition ${
        peligro
          ? 'text-[#B0A697] hover:bg-[#FBEAE0] hover:text-[#A63A0C]'
          : activo
            ? 'text-[#B4551A] hover:bg-[#FBE5C8]'
            : 'text-[#948A7C] hover:bg-[#F3EDE4] hover:text-[#2A2118]'
      }`}
    >
      <Icono size={15} strokeWidth={2} />
    </button>
  );
}
