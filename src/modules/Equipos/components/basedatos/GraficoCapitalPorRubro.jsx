// ============================================================================
// SISTEMA GM · M-02 EQUIPAMIENTOS · CAPITAL INMOVILIZADO POR RUBRO
// ----------------------------------------------------------------------------
// La KPI de arriba ya suma el capital inmovilizado en un solo número; este
// gráfico lo abre por rubro (Odontología, Veterinaria, Diagnóstico por
// Imagen), que es la pregunta real a la hora de decidir dónde reponer y
// dónde frenar la compra.
// ============================================================================

import React from 'react';
import {
  Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import { EJE_CLARO, GRILLA_CLARA, SIN_ANIMACION, usd } from '../../../../shared/gm-ui/graficos';
import { RAMPA } from '../../../../shared/gm-ui/tokens';

export default function GraficoCapitalPorRubro({ datos = [], alto = 220 }) {
  if (datos.length === 0 || datos.every((d) => d.inmovilizado === 0)) {
    return (
      <p className="py-10 text-center text-[13px] text-[var(--gm-texto-suave)]">
        Todavía no hay stock cargado para mostrar el capital por rubro.
      </p>
    );
  }

  return (
    <div style={{ height: alto }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={datos} margin={{ top: 8, right: 8, bottom: 4, left: -8 }}>
          <CartesianGrid {...GRILLA_CLARA} />
          <XAxis dataKey="rubro" {...EJE_CLARO} />
          <YAxis {...EJE_CLARO} tickFormatter={usd} width={64} />
          <Tooltip content={<Globo />} cursor={{ fill: 'rgba(180,85,26,0.05)' }} />
          <Bar dataKey="inmovilizado" radius={[4, 4, 0, 0]} maxBarSize={56} {...SIN_ANIMACION}>
            {datos.map((d, i) => (
              <Cell key={d.rubro} fill={RAMPA[i % RAMPA.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function Globo({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="rounded-xl border border-[var(--gm-borde)] bg-white px-3 py-2 shadow-[0_8px_24px_-12px_rgba(26,26,24,0.3)]">
      <p className="text-[12px] font-semibold text-[#2A2118]">{d.rubro}</p>
      <p className="mt-1 text-[12px] text-[#6E6559]">Inmovilizado: {usd(d.inmovilizado)}</p>
      <p className="text-[12px] text-[#948A7C]">{d.unidades} unidades en depósito</p>
    </div>
  );
}
