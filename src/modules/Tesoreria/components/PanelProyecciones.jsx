// ============================================================================
// SISTEMA GM · TESORERÍA · PROYECCIONES DE CRECIMIENTO
// ----------------------------------------------------------------------------
// Resultado acumulado esperado a 1, 3, 6, 12 meses y 5 años, sobre la tasa de
// crecimiento real de los últimos meses.
// ============================================================================

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from 'recharts';
import PanelTerminal from '../../../shared/ui/PanelTerminal';
import ChartTooltip from '../../../shared/ui/ChartTooltip';
import { SERIES, EJE, ejeProps, usdCorto, pct } from '../../../shared/ui/viz';
import { useTesoreria } from '../context/TesoreriaContext';

export default function PanelProyecciones() {
  const { datos } = useTesoreria();
  if (!datos) return null;

  const { proyecciones, crecimientoMensual } = datos;

  return (
    <PanelTerminal
      titulo="Proyección de resultado acumulado"
      className="min-h-[260px] flex-1"
      acciones={
        <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-gray-500">
          Crecimiento medido: {pct(crecimientoMensual * 100)} mensual
        </span>
      }
      bodyClassName="p-2"
    >
      <ResponsiveContainer width="100%" height="100%" minHeight={210}>
        <BarChart data={proyecciones} margin={{ top: 20, right: 12, bottom: 4, left: 4 }}>
          <CartesianGrid stroke={EJE.grid} vertical={false} />
          <XAxis dataKey="etiqueta" {...ejeProps} />
          <YAxis tickFormatter={usdCorto} width={44} {...ejeProps} />
          <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
          <Bar
            isAnimationActive={false}
            dataKey="resultadoAcumuladoUsd"
            name="Resultado acumulado"
            fill={SERIES.neto}
            radius={[4, 4, 0, 0]}
            maxBarSize={54}
          >
            <LabelList
              dataKey="resultadoAcumuladoUsd"
              position="top"
              formatter={usdCorto}
              style={{
                fill: '#9ca3af',
                fontSize: 10,
                fontFamily: 'ui-monospace, monospace',
              }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <p className="px-2 pb-1 font-mono text-[9px] uppercase tracking-[0.15em] text-gray-600">
        Serie única en USD, sin impuestos · más de 12 meses se proyecta con tasa
        amortiguada al {pct(Math.min(crecimientoMensual, 0.015) * 100)} mensual
      </p>
    </PanelTerminal>
  );
}
