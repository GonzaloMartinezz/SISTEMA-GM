import React from 'react';
import { GlassCard } from '../ui/GlassCard';
import WhatsAppButton from '../crm/WhatsAppButton';
import { RotateCcw, Clock } from 'lucide-react';

const mockReplenishments = [
  { id: 1, client: "Centro Odontológico Ruiz", item: "Kit Quirúrgico Premium x5", cycleDays: 45, daysRemaining: 3, phone: "+549112345678" },
  { id: 2, client: "Sonrisas Kids", item: "Anestesia Local (Caja x50)", cycleDays: 30, daysRemaining: -2, phone: "+549115555666" }, // Atrasado
];

export default function ReplenishmentAlerts() {
  return (
    <GlassCard className="flex flex-col h-full bg-surfaceHighlight/20 border-accent/20">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-xl bg-accent/10 text-accent">
          <RotateCcw className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-text">Reposición Inteligente</h3>
          <p className="text-xs text-textMuted">Algoritmo predictivo de insumos</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-4 overflow-y-auto pr-2">
        {mockReplenishments.map((alert) => {
          const isOverdue = alert.daysRemaining < 0;
          const statusText = isOverdue 
            ? `Retrasado hace ${Math.abs(alert.daysRemaining)} días`
            : `Renovar en ${alert.daysRemaining} días`;
            
          const msg = `Hola! Notamos que tu stock de ${alert.item} podría estar agotándose (ciclo de ${alert.cycleDays} días). ¿Te preparamos un envío para esta semana?`;

          return (
            <div key={alert.id} className="p-4 rounded-lg bg-background border border-surfaceHighlight hover:border-accent/30 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <p className="font-medium text-sm text-text line-clamp-1">{alert.client}</p>
                <div className="flex items-center gap-1">
                  <Clock className={`w-3 h-3 ${isOverdue ? 'text-accent' : 'text-primary'}`} />
                  <span className={`text-[10px] font-bold ${isOverdue ? 'text-accent' : 'text-primary'}`}>
                    {statusText}
                  </span>
                </div>
              </div>
              <p className="text-xs text-textMuted mb-3 line-clamp-1">{alert.item}</p>
              
              <div className="flex items-center justify-between mt-auto">
                <span className="text-[10px] text-textMuted">Ciclo promedio: {alert.cycleDays} d.</span>
                <WhatsAppButton 
                  phone={alert.phone} 
                  message={msg}
                  className="px-3 py-1 rounded-md text-xs bg-surfaceHighlight hover:bg-[#25D366]/20 border-none w-auto"
                />
              </div>
            </div>
          );
        })}
        {mockReplenishments.length === 0 && (
          <p className="text-center text-sm text-textMuted py-4">No hay alertas pendientes hoy.</p>
        )}
      </div>
    </GlassCard>
  );
}
