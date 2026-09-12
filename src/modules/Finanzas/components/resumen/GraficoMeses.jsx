// ============================================================================
// SISTEMA GM · M-09 TESORERÍA · VENTAS Y RESULTADO POR MES
// ----------------------------------------------------------------------------
// Las ventas en barras y el resultado como línea. Sirve para ver la trampa
// clásica: meses que vendieron mucho y dejaron poco.
// ============================================================================

import React from 'react';
import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend,
} from 'recharts';
import { SERIE } from '../../../../shared/gm-ui/tokens';
import { EJE_CLARO, GRILLA_CLARA, SIN_ANIMACION } from '../../../../shared/gm-ui/graficos';
import TooltipGm from '../../../../shared/gm-ui/TooltipGm';
import EstadoVacio from '../../../../shared/gm-ui/EstadoVacio';

export default function GraficoMeses({ meses = [], enMoneda, enMonedaCorta }) {
  if (!meses.length) {
    return <EstadoVacio titulo="Sin meses cargados" texto="Cargá el primer mes en Ingresos y Egresos." />;
  }

  const datos = meses.map((m) => ({
    etiqueta: m.etiqueta,
    Ventas: m.ventasUsd,
    Resultado: m.resultadoUsd,
  }));

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={datos} margin={{ top: 8, right: 8, bottom: 4, left: -6 }}>
          <CartesianGrid {...GRILLA_CLARA} />
          <XAxis dataKey="etiqueta" {...EJE_CLARO} />
          <YAxis {...EJE_CLARO} tickFormatter={enMonedaCorta} />
          <Tooltip cursor={{ fill: '#FCFAF6' }} content={<TooltipGm formato={enMoneda} />} />
          <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, color: '#948A7C', paddingTop: 8 }} />

          <Bar dataKey="Ventas" fill={SERIE.azul} radius={[5, 5, 0, 0]} barSize={26} {...SIN_ANIMACION} />
          <Line
            type="monotone"
            dataKey="Resultado"
            stroke={SERIE.terracota}
            strokeWidth={2.5}
            dot={{ r: 3, fill: SERIE.terracota, strokeWidth: 0 }}
            {...SIN_ANIMACION}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
