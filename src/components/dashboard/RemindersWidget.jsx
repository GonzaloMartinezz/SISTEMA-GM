import React from 'react';
import { Bell, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';

export default function RemindersWidget() {
  const reminders = [
    { id: 1, title: 'Renovar licencia de software CRM', time: 'En 2 horas', priority: 'high' },
    { id: 2, title: 'Confirmar pago Hospital Austral', time: 'Hoy, 16:00', priority: 'medium' },
    { id: 3, title: 'Reunión de equipo - Logística', time: 'Mañana, 09:00', priority: 'low' },
    { id: 4, title: 'Enviar reporte mensual al CEO', time: 'Viernes', priority: 'high' },
  ];

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return <AlertTriangle className="w-4 h-4 text-accent" />;
      case 'medium': return <Clock className="w-4 h-4 text-orange-400" />;
      case 'low': return <CheckCircle2 className="w-4 h-4 text-green-400" />;
      default: return <Bell className="w-4 h-4 text-primary" />;
    }
  };

  return (
    <div className="bg-surface/40 backdrop-blur-md border border-white/5 rounded-2xl p-6 shadow-xl flex flex-col h-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center border border-accent/30 shadow-[0_0_15px_rgba(255,0,85,0.2)]">
          <Bell className="w-4 h-4 text-accent animate-pulse" />
        </div>
        <h3 className="text-lg font-bold text-white tracking-wide">Recordatorios</h3>
      </div>

      <div className="space-y-4 flex-1">
        {reminders.map((reminder) => (
          <div key={reminder.id} className="flex gap-4 group cursor-pointer">
            <div className="mt-1">
              {getPriorityIcon(reminder.priority)}
            </div>
            <div className="flex-1 pb-4 border-b border-white/5 group-last:border-0 group-last:pb-0">
              <h4 className="text-sm font-medium text-white group-hover:text-primary transition-colors">{reminder.title}</h4>
              <p className="text-xs text-textMuted mt-1">{reminder.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
