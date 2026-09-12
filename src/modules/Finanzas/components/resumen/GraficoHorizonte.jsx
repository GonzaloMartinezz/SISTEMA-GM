// ============================================================================
// SISTEMA GM · M-09 TESORERÍA · INGRESOS Y EGRESOS DEL HORIZONTE
// ----------------------------------------------------------------------------
// El gráfico principal del módulo: ingresos y egresos como áreas, el neto como
// línea. Se adapta al horizonte elegido (semana, mes, 12 meses, 5 años).
//
// El tramo proyectado se pinta con una banda gris de fondo y la línea del neto
// pasa a punteada. Es la única forma honesta de mostrar juntos un dato y un
// pronóstico: si se ven iguales, se leen iguales.
// ============================================================================

import React, { useMemo } from 'react';
import {
  ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend,
  ReferenceArea, ReferenceLine,
} from 'recharts';
import { SERIE } from '../../../../shared/gm-ui/tokens';
import { EJE_CLARO, GRILLA_CLARA, SIN_ANIMACION } from '../../../../shared/gm-ui/graficos';
import TooltipGm from '../../../../shared/gm-ui/TooltipGm';
import EstadoVacio from '../../../../shared/gm-ui/EstadoVacio';

export default function GraficoHorizonte({ serie, enMoneda, enMonedaCorta, alto = 320 }) {
  const datos = useMemo(
    () =>
      (serie.puntos || []).map((p) => ({
        etiqueta: p.etiqueta,
        Ingresos: Math.round(p.ingresos),
        Egresos: Math.round(p.egresos),
        Neto: Math.round(p.neto),
        proyectado: p.proyectado,
      })),
    [serie]
  );

  if (!datos.length) {
    return <EstadoVacio titulo="Sin datos para este período" texto="Cargá los meses o el flujo de caja." />;
  }

  const primerProyectado = datos.find((d) => d.proyectado)?.etiqueta;
  const ultimo = datos[datos.length - 1]?.etiqueta;

  return (
    <>
      <div style={{ height: alto }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={datos} margin={{ top: 8, right: 8, bottom: 4, left: -6 }}>
            <defs>
              <linearGradient id="gradIngresos" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={SERIE.verde} stopOpacity={0.28} />
                <stop offset="100%" stopColor={SERIE.verde} stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="gradEgresos" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={SERIE.terracota} stopOpacity={0.22} />
                <stop offset="100%" stopColor={SERIE.terracota} stopOpacity={0.02} />
              </linearGradient>
            </defs>

            <CartesianGrid {...GRILLA_CLARA} />
            <XAxis dataKey="etiqueta" {...EJE_CLARO} />
            <YAxis {...EJE_CLARO} tickFormatter={enMonedaCorta} />
            <Tooltip cursor={{ stroke: '#D5CABA' }} content={<TooltipGm formato={enMoneda} />} />
            <Legend
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: 12, color: '#948A7C', paddingTop: 8 }}
            />

            {/* La zona proyectada queda marcada de fondo. */}
            {primerProyectado && (
              <ReferenceArea
                x1={primerProyectado}
                x2={ultimo}
                fill="#2A2118"
                fillOpacity={0.035}
                ifOverflow="extendDomain"
              />
            )}
            {serie.corte && <ReferenceLine x={serie.corte} stroke="#D5CABA" strokeDasharray="4 4" />}

            <Area
              type="monotone"
              dataKey="Ingresos"
              stroke={SERIE.verde}
              strokeWidth={2}
              fill="url(#gradIngresos)"
              {...SIN_ANIMACION}
            />
            <Area
              type="monotone"
              dataKey="Egresos"
              stroke={SERIE.terracota}
              strokeWidth={2}
              fill="url(#gradEgresos)"
              {...SIN_ANIMACION}
            />
            <Line
              type="monotone"
              dataKey="Neto"
              stroke={SERIE.azul}
              strokeWidth={2.5}
              dot={{ r: 3, fill: SERIE.azul, strokeWidth: 0 }}
              {...SIN_ANIMACION}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-[#948A7C]">
        <span>{serie.nota}</span>
        {serie.hayProyeccion && (
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-4 rounded-sm bg-[#2A2118]/[0.06]" />
            zona proyectada
          </span>
        )}
      </p>
    </>
  );
}
