import React from 'react';

export default function TabHistoriales() {
  return (
    <div className="h-full flex flex-col gap-3 font-mono text-[10px] overflow-auto">
      
      {/* Fila 1: Historial de Estados / Bloqueos */}
      <div className="bg-gray-900 border border-gray-700 flex-none h-32 flex flex-col">
        <div className="bg-gray-800 text-cyan-400 font-bold text-center py-1 border-b border-gray-700 uppercase tracking-widest">
          HISTORIAL DE ESTADOS / BLOQUEOS DE TITULARES / ADICIONALES
        </div>
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-800 sticky top-0 border-b border-gray-700 text-gray-400">
              <tr>
                <th className="p-1 border-r border-gray-700">Tipo</th>
                <th className="p-1 border-r border-gray-700">Nº</th>
                <th className="p-1 border-r border-gray-700">Descripción del Estado ó Bloqueo</th>
                <th className="p-1 border-r border-gray-700">Día y Hora de Creación</th>
                <th className="p-1">Día y Hora de Cancelación</th>
              </tr>
            </thead>
            <tbody className="text-gray-300">
              <tr className="border-b border-gray-800 hover:bg-gray-800">
                <td className="p-1 border-r border-gray-800">Estado</td>
                <td className="p-1 border-r border-gray-800">00</td>
                <td className="p-1 border-r border-gray-800">CORRIENTE RENEGOCIADA</td>
                <td className="p-1 border-r border-gray-800 text-cyan-300">09/05/2011 18:05:39</td>
                <td className="p-1 text-gray-500">18/06/2011 12:35:44</td>
              </tr>
              <tr className="bg-blue-900/20 text-cyan-400 font-bold border-b border-gray-800 hover:bg-gray-800">
                <td className="p-1 border-r border-gray-800">Estado</td>
                <td className="p-1 border-r border-gray-800">00</td>
                <td className="p-1 border-r border-gray-800">CORRIENTE</td>
                <td className="p-1 border-r border-gray-800">18/06/2011 12:35:44</td>
                <td className="p-1 text-gray-500">/ / : :</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Fila 2: Plásticos y Márgenes (Split) */}
      <div className="grid grid-cols-2 gap-3 flex-none h-40">
        
        {/* Historial de Embozado */}
        <div className="bg-gray-900 border border-gray-700 flex flex-col">
          <div className="bg-gray-800 text-cyan-400 font-bold text-center py-1 border-b border-gray-700 uppercase">
            HISTORIAL DE EMBOZADO DE PLASTICOS
          </div>
          <div className="flex-1 overflow-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-800 sticky top-0 border-b border-gray-700 text-gray-400">
                <tr>
                  <th className="p-1 border-r border-gray-700">Nº</th>
                  <th className="p-1 border-r border-gray-700">Numero de Tarjeta</th>
                  <th className="p-1">Día y Hora Activación</th>
                </tr>
              </thead>
              <tbody className="text-gray-300">
                <tr className="bg-blue-900/20 text-cyan-400 font-bold border-b border-gray-800">
                  <td className="p-1 border-r border-gray-800">00</td>
                  <td className="p-1 border-r border-gray-800">62764904548200030</td>
                  <td className="p-1">/ / : :</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Historial de Márgenes */}
        <div className="bg-gray-900 border border-gray-700 flex flex-col">
          <div className="bg-gray-800 text-cyan-400 font-bold text-center py-1 border-b border-gray-700 uppercase">
            HISTORIAL DE CAMBIOS DE MARGENES
          </div>
          <div className="flex-1 overflow-auto">
            <table className="w-full text-left text-center">
              <thead className="bg-gray-800 sticky top-0 border-b border-gray-700 text-gray-400">
                <tr>
                  <th className="p-1 border-r border-gray-700">Mensual</th>
                  <th className="p-1 border-r border-gray-700">Crédito</th>
                  <th className="p-1 border-r border-gray-700">Día Creación</th>
                </tr>
              </thead>
              <tbody className="text-gray-300">
                <tr className="bg-blue-900/20 text-cyan-400 font-bold border-b border-gray-800">
                  <td className="p-1 border-r border-gray-800">650</td>
                  <td className="p-1 border-r border-gray-800">1550</td>
                  <td className="p-1">27/04/2010</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Fila 3: Intimaciones y Renegociaciones (Split) */}
      <div className="grid grid-cols-2 gap-3 flex-none h-40">
        
        {/* Intimaciones */}
        <div className="bg-gray-900 border border-gray-700 flex flex-col">
          <div className="bg-gray-800 text-cyan-400 font-bold text-center py-1 border-b border-gray-700 uppercase">
            HISTORIAL DE INTIMACIONES
          </div>
          <div className="flex-1 overflow-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-800 sticky top-0 border-b border-gray-700 text-gray-400">
                <tr>
                  <th className="p-1 border-r border-gray-700">Día Emisión</th>
                  <th className="p-1">Tipo de Intimación</th>
                </tr>
              </thead>
              <tbody className="text-gray-300">
                <tr className="border-b border-gray-800">
                  <td className="p-1 border-r border-gray-800">05/05/2011</td>
                  <td className="p-1 text-gray-400">Llamado Tel.</td>
                </tr>
                <tr className="bg-blue-900/20 text-cyan-400 font-bold border-b border-gray-800">
                  <td className="p-1 border-r border-gray-800">23/08/2011</td>
                  <td className="p-1">Carta 1er. Aviso</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Renegociaciones */}
        <div className="bg-gray-900 border border-gray-700 flex flex-col">
          <div className="bg-gray-800 text-cyan-400 font-bold text-center py-1 border-b border-gray-700 uppercase">
            HISTORIAL DE RENEG. / REFINANC.
          </div>
          <div className="flex-1 overflow-auto">
            <table className="w-full text-center">
              <thead className="bg-gray-800 sticky top-0 border-b border-gray-700 text-gray-400">
                <tr>
                  <th className="p-1 border-r border-gray-700">Día Efectuada</th>
                  <th className="p-1 border-r border-gray-700">Anticipo</th>
                  <th className="p-1">Monto c/Cuota</th>
                </tr>
              </thead>
              <tbody className="text-gray-300">
                <tr className="bg-blue-900/20 text-cyan-400 font-bold border-b border-gray-800">
                  <td className="p-1 border-r border-gray-800">09/05/2011</td>
                  <td className="p-1 border-r border-gray-800 text-green-400">300.00</td>
                  <td className="p-1 text-red-400">203.27</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
}
