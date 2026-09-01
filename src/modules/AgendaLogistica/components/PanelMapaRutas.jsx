import React from 'react';
import { Map, MapPin } from 'lucide-react';

export default function PanelMapaRutas({ selectedEvent }) {
  return (
    <div className="bg-gray-900 border border-gray-800 flex flex-col h-full relative overflow-hidden">
      <div className="bg-gray-800 text-purple-400 font-bold text-center py-2 border-b border-gray-800 uppercase tracking-widest text-xs flex justify-center items-center gap-2 z-10 relative">
        <Map className="w-4 h-4" />
        Trazado de Ruta Interactivo
      </div>
      
      {/* Mockup de Mapa Cyberpunk */}
      <div className="flex-1 relative bg-gray-950 flex justify-center items-center">
        {/* Grilla de fondo simulando mapa cyber */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.05)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
        
        {/* Contenido del Mapa Simulado */}
        <div className="z-10 text-center space-y-4">
          <MapPin className="w-16 h-16 text-purple-500/50 mx-auto animate-pulse" />
          {selectedEvent ? (
            <div className="bg-gray-900/80 border border-purple-500/50 p-4 backdrop-blur-sm">
              <h3 className="text-gray-200 font-bold uppercase">{selectedEvent.cliente}</h3>
              <p className="text-gray-400 text-xs font-mono mt-1">{selectedEvent.dir}</p>
              <div className="mt-3 text-[10px] text-purple-400 font-mono flex gap-4 justify-center">
                <span>ETA: 14 MIN</span>
                <span>DIST: 4.2 KM</span>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 font-mono text-sm">Seleccione un destino en la agenda para trazar la ruta</p>
          )}
        </div>
      </div>
    </div>
  );
}
