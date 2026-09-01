// ============================================================================
// SISTEMA GM · MÓDULO 2 · EQUIPAMIENTOS (Fase 5)
// ----------------------------------------------------------------------------
// Stock, rotación, alertas de reposición y fichas técnicas listas para
// compartir con el cliente.
// ============================================================================

import React, { useState } from 'react';
import { Loader2, Search, Boxes, Truck, Coins, AlertTriangle } from 'lucide-react';

import { InventarioProvider, useInventario } from '../context/InventarioContext';
import { CATEGORIAS, TIPOS } from '../config/inventario.config';
import KpiTile from '../../../shared/ui/KpiTile';
import { SERIES, usd } from '../../../shared/ui/viz';

import ControlStockRotacion from '../components/ControlStockRotacion';
import CatalogoGrid from '../components/CatalogoGrid';
import AlertasStock from '../components/AlertasStock';
import InformesEquipamiento from '../components/InformesEquipamiento';
import FichaTecnicaModal from '../components/FichaTecnicaModal';

const VISTAS = [
  { id: 'stock', label: 'Stock' },
  { id: 'catalogo', label: 'Catálogo' },
  { id: 'informes', label: 'Informes' },
];

function Consola() {
  const {
    cargando,
    resumen,
    visibles,
    equipos,
    busqueda,
    setBusqueda,
    categorias,
    toggleCategoria,
    tipos,
    toggleTipo,
    soloAlertas,
    setSoloAlertas,
  } = useInventario();

  const [vista, setVista] = useState('stock');
  const [ficha, setFicha] = useState(null);

  if (cargando) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-violet-400" />
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-gray-500">
            Cargando inventario
          </span>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Filtros */}
      <div className="shrink-0 space-y-2 border-b border-gray-800 bg-gray-950/80 px-3 py-2.5 md:px-4">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1">
            {VISTAS.map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => setVista(v.id)}
                className={`rounded-md border px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.12em] transition-colors ${
                  vista === v.id
                    ? 'border-violet-500/50 bg-violet-500/10 text-violet-400'
                    : 'border-gray-800 text-gray-500 hover:text-gray-300'
                }`}
              >
                {v.label}
              </button>
            ))}
          </div>

          <div className="relative min-w-[180px] flex-1">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-600" />
            <input
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar equipo, marca o código…"
              className="w-full rounded-md border border-gray-800 bg-black/50 py-1.5 pl-8 pr-3 text-xs text-gray-200 outline-none transition-colors placeholder:text-gray-700 focus:border-gray-600"
            />
          </div>

          <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-gray-600">
            {visibles.length}/{equipos.length}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {CATEGORIAS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => toggleCategoria(c)}
              className={`rounded-md border px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.12em] transition-all ${
                categorias.includes(c)
                  ? 'border-violet-500/40 bg-violet-500/10 text-violet-400'
                  : 'border-gray-800 text-gray-700 hover:text-gray-500'
              }`}
            >
              {c}
            </button>
          ))}

          <span className="mx-1 hidden h-4 w-px bg-gray-800 sm:block" />

          {TIPOS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => toggleTipo(t)}
              className={`rounded-md border px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.12em] transition-all ${
                tipos.includes(t)
                  ? 'border-gray-600 bg-gray-800/60 text-gray-200'
                  : 'border-gray-800 text-gray-700 hover:text-gray-500'
              }`}
            >
              {t}
            </button>
          ))}

          <button
            type="button"
            onClick={() => setSoloAlertas((v) => !v)}
            className={`ml-auto rounded-md border px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.12em] transition-all ${
              soloAlertas
                ? 'border-rose-500/40 bg-rose-500/10 text-rose-400'
                : 'border-gray-800 text-gray-600 hover:text-gray-400'
            }`}
          >
            Solo con alerta
          </button>
        </div>
      </div>

      {/* Indicadores */}
      <div className="grid shrink-0 grid-cols-2 gap-2 px-3 pt-3 md:grid-cols-4 md:px-4">
        <KpiTile
          label="Unidades en stock"
          valor={resumen.unidades}
          detalle={`${equipos.length} productos activos`}
          acento={SERIES.ingresos}
          icon={Boxes}
        />
        <KpiTile
          label="Valor a costo"
          valor={usd(resumen.valorCosto)}
          detalle={`Venta ${usd(resumen.valorVenta)}`}
          acento={SERIES.neto}
          icon={Coins}
        />
        <KpiTile
          label="En tránsito"
          valor={resumen.enTransito}
          detalle="Unidades por recibir"
          acento={SERIES.impuestos}
          icon={Truck}
        />
        <KpiTile
          label="Alertas de stock"
          valor={resumen.alertas.length}
          detalle="Bajo mínimo o sin stock"
          acento={SERIES.egresos}
          icon={AlertTriangle}
        />
      </div>

      {/* Contenido */}
      <div className="min-h-0 flex-1 overflow-hidden p-3 md:p-4">
        {vista === 'stock' && (
          <div className="grid h-full min-h-0 grid-cols-1 gap-3 lg:grid-cols-[1fr_minmax(280px,30%)]">
            <ControlStockRotacion onVerFicha={setFicha} />
            <div className="min-h-0 overflow-y-auto pr-1">
              <AlertasStock onVerFicha={setFicha} />
            </div>
          </div>
        )}

        {vista === 'catalogo' && (
          <div className="flex h-full min-h-0 flex-col overflow-hidden">
            <CatalogoGrid onVerFicha={setFicha} />
          </div>
        )}

        {vista === 'informes' && (
          <div className="grid h-full min-h-0 grid-cols-1 gap-3 overflow-y-auto lg:grid-cols-2">
            <InformesEquipamiento />
            <AlertasStock onVerFicha={setFicha} />
          </div>
        )}
      </div>

      <FichaTecnicaModal equipo={ficha} onCerrar={() => setFicha(null)} />
    </>
  );
}

export default function InventarioDashboard() {
  return (
    <div className="flex h-screen min-h-screen flex-col bg-gray-950 font-sans">
      <InventarioProvider>
        <Consola />
      </InventarioProvider>
    </div>
  );
}
