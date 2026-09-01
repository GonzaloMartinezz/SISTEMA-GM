import React from 'react';
import { PackageOpen } from 'lucide-react';

export default function CatalogoGrid() {
  const equipos = [
    { id: 1, modelo: 'Sillón Odontológico Premium', serie: 'SO-1029', stock: 3, estado: 'Disponible', precio: '3,500' },
    { id: 2, modelo: 'Ecógrafo Portátil 3D', serie: 'EC-4491', stock: 1, estado: 'Reserva', precio: '5,200' },
    { id: 3, modelo: 'Kit Quirúrgico Básico', serie: 'KQ-0012', stock: 15, estado: 'Disponible', precio: '450' },
    { id: 4, modelo: 'Lámpara de Fotocurado', serie: 'LF-9920', stock: 0, estado: 'Sin Stock', precio: '120' },
    { id: 5, modelo: 'Autoclave 12L', serie: 'AC-3321', stock: 2, estado: 'Disponible', precio: '1,100' },
    { id: 6, modelo: 'Turbina Alta Velocidad', serie: 'TV-8812', stock: 8, estado: 'Disponible', precio: '85' },
  ];

  return (
    <div className="bg-gray-900 border border-gray-800 flex flex-col h-full overflow-hidden">
      <div className="bg-gray-800 text-blue-400 font-bold text-center py-2 border-b border-gray-800 uppercase tracking-widest text-xs flex justify-center items-center gap-2">
        <PackageOpen className="w-4 h-4" />
        Catálogo Visual
      </div>
      
      <div className="flex-1 overflow-auto p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {equipos.map((eq) => (
            <div key={eq.id} className="bg-gray-950 border border-gray-800 hover:border-blue-500/50 transition-colors group flex flex-col">
              <div className="h-24 bg-gray-800 flex items-center justify-center border-b border-gray-800 relative">
                <PackageOpen className="w-8 h-8 text-gray-600 group-hover:text-blue-500/50 transition-colors" />
                <span className={`absolute top-2 right-2 text-[9px] px-1.5 py-0.5 uppercase font-bold border ${
                  eq.estado === 'Disponible' ? 'bg-green-900/30 text-green-400 border-green-700' :
                  eq.estado === 'Sin Stock' ? 'bg-red-900/30 text-red-400 border-red-700' :
                  'bg-yellow-900/30 text-yellow-400 border-yellow-700'
                }`}>
                  {eq.estado}
                </span>
              </div>
              <div className="p-3 font-mono text-xs flex flex-col flex-1">
                <h3 className="text-gray-200 font-bold uppercase line-clamp-1">{eq.modelo}</h3>
                <span className="text-gray-500 mt-1">S/N: {eq.serie}</span>
                
                <div className="mt-auto pt-3 flex justify-between items-center border-t border-gray-800">
                  <span className="text-gray-400">Stock: <span className="text-white">{eq.stock}</span></span>
                  <span className="text-blue-400 font-bold text-sm">${eq.precio}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
