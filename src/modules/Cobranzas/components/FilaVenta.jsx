// ============================================================================
// SISTEMA GM · M-08 · FILA DE VENTA
// ----------------------------------------------------------------------------
// Una venta en la lista. Lleva lo que se necesita para decidir sin abrirla:
// quién es, qué compró, cuánto falta y si está atrasada. El resto se ve al
// tocarla.
//
// En celular el bloque del saldo no entra al lado del detalle sin apretujar
// las dos cosas, así que pasa a una segunda línea, separada por un filete:
// mismo dato, leído de arriba hacia abajo en vez de lado a lado.
// ============================================================================

import React from 'react';
import { AlertTriangle, ChevronRight } from 'lucide-react';
import Chip from '../../../shared/gm-ui/Chip';
import BarraAvance from './BarraAvance';
import {
  getEstadoVenta, getAtraso, usd, fechaCorta, dias as diasTexto,
} from '../config/cobranzas.config';

export default function FilaVenta({ venta: v, activa, onClick }) {
  const estado = getEstadoVenta(v.estadoCobro);
  const atrasada = v.cuotasVencidas > 0;
  const atraso = atrasada && v.diasAtraso != null ? getAtraso(v.diasAtraso) : null;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full flex-col gap-3 px-5 py-4 text-left transition sm:flex-row sm:items-start sm:gap-4 ${
        activa ? 'bg-[#FBE5C8]' : 'hover:bg-[#FCFAF6]'
      }`}
    >
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
          <span className="text-[14px] font-semibold text-[#2A2118]">{v.cliente}</span>
          <span className="text-[12px] text-[#B0A697]">{v.codigo}</span>
          <Chip tono={estado.tono} punto>{estado.nombre}</Chip>
          {atraso && (
            <Chip tono={atraso.tono}>
              {atraso.nombre} · {diasTexto(v.diasAtraso)}
            </Chip>
          )}
        </div>

        <p className="mt-1 truncate text-[13px] text-[#6E6559]">{v.detalle}</p>

        <div className="mt-2.5 max-w-md">
          <BarraAvance total={v.totalUsd} cobrado={v.cobradoUsd} vencido={v.vencidoUsd} />
        </div>

        <p className="mt-2 flex flex-wrap items-center gap-x-2.5 gap-y-0.5 text-[11px] text-[#B0A697]">
          <span>{usd(v.cobradoUsd)} de {usd(v.totalUsd)}</span>
          {v.cuotasTotal > 0 && (
            <>
              <span>·</span>
              <span>{v.cuotasPagadas} de {v.cuotasTotal} cuotas</span>
            </>
          )}
          {v.proximoVencimiento && (
            <>
              <span>·</span>
              <span>
                {atrasada ? 'debía entrar el ' : 'próxima el '}
                {fechaCorta(v.proximoVencimiento)}
              </span>
            </>
          )}
          {v.cuotasTotal === 0 && v.cuotasPactadas === 0 && (
            <>
              <span>·</span>
              <span>contado</span>
            </>
          )}
        </p>
      </div>

      <div className="flex items-center justify-between gap-2 border-t border-[#F0EAE1] pt-3 sm:shrink-0 sm:justify-end sm:border-t-0 sm:pt-0.5 sm:text-right">
        <div>
          <p
            className="text-[16px] font-semibold tabular-nums"
            style={{ color: v.saldoUsd > 0.01 ? '#2A2118' : '#948A7C' }}
          >
            {v.saldoUsd > 0.01 ? usd(v.saldoUsd) : 'Saldada'}
          </p>
          {v.vencidoUsd > 0 && (
            <p className="mt-0.5 flex items-center gap-1 text-[11px] text-[#A63A0C] sm:justify-end">
              <AlertTriangle size={11} />
              {usd(v.vencidoUsd)} vencido
            </p>
          )}
          {v.saldoUsd > 0.01 && v.vencidoUsd === 0 && (
            <p className="mt-0.5 text-[11px] text-[#B0A697]">por cobrar</p>
          )}
        </div>
        <ChevronRight size={16} className="text-[#C6BCAC]" />
      </div>
    </button>
  );
}
