// ============================================================================
// SISTEMA GM · TESORERÍA · IMPUESTOS Y CAPITAL
// ----------------------------------------------------------------------------
// Separa el neto de lo que en realidad no es tuyo, y muestra la reserva.
// ============================================================================

import React from 'react';
import { Landmark, PiggyBank } from 'lucide-react';
import PanelTerminal from '../../../shared/ui/PanelTerminal';
import { SERIES, ESTADO, usd, pct } from '../../../shared/ui/viz';
import { useTesoreria } from '../context/TesoreriaContext';

function Linea({ label, valor, color, negativo = false }) {
  return (
    <div className="flex items-center justify-between border-t border-gray-800 px-3 py-1.5 first:border-t-0">
      <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-gray-500">
        {label}
      </span>
      <span
        className="font-mono text-xs font-bold tabular-nums"
        style={{ color: color || '#e5e7eb' }}
      >
        {negativo ? '−' : ''}
        {valor}
      </span>
    </div>
  );
}

export default function PanelImpuestos() {
  const { datos } = useTesoreria();
  if (!datos) return null;

  const { impuestos, capital, params, ultimo } = datos;
  const cobertura = impuestos.totalUsd
    ? (capital.reservaImpuestosUsd / impuestos.totalUsd) * 100
    : 0;

  return (
    <div className="space-y-3">
      <PanelTerminal
        titulo="Impuestos y facturación"
        acento="ambar"
        acciones={
          <span className="inline-flex items-center gap-1 font-mono text-[9px] uppercase tracking-[0.15em] text-gray-600">
            <Landmark className="h-3 w-3" />
            Sobre {usd(ultimo.ventasUsd)}
          </span>
        }
      >
        <Linea label="Facturado bruto" valor={usd(ultimo.ventasUsd)} />
        <Linea
          label={`IVA (${params.ivaPct}%)`}
          valor={usd(impuestos.ivaUsd)}
          color={SERIES.impuestos}
          negativo
        />
        <Linea
          label={`Ingresos brutos (${params.ingresosBrutosPct}%)`}
          valor={usd(impuestos.ingresosBrutosUsd)}
          color={SERIES.impuestos}
          negativo
        />
        <Linea
          label={`Retenciones (${params.retencionesPct}%)`}
          valor={usd(impuestos.retencionesUsd)}
          color={SERIES.impuestos}
          negativo
        />
        <Linea label="Neto real" valor={usd(impuestos.netoUsd)} color={SERIES.neto} />
      </PanelTerminal>

      <PanelTerminal
        titulo="Ahorros y capital"
        acento="verde"
        acciones={
          <span className="inline-flex items-center gap-1 font-mono text-[9px] uppercase tracking-[0.15em] text-gray-600">
            <PiggyBank className="h-3 w-3" />
            Fondos de reserva
          </span>
        }
      >
        <Linea label="Capital líquido" valor={usd(capital.liquidezUsd)} color={SERIES.ingresos} />
        <Linea label="Ahorro acumulado" valor={usd(capital.ahorroUsd)} color={SERIES.neto} />
        <Linea label="Reserva impositiva" valor={usd(capital.reservaImpuestosUsd)} color={SERIES.impuestos} />

        <div className="border-t border-gray-800 px-3 py-2.5">
          <div className="mb-1 flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.15em]">
            <span className="text-gray-600">Cobertura de la carga impositiva</span>
            <span
              style={{
                color: cobertura >= 100 ? ESTADO.bien : cobertura >= 60 ? ESTADO.atencion : ESTADO.grave,
              }}
            >
              {pct(Math.min(cobertura, 999), 0)}
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-800">
            <div
              className="h-full rounded-full"
              style={{
                width: `${Math.min(100, cobertura)}%`,
                background:
                  cobertura >= 100 ? ESTADO.bien : cobertura >= 60 ? ESTADO.atencion : ESTADO.grave,
              }}
            />
          </div>
        </div>
      </PanelTerminal>
    </div>
  );
}
