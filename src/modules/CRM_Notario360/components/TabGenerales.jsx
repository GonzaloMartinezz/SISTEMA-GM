import React from 'react';

export default function TabGenerales() {
  return (
    <div className="flex flex-col gap-4 font-mono text-sm h-full">
      
      {/* Panel de Avisos (Alertas del Sistema) */}
      <div className="bg-gray-900 border border-gray-700 rounded-sm">
        <div className="bg-gray-800 text-gray-400 font-bold px-2 py-1 border-b border-gray-700 text-xs">
          Avisos
        </div>
        <div className="p-2 h-16 overflow-auto">
          <p className="text-red-500 font-bold text-xs tracking-wide">
            No se Emitió Resumen en el Período para la Cuenta
          </p>
        </div>
      </div>

      {/* Estado y Bloqueos */}
      <div className="bg-gray-900 border border-gray-700 rounded-sm p-4 grid grid-cols-[100px_1fr] gap-4 items-center">
        <span className="text-gray-400 font-bold text-right text-xs">Estado</span>
        <div className="bg-gray-950 border border-gray-800 px-3 py-1">
          <span className="text-green-500 font-bold tracking-widest text-xs uppercase">CORRIENTE</span>
        </div>

        <span className="text-gray-400 font-bold text-right text-xs">Bloqueos</span>
        <div className="bg-gray-950 border border-gray-800 px-3 py-1">
          <span className="text-gray-300 font-mono tracking-widest text-xs uppercase">SIN RESTRICCION</span>
        </div>
      </div>

      {/* Grid de Datos Contractuales */}
      <div className="bg-gray-900 border border-gray-700 rounded-sm overflow-hidden flex-1">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="bg-gray-800 border-b border-gray-700">
            <tr>
              <th className="p-2 border-r border-gray-700 font-bold text-cyan-400">Tipo de Tarjeta</th>
              <th className="p-2 border-r border-gray-700 font-bold text-gray-400">Nº de Tarjeta Titular</th>
              <th className="p-2 border-r border-gray-700 font-bold text-gray-400">Fecha de Alta</th>
              <th className="p-2 border-r border-gray-700 font-bold text-gray-400">Vto de la Cuenta</th>
              <th className="p-2 font-bold text-gray-400">Ciclo:Cierra-Factura-Vence</th>
            </tr>
          </thead>
          <tbody className="text-gray-300">
            <tr className="border-b border-gray-800">
              <td className="p-2 border-r border-gray-800 text-blue-400 font-bold">TITANIO</td>
              <td className="p-2 border-r border-gray-800">62764904548200030</td>
              <td className="p-2 border-r border-gray-800 text-center">21/08/2008</td>
              <td className="p-2 border-r border-gray-800 text-center">31/05/2014</td>
              <td className="p-2 text-center">25 - 30 - 10</td>
            </tr>
            <tr className="bg-gray-950/50">
              <td className="p-2 text-gray-500 font-bold">Día Vto.</td>
              <td className="p-2 text-center text-cyan-300">Sucursal</td>
              <td colSpan="3" className="p-2 text-center text-cyan-300">Convenio</td>
            </tr>
            <tr>
              <td className="p-2">10/09</td>
              <td className="p-2 text-center uppercase">TUCUMAN</td>
              <td colSpan="3" className="p-2 text-center uppercase">CLIENTES PARTICULARES</td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  );
}
