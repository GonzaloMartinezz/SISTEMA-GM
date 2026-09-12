// ============================================================================
// SISTEMA GM · M-09 TESORERÍA · HORIZONTE DE TIEMPO
// ----------------------------------------------------------------------------
// Vive en el encabezado, al lado de la moneda, porque cambia lo que muestran
// las cuatro secciones a la vez. Cada opción dice qué distancia mira.
// ============================================================================

import React from 'react';
import { PERIODOS } from '../utils/horizonte';
import { useFinanzas } from '../context/FinanzasContext';

export default function SelectorPeriodo() {
  const { periodo, setPeriodo } = useFinanzas();

  return (
    <div className="flex overflow-hidden rounded-xl border border-[var(--gm-borde)] dark:border-[#333333]">
      {PERIODOS.map((p) => (
        <button
          key={p.id}
          type="button"
          title={p.bajada}
          onClick={() => setPeriodo(p.id)}
          className={`px-3 py-1.5 text-[12px] font-semibold transition ${
            periodo === p.id
              ? 'bg-[#FBE5C8] dark:bg-[#2A1608] text-[#8A3F11]'
              : 'bg-[var(--gm-superficie)] dark:bg-[#1E1E1E] text-[#948A7C] hover:bg-[#FCFAF6] dark:hover:bg-[#2D2D2D]'
          }`}
        >
          {p.nombre}
        </button>
      ))}
    </div>
  );
}
