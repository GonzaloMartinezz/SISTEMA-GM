// ============================================================================
// SISTEMA GM · NOTARIO 360° · PESTAÑA 3 · MÁRGENES
// ----------------------------------------------------------------------------
// Split-screen: a la izquierda lo asignado y lo libre; a la derecha el corte
// estricto entre Período Actual y Período Próximo.
// ============================================================================

import React from 'react';
import { useCuenta } from '../../../shared/cuentas/CuentaContext';
import PanelTerminal from '../../../shared/ui/PanelTerminal';
import { num } from '../../../shared/utils/format';

function FilaValor({ label, valor, destacado = false }) {
  return (
    <>
      <div className="border-t border-gray-800 bg-gray-800/60 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.15em] text-gray-500">
        {label}
      </div>
      <div
        className={`border-t border-gray-800 px-3 py-1.5 text-right font-mono text-xs font-bold tabular-nums ${
          destacado ? 'text-cyan-400' : 'text-gray-200'
        }`}
      >
        {num(valor)}
      </div>
    </>
  );
}

function PanelPeriodo({ periodo, acento }) {
  if (!periodo) return null;
  return (
    <PanelTerminal titulo={periodo.etiqueta} acento={acento}>
      <div className="grid grid-cols-2">
        <FilaValor label="Saldo" valor={periodo.saldo} destacado />
        <FilaValor label="Cantidad de cuotas" valor={periodo.cuotas} />
        <FilaValor label="Pagos efectuados" valor={periodo.pagosEfectuados} />
        <FilaValor label="Más crédito disponible" valor={periodo.creditoDisponible} destacado />
      </div>
      <div className="flex items-center justify-between border-t border-gray-800 bg-gray-950/60 px-3 py-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-gray-500">
          Vencimiento
        </span>
        <span className="font-mono text-xs font-bold text-gray-200">{periodo.vencimiento}</span>
      </div>
    </PanelTerminal>
  );
}

export default function TabMargenes() {
  const { cuenta } = useCuenta();
  if (!cuenta) return null;

  const m = cuenta.margenes || {};
  const asignados = m.asignados || {};
  const libres = m.libres || {};

  return (
    <div className="grid h-full min-h-0 grid-cols-1 gap-3 overflow-auto pr-1 lg:grid-cols-2">
      {/* ---------- Izquierda ---------- */}
      <div className="flex flex-col gap-3">
        <PanelTerminal titulo="Márgenes asignados">
          <div className="grid grid-cols-2">
            <FilaValor label="Mensual" valor={asignados.mensual} destacado />
            <FilaValor label="Crédito" valor={asignados.credito} destacado />
            <FilaValor label="Adel. mensual" valor={asignados.adelMensual} />
            <FilaValor label="Adel. crédito" valor={asignados.adelCredito} />
          </div>
        </PanelTerminal>

        <PanelTerminal titulo="Márgenes libres" acento="verde">
          <div className="grid grid-cols-2">
            <FilaValor label="Mensual" valor={libres.mensual} destacado />
            <FilaValor label="Crédito" valor={libres.credito} destacado />
            <FilaValor label="Adel. mensual" valor={libres.adelMensual} />
            <FilaValor label="Adel. crédito" valor={libres.adelCredito} />
          </div>
        </PanelTerminal>

        <PanelTerminal titulo="No financiable / mínimo" acento="gris">
          <div className="grid grid-cols-2">
            <FilaValor label="No financiable" valor={m.noFinanciable} />
            <FilaValor label="Mínimo elegido" valor={m.minimoElegido} destacado />
          </div>
        </PanelTerminal>
      </div>

      {/* ---------- Derecha ---------- */}
      <div className="flex flex-col gap-3">
        <PanelPeriodo periodo={m.periodoActual} acento="cyan" />
        <PanelPeriodo periodo={m.periodoProximo} acento="ambar" />
      </div>
    </div>
  );
}
