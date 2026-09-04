// ============================================================================
// SISTEMA GM · M-01 CLIENTES · FILTRO POR RUBRO
// ----------------------------------------------------------------------------
// Pastillas con el conteo real de cada rubro. El color de cada rubro es el
// mismo en toda la app (tokens.RUBRO_COLOR), así el ojo lo reconoce sin leer.
// El estado "seleccionado" de la pastilla usa siempre el acento del sistema,
// sea cual sea el rubro — el color de rubro identifica el dato, el acento
// identifica la selección: no se mezclan.
// ============================================================================

import React from 'react';
import { useTema } from '../../../../shared/gm-ui/TemaProvider';

export default function FiltrosRubro({ rubros = [], valor, onChange, total = 0 }) {
  const { rubroColor, t } = useTema();
  const opciones = [{ rubro: null, nombre: 'Todos', cantidad: total }, ...rubros.map((r) => ({
    rubro: r.rubro,
    nombre: r.rubro,
    cantidad: r.cantidad,
  }))];

  return (
    <div className="flex flex-wrap items-center gap-2">
      {opciones.map((o) => {
        const activo = valor === o.rubro;
        const color = o.rubro ? rubroColor[o.rubro] || t.textoSuave : t.textoMedio;
        return (
          <button
            key={o.nombre}
            type="button"
            onClick={() => onChange(o.rubro)}
            className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-[13px] font-medium transition ${
              activo
                ? 'border-[var(--gm-acento)] bg-[var(--gm-acento-suave-bg)] text-[var(--gm-acento-fuerte)]'
                : 'border-[var(--gm-borde)] bg-[var(--gm-superficie)] text-[var(--gm-texto-medio)] hover:border-[var(--gm-borde-fuerte)] hover:bg-[var(--gm-superficie-suave)]'
            }`}
          >
            {o.rubro && (
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
            )}
            {o.nombre}
            <span
              className={`rounded-full px-1.5 py-0.5 text-[11px] font-semibold ${
                activo
                  ? 'bg-[var(--gm-superficie)] text-[var(--gm-acento-fuerte)]'
                  : 'bg-[var(--gm-superficie-fuerte)] text-[var(--gm-texto-medio)]'
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
