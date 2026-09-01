import React, { useState, useCallback, useMemo } from 'react';
import { GlassCard } from '../ui/GlassCard';
import { Map as MapIcon, Loader2, Navigation } from 'lucide-react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { useClient } from '../../context/ClientContext';

const mapContainerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '0.75rem',
};

// Centro del mapa por defecto (Ej: Tucumán/Yerba Buena)
const defaultCenter = { lat: -26.8167, lng: -65.3167 };

// Datos Mock con coordenadas de clientes
const mockLocations = [
  { id: 1, name: "Dra. Ana Torres", type: "Vendido", item: "Ecógrafo Portátil", lat: -26.8180, lng: -65.3150 },
  { id: 2, name: "Centro Radiológico", type: "Por Vender", item: "Tomógrafo 3D", lat: -26.8220, lng: -65.3190 },
  { id: 3, name: "Dr. Carlos Ruiz", type: "Vendido", item: "Kit Quirúrgico x5", lat: -26.8150, lng: -65.3100 },
];

// Estilo minimalista oscuro para que encaje con el Dashboard
const darkMapStyle = [
  { elementType: "geometry", stylers: [{ color: "#212121" }] },
  { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#212121" }] },
  { featureType: "administrative", elementType: "geometry", stylers: [{ color: "#757575" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#000000" }] },
  { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#3d3d3d" }] }
];

export default function MapRoute() {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    // IMPORTANTE: Asegúrate de cargar tu KEY en el archivo .env (.env.local)
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "", 
  });

  const [map, setMap] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);
  const { openClientProfile } = useClient();

  const onLoad = useCallback(function callback(mapInstance) {
    setMap(mapInstance);
  }, []);

  const onUnmount = useCallback(function callback() {
    setMap(null);
  }, []);

  return (
    <GlassCard className="h-full min-h-[500px] flex flex-col relative overflow-hidden">
      <div className="relative z-10 mb-4 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-text flex items-center gap-2">
            <MapIcon className="w-5 h-5 text-primary" />
            Mapa de Ruta Activa (Google Maps)
          </h3>
          <p className="text-xs text-textMuted">Rastreo de clientes cerrados y leads en la zona.</p>
        </div>
        <div className="flex gap-4 text-xs text-textMuted">
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-primary block"></span> Vendido</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-accent block"></span> Por Vender</span>
        </div>
      </div>

      <div className="flex-1 w-full relative rounded-xl overflow-hidden border border-surfaceHighlight/50">
        {!isLoaded ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-surfaceHighlight/10">
            <Loader2 className="w-8 h-8 text-primary animate-spin mb-2" />
            <span className="text-textMuted text-sm">Cargando Google Maps...</span>
          </div>
        ) : (
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={defaultCenter}
            zoom={14}
            onLoad={onLoad}
            onUnmount={onUnmount}
            options={{
              styles: darkMapStyle,
              disableDefaultUI: true, // Estética limpia
              zoomControl: true,
            }}
          >
            {/* Marcadores de clientes */}
            {mockLocations.map((loc) => {
              // Icono SVG personalizado según el tipo
              const markerColor = loc.type === "Vendido" ? "#00ffcc" : "#ff0055";
              const pinSymbol = {
                path: 'M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z',
                fillColor: markerColor,
                fillOpacity: 1,
                strokeColor: '#0a0a0a',
                strokeWeight: 2,
                scale: 1,
              };

              return (
                <Marker
                  key={loc.id}
                  position={{ lat: loc.lat, lng: loc.lng }}
                  icon={pinSymbol}
                  onClick={() => setSelectedClient(loc)}
                />
              );
            })}

            {/* Ventana de información interactiva */}
            {selectedClient && (
              <InfoWindow
                position={{ lat: selectedClient.lat, lng: selectedClient.lng }}
                onCloseClick={() => setSelectedClient(null)}
              >
                <div className="bg-surface p-3 rounded-md min-w-[150px] shadow-lg border border-surfaceHighlight">
                  <h4 className="font-bold text-text mb-1 text-sm">{selectedClient.name}</h4>
                  <p className="text-xs text-textMuted mb-2">{selectedClient.item}</p>
                  <span className={`text-[10px] px-2 py-1 rounded font-bold ${selectedClient.type === 'Vendido' ? 'bg-primary/20 text-primary' : 'bg-accent/20 text-accent'}`}>
                    {selectedClient.type}
                  </span>
                  <button 
                    onClick={() => openClientProfile({
                      id: selectedClient.id,
                      name: selectedClient.name,
                      clinic: 'Clínica/Hospital Genérico', 
                      specialty: 'Especialidad',
                      scoring: selectedClient.type === 'Vendido' ? 100 : 50,
                    })}
                    className="w-full mt-3 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 py-1.5 rounded text-xs flex items-center justify-center gap-1 transition-colors"
                  >
                    Abrir Perfil 360°
                  </button>
                  <button className="w-full mt-2 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 py-1.5 rounded text-xs flex items-center justify-center gap-1 transition-colors">
                    <Navigation className="w-3 h-3" />
                    Ir allá
                  </button>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        )}
      </div>
    </GlassCard>
  );
}
