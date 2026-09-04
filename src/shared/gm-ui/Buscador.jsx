// ============================================================================
// SISTEMA GM · UI · BUSCADOR
// ----------------------------------------------------------------------------
// Campo de texto con lupa y botón de limpiar. Componente controlado: el estado
// vive en la vista que lo usa.
// ============================================================================

import React from 'react';
import { Search, X } from 'lucide-react';

export default function Buscador({
  valor = '',
  onChange,
  placeholder = 'Buscar…',
  className = '',
}) {
  return (
    <div className={`relative ${className}`}>
      <Search
        size={16}
        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--gm-texto-medio)]"
      />
      <input
        type="text"
        value={valor}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className="h-11 w-full rounded-xl border border-[var(--gm-borde)] bg-[var(--gm-superficie)] pl-10 pr-9 text-[14px] text-[var(--gm-texto)] outline-none transition placeholder:text-[var(--gm-texto-medio)] focus:border-[var(--gm-acento)] focus:ring-4 focus:ring-[var(--gm-acento)]/15"
      />
      {valor && (
        <button
          type="button"
          onClick={() => onChange?.('')}
          aria-label="Limpiar búsqueda"
          className="absolute right-2.5 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center rounded-lg text-[var(--gm-texto-tenue)] transition hover:bg-[var(--gm-superficie-fuerte)] hover:text-[var(--gm-texto-medio)]"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
