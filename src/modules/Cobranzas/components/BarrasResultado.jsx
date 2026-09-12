// ============================================================================
// SISTEMA GM · M-07 · INGRESOS Y EGRESOS POR MES
// ----------------------------------------------------------------------------
// Dos barras por mes —lo que entró y lo que salió— y encima la línea de la
// caja acumulada. Las barras contestan "cómo me fue este mes"; la línea
// contesta la pregunta que de verdad importa, que es si la cosa mejora o
// empeora con el tiempo.
//
// Los dos colores son de la paleta categórica validada, no verde/rojo: el
// signo ya lo dice el eje y la línea de cero. Reservar el rojo para las
// alarmas hace que las alarmas se noten.
// ============================================================================

import React from 'react';
import {
  Bar, CartesianGrid, ComposedChart, Line, ReferenceLine,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import { EJE_CLARO, GRILLA_CLARA, SIN_ANIMACION } from '../../../shared/gm-ui/graficos';
import { SERIE, GM } from '../../../shared/gm-ui/tokens';
import { usd, usdCorto } from '../config/cobranzas.config';

export default function BarrasResultado({ meses = [], alto = 300 }) {
  const datos = meses.map((m) => ({
    mes: m.mesCorto,
    etiqueta: m.etiqueta,
    entro: m.cobradoUsd,
    salio: -m.egresosUsd,
    acumulado: m.acumulado,
  }));

  return (
    <div style={{ height: alto }}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={datos} margin={{ top: 8, right: 8, bottom: 4, left: -8 }}>
          <CartesianGrid {...GRILLA_CLARA} />
          <XAxis dataKey="mes" {...EJE_CLARO} />
          <YAxis {...EJE_CLARO} tickFormatter={usdCorto} width={52} />
          <ReferenceLine y={0} stroke={GM.bordeFuerte} />
          <Tooltip content={<Globo />} cursor={{ fill: 'rgba(180,85,26,0.05)' }} />
          <Bar dataKey="entro" fill={SERIE.verde} radius={[4, 4, 0, 0]} maxBarSize={22} {...SIN_ANIMACION} />
          <Bar dataKey="salio" fill={SERIE.terracota} radius={[0, 0, 4, 4]} maxBarSize={22} {...SIN_ANIMACION} />
          <Line
            type="monotone"
            dataKey="acumulado"
            stroke={SERIE.azul}
            strokeWidth={2}
            dot={{ r: 2.5, fill: SERIE.azul, strokeWidth: 0 }}
            {...SIN_ANIMACION}
          />
        </ComposedChart>
      </ResponsiveContainer>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1 text-[11px] text-[#948A7C]">
        <Ref color={SERIE.verde}>entró</Ref>
        <Ref color={SERIE.terracota}>salió</Ref>
        <Ref color={SERIE.azul} linea>caja acumulada</Ref>
      </div>
    </div>
  );
}

function Ref({ color, linea, children }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className={linea ? 'h-0.5 w-4 rounded-full' : 'h-2.5 w-2.5 rounded-sm'}
        style={{ backgroundColor: color }}
      />
      {children}
    </span>
  );
}

function Globo({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="rounded-xl border border-[var(--gm-borde)] bg-white px-3 py-2 shadow-[0_8px_24px_-12px_rgba(26,26,24,0.3)]">
      <p className="text-[12px] font-semibold text-[#2A2118]">{d.etiqueta}</p>
      <p className="mt-1 text-[12px] text-[#2E9B76]">Entró {usd(d.entro)}</p>
      <p className="text-[12px] text-[#B4551A]">Salió {usd(Math.abs(d.salio))}</p>
      <p className="mt-1 border-t border-[var(--gm-borde-fuerte)] pt-1 text-[12px] text-[#6E6559]">
        Del mes: <strong>{usd(d.entro + d.salio)}</strong>
      </p>
      <p className="text-[12px] text-[#2F6DA0]">Acumulado: {usd(d.acumulado)}</p>
    </div>
  );
}
