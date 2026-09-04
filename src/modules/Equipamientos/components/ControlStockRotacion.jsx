// ============================================================================
// SISTEMA GM · EQUIPAMIENTOS · STOCK Y ROTACIÓN
// ----------------------------------------------------------------------------
// Unidades disponibles y en tránsito, con la rotación real de cada producto.
// ============================================================================

import React from 'react';
import { FileText } from 'lucide-react';
import { AccionesFila } from '../../../shared/abm/AccionesFila';
import PanelTerminal, { SinDatos } from '../../../shared/ui/PanelTerminal';
import { usd, pct } from '../../../shared/ui/viz';
import { getEstadoStock } from '../config/inventario.config';
import { useInventario } from '../context/InventarioContext';

export default function ControlStockRotacion({ onVerFicha, onEditar, onEliminar }) {
  const { visibles } = useInventario();

  return (
    <PanelTerminal titulo="Stock de equipamiento" className="min-h-0 flex-1">
      {visibles.length ? (
        <table className="w-full border-collapse whitespace-nowrap text-left font-mono text-[10px]">
          <thead className="sticky top-0 z-10 border-b border-gray-800 bg-gray-800/90">
            <tr className="uppercase text-gray-500">
              <th className="p-2">Equipo</th>
              <th className="p-2">Rubro</th>
              <th className="p-2 text-center">Stock</th>
              <th className="p-2 text-center">Tránsito</th>
              <th className="p-2 text-center">Meses</th>
              <th className="p-2 text-right">Costo</th>
              <th className="p-2 text-right">Venta</th>
              <th className="p-2 text-right">Margen</th>
              <th className="p-2 text-center">Estado</th>
              <th className="p-2 text-center">Ficha</th>
              <th className="p-2 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="text-gray-300">
            {visibles.map((e) => {
              const estado = getEstadoStock(e.estadoStock);
              return (
                <tr key={e.id} className="border-b border-gray-800/60 hover:bg-gray-800/50">
                  <td className="p-2">
                    <span className="block max-w-[220px] truncate text-[11px] font-semibold text-gray-100">
                      {e.nombre}
                    </span>
                    <span className="text-[9px] uppercase tracking-wider text-gray-600">
                      {e.marca} {e.modelo} · {e.id}
                    </span>
                  </td>
                  <td className="p-2 text-gray-500">{e.categoria}</td>
                  <td className="p-2 text-center font-bold tabular-nums text-gray-100">{e.stock}</td>
                  <td className="p-2 text-center tabular-nums text-sky-400">{e.transito || '—'}</td>
                  <td className="p-2 text-center tabular-nums text-gray-400">
                    {Number.isFinite(e.mesesDeStock) ? e.mesesDeStock.toFixed(1) : '∞'}
                  </td>
                  <td className="p-2 text-right tabular-nums text-gray-500">{usd(e.costoUsd)}</td>
                  <td className="p-2 text-right tabular-nums text-gray-100">{usd(e.precioUsd)}</td>
                  <td className="p-2 text-right tabular-nums font-bold text-emerald-400">
                    {pct(e.margenPct, 0)}
                  </td>
                  <td className="p-2 text-center">
                    <span
                      className={`rounded border px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${estado.borde} ${estado.clase}`}
                    >
                      {estado.label}
                    </span>
                  </td>
                  <td className="p-2 text-center">
                    <button
                      type="button"
                      onClick={() => onVerFicha(e)}
                      className="inline-flex items-center gap-1 rounded border border-gray-700 px-2 py-1 text-[9px] uppercase tracking-wider text-gray-400 transition-colors hover:border-violet-500/50 hover:text-violet-400"
                    >
                      <FileText className="h-3 w-3" />
                      Ver
                    </button>
                  </td>
                  <td className="p-2 text-center">
                    <AccionesFila
                      compacto
                      onEditar={onEditar ? () => onEditar(e) : null}
                      onEliminar={onEliminar ? () => onEliminar(e) : null}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <SinDatos mensaje="Ningún equipo coincide con los filtros" />
      )}
    </PanelTerminal>
  );
}
