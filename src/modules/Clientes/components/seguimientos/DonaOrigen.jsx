// ============================================================================
// SISTEMA GM · M-01 CLIENTES · ORIGEN DE LAS OPORTUNIDADES
// ----------------------------------------------------------------------------
// Dona de composición: de qué rubro viene cada oportunidad del pipeline. El
// total va en el centro y la leyenda lleva cantidad y porcentaje escritos, así
// el gráfico se entiende también sin distinguir los colores.
// ============================================================================

import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { RUBRO_COLOR, SERIE_ORDEN } from '../../../../shared/gm-ui/tokens';
import { SIN_ANIMACION, numero } from '../../../../shared/gm-ui/graficos';
import TooltipGm from '../../../../shared/gm-ui/TooltipGm';
import EstadoVacio from '../../../../shared/gm-ui/EstadoVacio';

export default function DonaOrigen({ leads = [], dimension = 'especialidad', etiqueta = 'rubro' }) {
  const datos = useMemo(() => {
    const mapa = new Map();
    leads.forEach((l) => {
      const k = l[dimension] || 'Sin clasificar';
      mapa.set(k, (mapa.get(k) || 0) + 1);
    });
    return [...mapa.entries()]
      .map(([nombre, valor], i) => ({
        nombre,
        valor,
        color: RUBRO_COLOR[nombre] || SERIE_ORDEN[i % SERIE_ORDEN.length],
      }))
      .sort((a, b) => b.valor - a.valor);
  }, [leads, dimension]);

  const total = datos.reduce((s, d) => s + d.valor, 0);

  if (!total) {
    return <EstadoVacio titulo="Sin oportunidades" texto={`Todavía no hay datos por ${etiqueta}.`} />;
  }

  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row">
      <div className="relative h-[188px] w-[188px] shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={datos}
              dataKey="valor"
              nameKey="nombre"
              innerRadius={58}
              outerRadius={90}
              paddingAngle={2}
              stroke="#FFFFFF"
              strokeWidth={2}
              {...SIN_ANIMACION}
            >
              {datos.map((d) => (
                <Cell key={d.nombre} fill={d.color} />
              ))}
            </Pie>
            <Tooltip content={<TooltipGm formato={numero} />} />
          </PieChart>
        </ResponsiveContainer>

        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[28px] font-semibold leading-none text-[#2A2118] dark:text-[#F9FAFB]">{total}</span>
          <span className="mt-1 text-[11px] uppercase tracking-[0.1em] text-[var(--gm-texto-medio)] dark:text-[#6B7280]">en curso</span>
        </div>
      </div>

      <ul className="w-full space-y-3">
        {datos.map((d) => (
          <li key={d.nombre} className="flex items-center gap-3">
            <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: d.color }} />
            <span className="min-w-0 flex-1 truncate text-[14px] text-[#6E6559] dark:text-[#9CA3AF]">{d.nombre}</span>
            <span className="text-[14px] font-semibold text-[#2A2118] dark:text-[#F9FAFB]">{d.valor}</span>
            <span className="w-11 text-right text-[13px] text-[var(--gm-texto-medio)] dark:text-[#6B7280]">
              {Math.round((d.valor / total) * 100)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
