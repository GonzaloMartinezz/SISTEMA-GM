// ============================================================================
// SISTEMA GM · M-01 CLIENTES · EVOLUCIÓN DE LA CARTERA
// ----------------------------------------------------------------------------
// Altas por mes y acumulado. Se arma con el campo "cliente desde" de cada
// cuenta; si una cuenta no lo tiene, no se inventa una fecha: queda fuera y se
// avisa debajo del gráfico.
// ============================================================================

import React, { useMemo } from 'react';
import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend,
} from 'recharts';
import { SERIE } from '../../../../shared/gm-ui/tokens';
import { EJE_CLARO, GRILLA_CLARA, SIN_ANIMACION, numero } from '../../../../shared/gm-ui/graficos';
import TooltipGm from '../../../../shared/gm-ui/TooltipGm';
import EstadoVacio from '../../../../shared/gm-ui/EstadoVacio';

const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

export default function GraficoAltas({ clientes = [], meses = 12 }) {
  const { datos, sinFecha } = useMemo(() => {
    const conFecha = clientes.filter((c) => c.cliente_desde);
    const hoy = new Date();

    const cubos = [];
    for (let i = meses - 1; i >= 0; i -= 1) {
      const d = new Date(hoy.getFullYear(), hoy.getMonth() - i, 1);
      cubos.push({
        clave: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
        mes: `${MESES[d.getMonth()]} ${String(d.getFullYear()).slice(2)}`,
        altas: 0,
      });
    }

    const indice = new Map(cubos.map((c) => [c.clave, c]));
    let previas = 0;
    conFecha.forEach((c) => {
      const clave = String(c.cliente_desde).slice(0, 7);
      const cubo = indice.get(clave);
      if (cubo) cubo.altas += 1;
      else if (clave < cubos[0].clave) previas += 1;
    });

    let acum = previas;
    cubos.forEach((c) => {
      acum += c.altas;
      c.acumulado = acum;
    });

    return { datos: cubos, sinFecha: clientes.length - conFecha.length };
  }, [clientes, meses]);

  if (!clientes.length) {
    return <EstadoVacio titulo="Sin datos de evolución" texto="Todavía no hay cuentas cargadas." />;
  }

  return (
    <>
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={datos} margin={{ top: 8, right: 8, bottom: 4, left: -8 }}>
            <CartesianGrid {...GRILLA_CLARA} />
            <XAxis dataKey="mes" {...EJE_CLARO} />
            <YAxis {...EJE_CLARO} allowDecimals={false} />
            <Tooltip cursor={{ fill: '#FCFAF6' }} content={<TooltipGm formato={numero} />} />
            <Legend
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: 12, color: '#948A7C', paddingTop: 8 }}
            />
            <Bar
              dataKey="altas"
              name="Altas del mes"
              fill={SERIE.azul}
              radius={[6, 6, 0, 0]}
              barSize={22}
              {...SIN_ANIMACION}
            />
            <Line
              type="monotone"
              dataKey="acumulado"
              name="Cartera acumulada"
              stroke={SERIE.terracota}
              strokeWidth={2.5}
              dot={{ r: 3, fill: SERIE.terracota, strokeWidth: 0 }}
              {...SIN_ANIMACION}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {sinFecha > 0 && (
        <p className="mt-3 text-[12px] text-[#B0A697] dark:text-[#6B7280]">
          {sinFecha} {sinFecha === 1 ? 'cuenta no tiene' : 'cuentas no tienen'} cargada la fecha de alta y
          quedan fuera de este gráfico.
        </p>
      )}
    </>
  );
}
