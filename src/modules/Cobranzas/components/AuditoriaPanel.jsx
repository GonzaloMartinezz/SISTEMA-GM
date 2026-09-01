// ============================================================================
// SISTEMA GM · COBRANZAS · AUDITORÍA DE LA CUENTA
// ----------------------------------------------------------------------------
// Historial de llamados · notas grabadas · pagos y movimientos históricos.
// ============================================================================

import React, { useState } from 'react';
import { PhoneCall, StickyNote, Receipt } from 'lucide-react';
import PanelTerminal, { SinDatos } from '../../../shared/ui/PanelTerminal';
import { num } from '../../../shared/utils/format';

const SOLAPAS = [
  { id: 'llamados', label: 'Llamados', icon: PhoneCall },
  { id: 'notas', label: 'Notas', icon: StickyNote },
  { id: 'movimientos', label: 'Pagos y movimientos', icon: Receipt },
];

export default function AuditoriaPanel({ cuenta }) {
  const [solapa, setSolapa] = useState('llamados');
  if (!cuenta) return null;

  const { llamados = [], notas = [] } = cuenta.historial || {};
  const pagos = cuenta.pagos || [];
  const movimientos = cuenta.movimientos || [];

  return (
    <PanelTerminal
      titulo="Auditoría de cobranzas"
      className="min-h-0 flex-1"
      acciones={
        <div className="flex items-center gap-1">
          {SOLAPAS.map((s) => {
            const Icon = s.icon;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setSolapa(s.id)}
                className={`inline-flex items-center gap-1 rounded px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-[0.12em] transition-colors ${
                  solapa === s.id
                    ? 'bg-cyan-500/15 text-cyan-400'
                    : 'text-gray-600 hover:text-gray-300'
                }`}
              >
                <Icon className="h-3 w-3" />
                <span className="hidden sm:inline">{s.label}</span>
              </button>
            );
          })}
        </div>
      }
    >
      {/* -------- Llamados -------- */}
      {solapa === 'llamados' &&
        (llamados.length ? (
          <ul className="divide-y divide-gray-800">
            {llamados.map((ll, i) => (
              <li key={i} className="space-y-1 p-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                    {ll.contacto} · {ll.quienAtiende || 'sin identificar'}
                  </span>
                  <span className="font-mono text-[10px] text-gray-600">{ll.fecha}</span>
                </div>
                <p className="text-xs leading-relaxed text-gray-200">{ll.respuesta}</p>
                {ll.proximoEvento && (
                  <p className="rounded border border-gray-800 bg-gray-950/60 px-2 py-1 font-mono text-[10px] text-amber-400">
                    Próximo: {ll.proximoEvento}
                  </p>
                )}
                <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-gray-700">
                  Op. {ll.operador}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <SinDatos mensaje="Sin llamados registrados" />
        ))}

      {/* -------- Notas -------- */}
      {solapa === 'notas' &&
        (notas.length ? (
          <ul className="divide-y divide-gray-800">
            {notas.map((n, i) => (
              <li key={i} className="space-y-1 p-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-amber-400">
                    {n.tipo}
                  </span>
                  <span className="font-mono text-[10px] text-gray-600">{n.fecha}</span>
                </div>
                <p className="text-xs leading-relaxed text-gray-200">{n.texto}</p>
                <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-gray-700">
                  Op. {n.operador}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <SinDatos mensaje="Sin notas grabadas" />
        ))}

      {/* -------- Pagos y movimientos -------- */}
      {solapa === 'movimientos' && (
        <div className="space-y-4 p-1">
          <div>
            <p className="px-2 py-1.5 font-mono text-[9px] uppercase tracking-[0.2em] text-gray-600">
              Pagos
            </p>
            {pagos.length ? (
              <table className="w-full border-collapse text-left font-mono text-[10px]">
                <thead className="border-y border-gray-800 bg-gray-800/60">
                  <tr className="uppercase text-gray-500">
                    <th className="p-1.5">Vencimiento</th>
                    <th className="p-1.5 text-right">Mínimo</th>
                    <th className="p-1.5 text-center">Pagado el</th>
                    <th className="p-1.5 text-right">Importe</th>
                    <th className="p-1.5">Lugar</th>
                  </tr>
                </thead>
                <tbody className="text-gray-300">
                  {pagos.map((p, i) => {
                    const impago = Number(p.minImpago || 0) > 0;
                    return (
                      <tr
                        key={i}
                        className={`border-b border-gray-800/60 ${impago ? 'bg-rose-950/20' : ''}`}
                      >
                        <td className="p-1.5 text-cyan-300">{p.vencimiento}</td>
                        <td className="p-1.5 text-right tabular-nums">{num(p.minimoElegido)}</td>
                        <td className="p-1.5 text-center">{p.diaPago || '—'}</td>
                        <td
                          className={`p-1.5 text-right font-bold tabular-nums ${impago ? 'text-rose-400' : 'text-emerald-400'}`}
                        >
                          {num(p.importe)}
                        </td>
                        <td className="p-1.5 uppercase text-gray-400">{p.lugar || '—'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <SinDatos mensaje="Sin pagos registrados" />
            )}
          </div>

          <div>
            <p className="px-2 py-1.5 font-mono text-[9px] uppercase tracking-[0.2em] text-gray-600">
              Movimientos
            </p>
            {movimientos.length ? (
              <table className="w-full border-collapse text-left font-mono text-[10px]">
                <thead className="border-y border-gray-800 bg-gray-800/60">
                  <tr className="uppercase text-gray-500">
                    <th className="p-1.5">Fecha</th>
                    <th className="p-1.5">Detalle</th>
                    <th className="p-1.5 text-center">Cuota</th>
                    <th className="p-1.5 text-center">Período</th>
                    <th className="p-1.5 text-right">USD</th>
                  </tr>
                </thead>
                <tbody className="text-gray-300">
                  {movimientos.map((m, i) => (
                    <tr key={i} className="border-b border-gray-800/60">
                      <td className="p-1.5">{m.fecha}</td>
                      <td className="max-w-[220px] truncate p-1.5 text-gray-200">{m.detalle}</td>
                      <td className="p-1.5 text-center text-cyan-300">{m.cuota}</td>
                      <td className="p-1.5 text-center">
                        <span
                          className={`rounded px-1.5 py-0.5 text-[9px] font-bold uppercase ${
                            m.periodo === 'ACTUAL'
                              ? 'bg-cyan-500/10 text-cyan-400'
                              : 'bg-amber-500/10 text-amber-400'
                          }`}
                        >
                          {m.periodo}
                        </span>
                      </td>
                      <td className="p-1.5 text-right font-bold tabular-nums text-emerald-400">
                        {num(m.importeUsd)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <SinDatos mensaje="Sin movimientos registrados" />
            )}
          </div>
        </div>
      )}
    </PanelTerminal>
  );
}
