// ============================================================================
// SISTEMA GM · AGENDA INTELIGENTE · RUTA DEL DÍA
// ----------------------------------------------------------------------------
// Cruza los horarios de la agenda con las ubicaciones y propone el orden más
// eficiente de visitas.
// ============================================================================

import React, { useMemo } from 'react';
import { Navigation, Route as RouteIcon, TrendingDown } from 'lucide-react';
import PanelTerminal, { SinDatos } from '../../../shared/ui/PanelTerminal';
import { BASE_OPERATIVA } from '../../../shared/agenda/agendaDemo';
import {
  optimizarRuta,
  rutaCronologica,
  linkGoogleMapsRuta,
  minutosDeViaje,
} from '../../../shared/geo/ruteo';
import { useAgenda } from '../context/AgendaContext';

export default function PanelMapaRutas() {
  const { delDia } = useAgenda();

  const visitas = useMemo(
    () => delDia.filter((e) => e.tipo === 'visita' && e.estado !== 'cancelado'),
    [delDia]
  );

  const optimizada = useMemo(() => optimizarRuta(BASE_OPERATIVA, visitas), [visitas]);
  const cronologica = useMemo(() => rutaCronologica(BASE_OPERATIVA, visitas), [visitas]);
  const ahorro = cronologica.totalKm - optimizada.totalKm;

  return (
    <PanelTerminal
      titulo="Ruta optimizada del día"
      acento="verde"
      className="min-h-[220px]"
      acciones={
        visitas.length ? (
          <a
            href={linkGoogleMapsRuta(BASE_OPERATIVA, optimizada.orden)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 font-mono text-[9px] uppercase tracking-[0.15em] text-gray-500 transition-colors hover:text-emerald-400"
          >
            <Navigation className="h-3 w-3" />
            Abrir en Maps
          </a>
        ) : null
      }
    >
      {visitas.length ? (
        <>
          {/* Resumen */}
          <div className="grid grid-cols-3 divide-x divide-gray-800 border-b border-gray-800">
            <div className="p-2.5 text-center">
              <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-gray-600">
                Paradas
              </p>
              <p className="font-mono text-sm font-bold text-gray-200">{visitas.length}</p>
            </div>
            <div className="p-2.5 text-center">
              <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-gray-600">
                Distancia
              </p>
              <p className="font-mono text-sm font-bold text-emerald-400">
                {optimizada.totalKm.toFixed(1)} km
              </p>
            </div>
            <div className="p-2.5 text-center">
              <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-gray-600">
                Manejo
              </p>
              <p className="font-mono text-sm font-bold text-gray-200">
                {minutosDeViaje(optimizada.totalKm)}′
              </p>
            </div>
          </div>

          {ahorro > 0.3 && (
            <div className="flex items-center gap-2 border-b border-gray-800 bg-emerald-950/20 px-3 py-1.5">
              <TrendingDown className="h-3 w-3 shrink-0 text-emerald-400" />
              <p className="font-mono text-[10px] text-emerald-400">
                Reordenando las visitas ahorrás {ahorro.toFixed(1)} km (
                {minutosDeViaje(ahorro)}′)
              </p>
            </div>
          )}

          {/* Orden propuesto */}
          <ol className="divide-y divide-gray-800">
            <li className="flex items-center gap-2.5 px-3 py-2">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-gray-700 font-mono text-[9px] text-gray-500">
                0
              </span>
              <span className="font-mono text-[10px] uppercase tracking-wider text-gray-500">
                {BASE_OPERATIVA.nombre}
              </span>
            </li>

            {optimizada.orden.map((p, i) => (
              <li key={p.id} className="flex items-start gap-2.5 px-3 py-2">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-emerald-500/40 bg-emerald-500/10 font-mono text-[9px] font-bold text-emerald-400">
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-gray-200">{p.cliente}</p>
                  <p className="truncate font-mono text-[10px] text-gray-600">{p.direccion}</p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="font-mono text-[10px] font-bold text-gray-300">
                    {p.distancia.toFixed(1)} km
                  </p>
                  <p className="font-mono text-[9px] text-gray-600">{p.hora}</p>
                </div>
              </li>
            ))}
          </ol>
        </>
      ) : (
        <SinDatos mensaje="No hay visitas para rutear en este día" />
      )}
    </PanelTerminal>
  );
}
