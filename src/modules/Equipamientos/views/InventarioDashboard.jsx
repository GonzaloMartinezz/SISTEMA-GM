import React from 'react';
import { Package, Search } from 'lucide-react';
import CatalogoGrid from '../components/CatalogoGrid';
import ControlStockRotacion from '../components/ControlStockRotacion';

export default function InventarioDashboard() {
  return (
    <div className="min-h-screen bg-gray-950 p-2 font-sans flex flex-col h-screen">
      {/* Cabecera del Módulo */}
      <div className="bg-gray-900 border border-gray-800 p-3 flex justify-between items-center shrink-0 mb-2">
        <div className="flex items-center gap-3">
          <Package className="text-blue-400 w-6 h-6" />
          <h1 className="text-blue-400 font-bold tracking-widest uppercase text-sm">
            Inventario y Equipamientos
          </h1>
        </div>
        
        {/* Buscador Rápido */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Buscar Modelo / N° Serie..."
              className="bg-gray-950 border border-gray-700 text-blue-300 px-3 py-1 text-sm font-mono focus:outline-none focus:border-blue-500 w-64 uppercase"
            />
            <Search className="absolute right-2 top-1.5 w-4 h-4 text-gray-500" />
          </div>
        </div>
      </div>

      {/* Grid Principal */}
      <div className="flex gap-2 flex-1 min-h-0 flex-col md:flex-row">
        {/* Columna Izquierda: Grilla de Catálogo */}
        <div className="md:w-2/3 flex flex-col min-h-0">
          <CatalogoGrid />
        </div>

        {/* Columna Derecha: Control de Stock y Rotación */}
        <div className="md:w-1/3 flex flex-col min-h-0">
          <ControlStockRotacion />
        </div>
      </div>
    </div>
  );
}
