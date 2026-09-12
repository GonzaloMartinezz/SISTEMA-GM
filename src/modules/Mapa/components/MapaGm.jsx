import React, { useMemo, useCallback, useRef, useState, useEffect } from 'react';
import { Crosshair, Minus, Plus } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { renderToString } from 'react-dom/server';
import 'leaflet/dist/leaflet.css';

const CENTRO_POR_DEFECTO = [-26.8241, -65.2226]; // San Miguel de Tucumán

// Helper para crear un DivIcon a partir de un componente React
const createReactIcon = (component, activo, capa) => {
  const html = renderToString(component);
  return L.divIcon({
    html,
    className: 'bg-transparent border-none', // Para resetear estilos por defecto de leaflet
    iconSize: [34, 34],
    iconAnchor: [17, 34],
    popupAnchor: [0, -34],
  });
};

const createClusterIcon = (count, activo, capa) => {
  const html = `<span class="grid h-8 w-8 place-items-center rounded-full border-2 border-white bg-[#B4551A] text-[12px] font-bold text-white shadow-[0_2px_8px_rgba(26,26,24,0.35)]">${count}</span>`;
  return L.divIcon({
    html,
    className: 'bg-transparent border-none',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

// Componente para manejar el encuadre automático
function MapController({ puntos, seleccionado }) {
  const map = useMap();
  const encuadrado = useRef(false);

  useEffect(() => {
    if (!puntos.length || encuadrado.current) return;
    encuadrado.current = true;

    const bounds = L.latLngBounds(puntos.map(p => [p.lat, p.lng]));
    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [40, 40] });
    }
  }, [puntos, map]);

  useEffect(() => {
    if (!seleccionado) return;
    const latLng = L.latLng(seleccionado.lat, seleccionado.lng);
    if (!map.getBounds().contains(latLng)) {
      map.panTo(latLng);
      if (map.getZoom() < 13) {
        map.setZoom(13);
      }
    }
  }, [seleccionado, map]);

  return null;
}

// Control manual de zoom para reemplazar los de leaflet
function CustomZoomControl({ encuadrarTodo }) {
  const map = useMap();

  return (
    <div className="absolute right-3 top-3 z-[1000] flex flex-col overflow-hidden rounded-xl border border-[var(--gm-borde)] dark:border-[#333333] bg-white dark:bg-[#1E1E1E] shadow-[0_4px_16px_-6px_rgba(26,26,24,0.25)]">
      <BotonMapa etiqueta="Acercar" icono={Plus} onClick={() => map.setZoom(map.getZoom() + 1)} />
      <span className="h-px bg-[var(--gm-superficie-fuerte)]" />
      <BotonMapa etiqueta="Alejar" icono={Minus} onClick={() => map.setZoom(map.getZoom() - 1)} />
      <span className="h-px bg-[var(--gm-superficie-fuerte)]" />
      <BotonMapa etiqueta="Ver todos los puntos" icono={Crosshair} onClick={encuadrarTodo} />
    </div>
  );
}

function MapStateSync({ setZoom }) {
  useMapEvents({
    zoomend: (e) => {
      setZoom(e.target.getZoom());
    }
  });
  return null;
}

// Proyección esférica de Mercator para clustering visual (igual que en tu lógica original)
const proyectarAPixeles = (lat, lng, zoom) => {
  const siny = Math.sin((lat * Math.PI) / 180);
  const y = 256 * (0.5 - Math.log((1 + siny) / (1 - siny)) / (4 * Math.PI));
  const x = 256 * (0.5 + lng / 360);
  const scale = Math.pow(2, zoom);
  return { x: x * scale, y: y * scale };
};

