// ============================================================================
// SISTEMA GM · MAPA Y LOGÍSTICA · FILTROS
// ============================================================================

import React from 'react';
import { Search, Route } from 'lucide-react';
import { ESTADOS_CLIENTE, ESPECIALIDADES } from '../config/mapa.config';

export default function FiltrosMapa({
  busqueda,
  setBusqueda,
  estados,
  toggleEstado,
  especialidades,
  toggleEspecialidad,
  mostrarRuta,
  setMostrarRuta,
  totalVisibles,
  totalClientes,
}) {
  return (
    <div className="shrink-0 space-y-2 border-b border-gray-800 bg-gray-950/80 px-3 py-2.5 md:px-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-[200px] flex-1">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-600" />
          <input
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar cliente, clínica o zona…"
            className="w-full rounded-md border border-gray-800 bg-black/50 py-1.5 pl-8 pr-3 text-xs text-gray-200 outline-none transition-colors placeholder:text-gray-700 focus:border-gray-600"
          />
        </div>

        <button
          type="button"
          onClick={() => setMostrarRuta((v) => !v)}
          className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 font-mono text-[9px] font-bold uppercase tracking-[0.12em] transition-colors ${
            mostrarRuta
              ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
              : 'border-gray-800 text-gray-600 hover:text-gray-400'
          }`}
        >
          <Route className="h-3 w-3" />
          Ruta del día
        </button>

        <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-gray-600">
          {totalVisibles}/{totalClientes} en pantalla
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        <span className="mr-1 font-mono text-[9px] uppercase tracking-[0.2em] text-gray-600">
          Estado
        </span>
        {Object.entries(ESTADOS_CLIENTE).map(([id, e]) => {
          const activo = estados.includes(id);
          return (
            <button
              key={id}
              type="button"
              onClick={() => toggleEstado(id)}
              className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.12em] transition-all ${
                activo ? `${e.borde} ${e.clase}` : 'border-gray-800 text-gray-700 hover:text-gray-500'
              }`}
            >
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: e.color }} />
              {e.label}
            </button>
          );
        })}

        <span className="mx-1 hidden h-4 w-px bg-gray-800 sm:block" />

        <span className="mr-1 font-mono text-[9px] uppercase tracking-[0.2em] text-gray-600">
          Rubro
        </span>
        {ESPECIALIDADES.map((esp) => {
          const activo = especialidades.includes(esp);
          return (
            <button
              key={esp}
              type="button"
              onClick={() => toggleEspecialidad(esp)}
              className={`rounded-md border px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.12em] transition-all ${
                activo
                  ? 'border-gray-600 bg-gray-800/60 text-gray-200'
                  : 'border-gray-800 text-gray-700 hover:text-gray-500'
              }`}
            >
              {esp}
            </button>
          );
        })}
      </div>
    </div>
  );
}
