// ============================================================================
// SISTEMA GM · M-03 TESORERÍA · SALUD FINANCIERA
// ----------------------------------------------------------------------------
// Una nota de 0 a 100 que junta tres cosas: cuánto deja el negocio, cuántos
// meses aguanta con la liquidez que hay, y si viene creciendo.
//
// El desglose está siempre a la vista. Un número solo ("92") no sirve para
// decidir nada; lo útil es ver cuál de las tres patas está floja.
// ============================================================================

import React from 'react';
import { HeartPulse } from 'lucide-react';
import EstadoVacio from '../../../../shared/gm-ui/EstadoVacio';

const COLOR = (n) => (n >= 80 ? '#2E9B76' : n >= 60 ? '#2F6DA0' : n >= 40 ? '#C08A1E' : '#A63A0C');

export default function MedidorSalud({ salud }) {
  if (!salud) {
    return <EstadoVacio icono={HeartPulse} titulo="Sin datos suficientes" texto="Cargá al menos un mes." />;
  }

  const color = COLOR(salud.total);
  const R = 62;
  const circunferencia = Math.PI * R; // media vuelta
  const avance = (salud.total / 100) * circunferencia;

  return (
    <div className="space-y-5">
      {/* Semicírculo: la mitad de arriba de un reloj, de 0 a 100. */}
      <div className="relative mx-auto h-[104px] w-[160px]">
        <svg viewBox="0 0 160 92" className="h-full w-full">
          <path
            d="M 18 80 A 62 62 0 0 1 142 80"
            fill="none"
            stroke="#F0EAE1"
            strokeWidth="14"
            strokeLinecap="round"
          />
          <path
            d="M 18 80 A 62 62 0 0 1 142 80"
            fill="none"
            stroke={color}
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray={`${avance} ${circunferencia}`}
          />
        </svg>

        <div className="absolute inset-x-0 bottom-0 text-center">
          <p className="text-[30px] font-semibold leading-none" style={{ color }}>
            {salud.total}
          </p>
          <p className="mt-1 text-[13px] text-[#6E6559] dark:text-[#9CA3AF]">{salud.etiqueta}</p>
        </div>
      </div>

      {/* Las tres patas, con cuánto aporta cada una. */}
      <ul className="space-y-3.5">
        {salud.partes.map((p) => (
          <li key={p.nombre}>
            <div className="mb-1.5 flex flex-wrap items-baseline justify-between gap-2">
              <span className="text-[13px] text-[#2A2118] dark:text-[#F9FAFB]">{p.nombre}</span>
              <span className="text-[12px] text-[#948A7C]">
                {p.detalle} · {p.valor}/{p.tope}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-[#F0EAE1]">
              <div
                className="h-full rounded-full"
                style={{ width: `${(p.valor / p.tope) * 100}%`, backgroundColor: color }}
              />
            </div>
          </li>
        ))}
      </ul>

      <p className="text-[12px] leading-relaxed text-[#948A7C]">
        Los pesos (50 / 30 / 20) y los umbrales son del negocio, no una regla general. Están acá a
        la vista para poder discutirlos cuando dejen de tener sentido.
      </p>
    </div>
  );
}
