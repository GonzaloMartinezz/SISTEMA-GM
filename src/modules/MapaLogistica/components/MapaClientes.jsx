// ============================================================================
// SISTEMA GM · MAPA Y LOGÍSTICA · LIENZO DE GEOLOCALIZACIÓN
// ----------------------------------------------------------------------------
// Con clave de Google Maps muestra el mapa real con la ruta trazada; sin clave
// dibuja un plano esquemático con las mismas coordenadas, para que el módulo
// sea operativo igual.
// ============================================================================

import React, { useMemo } from 'react';
import { MapPin, Warehouse } from 'lucide-react';
import { getEstadoCliente, GOOGLE_MAPS_KEY } from '../config/mapa.config';
import { BASE_OPERATIVA } from '../../../shared/agenda/agendaDemo';

const MARGEN = 0.06;

function proyectar(puntos) {
  const lats = puntos.map((p) => p.lat);
  const lngs = puntos.map((p) => p.lng);
  const minLat = Math.min(...lats) - MARGEN;
  const maxLat = Math.max(...lats) + MARGEN;
  const minLng = Math.min(...lngs) - MARGEN;
  const maxLng = Math.max(...lngs) + MARGEN;

  return (p) => ({
    x: ((p.lng - minLng) / (maxLng - minLng || 1)) * 100,
    // La latitud crece hacia el norte: se invierte para el eje Y del SVG
    y: ((maxLat - p.lat) / (maxLat - minLat || 1)) * 100,
  });
}

export default function MapaClientes({ clientes, ruta = [], seleccionado, onSeleccionar }) {
  const puntos = useMemo(
    () => [BASE_OPERATIVA, ...clientes.map((c) => ({ lat: c.lat, lng: c.lng }))],
    [clientes]
  );

  const proj = useMemo(() => proyectar(puntos.length ? puntos : [BASE_OPERATIVA]), [puntos]);

  // ---- Modo Google Maps (clave configurada) --------------------------------
  if (GOOGLE_MAPS_KEY && ruta.length) {
    const punto = (p) => `${p.lat},${p.lng}`;
    const destino = ruta[ruta.length - 1];
    const waypoints = ruta.slice(0, -1).map(punto).join('|');
    const src =
      `https://www.google.com/maps/embed/v1/directions?key=${GOOGLE_MAPS_KEY}` +
      `&origin=${punto(BASE_OPERATIVA)}&destination=${punto(destino)}` +
      (waypoints ? `&waypoints=${encodeURIComponent(waypoints)}` : '') +
      '&mode=driving';

    return (
      <div className="h-full w-full overflow-hidden rounded-md border border-gray-800">
        <iframe
          title="Ruta de visitas"
          src={src}
          className="h-full w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    );
  }

  // ---- Modo esquemático (sin clave) ----------------------------------------
  const base = proj(BASE_OPERATIVA);
  const puntosRuta = ruta.map((p) => proj(p));

  return (
    <div className="relative h-full w-full overflow-hidden rounded-md border border-gray-800 bg-gray-950">
      {/* Retícula */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Trazado de la ruta */}
      {puntosRuta.length > 0 && (
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <polyline
            points={[base, ...puntosRuta].map((p) => `${p.x},${p.y}`).join(' ')}
            fill="none"
            stroke="rgba(52,211,153,0.55)"
            strokeWidth="0.5"
            strokeDasharray="1.5 1"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      )}

      {/* Base operativa */}
      <div
        className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
        style={{ left: `${base.x}%`, top: `${base.y}%` }}
        title={BASE_OPERATIVA.nombre}
      >
        <div className="flex h-7 w-7 items-center justify-center rounded-md border border-white/25 bg-black/80">
          <Warehouse className="h-3.5 w-3.5 text-white/70" />
        </div>
      </div>

      {/* Marcadores de clientes */}
      {clientes.map((c) => {
        const p = proj(c);
        const estado = getEstadoCliente(c.estado);
        const activo = seleccionado?.id === c.id;
        const enRuta = ruta.some((r) => r.clienteId === c.id || r.id === c.id);

        return (
          <button
            key={c.id}
            type="button"
            onClick={() => onSeleccionar(c)}
            title={`${c.nombre} · ${c.zona}`}
            className="absolute z-20 -translate-x-1/2 -translate-y-full transition-transform hover:z-30 hover:scale-125"
            style={{ left: `${p.x}%`, top: `${p.y}%` }}
          >
            <MapPin
              className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
              style={{
                width: activo ? 30 : 22,
                height: activo ? 30 : 22,
                color: estado.color,
                fill: activo || enRuta ? estado.color : 'transparent',
                fillOpacity: activo ? 0.35 : 0.18,
              }}
              strokeWidth={1.75}
            />
          </button>
        );
      })}

      {/* Nota del modo esquemático */}
      <p className="absolute bottom-2 left-2 z-30 rounded border border-gray-800 bg-black/70 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.15em] text-gray-600">
        Plano esquemático · cargá VITE_GOOGLE_MAPS_API_KEY para el mapa real
      </p>
    </div>
  );
}
