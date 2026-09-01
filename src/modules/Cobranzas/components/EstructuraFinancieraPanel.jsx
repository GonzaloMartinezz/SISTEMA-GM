// ============================================================================
// SISTEMA GM · COBRANZAS · ESTRUCTURA FINANCIERA DEL CLIENTE
// ----------------------------------------------------------------------------
// Desglose separado estrictamente por Período Actual y Período Próximo.
// ============================================================================

import React from 'react';
import PanelTerminal from '../../../shared/ui/PanelTerminal';
import { num } from '../../../shared/utils/format';

function Linea({ label, valor, destacado = false, alerta = false }) {
  return (
    <div className="flex items-center justify-between border-t border-gray-800 px-3 py-1.5 first:border-t-0">
      <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-gray-500">
        {label}
      </span>
      <span
        className={`font-mono text-xs font-bold tabular-nums ${
          alerta ? 'text-rose-400' : destacado ? 'text-cyan-400' : 'text-gray-200'
        }`}
      >
        {valor}
      </span>
    </div>
  );
}

function Periodo({ periodo, acento }) {
  if (!periodo) return null;
  const pendientes = Math.max(0, (periodo.cuotas || 0) - (periodo.pagosEfectuados || 0));

  return (
    <PanelTerminal titulo={periodo.etiqueta} acento={acento}>
      <Linea label="Saldo del período" valor={num(periodo.saldo)} destacado />
      <Linea label="Cantidad de cuotas" valor={periodo.cuotas} />
      <Linea label="Pagos efectuados" valor={periodo.pagosEfectuados} />
      <Linea label="Cuotas pendientes" valor={pendientes} alerta={pendientes > 0} />
      <Linea label="Más crédito disponible" valor={num(periodo.creditoDisponible)} destacado />
      <Linea label="Vencimiento" valor={periodo.vencimiento} />

      {/* Avance de cuotas */}
      <div className="border-t border-gray-800 px-3 py-2">
        <div className="mb-1 flex justify-between font-mono text-[9px] uppercase tracking-wider text-gray-600">
          <span>Avance</span>
          <span>
            {periodo.pagosEfectuados}/{periodo.cuotas}
          </span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-800">
          <div
            className={acento === 'cyan' ? 'h-full bg-cyan-500' : 'h-full bg-amber-500'}
            style={{
              width: `${periodo.cuotas ? (periodo.pagosEfectuados / periodo.cuotas) * 100 : 0}%`,
            }}
          />
        </div>
      </div>
    </PanelTerminal>
  );
}

export default function EstructuraFinancieraPanel({ cuenta }) {
  if (!cuenta) return null;
  const m = cuenta.margenes || {};

  return (
    <div className="space-y-3">
      <Periodo periodo={m.periodoActual} acento="cyan" />
      <Periodo periodo={m.periodoProximo} acento="ambar" />

      <PanelTerminal titulo="Márgenes de la cuenta" acento="gris">
        <Linea label="Margen mensual asignado" valor={num(m.asignados?.mensual)} />
        <Linea label="Margen de crédito asignado" valor={num(m.asignados?.credito)} />
        <Linea label="Mensual libre" valor={num(m.libres?.mensual)} destacado />
        <Linea label="Crédito libre" valor={num(m.libres?.credito)} destacado />
        <Linea label="Mínimo elegido" valor={num(m.minimoElegido)} />
        <Linea label="No financiable" valor={num(m.noFinanciable)} alerta={Number(m.noFinanciable) > 0} />
      </PanelTerminal>
    </div>
  );
}
