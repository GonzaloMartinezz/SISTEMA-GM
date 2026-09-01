import React, { useState } from 'react';
import { Calendar, Map, Navigation, Clock, Search } from 'lucide-react';
import PanelAgenda from '../components/PanelAgenda';
import PanelMapaRutas from '../components/PanelMapaRutas';
import ControladorLogistico from '../components/ControladorLogistico';

export default function AgendaLogisticaDashboard() {
  const [selectedEvent, setSelectedEvent] = useState(null);

  return (
    <div className="min-h-screen bg-gray-950 p-2 font-sans flex flex-col h-screen">
      {/* Top Bar */}
      <div className="bg-gray-900 border border-gray-800 p-3 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-3">
          <Navigation className="text-purple-400 w-6 h-6" />
          <h1 className="text-purple-400 font-bold tracking-widest uppercase text-sm">
            Control Unificado: Agenda y Logística
          </h1>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="text-gray-500 uppercase font-bold">Fecha:</span>
            <span className="text-gray-300 bg-gray-950 border border-gray-700 px-3 py-1">29/10/2026</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-500 uppercase font-bold">Ruta Activa:</span>
            <span className="text-green-400 bg-gray-950 border border-green-900 px-3 py-1 font-bold">ZONA SUR (EN PROGRESO)</span>
          </div>
        </div>
      </div>

      {/* Main Split Screen */}
      <div className="flex gap-2 flex-1 mt-2 min-h-0 relative">
        {/* Left Column: Agenda/Timeline */}
        <div className="w-1/3 flex flex-col min-h-0">
          <PanelAgenda onSelectEvent={setSelectedEvent} selectedEvent={selectedEvent} />
        </div>

        {/* Right Column: Interactive Map */}
        <div className="w-2/3 flex flex-col min-h-0">
          <PanelMapaRutas selectedEvent={selectedEvent} />
        </div>
        
        {/* Floating Logistics Controller */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 w-3/4 max-w-2xl">
          <ControladorLogistico />
        </div>
      </div>
    </div>
  );
}
