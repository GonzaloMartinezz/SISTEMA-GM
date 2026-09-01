// ============================================================================
// SISTEMA GM · TESORERÍA · SIMULADOR DE RENTABILIDAD
// ----------------------------------------------------------------------------
// Cuánto margen queda si se aplica un descuento especial a un cliente.
// ============================================================================

import React, { useMemo, useState } from 'react';
import { Calculator } from 'lucide-react';
import PanelTerminal from '../../../shared/ui/PanelTerminal';
import { simularOperacion } from '../../../shared/finanzas/finanzasService';
import { SERIES, ESTADO, usd, pct } from '../../../shared/ui/viz';
import { useTesoreria } from '../context/TesoreriaContext';

export default function SimuladorRentabilidad() {
  const { datos } = useTesoreria();
  const [form, setForm] = useState({
    precioUsd: 15900,
    costoUsd: 10400,
    logisticaUsd: 320,
    descuentoPct: 10,
  });

  const comisionPct = datos?.params?.comisionPct ?? 8;

  const resultado = useMemo(
    () => simularOperacion({ ...form, comisionPct }),
    [form, comisionPct]
  );

  const set = (campo) => (e) =>
    setForm((f) => ({ ...f, [campo]: Number(e.target.value) || 0 }));

  const tono =
    resultado.margenPct >= 25
      ? ESTADO.bien
      : resultado.margenPct >= 12
        ? ESTADO.atencion
        : ESTADO.grave;

  const inputCls =
    'w-full rounded border border-gray-700 bg-black/60 px-2.5 py-1.5 text-right font-mono text-xs text-gray-200 outline-none transition-colors focus:border-cyan-500/60';
  const labelCls =
    'mb-1 block font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-gray-500';

  return (
    <PanelTerminal titulo="Simulador de rentabilidad" acento="cyan" className="min-h-[240px]">
      <div className="space-y-3 p-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>Precio de lista (USD)</label>
            <input type="number" className={inputCls} value={form.precioUsd} onChange={set('precioUsd')} />
          </div>
          <div>
            <label className={labelCls}>Costo de mercadería</label>
            <input type="number" className={inputCls} value={form.costoUsd} onChange={set('costoUsd')} />
          </div>
          <div>
            <label className={labelCls}>Logística</label>
            <input type="number" className={inputCls} value={form.logisticaUsd} onChange={set('logisticaUsd')} />
          </div>
          <div>
            <label className={labelCls}>Descuento (%)</label>
            <input
              type="number"
              min="0"
              max="60"
              className={inputCls}
              value={form.descuentoPct}
              onChange={set('descuentoPct')}
            />
          </div>
        </div>

        {/* Deslizador de descuento */}
        <div>
          <input
            type="range"
            min="0"
            max="40"
            step="1"
            value={form.descuentoPct}
            onChange={set('descuentoPct')}
            className="w-full accent-cyan-400"
          />
          <div className="flex justify-between font-mono text-[9px] uppercase tracking-wider text-gray-700">
            <span>0%</span>
            <span>20%</span>
            <span>40%</span>
          </div>
        </div>

        {/* Resultado */}
        <div className="rounded border border-gray-800 bg-black/50 p-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.18em] text-gray-500">
              <Calculator className="h-3 w-3" />
              Margen neto de la operación
            </span>
            <span className="font-mono text-lg font-bold tabular-nums" style={{ color: tono }}>
              {usd(resultado.margenNetoUsd)}
            </span>
          </div>

          <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-800">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${Math.max(0, Math.min(100, resultado.margenPct * 2))}%`,
                background: tono,
              }}
            />
          </div>

          <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 font-mono text-[10px]">
            <dt className="text-gray-600">Precio final</dt>
            <dd className="text-right text-gray-200">{usd(resultado.precioFinal)}</dd>
            <dt className="text-gray-600">Comisión ({comisionPct}%)</dt>
            <dd className="text-right" style={{ color: SERIES.egresos }}>
              −{usd(resultado.comisionUsd)}
            </dd>
            <dt className="text-gray-600">Margen sobre venta</dt>
            <dd className="text-right text-gray-200">{pct(resultado.margenPct)}</dd>
            <dt className="text-gray-600">Markup sobre costo</dt>
            <dd className="text-right text-gray-200">{pct(resultado.markupPct)}</dd>
          </dl>
        </div>
      </div>
    </PanelTerminal>
  );
}
