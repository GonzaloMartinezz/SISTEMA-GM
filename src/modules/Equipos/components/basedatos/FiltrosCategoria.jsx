// ============================================================================
// SISTEMA GM · M-02 EQUIPAMIENTOS · FILTRO POR RUBRO
// ----------------------------------------------------------------------------
// El mismo color por rubro que en Clientes: el ojo lo reconoce sin leer.
// ============================================================================

import React from 'react';
import { RUBRO_COLOR } from '../../../../shared/gm-ui/tokens';

export default function FiltrosCategoria({ rubros = [], valor, onChange, total = 0 }) {
  const opciones = [
    { rubro: null, nombre: 'Todos', cantidad: total },
    ...rubros.map((r) => ({ rubro: r.rubro, nombre: r.rubro, cantidad: r.cantidad })),
  ];

  return (
    <div className="flex flex-wrap items-center gap-2">
      {opciones.map((o) => {
        const activo = valor === o.rubro;
        const color = o.rubro ? RUBRO_COLOR[o.rubro] || '#948A7C' : '#6E6559';
        return (
          <button
            key={o.nombre}
            type="button"
            onClick={() => onChange(o.rubro)}
            className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-[13px] transition ${
              activo
                ? 'border-[#B4551A] bg-[#FBE5C8] dark:bg-[#2A1608] text-[#8A3F11]'
                : 'border-[var(--gm-borde)] dark:border-[#333333] bg-[var(--gm-superficie)] dark:bg-[#1E1E1E] text-[#6E6559] dark:text-[#9CA3AF] hover:border-[#D5CABA] hover:bg-[#FCFAF6] dark:hover:bg-[#2D2D2D]'
            }`}
          >
            {o.rubro && <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />}
            {o.nombre}
            <span
              className={`rounded-full px-1.5 py-0.5 text-[11px] font-semibold ${
                activo ? 'bg-[var(--gm-superficie)] dark:bg-[#1E1E1E] text-[#8A3F11]' : 'bg-[#EFE7DB] text-[#5B5347]'
              }`}
            >
              {o.cantidad}
            </span>
          </button>
        );
      })}
    </div>
  );
}
