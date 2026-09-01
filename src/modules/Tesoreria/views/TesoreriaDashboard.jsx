import React from 'react';
import { DollarSign, PieChart } from 'lucide-react';
import PanelFlujoCaja from '../components/PanelFlujoCaja';
import PanelProyecciones from '../components/PanelProyecciones';

export default function TesoreriaDashboard() {
  return (
    <div className="min-h-screen bg-gray-950 p-2 font-sans flex flex-col h-screen">
      {/* Cabecera del Módulo */}
      <div className="bg-gray-900 border border-gray-800 p-3 flex justify-between items-center shrink-0 mb-2">
        <div className="flex items-center gap-3">
          <DollarSign className="text-yellow-400 w-6 h-6" />
          <h1 className="text-yellow-400 font-bold tracking-widest uppercase text-sm">
            Tesorería, Finanzas y Contaduría
          </h1>
        </div>
        
        {/* Selector de Divisa */}
        <div className="flex items-center gap-2 font-mono text-xs font-bold">
          <span className="text-gray-500 uppercase">Moneda Base:</span>
          <div className="flex bg-gray-950 border border-gray-700 rounded-sm">
            <button className="px-3 py-1 bg-gray-800 text-yellow-400 border-r border-gray-700">ARS</button>
            <button className="px-3 py-1 text-gray-500 hover:text-gray-300">USD</button>
          </div>
        </div>
      </div>

      {/* Grid Principal */}
      <div className="flex gap-2 flex-1 min-h-0">
        {/* Columna Izquierda: Flujo de Caja (Ingresos/Egresos/Ahorros) */}
        <div className="w-1/3 flex flex-col min-h-0">
          <PanelFlujoCaja />
        </div>

        {/* Columna Derecha: Proyecciones y Analíticas ROI */}
        <div className="w-2/3 flex flex-col min-h-0">
          <PanelProyecciones />
        </div>
      </div>
    </div>
  );
}
