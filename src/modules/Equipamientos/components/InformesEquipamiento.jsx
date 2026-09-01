// ============================================================================
// SISTEMA GM · EQUIPAMIENTOS · INFORMES
// ----------------------------------------------------------------------------
// Rotación de productos y equipos más vendidos de los últimos 12 meses.
// ============================================================================

import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import PanelTerminal, { SinDatos } from '../../../shared/ui/PanelTerminal';
import ChartTooltip from '../../../shared/ui/ChartTooltip';
import { SERIES, EJE, ejeProps, usdCorto } from '../../../shared/ui/viz';
import { useInventario } from '../context/InventarioContext';

export default function InformesEquipamiento() {
  const { equipos } = useInventario();

  const masVendidos = useMemo(
    () =>
      [...equipos]
        .sort((a, b) => b.facturacion12m - a.facturacion12m)
        .slice(0, 6)
        .map((e) => ({
          etiqueta: e.nombre.length > 22 ? `${e.nombre.slice(0, 20)}…` : e.nombre,
          facturacion: e.facturacion12m,
          unidades: e.vendidos12m,
        })),
    [equipos]
  );

  return (
    <PanelTerminal
      titulo="Facturación por equipo · 12 meses"
      className="min-h-[280px]"
      acciones={
        <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-gray-600">
          Top {masVendidos.length} de {equipos.length}
        </span>
      }
      bodyClassName="p-2"
    >
      {masVendidos.length ? (
        <ResponsiveContainer width="100%" height="100%" minHeight={250}>
          <BarChart
            data={masVendidos}
            layout="vertical"
            margin={{ top: 8, right: 16, bottom: 4, left: 8 }}
          >
            <CartesianGrid stroke={EJE.grid} horizontal={false} />
            <XAxis type="number" tickFormatter={usdCorto} {...ejeProps} />
            <YAxis
              type="category"
              dataKey="etiqueta"
              width={140}
              {...ejeProps}
              tick={{ ...ejeProps.tick, fontSize: 9 }}
            />
            <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
            <Bar
              isAnimationActive={false}
              dataKey="facturacion"
              name="Facturación"
              fill={SERIES.ingresos}
              radius={[0, 4, 4, 0]}
              maxBarSize={18}
            />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <SinDatos mensaje="Sin ventas registradas" />
      )}
    </PanelTerminal>
  );
}
