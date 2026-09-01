import React from 'react';

export default function PanelFlujoCaja() {
  return (
    <div className="bg-gray-900 border border-gray-800 flex flex-col h-full font-mono text-sm overflow-auto">
      <div className="bg-gray-800 text-yellow-400 font-bold text-center py-2 border-b border-gray-800 uppercase tracking-widest text-xs">
        Ingresos, Egresos y Ahorros
      </div>
      
      <div className="p-2 flex flex-col gap-2 flex-1">
        
        {/* Ingresos */}
        <div className="border border-gray-700 bg-gray-950 p-3">
          <h3 className="text-green-400 font-bold text-xs uppercase border-b border-gray-800 pb-1 mb-2">
            Ingresos (Mensual)
          </h3>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-500">Sueldo Fijo</span>
              <span className="text-gray-300">500,000.00</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Comisiones</span>
              <span className="text-gray-300">125,500.00</span>
            </div>
            <div className="flex justify-between border-t border-gray-800 pt-1 mt-1 font-bold">
              <span className="text-gray-400">TOTAL INGRESOS</span>
              <span className="text-green-400">625,500.00</span>
            </div>
          </div>
        </div>

        {/* Egresos */}
        <div className="border border-gray-700 bg-gray-950 p-3">
          <h3 className="text-red-400 font-bold text-xs uppercase border-b border-gray-800 pb-1 mb-2">
            Egresos
          </h3>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-500">Gastos Semanales</span>
              <span className="text-gray-300">45,000.00</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Gastos Fijos Mensuales</span>
              <span className="text-gray-300">210,000.00</span>
            </div>
            <div className="flex justify-between border-t border-gray-800 pt-1 mt-1 font-bold">
              <span className="text-gray-400">TOTAL EGRESOS</span>
              <span className="text-red-400">255,000.00</span>
            </div>
          </div>
        </div>

        {/* Ahorros y Saldo */}
        <div className="border border-yellow-700/50 bg-gray-950 p-3 mt-auto">
          <h3 className="text-yellow-400 font-bold text-xs uppercase border-b border-gray-800 pb-1 mb-2">
            Control de Ahorros / Saldo Neto
          </h3>
          <div className="space-y-1">
            <div className="flex justify-between font-bold text-lg">
              <span className="text-gray-400">FLUJO NETO</span>
              <span className="text-cyan-400">370,500.00</span>
            </div>
            <div className="flex justify-between text-xs mt-2 border-t border-gray-800 pt-2">
              <span className="text-gray-500">Objetivo Ahorro (20%)</span>
              <span className="text-yellow-500">125,100.00</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
