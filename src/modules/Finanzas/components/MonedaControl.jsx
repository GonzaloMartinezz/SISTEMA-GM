// ============================================================================
// SISTEMA GM · M-09 TESORERÍA · MONEDA Y TIPO DE CAMBIO
// ----------------------------------------------------------------------------
// Vive en el encabezado del módulo porque afecta a las cuatro secciones a la
// vez. Cambiar la moneda no toca la base: todo se guarda siempre en dólares y
// esto sólo decide cómo se muestra.
// ============================================================================

import React from 'react';
import { useFinanzas } from '../context/FinanzasContext';

export default function MonedaControl() {
  const { moneda, setMoneda, tipoCambio } = useFinanzas();

  return (
    <div className="flex items-center gap-2">
      <div className="flex overflow-hidden rounded-xl border border-[var(--gm-borde)] dark:border-[#333333]">
        {['USD', 'ARS'].map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMoneda(m)}
            className={`px-3 py-1.5 text-[12px] font-semibold transition ${
              moneda === m
                ? 'bg-[#FBE5C8] dark:bg-[#2A1608] text-[#8A3F11]'
                : 'bg-[var(--gm-superficie)] dark:bg-[#1E1E1E] text-[#948A7C] hover:bg-[#FCFAF6] dark:hover:bg-[#2D2D2D]'
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      {moneda === 'ARS' && (
        <span className="hidden text-[12px] text-[var(--gm-texto-medio)] dark:text-[#6B7280] sm:inline">
          a ${tipoCambio.toLocaleString('es-AR')}
        </span>
      )}
    </div>
  );
}
