// ============================================================================
// SISTEMA GM · NOTARIO 360° · PESTAÑA 5 · MOVIMIENTOS
// ----------------------------------------------------------------------------
// Corte estricto por período (actual / próximo), bimonetario ARS + USD.
// ============================================================================

import React, { useMemo, useState } from 'react';
import { useCuenta } from '../../../shared/cuentas/CuentaContext';
import PanelTerminal, { SinDatos } from '../../../shared/ui/PanelTerminal';
import { num } from '../../../shared/utils/format';

const FILTROS = [
  { id: 'TODOS', label: 'Todos' },
  { id: 'ACTUAL', label: 'Período actual' },
  { id: 'PROXIMO', label: 'Período próximo' },
];

export default function TabMovimientos() {
  const { cuenta } = useCuenta();
  const [filtro, setFiltro] = useState('TODOS');

  const movimientos = cuenta?.movimientos || [];

  const visibles = useMemo(
    () => (filtro === 'TODOS' ? movimientos : movimientos.filter((m) => m.periodo === filtro)),
    [movimientos, filtro]
  );

  const totales = useMemo(
    () =>
      visibles.reduce(
        (acc, m) => ({
          ars: acc.ars + Number(m.importeArs || 0),
          usd: acc.usd + Number(m.importeUsd || 0),
        }),
        { ars: 0, usd: 0 }
      ),
    [visibles]
  );

  if (!cuenta) return null;

  return (
    <PanelTerminal
      titulo="Movimientos de la cuenta"
      className="h-full"
      acciones={
        <div className="flex items-center gap-1">
          {FILTROS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFiltro(f.id)}
              className={`rounded px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-[0.12em] transition-colors ${
                filtro === f.id
                  ? 'bg-cyan-500/15 text-cyan-400'
                  : 'text-gray-600 hover:text-gray-300'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      }
    >
      {visibles.length ? (
        <table className="w-full border-collapse whitespace-nowrap text-left font-mono text-[10px]">
          <thead className="sticky top-0 z-10 border-b border-gray-800 bg-gray-800/90">
            <tr className="uppercase text-gray-500">
              <th className="border-r border-gray-800 p-2 font-semibold">Fecha</th>
              <th className="border-r border-gray-800 p-2 font-semibold">Comprobante</th>
              <th className="border-r border-gray-800 p-2 font-semibold">Detalle</th>
              <th className="border-r border-gray-800 p-2 text-center font-semibold">Cuota</th>
              <th className="border-r border-gray-800 p-2 text-center font-semibold">Período</th>
              <th className="border-r border-gray-800 p-2 text-right font-semibold">Importe ARS</th>
              <th className="p-2 text-right font-semibold">Importe USD</th>
            </tr>
          </thead>
          <tbody className="text-gray-300">
            {visibles.map((m, i) => (
              <tr
                key={`${m.comprobante}-${i}`}
                className="border-b border-gray-800/60 transition-colors hover:bg-gray-800/60"
              >
                <td className="border-r border-gray-800 p-1.5 text-center">{m.fecha}</td>
                <td className="border-r border-gray-800 p-1.5">{m.comprobante}</td>
                <td className="max-w-[280px] truncate border-r border-gray-800 p-1.5 text-gray-200">
                  {m.detalle}
                </td>
                <td className="border-r border-gray-800 p-1.5 text-center text-cyan-300">{m.cuota}</td>
                <td className="border-r border-gray-800 p-1.5 text-center">
                  <span
                    className={`rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                      m.periodo === 'ACTUAL'
                        ? 'bg-cyan-500/10 text-cyan-400'
                        : 'bg-amber-500/10 text-amber-400'
                    }`}
                  >
                    {m.periodo}
                  </span>
                </td>
                <td className="border-r border-gray-800 p-1.5 text-right tabular-nums">
                  {num(m.importeArs)}
                </td>
                <td className="p-1.5 text-right font-bold tabular-nums text-emerald-400">
                  {num(m.importeUsd)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="sticky bottom-0 border-t border-gray-700 bg-gray-900">
            <tr className="font-bold uppercase text-gray-400">
              <td colSpan="5" className="p-2 text-right text-[9px] tracking-[0.2em]">
                Total {filtro === 'TODOS' ? 'general' : filtro.toLowerCase()}
              </td>
              <td className="border-l border-gray-800 p-2 text-right tabular-nums text-gray-200">
                {num(totales.ars)}
              </td>
              <td className="p-2 text-right tabular-nums text-emerald-400">{num(totales.usd)}</td>
            </tr>
          </tfoot>
        </table>
      ) : (
        <SinDatos mensaje="Sin movimientos para el filtro seleccionado" />
      )}
    </PanelTerminal>
  );
}
