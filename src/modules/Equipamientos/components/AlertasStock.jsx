// ============================================================================
// SISTEMA GM · EQUIPAMIENTOS · ALERTAS DE REPOSICIÓN
// ============================================================================

import React from 'react';
import { AlertTriangle, PackageX, Truck } from 'lucide-react';
import PanelTerminal, { SinDatos } from '../../../shared/ui/PanelTerminal';
import { useInventario } from '../context/InventarioContext';

export default function AlertasStock({ onVerFicha }) {
  const { resumen } = useInventario();
  const alertas = resumen.alertas || [];

  return (
    <PanelTerminal
      titulo="Alertas de reposición"
      acento={alertas.length ? 'rojo' : 'verde'}
      className="min-h-[200px]"
      acciones={
        <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-gray-600">
          {resumen.enTransito} unidades en tránsito
        </span>
      }
    >
      {alertas.length ? (
        <ul className="divide-y divide-gray-800">
          {alertas.map((e) => {
            const sinStock = e.estadoStock === 'sin-stock';
            const Icono = sinStock ? PackageX : AlertTriangle;
            return (
              <li key={e.id} className="flex items-start gap-2.5 p-3">
                <span
                  className={`mt-0.5 rounded border p-1 ${sinStock ? 'border-rose-500/40 text-rose-400' : 'border-amber-500/40 text-amber-400'}`}
                >
                  <Icono className="h-3 w-3" />
                </span>

                <div className="min-w-0 flex-1">
                  <button
                    type="button"
                    onClick={() => onVerFicha(e)}
                    className="block truncate text-left text-xs font-semibold text-gray-200 transition-colors hover:text-violet-400"
                  >
                    {e.nombre}
                  </button>
                  <p className="mt-0.5 font-mono text-[10px] text-gray-600">
                    Stock {e.stock} · mínimo {e.minStock} · vende {e.rotacionMensual.toFixed(1)}/mes
                  </p>
                  {e.transito > 0 && (
                    <p className="mt-1 inline-flex items-center gap-1 rounded border border-sky-500/30 bg-sky-500/10 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-sky-400">
                      <Truck className="h-2.5 w-2.5" />
                      {e.transito} en camino
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <SinDatos mensaje="Todo el stock está por encima del mínimo" />
      )}
    </PanelTerminal>
  );
}
