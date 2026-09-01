// ============================================================================
// SISTEMA GM · SEGUIMIENTOS · BARRA DE FILTROS Y MÉTRICAS
// ============================================================================

import React from 'react';
import { Search, Flame, Snowflake, Target, DollarSign } from 'lucide-react';
import { ETAPAS } from '../config/pipeline.config';
import { usePipeline } from '../context/PipelineContext';

function Metrica({ icon: Icon, label, valor, color = 'text-gray-200' }) {
  return (
    <div className="flex items-center gap-2 rounded-md border border-gray-800 bg-gray-900/60 px-2.5 py-1.5">
      <Icon className="h-3.5 w-3.5 shrink-0 text-gray-600" />
      <div className="leading-tight">
        <p className="font-mono text-[8px] uppercase tracking-[0.18em] text-gray-600">{label}</p>
        <p className={`font-mono text-xs font-bold tabular-nums ${color}`}>{valor}</p>
      </div>
    </div>
  );
}

export default function PipelineToolbar() {
  const {
    busqueda,
    setBusqueda,
    etapasVisibles,
    toggleEtapa,
    soloPrioridadAlta,
    setSoloPrioridadAlta,
    metricas,
  } = usePipeline();

  return (
    <div className="shrink-0 space-y-2 border-b border-gray-800 bg-gray-950/80 px-3 py-2.5 md:px-4">
      {/* Fila 1 · búsqueda y métricas */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-[200px] flex-1">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-600" />
          <input
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por titular, clínica, equipo o zona…"
            className="w-full rounded-md border border-gray-800 bg-black/50 py-1.5 pl-8 pr-3 text-xs text-gray-200 outline-none transition-colors placeholder:text-gray-700 focus:border-gray-600"
          />
        </div>

        <Metrica icon={Target} label="Leads" valor={metricas.total} />
        <Metrica
          icon={DollarSign}
          label="Valor cartera"
          valor={`US$ ${Math.round(metricas.valor).toLocaleString('es-AR')}`}
          color="text-cyan-400"
        />
        <Metrica
          icon={Flame}
          label="Ponderado"
          valor={`US$ ${Math.round(metricas.ponderado).toLocaleString('es-AR')}`}
          color="text-emerald-400"
        />
        <Metrica
          icon={Snowflake}
          label="+7 días sin contacto"
          valor={metricas.frios}
          color={metricas.frios ? 'text-rose-400' : 'text-gray-500'}
        />
      </div>

      {/* Fila 2 · filtros de nivel de proceso */}
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="mr-1 font-mono text-[9px] uppercase tracking-[0.2em] text-gray-600">
          Nivel de proceso
        </span>

        {ETAPAS.map((etapa) => {
          const activa = etapasVisibles.includes(etapa.id);
          return (
            <button
              key={etapa.id}
              type="button"
              onClick={() => toggleEtapa(etapa.id)}
              className={`rounded-md border px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.12em] transition-all ${
                activa
                  ? `${etapa.borde} ${etapa.fondo} ${etapa.color}`
                  : 'border-gray-800 text-gray-700 hover:text-gray-500'
              }`}
            >
              {etapa.label}
            </button>
          );
        })}

        <span className="mx-1 hidden h-4 w-px bg-gray-800 sm:block" />

        <button
          type="button"
          onClick={() => setSoloPrioridadAlta((v) => !v)}
          className={`rounded-md border px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.12em] transition-all ${
            soloPrioridadAlta
              ? 'border-rose-500/40 bg-rose-500/10 text-rose-400'
              : 'border-gray-800 text-gray-600 hover:text-gray-400'
          }`}
        >
          Solo prioridad alta
        </button>

        <span className="ml-auto hidden font-mono text-[9px] uppercase tracking-[0.18em] text-gray-700 lg:inline">
          Arrastrá una tarjeta para cambiarla de etapa
        </span>
      </div>
    </div>
  );
}
