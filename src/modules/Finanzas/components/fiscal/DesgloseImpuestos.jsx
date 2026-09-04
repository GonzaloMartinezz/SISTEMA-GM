// ============================================================================
// SISTEMA GM · M-03 TESORERÍA · IMPUESTOS DEL MES
// ----------------------------------------------------------------------------
// Qué se lleva el fisco sobre las ventas del último mes. El IVA se calcula
// sacándolo del precio (ventas × iva / (100 + iva)), que es como funciona de
// verdad: el precio ya lo tiene adentro. Los otros dos van sobre la venta.
//
// Es una estimación para decidir cuánta plata reservar, no una liquidación
// impositiva: eso lo hace el contador.
// ============================================================================

import React from 'react';
import { Info } from 'lucide-react';

function Barra({ etiqueta, detalle, monto, total, color, enMoneda }) {
  const ancho = total > 0 ? (monto / total) * 100 : 0;
  return (
    <div>
      <div className="mb-1.5 flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <span className="text-[14px] text-[#2A2118] dark:text-[#F9FAFB]">{etiqueta}</span>
          <span className="ml-2 text-[12px] text-[#B0A697] dark:text-[#6B7280]">{detalle}</span>
        </div>
        <span className="text-[14px] font-semibold text-[#2A2118] dark:text-[#F9FAFB]">{enMoneda(monto)}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-[#F0EAE1]">
        <div className="h-full rounded-full" style={{ width: `${ancho}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}

export default function DesgloseImpuestos({ impuestos, ventasUsd, params, enMoneda }) {
  const partes = [
    {
      etiqueta: 'IVA',
      detalle: `${params.ivaPct}% incluido en el precio`,
      monto: impuestos.ivaUsd,
      color: '#B4551A',
    },
    {
      etiqueta: 'Ingresos brutos',
      detalle: `${params.ingresosBrutosPct}% sobre la venta`,
      monto: impuestos.ingresosBrutosUsd,
      color: '#C08A1E',
    },
    {
      etiqueta: 'Retenciones',
      detalle: `${params.retencionesPct}% sobre la venta`,
      monto: impuestos.retencionesUsd,
      color: '#2F6DA0',
    },
  ];

  const carga = ventasUsd > 0 ? (impuestos.totalUsd / ventasUsd) * 100 : 0;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3 rounded-xl bg-[#FCFAF6] dark:bg-[#2D2D2D] p-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#B0A697] dark:text-[#6B7280]">
            Sobre ventas de
          </p>
          <p className="mt-1 text-[20px] font-semibold text-[#2A2118] dark:text-[#F9FAFB]">{enMoneda(ventasUsd)}</p>
        </div>
        <div className="text-right">
          <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#B0A697] dark:text-[#6B7280]">
            Carga total
          </p>
          <p className="mt-1 text-[20px] font-semibold text-[#A63A0C]">{carga.toFixed(1)}%</p>
        </div>
      </div>

      <div className="space-y-4">
        {partes.map((p) => (
          <Barra key={p.etiqueta} {...p} total={impuestos.totalUsd} enMoneda={enMoneda} />
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#F0EAE1] dark:border-[#333333] pt-4">
        <span className="text-[14px] text-[#6E6559] dark:text-[#9CA3AF]">Total a reservar</span>
        <span className="text-[17px] font-semibold text-[#A63A0C]">{enMoneda(impuestos.totalUsd)}</span>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="text-[14px] text-[#6E6559] dark:text-[#9CA3AF]">Neto después de impuestos</span>
        <span className="text-[17px] font-semibold text-[#1F6F53]">{enMoneda(impuestos.netoUsd)}</span>
      </div>

      <p className="flex items-start gap-2 text-[12px] leading-relaxed text-[#948A7C]">
        <Info size={13} className="mt-0.5 shrink-0" />
        <span>
          Es una estimación para saber cuánto apartar, con los porcentajes cargados en Parámetros.
          La liquidación real la hace tu contador.
        </span>
      </p>
    </div>
  );
}
