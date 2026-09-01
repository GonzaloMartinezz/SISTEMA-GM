import React, { useState } from 'react';
import { GlassCard } from '../ui/GlassCard';
import { GripVertical, XCircle, CheckCircle2, Navigation2 } from 'lucide-react';
import WhatsAppButton from '../crm/WhatsAppButton';

const initialRoute = [
  { id: 1, time: "10:00 AM", client: "Dra. Ana Torres", type: "Visita / Demo", status: "pending", phone: "+549112345678" },
  { id: 2, time: "11:30 AM", client: "Centro Radiológico", type: "Mantenimiento Preventivo", status: "pending", phone: "+549113334444" },
  { id: 3, time: "02:00 PM", client: "Dr. Carlos Ruiz", type: "Firma de Contrato", status: "pending", phone: "+549118889999" },
];

export default function DynamicRouter() {
  const [route, setRoute] = useState(initialRoute);

  const handleCancel = (id) => {
    // Al cancelar una cita, el sistema "recalcula" dinámicamente eliminándola
    setRoute(prev => prev.filter(stop => stop.id !== id));
  };

  const handleComplete = (id) => {
    setRoute(prev => prev.map(stop => stop.id === id ? { ...stop, status: 'completed' } : stop));
  };

  return (
    <GlassCard className="flex flex-col h-full overflow-hidden">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold text-text">Hoja de Ruta (Hoy)</h3>
          <p className="text-xs text-textMuted">Re-enrutamiento dinámico activo</p>
        </div>
        <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold animate-pulse">
          Online
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-2">
        {route.length === 0 ? (
          <div className="text-center py-10 text-textMuted">Ruta completada o vacía.</div>
        ) : (
          route.map((stop, index) => (
            <div key={stop.id} className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${stop.status === 'completed' ? 'bg-surfaceHighlight/30 border-surfaceHighlight opacity-50' : 'bg-surface/80 border-primary/20 hover:border-primary/50'}`}>
              
              <div className="cursor-grab text-textMuted hover:text-text active:cursor-grabbing">
                <GripVertical className="w-5 h-5" />
              </div>
              
              <div className="flex flex-col items-center justify-center min-w-[60px]">
                <span className="text-xs font-bold text-text">{stop.time}</span>
                <div className={`w-2 h-2 rounded-full mt-1 ${stop.status === 'completed' ? 'bg-secondary' : 'bg-primary'}`}></div>
              </div>

              <div className="flex-1 min-w-0 border-l border-surfaceHighlight pl-3">
                <p className={`text-sm font-medium truncate ${stop.status === 'completed' ? 'line-through text-textMuted' : 'text-text'}`}>
                  {stop.client}
                </p>
                <p className="text-xs text-textMuted truncate">{stop.type}</p>
              </div>

              {stop.status === 'pending' && (
                <div className="flex items-center gap-1">
                  <WhatsAppButton 
                    phone={stop.phone} 
                    message={`Hola ${stop.client}, estoy en camino para nuestra visita de las ${stop.time}.`}
                    className="p-1.5"
                  />
                  <button onClick={() => handleComplete(stop.id)} className="p-1.5 text-textMuted hover:text-[#25D366] transition-colors" title="Marcar completada">
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleCancel(stop.id)} className="p-1.5 text-textMuted hover:text-accent transition-colors" title="Cancelar visita (Recalcular ruta)">
                    <XCircle className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
      
      {route.length > 0 && (
        <div className="mt-4 pt-4 border-t border-surfaceHighlight">
          <button className="w-full bg-surfaceHighlight hover:bg-surfaceHighlight/80 text-text text-sm py-2 rounded-lg transition-colors flex items-center justify-center gap-2">
            <Navigation2 className="w-4 h-4" />
            Optimizar Recorrido
          </button>
        </div>
      )}
    </GlassCard>
  );
}
