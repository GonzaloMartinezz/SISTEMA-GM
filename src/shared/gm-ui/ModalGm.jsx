// ============================================================================
// SISTEMA GM · UI · MODAL
// ----------------------------------------------------------------------------
// Caparazón de diálogo, ya teñido para el tema activo. Cierra con Escape y
// con clic en el telón. El foco inicial se toma UNA sola vez al abrir: si se
// re-enfoca en cada render, el cursor se escapa del campo mientras el usuario
// escribe (fue exactamente el bug del login).
// ============================================================================

import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { useTema } from './TemaProvider';

export default function ModalGm({
  abierto,
  titulo,
  bajada,
  onCerrar,
  children,
  pie,
  ancho = 'max-w-2xl',
}) {
  const { t } = useTema();
  const cerrarRef = useRef(onCerrar);
  cerrarRef.current = onCerrar;

  useEffect(() => {
    if (!abierto) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') cerrarRef.current?.();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [abierto]);

  if (!abierto) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 backdrop-blur-[2px]"
        style={{ backgroundColor: t.overlay }}
        onClick={() => cerrarRef.current?.()}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={titulo}
        className={`relative flex max-h-[88vh] w-full ${ancho} flex-col overflow-hidden rounded-2xl border border-[var(--gm-borde)] bg-[var(--gm-superficie)] shadow-[var(--gm-sombra-modal)]`}
      >
        <header className="flex items-start justify-between gap-4 border-b border-[var(--gm-divisor)] px-6 py-5">
          <div className="min-w-0">
            <h2 className="text-[17px] font-semibold text-[var(--gm-texto)]">{titulo}</h2>
            {bajada && <p className="mt-1 text-[13px] text-[var(--gm-texto-medio)]">{bajada}</p>}
          </div>
          <button
            type="button"
            onClick={() => cerrarRef.current?.()}
            aria-label="Cerrar"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-[var(--gm-texto-suave)] transition hover:bg-[var(--gm-superficie-fuerte)] hover:text-[var(--gm-texto)]"
          >
            <X size={17} />
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-auto px-6 py-5">{children}</div>

        {pie && (
          <footer className="flex items-center justify-end gap-2 border-t border-[var(--gm-divisor)] bg-[var(--gm-superficie-suave)] px-6 py-4">
            {pie}
          </footer>
        )}
      </div>
    </div>
  );
}
