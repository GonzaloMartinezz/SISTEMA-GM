// ============================================================================
// SISTEMA GM · UI · CHIP
// ----------------------------------------------------------------------------
// Etiqueta chica de estado, rubro o canal. Relleno de la paleta con texto
// legible encima. Lleva un borde del mismo tono en baja opacidad porque sobre
// una superficie plana los tintes suaves se pierden y el chip dejaría de
// leerse como pieza propia.
// ============================================================================

import React from 'react';
import { useTema } from './TemaProvider';

export default function Chip({ tono = 'gris', children, punto = false, className = '' }) {
  const { tinte } = useTema();
  const t = tinte[tono] || tinte.gris;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[12px] font-medium leading-none ${className}`}
      style={{ backgroundColor: t.bg, color: t.fg, borderColor: `${t.fg}33` }}
    >
      {punto && <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: t.fg }} />}
      {children}
    </span>
  );
}
