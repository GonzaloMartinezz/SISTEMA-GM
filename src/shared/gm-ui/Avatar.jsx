// ============================================================================
// SISTEMA GM · UI · AVATAR DE INICIALES
// ----------------------------------------------------------------------------
// Sin fotos en el sistema: iniciales sobre un tinte estable derivado del texto,
// para que un mismo cliente tenga siempre el mismo color en toda la app.
// ============================================================================

import React from 'react';
import { useTema } from './TemaProvider';

const TONOS_PALETA = ['azul', 'aqua', 'naranja', 'amarillo', 'rosa'];

const iniciales = (texto = '') =>
  texto
    .replace(/[^\p{L}\s]/gu, ' ')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() || '')
    .join('') || '?';

const indice = (texto = '') => {
  let h = 0;
  for (let i = 0; i < texto.length; i += 1) h = (h * 31 + texto.charCodeAt(i)) % 997;
  return h % TONOS_PALETA.length;
};

const TAMANOS = { sm: 'h-8 w-8 text-[11px]', md: 'h-10 w-10 text-[13px]', lg: 'h-14 w-14 text-[17px]' };

export default function Avatar({ nombre = '', tamano = 'md', className = '' }) {
  const { tinte } = useTema();
  const t = tinte[TONOS_PALETA[indice(nombre)]];
  return (
    <span
      className={`grid shrink-0 place-items-center rounded-full font-semibold ${TAMANOS[tamano]} ${className}`}
      style={{ backgroundColor: t.bg, color: t.fg }}
      aria-hidden="true"
    >
      {iniciales(nombre)}
    </span>
  );
}
