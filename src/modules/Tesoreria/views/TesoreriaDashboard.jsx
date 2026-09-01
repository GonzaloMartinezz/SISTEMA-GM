// ============================================================================
// SISTEMA GM · MÓDULO 3 · TESORERÍA, FINANZAS Y CONTABILIDAD (Fase 5)
// ----------------------------------------------------------------------------
// Panel bimonetario USD / ARS: ingresos, egresos, ROI, proyecciones, flujo de
// caja, impuestos y simulador de rentabilidad.
// ============================================================================

import React, { useState } from 'react';
import { Loader2, Wallet, TrendingUp, Target, Coins } from 'lucide-react';

import { TesoreriaProvider, useTesoreria } from '../context/TesoreriaContext';
import KpiTile from '../../../shared/ui/KpiTile';
import { SERIES, usd, pct } from '../../../shared/ui/viz';

import PanelIngresos from '../components/PanelIngresos';
import PanelEgresos from '../components/PanelEgresos';
import PanelFlujoCaja from '../components/PanelFlujoCaja';
import PanelProyecciones from '../components/PanelProyecciones';
import SimuladorRentabilidad from '../components/SimuladorRentabilidad';
import PanelImpuestos from '../components/PanelImpuestos';

const VISTAS = [
  { id: 'resumen', label: 'Resumen' },
  { id: 'ingresos', label: 'Ingresos y egresos' },
  { id: 'proyeccion', label: 'Proyecciones' },
  { id: 'fiscal', label: 'Impuestos y capital' },
];

function Consola() {
  const { datos, cargando, params, setParams } = useTesoreria();
  const [vista, setVista] = useState('resumen');
  const [moneda, setMoneda] = useState('USD');

  if (cargando || !datos) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-amber-400" />
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-gray-500">
            Liquidando período
          </span>
        </div>
      </div>
    );
  }

  const { ultimo, meses, roiPct, egresoMensualTotal, capital, params: p } = datos;
  const anterior = meses[meses.length - 2];
  const variacionIngresos = anterior
    ? ((ultimo.ingresosUsd - anterior.ingresosUsd) / anterior.ingresosUsd) * 100
    : 0;

  const enMoneda = (v) => (moneda === 'USD' ? usd(v) : `$ ${Math.round(v * p.tipoCambio).toLocaleString('es-AR')}`);

  return (
    <>
      {/* Barra de control */}
      <div className="flex shrink-0 flex-wrap items-center gap-2 border-b border-gray-800 bg-gray-950/80 px-3 py-2.5 md:px-4">
        <div className="flex items-center gap-1">
          {VISTAS.map((v) => (
            <button
              key={v.id}
              type="button"
              onClick={() => setVista(v.id)}
              className={`rounded-md border px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.12em] transition-colors ${
                vista === v.id
                  ? 'border-amber-500/50 bg-amber-500/10 text-amber-400'
                  : 'border-gray-800 text-gray-500 hover:text-gray-300'
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-2">
          <div className="flex items-center overflow-hidden rounded-md border border-gray-800">
            {['USD', 'ARS'].map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMoneda(m)}
                className={`px-2.5 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.12em] transition-colors ${
                  moneda === m ? 'bg-gray-800 text-gray-100' : 'text-gray-600 hover:text-gray-400'
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          <label className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.15em] text-gray-600">
            TC
            <input
              type="number"
              value={p.tipoCambio}
              onChange={(e) =>
                setParams({ ...params, tipoCambio: Number(e.target.value) || 1 })
              }
              className="w-20 rounded border border-gray-800 bg-black/50 px-2 py-1 text-right font-mono text-[10px] text-gray-300 outline-none focus:border-amber-500/50"
            />
          </label>
        </div>
      </div>

      {/* Indicadores */}
      <div className="grid shrink-0 grid-cols-2 gap-2 px-3 pt-3 md:grid-cols-4 md:px-4">
        <KpiTile
          label="Ingreso del mes"
          valor={enMoneda(ultimo.ingresosUsd)}
          detalle={`Fijo + comisión ${p.comisionPct}%`}
          variacion={variacionIngresos}
          acento={SERIES.ingresos}
          icon={Wallet}
        />
        <KpiTile
          label="Egreso mensualizado"
          valor={enMoneda(egresoMensualTotal)}
          detalle="Semanales × 4,33 + mensuales"
          acento={SERIES.egresos}
          icon={Coins}
        />
        <KpiTile
          label="Resultado del mes"
          valor={enMoneda(ultimo.resultadoUsd)}
          detalle={`Margen bruto ${pct(ultimo.margenPct)}`}
          acento={SERIES.neto}
          icon={TrendingUp}
        />
        <KpiTile
          label="ROI acumulado"
          valor={pct(roiPct)}
          detalle={`Sobre ${usd(capital.inversionInicialUsd)} invertidos`}
          acento={SERIES.impuestos}
          icon={Target}
        />
      </div>

      {/* Paneles */}
      <div className="min-h-0 flex-1 overflow-y-auto p-3 md:p-4">
        {vista === 'resumen' && (
          <div className="grid gap-3 lg:grid-cols-2">
            <PanelFlujoCaja />
            <PanelProyecciones />
            <PanelIngresos />
            <SimuladorRentabilidad />
          </div>
        )}

        {vista === 'ingresos' && (
          <div className="grid gap-3 lg:grid-cols-2">
            <PanelIngresos />
            <PanelEgresos />
          </div>
        )}

        {vista === 'proyeccion' && (
          <div className="grid gap-3 lg:grid-cols-2">
            <PanelProyecciones />
            <PanelFlujoCaja />
          </div>
        )}

        {vista === 'fiscal' && (
          <div className="grid gap-3 lg:grid-cols-2">
            <PanelImpuestos />
            <SimuladorRentabilidad />
          </div>
        )}
      </div>
    </>
  );
}

export default function TesoreriaDashboard() {
  return (
    <div className="flex h-screen min-h-screen flex-col bg-gray-950 font-sans">
      <TesoreriaProvider>
        <Consola />
      </TesoreriaProvider>
    </div>
  );
}