export default function MapaGm({
  puntos = [],
  seleccionado,
  onSeleccionar,
  renderPin,
  renderFicha,
  alto = 'h-[560px]',
  className = '',
}) {
  const [zoom, setZoom] = useState(12);
  const mapRef = useRef(null);

  const encuadrarTodo = useCallback(() => {
    if (!mapRef.current || !puntos.length) return;
    const bounds = L.latLngBounds(puntos.map(p => [p.lat, p.lng]));
    if (bounds.isValid()) {
      mapRef.current.fitBounds(bounds, { padding: [40, 40] });
    }
  }, [puntos]);

  const puntosValidos = useMemo(() => {
    return puntos.filter(p => Number.isFinite(p.lat) && Number.isFinite(p.lng));
  }, [puntos]);

  // Agrupación de pines superpuestos
  const grupos = useMemo(() => {
    const RADIO = 30; // pixeles
    const libres = puntosValidos.map(p => ({ punto: p, pos: proyectarAPixeles(p.lat, p.lng, zoom) }));
    const salida = [];

    while (libres.length) {
      const cabeza = libres.shift();
      if (seleccionado?.codigo === cabeza.punto.codigo) {
        salida.push({ miembros: [cabeza], lat: cabeza.punto.lat, lng: cabeza.punto.lng });
        continue;
      }
      const miembros = [cabeza];
      for (let i = libres.length - 1; i >= 0; i -= 1) {
        const otro = libres[i];
        if (seleccionado?.codigo === otro.punto.codigo) continue;
        const dx = otro.pos.x - cabeza.pos.x;
        const dy = otro.pos.y - cabeza.pos.y;
        if (dx * dx + dy * dy <= RADIO * RADIO) {
          miembros.push(otro);
          libres.splice(i, 1);
        }
      }
      salida.push({ miembros, lat: cabeza.punto.lat, lng: cabeza.punto.lng });
    }
    return salida;
  }, [puntosValidos, seleccionado?.codigo, zoom]);

  return (
    <div className={`relative overflow-hidden rounded-2xl border border-[var(--gm-borde)] dark:border-[#333333] bg-[#F3EDE4] dark:bg-[#121212] ${alto} ${className}`}>
      {/* Añadimos estilos globales específicos para sobreescribir el popup default de leaflet y acomodar nuestros componentes */}
      <style>{`
        .leaflet-popup-content-wrapper { background: transparent; box-shadow: none; padding: 0; }
        .leaflet-popup-tip-container { display: none; }
        .leaflet-popup-content { margin: 0; }
        .leaflet-container { font-family: inherit; }
        /* Animación ping nativa porque Leaflet a veces filtra clases complejas */
        @keyframes ping {
          75%, 100% { transform: scale(2); opacity: 0; }
        }
        .animate-ping { animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite; }
      `}</style>

      <MapContainer
        center={CENTRO_POR_DEFECTO}
        zoom={zoom}
        zoomControl={false} // Desactivamos el default para usar el nuestro
        style={{ height: '100%', width: '100%', zIndex: 10 }}
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapController puntos={puntosValidos} seleccionado={seleccionado} />
        <CustomZoomControl encuadrarTodo={encuadrarTodo} />
        <MapStateSync setZoom={setZoom} />

        {/* ------------------------------ pines ------------------------ */}
        {grupos.map(({ miembros, lat, lng }) => {
          const solo = miembros.length === 1;
          const punto = miembros[0].punto;
          const activo = seleccionado?.codigo === punto.codigo;
          const capa = 200 + Math.round(lat * 100);

          let icon;
          if (solo) {
            const pinReact = renderPin ? renderPin(punto, activo) : <span className="block h-3 w-3 -translate-y-1/2 rounded-full bg-[#B4551A] ring-2 ring-white" />;
            icon = createReactIcon(pinReact, activo, capa);
          } else {
            icon = createClusterIcon(miembros.length, activo, capa);
          }

          return (
            <Marker
              key={solo ? punto.codigo : `grupo-${miembros.map((m) => m.punto.codigo).join('-')}`}
              position={[lat, lng]}
              icon={icon}
              zIndexOffset={activo ? 1000 : capa}
              eventHandlers={{
                click: () => {
                  if (solo) {
                    onSeleccionar?.(punto);
                  } else {
                    const bounds = L.latLngBounds(miembros.map(m => [m.punto.lat, m.punto.lng]));
                    mapRef.current.fitBounds(bounds, { padding: [90, 90] });
                  }
                }
              }}
            >
              {/* ------------------------------ la ficha -------------------------- */}
              {activo && renderFicha && (
                <Popup autoPan={false} closeButton={false} offset={[0, -15]}>
                  <div
                    className="w-[288px] -translate-y-2 -translate-x-0"
                    onPointerDown={(e) => e.stopPropagation()}
                  >
                    {renderFicha(seleccionado)}
                  </div>
                </Popup>
              )}
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}

function BotonMapa({ etiqueta, icono: Icono, onClick }) {
  return (
    <button
      type="button"
      title={etiqueta}
      aria-label={etiqueta}
      onClick={onClick}
      className="grid h-9 w-9 place-items-center text-[#6E6559] dark:text-[#9CA3AF] transition hover:bg-[#FCFAF6] dark:hover:bg-[#2D2D2D] hover:text-[#2A2118]"
    >
      <Icono size={16} />
    </button>
  );
}
