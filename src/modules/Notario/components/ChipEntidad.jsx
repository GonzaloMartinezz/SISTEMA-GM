// ============================================================================
// SISTEMA GM · M-05 · A QUÉ ESTÁ PEGADA UNA NOTA
// ----------------------------------------------------------------------------
// Muestra la clase (Cliente, Equipo, Venta…) y el nombre de la cosa, no el
// código pelado. "EQ-102" no le dice nada a nadie; "Autoclave 12 litros" sí.
// El código queda en el title, para cuando hace falta.
//
// Si la entidad no está en el índice, se dice: puede pasar si se borró el
// equipo del que hablaba la nota. La nota sobrevive a propósito, y esta etiqueta
// deja claro que lo que describe ya no existe en el sistema.
// ============================================================================

import React from 'react';
import { getEntidad } from '../config/notario.config';
import { TINTE } from '../../../shared/gm-ui/tokens';

export default function ChipEntidad({ entidad, codigo, resuelta, className = '', onClick }) {
  if (!entidad) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full border border-[var(--gm-borde)]  bg-[var(--gm-superficie)]  px-2.5 py-1 text-[12px] text-[var(--gm-texto-tenue)]  ${className}`}
      >
        Nota suelta
      </span>
    );
  }

  const e = getEntidad(entidad);
  const t = TINTE[e.tono] || TINTE.gris;
  const perdida = !resuelta;
  const Etiqueta = onClick ? 'button' : 'span';

  return (
    <Etiqueta
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      title={`${e.nombre} ${codigo}${perdida ? ' · ya no está en el sistema' : ''}`}
      className={`inline-flex max-w-[260px] items-center gap-1.5 rounded-full border px-2.5 py-1 text-[12px] font-medium leading-none ${
        onClick ? 'transition hover:brightness-95' : ''
      } ${className}`}
      style={{
        backgroundColor: perdida ? '#F6F1E9' : t.bg,
        color: perdida ? '#948A7C' : t.fg,
        borderColor: perdida ? 'var(--gm-borde)' : `${t.fg}33`,
      }}
    >
      <e.icono size={12} className="shrink-0" />
      <span className="truncate">{resuelta?.nombre || codigo}</span>
      {perdida && <span className="shrink-0 text-[11px]">· borrado</span>}
    </Etiqueta>
  );
}
