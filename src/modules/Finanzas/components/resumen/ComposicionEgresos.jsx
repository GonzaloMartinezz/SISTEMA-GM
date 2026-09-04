// ============================================================================
// SISTEMA GM · M-03 TESORERÍA · EN QUÉ SE VA EL DINERO
// ----------------------------------------------------------------------------
// Anillos concéntricos con los tres bloques que se comen la venta: la
// mercadería, los gastos fijos y lo que te llevás vos. En el centro, lo que
// sobra. Si el centro está en rojo, el negocio no cierra ese mes.
// ============================================================================

import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { SIN_ANIMACION } from '../../../../shared/gm-ui/graficos';
import TooltipGm from '../../../../shared/gm-ui/TooltipGm';
import EstadoVacio from '../../../../shared/gm-ui/EstadoVacio';

const BLOQUES = [
  { clave: 'mercaderia', nombre: 'Mercadería', color: '#B4551A' },
  { clave: 'fijos', nombre: 'Gastos fijos', color: '#C08A1E' },
  { clave: 'sueldo', nombre: 'Tu sueldo', color: '#2F6DA0' },
  { clave: 'resta', nombre: 'Queda', color: '#2E9B76' },
];

export default function ComposicionEgresos({ mes, enMoneda }) {
  const datos = useMemo(() => {
    if (!mes) return [];
    const partes = {
      mercaderia: mes.costoMercaderiaUsd,
      fijos: mes.gastosLogisticaUsd + mes.gastosOperativosUsd,
      sueldo: mes.sueldoFijoUsd,
      resta: Math.max(mes.resultadoUsd, 0),
    };
    return BLOQUES.map((b) => ({ nombre: b.nombre, valor: Math.round(partes[b.clave]), color: b.color }))
      .filter((d) => d.valor > 0);
  }, [mes]);

  if (!datos.length) {
    return <EstadoVacio titulo="Sin datos del mes" texto="Cargá la liquidación del último mes." />;
  }

  const ventas = mes.ventasUsd;
  const queda = mes.resultadoUsd;
  const colorQueda = queda >= 0 ? '#2E9B76' : '#A63A0C';

  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row">
      <div className="relative h-[196px] w-[196px] shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={datos}
              dataKey="valor"
              nameKey="nombre"
              innerRadius={62}
              outerRadius={94}
              paddingAngle={2}
              stroke="#FFFFFF"
              strokeWidth={2}
              {...SIN_ANIMACION}
            >
              {datos.map((d) => (
                <Cell key={d.nombre} fill={d.color} />
              ))}
            </Pie>
            <Tooltip content={<TooltipGm formato={enMoneda} />} />
          </PieChart>
        </ResponsiveContainer>

        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[11px] uppercase tracking-[0.1em] text-[#B0A697] dark:text-[#6B7280]">te queda</span>
          <span className="mt-1 text-[19px] font-semibold leading-none" style={{ color: colorQueda }}>
            {enMoneda(queda)}
          </span>
          <span className="mt-1 text-[12px] text-[#948A7C]">
            de {enMoneda(ventas)}
          </span>
        </div>
      </div>

      <ul className="w-full space-y-3">
        {datos.map((d) => (
          <li key={d.nombre} className="flex items-center gap-3">
            <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: d.color }} />
            <span className="min-w-0 flex-1 truncate text-[14px] text-[#6E6559] dark:text-[#9CA3AF]">{d.nombre}</span>
            <span className="text-[14px] font-semibold text-[#2A2118] dark:text-[#F9FAFB]">{enMoneda(d.valor)}</span>
            <span className="w-11 text-right text-[13px] text-[#B0A697] dark:text-[#6B7280]">
              {ventas > 0 ? Math.round((d.valor / ventas) * 100) : 0}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
