// ============================================================================
// SISTEMA GM · M-03 TESORERÍA · FLUJO DE CAJA
// ----------------------------------------------------------------------------
// Ingresos y egresos por período, con la línea del acumulado encima. El
// acumulado es lo que importa: dice si el negocio junta plata o la quema.
// ============================================================================

import React from 'react';
import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend,
  ReferenceLine,
} from 'recharts';
import { SERIE } from '../../../../shared/gm-ui/tokens';
import { EJE_CLARO, GRILLA_CLARA, SIN_ANIMACION } from '../../../../shared/gm-ui/graficos';
import TooltipGm from '../../../../shared/gm-ui/TooltipGm';
import EstadoVacio from '../../../../shared/gm-ui/EstadoVacio';

export default function GraficoFlujo({ flujo = [], enMoneda, enMonedaCorta }) {
  if (!flujo.length) {
    return (
      <EstadoVacio
        titulo="Sin flujo cargado"
        texto="Cargá los períodos en la planilla FLUJO DE CAJA y aparecen acá."
      />
    );
  }

  const datos = flujo.map((f) => ({
    etiqueta: f.etiqueta,
    Ingresos: f.ingresosUsd,
    Egresos: -f.egresosUsd, // hacia abajo: se lee como plata que sale
    Acumulado: f.acumuladoUsd,
  }));

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={datos} margin={{ top: 8, right: 8, bottom: 4, left: -6 }} stackOffset="sign">
          <CartesianGrid {...GRILLA_CLARA} />
          <XAxis dataKey="etiqueta" {...EJE_CLARO} />
          <YAxis {...EJE_CLARO} tickFormatter={enMonedaCorta} />
          <Tooltip
            cursor={{ fill: '#FCFAF6' }}
            content={<TooltipGm formato={(v) => enMoneda(Math.abs(v))} />}
          />
          <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, color: '#948A7C', paddingTop: 8 }} />
          <ReferenceLine y={0} stroke="#D5CABA" />

          <Bar dataKey="Ingresos" stackId="mov" fill={SERIE.verde} radius={[5, 5, 0, 0]} barSize={26} {...SIN_ANIMACION} />
          <Bar dataKey="Egresos" stackId="mov" fill={SERIE.terracota} radius={[0, 0, 5, 5]} barSize={26} {...SIN_ANIMACION} />
          <Line
            type="monotone"
            dataKey="Acumulado"
            stroke={SERIE.azul}
            strokeWidth={2.5}
            dot={{ r: 3, fill: SERIE.azul, strokeWidth: 0 }}
            {...SIN_ANIMACION}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
