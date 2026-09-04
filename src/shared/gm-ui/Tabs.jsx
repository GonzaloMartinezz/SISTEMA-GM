// ============================================================================
// SISTEMA GM · UI · PESTAÑAS HORIZONTALES
// ----------------------------------------------------------------------------
// Navegación en línea con subrayado activo. Se usa en la ficha del cliente y
// en cualquier vista que necesite cortar contenido sin cambiar de ruta.
// ============================================================================

import React from 'react';

export default function Tabs({ opciones = [], valor, onChange, className = '' }) {
  return (
    <div
      className={`flex items-center gap-1 overflow-x-auto border-b border-[var(--gm-divisor)] ${className}`}
    >
      {opciones.map((o) => {
        const activo = o.id === valor;
        return (
          <button
            key={o.id}
            type="button"
            onClick={() => onChange?.(o.id)}
            className={`relative shrink-0 px-4 py-3 text-[14px] font-medium transition-colors ${
              activo
                ? 'text-[var(--gm-texto)]'
                : 'text-[var(--gm-texto-medio)] hover:text-[var(--gm-texto-medio)]'
            }`}
          >
            <span className="inline-flex items-center gap-2">
              {o.icono && <o.icono size={15} strokeWidth={2} />}
              {o.nombre}
              {o.contador != null && (
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[11px] font-semibold ${
                    activo
                      ? 'bg-[var(--gm-acento-suave-bg)] text-[var(--gm-acento-fuerte)]'
                      : 'bg-[var(--gm-superficie-fuerte)] text-[var(--gm-texto-medio)]'
                  }`}
                >
                  {o.contador}
                </span>
              )}
            </span>
            {activo && (
              <span className="absolute inset-x-3 -bottom-px h-[2px] rounded-full bg-[var(--gm-acento)]" />
            )}
          </button>
        );
      })}
    </div>
  );
}
