// ============================================================================
// SISTEMA GM · TESORERÍA · ANÁLISIS DE INGRESOS
// ----------------------------------------------------------------------------
// Liquidación de sueldo fijo y comisiones por ventas cerradas, mes a mes.
// ============================================================================

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import PanelTerminal from '../../../shared/ui/PanelTerminal';
import ChartTooltip from '../../../shared/ui/ChartTooltip';
import { SERIES, EJE, ejeProps, usdCorto, usd } from '../../../shared/ui/viz';
import { useTesoreria } from '../context/TesoreriaContext';

export default function PanelIngresos() {
  const { datos } = useTesoreria();
  if (!datos) return null;

  const { meses, ultimo, params } = datos;

  return (
    <PanelTerminal
      titulo="Ingresos · sueldo fijo y comisiones"
      className="min-h-[260px] flex-1"
      acciones={
        <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-gray-500">
          Comisión {params.comisionPct}% · fijo {usd(params.sueldoFijoUsd)}
        </span>
      }
      bodyClassName="p-2"
    >
      <ResponsiveContainer width="100%" height="100%" minHeight={200}>
        <BarChart data={meses} margin={{ top: 12, right: 12, bottom: 4, left: 4 }}>
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
          <Bar
            isAnimationActive={false}
            dataKey="sueldoFijoUsd"
            name="Sueldo fijo"
            stackId="ingreso"
            fill={SERIES.ingresos}
            maxBarSize={34}
          />
          <Bar
            isAnimationActive={false}
            dataKey="comisionUsd"
            name="Comisiones"
            stackId="ingreso"
            fill={SERIES.neto}
            radius={[4, 4, 0, 0]}
            maxBarSize={34}
          />
        </BarChart>
      </ResponsiveContainer>

      <div className="grid grid-cols-3 divide-x divide-gray-800 border-t border-gray-800">
        <div className="p-2 text-center">
          <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-gray-600">
            Ingreso del mes
          </p>
          <p className="font-mono text-sm font-bold text-gray-100">{usd(ultimo.ingresosUsd)}</p>
        </div>
        <div className="p-2 text-center">
          <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-gray-600">
            Comisión
          </p>
          <p className="font-mono text-sm font-bold" style={{ color: SERIES.neto }}>
            {usd(ultimo.comisionUsd)}
          </p>
        </div>
        <div className="p-2 text-center">
          <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-gray-600">
            Ventas cerradas
          </p>
          <p className="font-mono text-sm font-bold text-gray-100">{usd(ultimo.ventasUsd)}</p>
        </div>
      </div>
    </PanelTerminal>
  );
}
