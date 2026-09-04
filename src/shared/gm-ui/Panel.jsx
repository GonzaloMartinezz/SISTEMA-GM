// ============================================================================
// SISTEMA GM · UI · PANEL
// ----------------------------------------------------------------------------
// Contenedor base de todo el sistema. La tarjeta es neutra a propósito: en un
// tablero que se mira todos los días el color se reserva para los datos, los
// estados y las acciones. El encabezado separa con una línea, no con un relleno.
// ============================================================================

import React from 'react';

export default function Panel({
  titulo,
  bajada,
  acciones,
  children,
  className = '',
  cuerpoClassName = 'p-6',
  sinEncabezado = false,
}) {
  return (
    <section
      className={`flex flex-col overflow-hidden rounded-2xl border border-[var(--gm-borde)] bg-[var(--gm-superficie)] shadow-[var(--gm-sombra-panel)] ${className}`}
    >
      {!sinEncabezado && (titulo || acciones) && (
        <header className="flex flex-wrap items-start justify-between gap-3 border-b border-[var(--gm-divisor)] px-6 py-4">
          <div className="min-w-0">
            {titulo && <h2 className="text-[19px] leading-tight text-[var(--gm-texto)]">{titulo}</h2>}
            {bajada && (
              <p className="mt-1 text-[13px] leading-relaxed text-[var(--gm-texto-medio)]">{bajada}</p>
            )}
          </div>
          {acciones && <div className="flex shrink-0 items-center gap-2">{acciones}</div>}
        </header>
      )}
      <div className={`min-h-0 flex-1 ${cuerpoClassName}`}>{children}</div>
    </section>
  );
}
