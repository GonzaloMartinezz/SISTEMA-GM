// ============================================================================
// SISTEMA GM · TESORERÍA · CONTROL DE EGRESOS
// ----------------------------------------------------------------------------
// Gastos semanales y mensuales operativos, con su equivalente mensualizado.
// ============================================================================

import React, { useMemo, useState } from 'react';
import PanelTerminal, { SinDatos } from '../../../shared/ui/PanelTerminal';
import { SERIES, usd } from '../../../shared/ui/viz';
import { useTesoreria } from '../context/TesoreriaContext';

const FILTROS = [
  { id: 'todos', label: 'Todos' },
  { id: 'semanal', label: 'Semanales' },
  { id: 'mensual', label: 'Mensuales' },
];

export default function PanelEgresos() {
  const { datos } = useTesoreria();
  const [filtro, setFiltro] = useState('todos');

  const visibles = useMemo(() => {
    if (!datos) return [];
    return filtro === 'todos'
      ? datos.gastos
      : datos.gastos.filter((g) => g.periodicidad === filtro);
  }, [datos, filtro]);

  if (!datos) return null;

  const mensualizado = (g) => (g.periodicidad === 'semanal' ? g.montoUsd * 4.33 : g.montoUsd);
  const totalMensualizado = visibles.reduce((a, g) => a + mensualizado(g), 0);

  return (
    <PanelTerminal
      titulo="Control de egresos"
      acento="ambar"
      className="min-h-[240px] flex-1"
      acciones={
        <div className="flex items-center gap-1">
          {FILTROS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFiltro(f.id)}
              className={`rounded px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-[0.12em] transition-colors ${
                filtro === f.id ? 'bg-amber-500/15 text-amber-400' : 'text-gray-600 hover:text-gray-300'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      }
    >
      {visibles.length ? (
        <>
          <table className="w-full border-collapse text-left font-mono text-[10px]">
            <thead className="sticky top-0 border-b border-gray-800 bg-gray-800/80">
              <tr className="uppercase text-gray-500">
                <th className="p-2">Concepto</th>
                <th className="p-2">Categoría</th>
                <th className="p-2 text-center">Periodicidad</th>
                <th className="p-2 text-right">Monto</th>
                <th className="p-2 text-right">Mensualizado</th>
              </tr>
            </thead>
            <tbody className="text-gray-300">
              {visibles.map((g) => (
                <tr key={g.id} className="border-b border-gray-800/60 hover:bg-gray-800/50">
                  <td className="p-2 text-gray-200">{g.concepto}</td>
                  <td className="p-2 text-gray-500">{g.categoria}</td>
                  <td className="p-2 text-center">
                    <span
                      className={`rounded px-1.5 py-0.5 text-[9px] font-bold uppercase ${
                        g.periodicidad === 'semanal'
                          ? 'bg-orange-500/10 text-orange-400'
                          : 'bg-gray-700/40 text-gray-400'
                      }`}
                    >
                      {g.periodicidad}
                    </span>
                  </td>
                  <td className="p-2 text-right tabular-nums">{usd(g.montoUsd)}</td>
                  <td className="p-2 text-right font-bold tabular-nums text-gray-100">
                    {usd(mensualizado(g))}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="sticky bottom-0 border-t border-gray-700 bg-gray-900">
              <tr>
                <td colSpan="4" className="p-2 text-right text-[9px] uppercase tracking-[0.2em] text-gray-500">
                  Egreso mensual equivalente
                </td>
                <td
                  className="p-2 text-right font-bold tabular-nums"
                  style={{ color: SERIES.egresos }}
                >
                  {usd(totalMensualizado)}
                </td>
              </tr>
            </tfoot>
          </table>
        </>
      ) : (
        <SinDatos mensaje="Sin gastos en esta periodicidad" />
      )}
    </PanelTerminal>
  );
}
