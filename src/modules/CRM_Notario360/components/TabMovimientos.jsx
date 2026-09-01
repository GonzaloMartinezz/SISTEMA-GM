import React, { useState } from 'react';

export default function TabMovimientos() {
  const [subTab, setSubTab] = useState('actual');

  const subTabs = [
    { id: 'actual', label: 'Movimientos Período Actual' },
    { id: 'proximo', label: 'Movimientos Próximo Período' },
    { id: 'siguientes', label: 'Movimientos Períodos Siguientes' },
    { id: 'historicos', label: 'Movimientos Históricos' },
  ];

  return (
    <div className="h-full flex flex-col font-mono text-sm">
      {/* Sub-Navegación Interna */}
      <div className="flex border-b border-gray-700 bg-gray-800 overflow-x-auto hide-scrollbar">
        {subTabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setSubTab(tab.id)}
            className={`px-3 py-1.5 text-[11px] font-bold tracking-wide uppercase transition-colors border-r border-gray-700 whitespace-nowrap ${
              subTab === tab.id 
                ? 'bg-gray-900 text-cyan-400 border-t border-cyan-500' 
                : 'text-gray-400 hover:bg-gray-700 hover:text-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tabla de Movimientos */}
      <div className="flex-1 bg-gray-950 border border-t-0 border-gray-700 overflow-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-800 sticky top-0 border-b border-gray-700">
            <tr className="text-[10px] text-gray-400 uppercase tracking-wider">
              <th className="p-2 border-r border-gray-700 font-semibold">Nº Tarj.</th>
              <th className="p-2 border-r border-gray-700 font-semibold">Día Oper.</th>
              <th className="p-2 border-r border-gray-700 font-semibold">Día Pres.</th>
              <th className="p-2 border-r border-gray-700 font-semibold">Descripción del Concepto</th>
              <th className="p-2 border-r border-gray-700 font-semibold">Comercio</th>
              <th className="p-2 border-r border-gray-700 font-semibold text-right">Capital</th>
              <th className="p-2 border-r border-gray-700 font-semibold text-center">Cuota</th>
              <th className="p-2 border-r border-gray-700 font-semibold text-right">Imp. Cuota</th>
              <th className="p-2 font-semibold text-center">Estado</th>
            </tr>
          </thead>
          <tbody className="text-gray-300 text-xs">
            {/* Ejemplo de Fila Vacía (Aquí iterarás los datos de tu API) */}
            <tr className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
              <td colSpan="9" className="p-4 text-center text-gray-600 italic">
                No se registraron movimientos en este período.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
