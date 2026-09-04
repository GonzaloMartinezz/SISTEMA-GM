// ============================================================================
// SISTEMA GM · M-01 CLIENTES · CARTERA POR RUBRO
// ----------------------------------------------------------------------------
// Barras horizontales: el nombre del rubro se lee derecho y el valor va escrito
// al final de cada barra, así el gráfico no depende de leer una escala.
// ============================================================================

import React, { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Cell, LabelList,
} from 'recharts';
import { RUBRO_COLOR, SERIE_ORDEN } from '../../../../shared/gm-ui/tokens';
import { EJE_CLARO, GRILLA_CLARA, SIN_ANIMACION, numero } from '../../../../shared/gm-ui/graficos';
import TooltipGm from '../../../../shared/gm-ui/TooltipGm';
import EstadoVacio from '../../../../shared/gm-ui/EstadoVacio';

export default function GraficoCarteraRubro({ clientes = [] }) {
  const datos = useMemo(() => {
    const mapa = new Map();
    clientes.forEach((c) => {
      const k = c.rubro || 'Sin rubro';
      mapa.set(k, (mapa.get(k) || 0) + 1);
    });
    return [...mapa.entries()]
      .map(([rubro, cantidad], i) => ({
        rubro,
        cantidad,
        color: RUBRO_COLOR[rubro] || SERIE_ORDEN[i % SERIE_ORDEN.length],
      }))
      .sort((a, b) => b.cantidad - a.cantidad);
  }, [clientes]);

  if (!datos.length) {
    return <EstadoVacio titulo="Sin clientes cargados" texto="Cargá cuentas en la Base de Datos para ver el análisis." />;
  }

  return (
    <div style={{ height: Math.max(datos.length * 56 + 24, 180) }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={datos} layout="vertical" margin={{ top: 4, right: 44, bottom: 4, left: 4 }}>
          <CartesianGrid {...GRILLA_CLARA} horizontal={false} vertical />
          <XAxis type="number" {...EJE_CLARO} allowDecimals={false} />
          <YAxis type="category" dataKey="rubro" {...EJE_CLARO} width={172} />
          <Tooltip cursor={{ fill: '#FCFAF6' }} content={<TooltipGm formato={numero} />} />
          <Bar dataKey="cantidad" name="Clientes" radius={[0, 8, 8, 0]} barSize={26} {...SIN_ANIMACION}>
            {datos.map((d) => (
              <Cell key={d.rubro} fill={d.color} />
            ))}
            <LabelList
              dataKey="cantidad"
              position="right"
              style={{ fill: '#2A2118', fontSize: 13, fontWeight: 600 }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
