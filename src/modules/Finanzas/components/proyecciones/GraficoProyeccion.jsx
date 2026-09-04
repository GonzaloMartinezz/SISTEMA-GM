// ============================================================================
// SISTEMA GM · M-03 TESORERÍA · CURVA DE PROYECCIÓN
// ----------------------------------------------------------------------------
// Los meses reales y la proyección en la misma línea, separadas por una marca:
// a la izquierda lo que pasó, a la derecha lo que podría pasar. El tramo
// proyectado va punteado para que nadie lo confunda con un dato.
// ============================================================================

import React, { useMemo } from 'react';
import {
  ComposedChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend,
  ReferenceLine,
} from 'recharts';
import { SERIE } from '../../../../shared/gm-ui/tokens';
import { EJE_CLARO, GRILLA_CLARA, SIN_ANIMACION } from '../../../../shared/gm-ui/graficos';
import TooltipGm from '../../../../shared/gm-ui/TooltipGm';
import EstadoVacio from '../../../../shared/gm-ui/EstadoVacio';

export default function GraficoProyeccion({ meses = [], proyecciones = [], enMoneda, enMonedaCorta }) {
  const datos = useMemo(() => {
    if (!meses.length) return [];

    const reales = meses.map((m) => ({
      etiqueta: m.etiqueta,
      Real: m.ventasUsd,
      Proyectado: null,
    }));

    // El último real también arranca la línea proyectada, así no queda un hueco.
    const ultimo = meses[meses.length - 1];
    reales[reales.length - 1].Proyectado = ultimo.ventasUsd;

    const futuras = proyecciones
      .filter((p) => p.meses <= 12)
      .map((p) => ({ etiqueta: `+${p.meses}m`, Real: null, Proyectado: p.ventasUsd }));

    return [...reales, ...futuras];
  }, [meses, proyecciones]);

  if (!datos.length) {
    return <EstadoVacio titulo="Sin historia para proyectar" texto="Cargá al menos dos meses." />;
  }

  const corte = meses[meses.length - 1]?.etiqueta;

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={datos} margin={{ top: 8, right: 8, bottom: 4, left: -6 }}>
          <CartesianGrid {...GRILLA_CLARA} />
          <XAxis dataKey="etiqueta" {...EJE_CLARO} />
          <YAxis {...EJE_CLARO} tickFormatter={enMonedaCorta} />
          <Tooltip cursor={{ fill: '#FCFAF6' }} content={<TooltipGm formato={enMoneda} />} />
          <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, color: '#948A7C', paddingTop: 8 }} />
          {corte && <ReferenceLine x={corte} stroke="#D5CABA" strokeDasharray="4 4" />}

          <Line
            type="monotone"
            dataKey="Real"
            name="Ventas reales"
            stroke={SERIE.azul}
            strokeWidth={2.5}
            dot={{ r: 3, fill: SERIE.azul, strokeWidth: 0 }}
            connectNulls={false}
            {...SIN_ANIMACION}
          />
          <Line
            type="monotone"
            dataKey="Proyectado"
            name="Proyección"
            stroke={SERIE.terracota}
            strokeWidth={2.5}
            strokeDasharray="6 4"
            dot={{ r: 3, fill: SERIE.terracota, strokeWidth: 0 }}
            connectNulls
            {...SIN_ANIMACION}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
