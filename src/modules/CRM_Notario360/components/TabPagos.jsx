// ============================================================================
// SISTEMA GM · NOTARIO 360° · PESTAÑA 4 · PAGOS
// ============================================================================

import React from 'react';
import { useCuenta } from '../../../shared/cuentas/CuentaContext';
import PanelTerminal, { SinDatos } from '../../../shared/ui/PanelTerminal';
import { num } from '../../../shared/utils/format';

export default function TabPagos() {
  const { cuenta } = useCuenta();
  if (!cuenta) return null;

  const pagos = cuenta.pagos || [];
  const totalPagado = pagos.reduce((acc, p) => acc + Number(p.importe || 0), 0);
  const impagos = pagos.filter((p) => Number(p.minImpago || 0) > 0).length;

  return (
    <PanelTerminal
      titulo="Pagos mínimos elegidos y pagos efectuados"
      className="h-full"
      acciones={
        <div className="flex items-center gap-3 font-mono text-[9px] uppercase tracking-[0.15em]">
          <span className="text-gray-500">
            Total pagado <b className="text-emerald-400">{num(totalPagado)}</b>
          </span>
          <span className={impagos ? 'text-rose-400' : 'text-gray-600'}>
            {impagos} impago{impagos === 1 ? '' : 's'}
          </span>
        </div>
      }
    >
      {pagos.length ? (
        <table className="w-full border-collapse whitespace-nowrap text-left font-mono text-[10px]">
          <thead className="sticky top-0 z-10 border-b border-gray-800 bg-gray-800/90 shadow-sm">
            <tr className="uppercase text-gray-500">
              <th className="border-r border-gray-800 p-2 font-semibold">Cierre</th>
              <th className="border-r border-gray-800 p-2 font-semibold">Vencimiento</th>
              <th className="border-r border-gray-800 p-2 text-right font-semibold">Mín. elegido</th>
              <th className="border-r border-gray-800 p-2 text-center font-semibold">PL</th>
              <th className="border-r border-gray-800 p-2 text-center font-semibold">PN</th>
              <th className="border-r border-gray-800 p-2 text-right font-semibold">Mín. impago</th>
              <th className="border-r border-gray-800 p-2 text-center font-semibold">Día de pago</th>
              <th className="border-r border-gray-800 p-2 font-semibold">Nº recibo</th>
              <th className="border-r border-gray-800 p-2 text-right font-semibold">Importe</th>
              <th className="p-2 font-semibold">Lugar</th>
            </tr>
          </thead>
          <tbody className="text-gray-300">
            {pagos.map((p, i) => {
              const impago = Number(p.minImpago || 0) > 0;
              return (
                <tr
                  key={`${p.cierre}-${i}`}
                  className={`border-b border-gray-800/60 transition-colors hover:bg-gray-800/60 ${
                    impago ? 'bg-rose-950/20' : ''
                  }`}
                >
                  <td className="border-r border-gray-800 p-1.5 text-center">{p.cierre}</td>
                  <td className="border-r border-gray-800 p-1.5 text-center text-cyan-300">
                    {p.vencimiento}
                  </td>
                  <td className="border-r border-gray-800 p-1.5 text-right font-bold text-cyan-400 tabular-nums">
                    {num(p.minimoElegido)}
                  </td>
                  <td className="border-r border-gray-800 p-1.5 text-center">{p.pl || '—'}</td>
                  <td className="border-r border-gray-800 p-1.5 text-center">{p.pn || '—'}</td>
                  <td
                    className={`border-r border-gray-800 p-1.5 text-right tabular-nums ${
                      impago ? 'font-bold text-rose-400' : 'text-gray-600'
                    }`}
                  >
                    {num(p.minImpago)}
                  </td>
                  <td className="border-r border-gray-800 p-1.5 text-center text-blue-300">
                    {p.diaPago || '—'}
                  </td>
                  <td className="border-r border-gray-800 p-1.5">{p.recibo || '—'}</td>
                  <td className="border-r border-gray-800 p-1.5 text-right font-bold tabular-nums text-emerald-400">
                    {num(p.importe)}
                  </td>
                  <td className="p-1.5 uppercase text-gray-400">{p.lugar || '—'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <SinDatos mensaje="Sin pagos registrados para la cuenta" />
      )}
    </PanelTerminal>
  );
}
