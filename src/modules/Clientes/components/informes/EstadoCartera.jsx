// ============================================================================
// SISTEMA GM · M-01 CLIENTES · ESTADO DE LA CARTERA
// ----------------------------------------------------------------------------
// Dona de composición por estado (activo, lead, inactivo) y por clasificación
// comercial. El total va al centro y la leyenda lleva los valores escritos.
// ============================================================================

import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { SERIE_ORDEN, ESTADO_COLOR } from '../../../../shared/gm-ui/tokens';
import { SIN_ANIMACION, numero } from '../../../../shared/gm-ui/graficos';
import TooltipGm from '../../../../shared/gm-ui/TooltipGm';
import EstadoVacio from '../../../../shared/gm-ui/EstadoVacio';

const COLOR_ESTADO = { activo: ESTADO_COLOR.bien, lead: '#2E9B76', inactivo: ESTADO_COLOR.neutro };

export default function EstadoCartera({ clientes = [], campo = 'estado' }) {
  const datos = useMemo(() => {
    const mapa = new Map();
    clientes.forEach((c) => {
      const k = c[campo] || 'sin definir';
      mapa.set(k, (mapa.get(k) || 0) + 1);
    });
    return [...mapa.entries()]
      .map(([nombre, valor], i) => ({
        nombre,
        valor,
        color: COLOR_ESTADO[nombre] || SERIE_ORDEN[i % SERIE_ORDEN.length],
      }))
      .sort((a, b) => b.valor - a.valor);
  }, [clientes, campo]);

  const total = datos.reduce((s, d) => s + d.valor, 0);
  if (!total) return <EstadoVacio titulo="Sin datos" texto="Todavía no hay cuentas cargadas." />;

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
          <span className="mt-1 text-[11px] uppercase tracking-[0.1em] text-[var(--gm-texto-medio)] dark:text-[#6B7280]">cuentas</span>
        </div>
      </div>

      <ul className="w-full space-y-3">
        {datos.map((d) => (
          <li key={d.nombre} className="flex items-center gap-3">
            <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: d.color }} />
            <span className="min-w-0 flex-1 truncate text-[14px] capitalize text-[#6E6559] dark:text-[#9CA3AF]">{d.nombre}</span>
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
