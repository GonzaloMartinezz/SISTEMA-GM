// ============================================================================
// SISTEMA GM · M-05 · CARGA DE LA JORNADA
// ----------------------------------------------------------------------------
// Cuánto del día ya está comprometido. La barra se pinta hasta el 100% y, si
// se pasa, aparece un tramo aparte en rojo con lo que sobra: se ve de un
// vistazo que el día no entra, en vez de una barra llena que no distingue un
// día justo de uno imposible.
// ============================================================================

import React from 'react';
import { ESTADO_COLOR } from '../../../shared/gm-ui/tokens';
import { horasYminutos } from '../utils/calendario';

export default function BarraCarga({ carga, compacto = false }) {
  const dentro = Math.min(carga.pct, 100);
  const sobra = Math.max(carga.pct - 100, 0);

  const color = carga.excedido
    ? ESTADO_COLOR.critico
    : carga.lleno
      ? ESTADO_COLOR.atencion
      : ESTADO_COLOR.bien;

  return (
    <div className={compacto ? '' : 'space-y-1.5'}>
      {!compacto && (
        <div className="flex items-baseline justify-between gap-3">
          <span className="text-[12px] text-[#6E6559] dark:text-[#9CA3AF]">
            {horasYminutos(carga.minutos)} comprometidas de 12 h de jornada
          </span>
          <span className="text-[13px] font-semibold" style={{ color }}>
            {Math.round(carga.pct)}%
          </span>
        </div>
      )}

      <div
        className={`flex overflow-hidden rounded-full bg-[#F3EDE4] dark:bg-[#121212] ${compacto ? 'h-1.5' : 'h-2.5'}`}
        role="img"
        aria-label={`Jornada al ${Math.round(carga.pct)} por ciento`}
      >
        <span
          className="block h-full"
          style={{ width: `${dentro}%`, backgroundColor: color }}
        />
        {sobra > 0 && (
          <span
            className="block h-full"
            style={{
              width: `${Math.min(sobra, 60)}%`,
              backgroundColor: ESTADO_COLOR.critico,
              opacity: 0.45,
            }}
            title="Lo que no entra en la jornada"
          />
        )}
      </div>

      {!compacto && carga.excedido && (
        <p className="text-[12px] text-[#A63A0C]">
          Te pasaste {horasYminutos(carga.minutos - 12 * 60)}. Algo hay que mover de día.
        </p>
      )}
    </div>
  );
}
