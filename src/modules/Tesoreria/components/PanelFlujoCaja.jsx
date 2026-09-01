// ============================================================================
// SISTEMA GM · TESORERÍA · FLUJO DE CAJA
// ----------------------------------------------------------------------------
// Ingresos proyectados contra egresos próximos, para anticipar la falta de
// liquidez. Una sola escala (USD) y una sola unidad en todo el gráfico.
// ============================================================================

import React from 'react';
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import PanelTerminal from '../../../shared/ui/PanelTerminal';
import ChartTooltip from '../../../shared/ui/ChartTooltip';
import { SERIES, EJE, ejeProps, usdCorto, usd } from '../../../shared/ui/viz';
import { useTesoreria } from '../context/TesoreriaContext';

export default function PanelFlujoCaja() {
  const { datos } = useTesoreria();
  if (!datos) return null;

  const { flujo } = datos;
  const enRojo = flujo.filter((f) => f.netoUsd < 0);

  return (
    <PanelTerminal
      titulo="Flujo de caja · próximas 6 semanas"
      className="min-h-[280px] flex-1"
      acciones={
        <span
          className={`font-mono text-[9px] uppercase tracking-[0.15em] ${enRojo.length ? 'text-orange-400' : 'text-emerald-400'}`}
        >
          {enRojo.length
            ? `${enRojo.length} semana${enRojo.length === 1 ? '' : 's'} con saldo negativo`
            : 'Sin semanas en rojo'}
        </span>
      }
      bodyClassName="p-2"
    >
      <ResponsiveContainer width="100%" height="100%" minHeight={230}>
        <ComposedChart data={flujo} margin={{ top: 12, right: 12, bottom: 4, left: 4 }}>
          <CartesianGrid stroke={EJE.grid} vertical={false} />
          <XAxis dataKey="etiqueta" {...ejeProps} />
          <YAxis tickFormatter={usdCorto} width={44} {...ejeProps} />
          <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
          <Legend
            wrapperStyle={{
              fontSize: 10,
              fontFamily: 'ui-monospace, monospace',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              color: '#9ca3af',
              paddingTop: 6,
            }}
          />
          <ReferenceLine y={0} stroke="rgba(255,255,255,0.18)" />

          <Bar

            isAnimationActive={false}
            dataKey="ingresosUsd"
            name="Ingresos"
            fill={SERIES.ingresos}
            radius={[4, 4, 0, 0]}
            maxBarSize={26}
          />
          <Bar
            isAnimationActive={false}
            dataKey="egresosUsd"
            name="Egresos"
            fill={SERIES.egresos}
            radius={[4, 4, 0, 0]}
            maxBarSize={26}
          />
          <Line
            isAnimationActive={false}
            type="monotone"
            dataKey="acumuladoUsd"
            name="Saldo acumulado"
            stroke={SERIES.neto}
            strokeWidth={2}
            dot={{ r: 4, fill: EJE.superficie, stroke: SERIES.neto, strokeWidth: 2 }}
            activeDot={{ r: 6 }}
          />
        </ComposedChart>
      </ResponsiveContainer>

      <p className="px-2 pb-1 font-mono text-[9px] uppercase tracking-[0.15em] text-gray-600">
        Saldo acumulado al cierre del período: {usd(flujo[flujo.length - 1]?.acumuladoUsd)}
      </p>
    </PanelTerminal>
  );
}
