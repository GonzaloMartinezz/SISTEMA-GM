// ============================================================================
// SISTEMA GM · MAPA Y LOGÍSTICA · PANEL DE RUTEO Y FICHA DEL PIN
// ============================================================================

import React from 'react';
import { Navigation, MapPin, Phone, ScanFace, TrendingDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PanelTerminal, { SinDatos } from '../../../shared/ui/PanelTerminal';
import { BASE_OPERATIVA } from '../../../shared/agenda/agendaDemo';
import { linkGoogleMapsRuta, minutosDeViaje } from '../../../shared/geo/ruteo';
import { getEstadoCliente } from '../config/mapa.config';

export default function PanelRuta({ ruta, ahorro, seleccionado }) {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-0 flex-col gap-3">
      {/* Ficha del marcador seleccionado */}
      <PanelTerminal titulo="Cliente seleccionado">
        {seleccionado ? (
          <div className="space-y-2 p-3">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-white">{seleccionado.nombre}</p>
                <p className="truncate font-mono text-[10px] uppercase tracking-wider text-gray-500">
                  {seleccionado.clinica}
                </p>
              </div>
              <span
                className={`shrink-0 rounded border px-1.5 py-0.5 font-mono text-[8px] font-bold uppercase tracking-widest ${getEstadoCliente(seleccionado.estado).borde} ${getEstadoCliente(seleccionado.estado).clase}`}
              >
                {getEstadoCliente(seleccionado.estado).label}
              </span>
            </div>

            <p className="flex items-center gap-1.5 font-mono text-[10px] text-gray-500">
              <MapPin className="h-3 w-3 text-gray-600" />
              {seleccionado.zona} · {seleccionado.especialidad}
            </p>

            <div className="flex gap-1.5 pt-1">
              <a
                href={`https://www.google.com/maps/dir/?api=1&origin=${BASE_OPERATIVA.lat},${BASE_OPERATIVA.lng}&destination=${seleccionado.lat},${seleccionado.lng}&travelmode=driving`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex flex-1 items-center justify-center gap-1.5 rounded border border-emerald-600/40 bg-emerald-500/10 py-1.5 font-mono text-[9px] font-bold uppercase tracking-widest text-emerald-400 transition-colors hover:bg-emerald-500/20"
              >
                <Navigation className="h-3 w-3" />
                Cómo llegar
              </a>

              {String(seleccionado.id).startsWith('CTA-') && (
                <button
                  type="button"
                  onClick={() => navigate(`/notario-360/ficha/${seleccionado.id}`)}
                  className="inline-flex items-center justify-center gap-1.5 rounded border border-gray-700 px-2.5 py-1.5 font-mono text-[9px] font-bold uppercase tracking-widest text-gray-400 transition-colors hover:border-cyan-500/50 hover:text-cyan-400"
                >
                  <ScanFace className="h-3 w-3" />
                  Ficha
                </button>
              )}
            </div>
          </div>
        ) : (
          <SinDatos mensaje="Tocá un marcador del mapa" />
        )}
      </PanelTerminal>

      {/* Ruteo automático */}
      <PanelTerminal
        titulo="Ruteo automático"
        acento="verde"
        className="min-h-0 flex-1"
        acciones={
          ruta.orden.length ? (
            <a
              href={linkGoogleMapsRuta(BASE_OPERATIVA, ruta.orden)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 font-mono text-[9px] uppercase tracking-[0.15em] text-gray-500 transition-colors hover:text-emerald-400"
            >
              <Navigation className="h-3 w-3" />
              Navegar
            </a>
          ) : null
        }
      >
        {ruta.orden.length ? (
          <>
            <div className="grid grid-cols-3 divide-x divide-gray-800 border-b border-gray-800">
              <div className="p-2 text-center">
                <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-gray-600">
                  Paradas
                </p>
                <p className="font-mono text-sm font-bold text-gray-200">{ruta.orden.length}</p>
              </div>
              <div className="p-2 text-center">
                <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-gray-600">Km</p>
                <p className="font-mono text-sm font-bold text-emerald-400">
                  {ruta.totalKm.toFixed(1)}
                </p>
              </div>
              <div className="p-2 text-center">
                <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-gray-600">
                  Manejo
                </p>
                <p className="font-mono text-sm font-bold text-gray-200">
                  {minutosDeViaje(ruta.totalKm)}′
                </p>
              </div>
            </div>

            {ahorro > 0.3 && (
              <div className="flex items-center gap-2 border-b border-gray-800 bg-emerald-950/20 px-3 py-1.5">
                <TrendingDown className="h-3 w-3 shrink-0 text-emerald-400" />
                <p className="font-mono text-[10px] text-emerald-400">
                  {ahorro.toFixed(1)} km menos que el orden agendado
                </p>
              </div>
            )}

            <ol className="divide-y divide-gray-800">
              {ruta.orden.map((p, i) => (
                <li key={p.id} className="flex items-start gap-2.5 px-3 py-2">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-emerald-500/40 bg-emerald-500/10 font-mono text-[9px] font-bold text-emerald-400">
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold text-gray-200">{p.cliente}</p>
                    <p className="truncate font-mono text-[10px] text-gray-600">
                      {p.hora} · {p.direccion}
                    </p>
                  </div>
                  <span className="shrink-0 font-mono text-[10px] font-bold text-gray-300">
                    {p.distancia.toFixed(1)} km
                  </span>
                </li>
              ))}
            </ol>
          </>
        ) : (
          <SinDatos mensaje="No hay visitas agendadas para hoy" />
        )}
      </PanelTerminal>
    </div>
  );
}
