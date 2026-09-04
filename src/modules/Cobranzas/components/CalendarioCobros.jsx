// ============================================================================
// SISTEMA GM · M-08 · CALENDARIO DE COBROS
// ----------------------------------------------------------------------------
// El mes con la plata que tiene que entrar cada día. No es una agenda de
// eventos: cada casillero muestra un monto, porque la pregunta que se le hace
// a esta pantalla es "cuánto me entra la semana que viene", no "qué día es".
//
// El día vencido sin cobrar se pinta; el día ya cobrado se apaga. Así el mes
// se lee de un vistazo: lo que resalta es lo que falta.
// ============================================================================

import React from 'react';
import { DIAS_SEMANA, usdCorto, usd, getEstadoCuota } from '../config/cobranzas.config';
import { ESTADO_COLOR } from '../../../shared/gm-ui/tokens';

export default function CalendarioCobros({ semanas = [], onDia, diaActivo }) {
  return (
    <div className="overflow-x-auto">
      <div className="min-w-[560px]">
        <div className="grid grid-cols-7 border-b border-[#F0EAE1]">
          {DIAS_SEMANA.map((d) => (
            <div
              key={d}
              className="px-2 py-2 text-center text-[11px] font-semibold uppercase tracking-[0.1em] text-[#B0A697]"
            >
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {semanas.flat().map((dia) => {
            const hayVencidas = dia.vencidas > 0;
            const todoCobrado = dia.cuotas.length > 0 && dia.total <= 0.01;
            const activo = diaActivo === dia.iso;

            return (
              <button
                key={dia.iso}
                type="button"
                onClick={() => onDia?.(dia)}
                disabled={dia.cuotas.length === 0}
                className={`flex min-h-[86px] flex-col items-start gap-1 border-b border-r border-[#F4EFE7] px-2 py-1.5 text-left transition ${
                  dia.cuotas.length ? 'cursor-pointer hover:bg-[#FCFAF6]' : 'cursor-default'
                } ${activo ? 'bg-[#FBE5C8]' : ''} ${
                  dia.delMes ? '' : 'bg-[#FCFAF6]/60'
                }`}
              >
                <span
                  className={`grid h-6 w-6 place-items-center rounded-lg text-[12px] tabular-nums ${
                    dia.esHoy
                      ? 'bg-[#B4551A] font-semibold text-white'
                      : dia.delMes
                        ? 'text-[#2A2118]'
                        : 'text-[#C6BCAC]'
                  }`}
                >
                  {dia.numero}
                </span>

                {dia.cuotas.length > 0 && (
                  <>
                    <span
                      className="rounded-md px-1.5 py-0.5 text-[12px] font-semibold tabular-nums leading-tight"
                      style={{
                        backgroundColor: todoCobrado
                          ? '#DFF0E8'
                          : hayVencidas ? '#F5DDCC' : '#FBE5C8',
                        color: todoCobrado
                          ? '#1F6F53'
                          : hayVencidas ? '#A63A0C' : '#8A3F11',
                      }}
                    >
                      {todoCobrado ? '✓' : usdCorto(dia.total)}
                    </span>

                    <span className="w-full truncate text-[10px] leading-tight text-[#B0A697]">
                      {dia.cuotas.length === 1
                        ? dia.cuotas[0].cliente
                        : `${dia.cuotas.length} cobros`}
                    </span>

                    <span className="mt-auto flex flex-wrap gap-0.5">
                      {dia.cuotas.slice(0, 6).map((c) => (
                        <span
                          key={c.codigo}
                          className="h-1.5 w-1.5 rounded-full"
                          style={{ backgroundColor: getEstadoCuota(c.estado).color }}
                          title={`${c.cliente} · ${usd(c.montoUsd)} · ${getEstadoCuota(c.estado).nombre}`}
                        />
                      ))}
                    </span>
                  </>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 px-1 pt-3 text-[11px] text-[#948A7C]">
        <Referencia color={ESTADO_COLOR.bien}>cobrada</Referencia>
        <Referencia color={ESTADO_COLOR.critico}>vencida</Referencia>
        <Referencia color={ESTADO_COLOR.atencion}>pagada a medias</Referencia>
        <Referencia color={ESTADO_COLOR.neutro}>por vencer</Referencia>
        <span className="ml-auto">El monto del casillero es lo que todavía falta cobrar ese día.</span>
      </div>
    </div>
  );
}

function Referencia({ color, children }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
      {children}
    </span>
  );
}
