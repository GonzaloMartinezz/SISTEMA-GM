// ============================================================================
// SISTEMA GM · EQUIPAMIENTOS · CATÁLOGO
// ----------------------------------------------------------------------------
// Vista de tarjetas para mostrarle el equipo al cliente en el momento.
// ============================================================================

import React from 'react';
import { Package, Truck, FileText } from 'lucide-react';
import PanelTerminal, { SinDatos } from '../../../shared/ui/PanelTerminal';
import { usd, pct } from '../../../shared/ui/viz';
import { getEstadoStock } from '../config/inventario.config';
import { useInventario } from '../context/InventarioContext';

export default function CatalogoGrid({ onVerFicha }) {
  const { visibles } = useInventario();

  return (
    <PanelTerminal titulo="Catálogo técnico" acento="cyan" className="min-h-0 flex-1">
      {visibles.length ? (
        <div className="grid gap-2.5 p-2.5 sm:grid-cols-2 xl:grid-cols-3">
          {visibles.map((e) => {
            const estado = getEstadoStock(e.estadoStock);
            return (
              <article
                key={e.id}
                className="group flex flex-col rounded-lg border border-gray-800 bg-gray-900/70 p-3 transition-colors hover:border-gray-600"
              >
                <div className="mb-2 flex items-start justify-between gap-2">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-gray-800 bg-black/40">
                    <Package className="h-4 w-4 text-violet-400" />
                  </span>
                  <span
                    className={`rounded border px-1.5 py-0.5 font-mono text-[8px] font-bold uppercase tracking-widest ${estado.borde} ${estado.clase}`}
                  >
                    {estado.label}
                  </span>
                </div>

                <h4 className="text-xs font-bold leading-tight text-gray-100">{e.nombre}</h4>
                <p className="mt-0.5 font-mono text-[9px] uppercase tracking-wider text-gray-600">
                  {e.marca} {e.modelo} · {e.tipo}
                </p>

                <div className="mt-2.5 flex items-end justify-between">
                  <div>
                    <p className="font-mono text-sm font-bold text-gray-100">{usd(e.precioUsd)}</p>
                    <p className="font-mono text-[9px] uppercase tracking-wider text-emerald-400">
                      Margen {pct(e.margenPct, 0)}
                    </p>
                  </div>
                  <div className="text-right font-mono text-[9px] uppercase tracking-wider text-gray-600">
                    <p>Stock {e.stock}</p>
                    {e.transito > 0 && (
                      <p className="inline-flex items-center gap-1 text-sky-400">
                        <Truck className="h-2.5 w-2.5" />
                        {e.transito}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onVerFicha(e)}
                  className="mt-3 inline-flex items-center justify-center gap-1.5 rounded border border-gray-700 py-1.5 font-mono text-[9px] font-bold uppercase tracking-widest text-gray-400 transition-colors hover:border-violet-500/50 hover:text-violet-400"
                >
                  <FileText className="h-3 w-3" />
                  Ficha técnica
                </button>
              </article>
            );
          })}
        </div>
      ) : (
        <SinDatos mensaje="Ningún equipo coincide con los filtros" />
      )}
    </PanelTerminal>
  );
}
