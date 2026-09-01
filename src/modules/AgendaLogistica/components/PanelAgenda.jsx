import React from 'react';
import { Calendar, Clock, CheckCircle, AlertCircle } from 'lucide-react';

export default function PanelAgenda({ onSelectEvent, selectedEvent }) {
  const eventos = [
    { id: 1, hora: '09:00', cliente: 'TORRES, MARCELA', tipo: 'Cobranza', estado: 'completado', dir: 'Balcarce 171' },
    { id: 2, hora: '11:30', cliente: 'CLINICA SANTA FE', tipo: 'Venta', estado: 'pendiente', dir: 'Av. Mate de Luna 2000' },
    { id: 3, hora: '15:00', cliente: 'ODONTOSALUD', tipo: 'Demostración', estado: 'pendiente', dir: 'San Martín 550' },
    { id: 4, hora: '17:45', cliente: 'RUIZ, CARLOS', tipo: 'Cobranza', estado: 'reprogramado', dir: 'Barrio Sur' },
  ];

  return (
    <div className="bg-gray-900 border border-gray-800 flex flex-col h-full">
      <div className="bg-gray-800 text-purple-400 font-bold text-center py-2 border-b border-gray-800 uppercase tracking-widest text-xs flex justify-center items-center gap-2">
        <Calendar className="w-4 h-4" />
        Cronograma del Día
      </div>
      
      <div className="flex-1 overflow-auto p-2 space-y-2">
        {eventos.map((evento) => (
          <div 
            key={evento.id}
            onClick={() => onSelectEvent(evento)}
            className={`border p-3 cursor-pointer transition-colors ${
              selectedEvent?.id === evento.id 
                ? 'bg-gray-800 border-purple-500' 
                : 'bg-gray-950 border-gray-800 hover:border-gray-600'
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                <Clock className="w-3 h-3 text-gray-500" />
                <span className="text-gray-300 font-bold text-sm font-mono">{evento.hora}</span>
              </div>
              <EstadoIcon estado={evento.estado} />
            </div>
            
            <h3 className="text-gray-200 font-bold uppercase text-xs mb-1">{evento.cliente}</h3>
            <div className="flex justify-between items-center text-[10px] font-mono">
              <span className="text-gray-500 uppercase">{evento.tipo}</span>
              <span className="text-gray-400">{evento.dir}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EstadoIcon({ estado }) {
  if (estado === 'completado') return <CheckCircle className="w-4 h-4 text-green-500" />;
  if (estado === 'reprogramado') return <AlertCircle className="w-4 h-4 text-yellow-500" />;
  return <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse mt-1"></div>;
}
