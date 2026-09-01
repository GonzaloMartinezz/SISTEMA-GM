import React from 'react';

export default function TabMargenes() {
  return (
    <div className="flex gap-4 h-full text-sm font-mono">
      {/* Columna Izquierda: Asignados y No Financiable */}
      <div className="flex-1 space-y-4">
        
        <div className="bg-gray-900 border border-gray-700">
          <div className="bg-gray-800 text-cyan-400 font-bold text-center py-1 border-b border-gray-700 uppercase tracking-widest text-xs">
            Margenes Asignados
          </div>
          <div className="grid grid-cols-4 divide-x divide-gray-700 text-center">
            <div className="bg-gray-800 text-gray-400 py-1">Mensual</div>
            <div className="text-gray-200 py-1 font-bold">650.00</div>
            <div className="bg-gray-800 text-gray-400 py-1">Crédito</div>
            <div className="text-gray-200 py-1 font-bold">1550.00</div>
            
            <div className="bg-gray-800 text-gray-400 py-1 border-t border-gray-700">Adel.Mensual</div>
            <div className="text-gray-200 py-1 font-bold border-t border-gray-700">0.00</div>
            <div className="bg-gray-800 text-gray-400 py-1 border-t border-gray-700">Adel.Crédito</div>
            <div className="text-gray-200 py-1 font-bold border-t border-gray-700">0.00</div>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-700 flex flex-col h-48">
          <div className="bg-gray-800 text-gray-300 font-bold text-center py-1 border-b border-gray-700 uppercase text-xs">
            No Financiable
          </div>
          <div className="flex-1 flex items-center justify-center text-gray-500 font-black text-2xl">
            +
          </div>
          <div className="bg-gray-800 p-2 flex justify-between border-t border-gray-700">
            <span className="text-cyan-400 text-xs font-bold uppercase">Mínimo Elegido</span>
            <span className="text-gray-200 font-bold">0.00</span>
          </div>
        </div>
      </div>

      {/* Columna Derecha: Libres y Vencimientos */}
      <div className="flex-1 space-y-4">
        
        <div className="bg-gray-900 border border-gray-700">
          <div className="bg-gray-800 text-cyan-400 font-bold text-center py-1 border-b border-gray-700 uppercase tracking-widest text-xs">
            Margenes Libres Actuales
          </div>
          <div className="grid grid-cols-4 divide-x divide-gray-700 text-center">
            <div className="bg-gray-800 text-gray-400 py-1">Mensual</div>
            <div className="text-red-400 py-1 font-bold">650.00</div>
            <div className="bg-gray-800 text-gray-400 py-1">Crédito</div>
            <div className="text-red-400 py-1 font-bold">1550.00</div>
            
            <div className="bg-gray-800 text-gray-400 py-1 border-t border-gray-700">Adel.Mensual</div>
            <div className="text-red-400 py-1 font-bold border-t border-gray-700">0.00</div>
            <div className="bg-gray-800 text-gray-400 py-1 border-t border-gray-700">Adel.Crédito</div>
            <div className="text-red-400 py-1 font-bold border-t border-gray-700">0.00</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-900 border border-gray-700 text-center p-3">
            <div className="text-cyan-400 font-bold uppercase text-xs mb-2 border-b border-gray-700 pb-1">
              Próximos Vencimientos
            </div>
            <div className="text-gray-400 text-[10px] mb-2 leading-tight">
              Sin mora por pago a cuenta o pago vencido
            </div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-400">Resto</span>
              <span className="text-gray-200">0.00</span>
            </div>
            <div className="flex justify-between text-xs font-bold border-t border-gray-700 mt-1 pt-1">
              <span className="text-gray-300">TOTAL</span>
              <span className="text-gray-200">0.00</span>
            </div>
          </div>
          
          <div className="bg-gray-900 border border-gray-700 flex items-center justify-center">
            {/* Espacio reservado para métricas de ROI o simulación */}
            <span className="text-gray-600 text-xs">Simulador Inactivo</span>
          </div>
        </div>

      </div>
    </div>
  );
}
