// ============================================================================
// SISTEMA GM · UI · ESTADO VACÍO
// ----------------------------------------------------------------------------
// Nunca se deja un panel en blanco: siempre se dice qué falta y qué hacer.
// ============================================================================

import React from 'react';
import { Inbox } from 'lucide-react';

export default function EstadoVacio({ titulo = 'Sin datos', texto, icono: Icono = Inbox, accion }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-14 text-center">
      <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[var(--gm-superficie-fuerte)] text-[var(--gm-texto-tenue)]">
        <Icono size={22} strokeWidth={1.8} />
      </span>
      <div>
        <p className="text-[15px] font-semibold text-[var(--gm-texto-medio)]">{titulo}</p>
        {texto && (
          <p className="mt-1 max-w-sm text-[13px] leading-relaxed text-[var(--gm-texto-medio)]">
            {texto}
          </p>
        )}
      </div>
      {accion}
    </div>
  );
}
