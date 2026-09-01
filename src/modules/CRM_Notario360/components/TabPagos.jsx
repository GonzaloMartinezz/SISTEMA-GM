import React from 'react';

export default function TabPagos() {
  return (
    <div className="h-full flex flex-col font-mono text-sm bg-gray-900 border border-gray-700 rounded-sm">
      <div className="bg-gray-800 text-cyan-400 font-bold text-center py-1.5 border-b border-gray-700 uppercase tracking-widest text-xs">
        PAGOS MINIMOS ELEGIDOS Y PAGOS EFECTUADOS
      </div>
      
      <div className="flex-1 overflow-auto">
        <table className="w-full text-left border-collapse text-[10px] whitespace-nowrap">
          <thead className="bg-gray-800 sticky top-0 border-b border-gray-700 shadow-sm">
            <tr className="text-gray-400 uppercase">
              <th className="p-2 border-r border-gray-700 font-semibold">Día de Cierre</th>
              <th className="p-2 border-r border-gray-700 font-semibold">Día de Vencto.</th>
              <th className="p-2 border-r border-gray-700 font-semibold text-right">Minimo Elegido</th>
              <th className="p-2 border-r border-gray-700 font-semibold text-center">PL</th>
              <th className="p-2 border-r border-gray-700 font-semibold text-center">PN</th>
              <th className="p-2 border-r border-gray-700 font-semibold text-right">Min. Impago</th>
              <th className="p-2 border-r border-gray-700 font-semibold text-center">Día de Pago</th>
              <th className="p-2 border-r border-gray-700 font-semibold">Nº Recibo</th>
              <th className="p-2 border-r border-gray-700 font-semibold text-right">Impte. Pago</th>
              <th className="p-2 font-semibold">Lugar de Pago</th>
            </tr>
          </thead>
          <tbody className="text-gray-300">
            {/* Ejemplo de registro iterativo */}
            <tr className="border-b border-gray-800/50 hover:bg-gray-800 transition-colors">
              <td className="p-1.5 border-r border-gray-800 text-center">25/08/2011</td>
              <td className="p-1.5 border-r border-gray-800 text-center text-cyan-300">12/09/2011</td>
              <td className="p-1.5 border-r border-gray-800 text-right text-cyan-400 font-bold">258.57</td>
              <td className="p-1.5 border-r border-gray-800 text-center">01</td>
              <td className="p-1.5 border-r border-gray-800 text-center">01</td>
              <td className="p-1.5 border-r border-gray-800 text-right text-gray-500">0.00</td>
              <td className="p-1.5 border-r border-gray-800 text-center text-blue-300">20/09/2011</td>
              <td className="p-1.5 border-r border-gray-800 font-mono">05007456</td>
              <td className="p-1.5 border-r border-gray-800 text-right text-green-400 font-bold">258.57</td>
              <td className="p-1.5 text-gray-400 uppercase">BANCOEMP</td>
            </tr>
            {/* Fila vacía para simular scroll continuo */}
            {Array.from({ length: 15 }).map((_, i) => (
              <tr key={i} className="border-b border-gray-800/50">
                <td className="p-1.5 border-r border-gray-800">&nbsp;</td>
                <td className="p-1.5 border-r border-gray-800">&nbsp;</td>
                <td className="p-1.5 border-r border-gray-800">&nbsp;</td>
                <td className="p-1.5 border-r border-gray-800">&nbsp;</td>
                <td className="p-1.5 border-r border-gray-800">&nbsp;</td>
                <td className="p-1.5 border-r border-gray-800">&nbsp;</td>
                <td className="p-1.5 border-r border-gray-800">&nbsp;</td>
                <td className="p-1.5 border-r border-gray-800">&nbsp;</td>
                <td className="p-1.5 border-r border-gray-800">&nbsp;</td>
                <td className="p-1.5">&nbsp;</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
