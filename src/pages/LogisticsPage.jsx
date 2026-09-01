import React from 'react';
import MapRoute from '../components/logistics/MapRoute';
import DynamicRouter from '../components/logistics/DynamicRouter';

export default function LogisticsPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 flex flex-col h-full">
      <div>
        <h2 className="text-2xl font-bold text-text mb-1">Logística y Trazado de Rutas</h2>
        <p className="text-textMuted">Optimiza tus visitas presenciales y recalcula recorridos en tiempo real.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 flex-1 min-h-[500px]">
        {/* Dynamic Route Planner - 1 Columna */}
        <div className="xl:col-span-1 flex flex-col">
          <DynamicRouter />
        </div>

        {/* Mapa Interactivo - 2 Columnas */}
        <div className="xl:col-span-2 flex flex-col">
          <MapRoute />
        </div>
      </div>
    </div>
  );
}
