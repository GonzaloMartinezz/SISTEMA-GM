import React, { useState } from 'react';
import { Search, Database } from 'lucide-react';
import RegistroLlamadaPanel from '../components/RegistroLlamadaPanel';

// Icono auxiliar
function DatabaseIcon(props) {
  return <Database {...props} />;
}

export default function CobranzasMain() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-gray-950 p-2 font-sans flex flex-col h-screen">
      {/* Cabecera del Módulo */}
      <div className="bg-gray-900 border border-gray-800 p-3 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-3">
          <DatabaseIcon className="text-red-400 w-6 h-6" />
          <h1 className="text-red-400 font-bold tracking-widest uppercase text-sm">
            Gestión de Cobranzas y Morosos
          </h1>
        </div>
        
        {/* Buscador de Estado de Cuenta */}
        <div className="flex items-center gap-2">
          <label className="text-gray-400 text-xs font-bold uppercase">Estado de Cuenta (DNI/Apellido)</label>
          <div className="relative">
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Ej: TORRES, MARCELA"
              className="bg-gray-950 border border-gray-700 text-red-300 px-3 py-1 text-sm font-mono focus:outline-none focus:border-red-500 w-64 uppercase"
            />
            <Search className="absolute right-2 top-1.5 w-4 h-4 text-gray-500" />
          </div>
        </div>
      </div>

      {/* Área de Trabajo Split-Screen */}
      <div className="flex gap-2 flex-1 mt-2 min-h-0">
        
        {/* Columna Izquierda: Directorio y Estado de Cuenta */}
        <div className="w-1/2 flex flex-col gap-2 min-h-0">
          
          {/* Ficha Rápida de Contacto */}
          <div className="bg-gray-900 border border-gray-800 p-3 shrink-0">
            <h2 className="text-red-400 font-bold text-xs uppercase mb-2 border-b border-gray-800 pb-1">
              Directorio de Contacto
            </h2>
            <div className="grid grid-cols-2 gap-4 text-xs font-mono">
              <div>
                <span className="text-gray-500 block">Teléfonos</span>
                <span className="text-gray-300">0381-4943494 / 0381-4311717</span>
              </div>
              <div>
                <span className="text-gray-500 block">Mail</span>
                <span className="text-gray-300">mtorres@clinica.com</span>
              </div>
              <div className="col-span-2">
                <span className="text-gray-500 block">Domicilios (Gral / Negocio)</span>
                <span className="text-gray-300">CALLE BALCARCE Nº:171, San Miguel de Tucumán</span>
              </div>
            </div>
          </div>

          {/* Cuotas y Crédito (Períodos) */}
          <div className="bg-gray-900 border border-gray-800 flex-1 flex flex-col min-h-0">
            <h2 className="text-red-400 font-bold text-xs uppercase p-2 border-b border-gray-800 text-center bg-gray-800">
              Estructura de Cuotas y Crédito
            </h2>
            
            <div className="grid grid-cols-2 gap-2 p-2 flex-1 overflow-auto font-mono text-xs">
              {/* Período Actual */}
              <div className="border border-gray-700 bg-gray-950 p-2">
                <div className="text-center text-cyan-400 font-bold border-b border-gray-800 pb-1 mb-2">PERIODO ACTUAL</div>
                <div className="space-y-2">
                  <div className="flex justify-between"><span className="text-gray-500">Pagos Efectuados</span><span className="text-green-400">15,000.00</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Cant. Cuotas Restantes</span><span className="text-gray-300">2 de 6</span></div>
                  <div className="flex justify-between border-t border-gray-800 pt-1 mt-1"><span className="text-gray-500">Saldo Exigible</span><span className="text-red-400 font-bold">45,300.00</span></div>
                </div>
              </div>

              {/* Período Próximo */}
              <div className="border border-gray-700 bg-gray-950 p-2">
                <div className="text-center text-gray-400 font-bold border-b border-gray-800 pb-1 mb-2">PERIODO PROXIMO</div>
                <div className="space-y-2">
                  <div className="flex justify-between"><span className="text-gray-500">Vencimiento</span><span className="text-gray-300">10/10/2026</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Proyección Cuota</span><span className="text-gray-300">22,650.00</span></div>
                  <div className="flex justify-between border-t border-gray-800 pt-1 mt-1"><span className="text-gray-500">Más Crédito Disp.</span><span className="text-cyan-400 font-bold">150,000.00</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Columna Derecha: Panel de Gestión Operativa (Llamados) */}
        <div className="w-1/2 flex flex-col min-h-0">
          <RegistroLlamadaPanel />
        </div>

      </div>
    </div>
  );
}
