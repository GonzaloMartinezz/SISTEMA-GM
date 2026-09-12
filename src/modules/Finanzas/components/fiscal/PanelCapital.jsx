// ============================================================================
// SISTEMA GM · M-09 TESORERÍA · CAPITAL Y ROI
// ----------------------------------------------------------------------------
// Cuánta plata hay y de quién es. La reserva de impuestos se muestra aparte
// porque no es capital disponible: está comprometida aunque todavía esté en la
// cuenta.
// ============================================================================

import React from 'react';
import { Banknote, PiggyBank, Receipt, Target } from 'lucide-react';

const CAJAS = [
  { clave: 'liquidezUsd', etiqueta: 'Liquidez', detalle: 'disponible ahora', icono: Banknote, color: '#2E9B76' },
  { clave: 'ahorroUsd', etiqueta: 'Ahorro', detalle: 'reservado, no operativo', icono: PiggyBank, color: '#2F6DA0' },
  { clave: 'reservaImpuestosUsd', etiqueta: 'Reserva impuestos', detalle: 'comprometido con el fisco', icono: Receipt, color: '#C08A1E' },
];

export default function PanelCapital({ capital, resultadoAcumulado, roiPct, enMoneda }) {
  const disponible = capital.liquidezUsd + capital.ahorroUsd;
  const total = disponible + capital.reservaImpuestosUsd;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {CAJAS.map((c) => (
          <div key={c.clave} className="rounded-xl border border-[var(--gm-borde)] dark:border-[#333333] p-4">
            <div className="flex items-center gap-2">
              <span
                className="grid h-8 w-8 place-items-center rounded-lg"
                style={{ backgroundColor: `${c.color}1A`, color: c.color }}
              >
                <c.icono size={15} />
              </span>
              <span className="text-[12px] font-medium text-[#6E6559] dark:text-[#9CA3AF]">{c.etiqueta}</span>
            </div>
            <p className="mt-3 text-[19px] font-semibold text-[#2A2118] dark:text-[#F9FAFB]">
              {enMoneda(capital[c.clave])}
            </p>
            <p className="mt-0.5 text-[12px] text-[var(--gm-texto-medio)] dark:text-[#6B7280]">{c.detalle}</p>
          </div>
        ))}
      </div>

      {/* Reparto visual del capital total */}
      <div>
        <div className="mb-2 flex items-baseline justify-between gap-2">
          <span className="text-[13px] text-[#6E6559] dark:text-[#9CA3AF]">Capital total en la cuenta</span>
          <span className="text-[14px] font-semibold text-[#2A2118] dark:text-[#F9FAFB]">{enMoneda(total)}</span>
        </div>
        <div className="flex h-2.5 overflow-hidden rounded-full bg-[var(--gm-superficie-fuerte)]">
          {CAJAS.map((c) => (
            <div
              key={c.clave}
              style={{
                width: total > 0 ? `${(capital[c.clave] / total) * 100}%` : '0%',
                backgroundColor: c.color,
              }}
            />
          ))}
        </div>
        <p className="mt-2 text-[12px] text-[#948A7C]">
          Realmente disponible: <b className="text-[#2A2118] dark:text-[#F9FAFB]">{enMoneda(disponible)}</b> — el resto
          ya tiene dueño.
        </p>
      </div>

      {/* ROI */}
      <div className="rounded-xl bg-[#FCFAF6] dark:bg-[#2D2D2D] p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="inline-flex items-center gap-2 text-[14px] text-[#6E6559] dark:text-[#9CA3AF]">
            <Target size={15} className="text-[#B4551A]" />
            Retorno sobre la inversión inicial
          </span>
          <span className="text-[20px] font-semibold text-[#2A2118] dark:text-[#F9FAFB]">{roiPct.toFixed(1)}%</span>
        </div>
        <p className="mt-2 text-[12px] leading-relaxed text-[#948A7C]">
          {enMoneda(resultadoAcumulado)} de resultado acumulado sobre{' '}
          {enMoneda(capital.inversionInicialUsd)} puestos al principio.
        </p>
      </div>
    </div>
  );
}
