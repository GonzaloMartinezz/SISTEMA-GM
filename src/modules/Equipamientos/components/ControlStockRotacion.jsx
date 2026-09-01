import React from 'react';
import { TrendingUp, AlertTriangle } from 'lucide-react';

export default function ControlStockRotacion() {
  return (
    <div className="bg-gray-900 border border-gray-800 flex flex-col h-full font-mono text-xs overflow-auto">
      <div className="bg-gray-800 text-blue-400 font-bold text-center py-2 border-b border-gray-800 uppercase tracking-widest flex justify-center items-center gap-2">
        <TrendingUp className="w-4 h-4" />
        Stock y Rotación
      </div>
      
      <div className="p-3 space-y-4 flex-1">
        
        {/* Alertas de Stock */}
        <div className="border border-red-900/50 bg-gray-950 p-3">
          <h3 className="text-red-400 font-bold uppercase border-b border-gray-800 pb-1 mb-2 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" /> Puntos de Pedido
          </h3>
          <ul className="space-y-2">
            <li className="flex justify-between items-center text-gray-300">
              <span className="line-clamp-1">Lámpara Fotocurado</span>
              <span className="text-red-500 font-bold">0</span>
            </li>
            <li className="flex justify-between items-center text-gray-300">
              <span className="line-clamp-1">Ecógrafo Portátil</span>
              <span className="text-yellow-500 font-bold">1</span>
            </li>
          </ul>
        </div>

        {/* Rotación (Alta Demanda) */}
        <div className="border border-gray-700 bg-gray-950 p-3">
          <h3 className="text-gray-400 font-bold uppercase border-b border-gray-800 pb-1 mb-2">
            Alta Rotación (Top 3)
          </h3>
          <div className="space-y-2 text-gray-300">
            <div className="flex flex-col">
              <span className="text-blue-300">1. Kit Quirúrgico Básico</span>
              <span className="text-[10px] text-gray-500">25 unidades vendidas (último mes)</span>
            </div>
            <div className="flex flex-col border-t border-gray-800 pt-1">
              <span className="text-blue-300">2. Turbina Alta Velocidad</span>
              <span className="text-[10px] text-gray-500">12 unidades vendidas (último mes)</span>
            </div>
            <div className="flex flex-col border-t border-gray-800 pt-1">
              <span className="text-blue-300">3. Autoclave 12L</span>
              <span className="text-[10px] text-gray-500">4 unidades vendidas (último mes)</span>
            </div>
          </div>
        </div>

        {/* Resumen Valorizado */}
        <div className="border border-blue-900/50 bg-gray-950 p-3 mt-auto">
          <h3 className="text-blue-400 font-bold uppercase border-b border-gray-800 pb-1 mb-2">
            Valorización Inventario
          </h3>
          <div className="flex justify-between items-end">
            <span className="text-gray-500">Total USD:</span>
            <span className="text-xl font-bold text-gray-200">28,450.00</span>
          </div>
        </div>

      </div>
    </div>
  );
}
