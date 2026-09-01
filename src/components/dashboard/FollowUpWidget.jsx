import React from 'react';
import { Phone, Mail, Calendar, MoreHorizontal, ArrowUpRight } from 'lucide-react';

export default function FollowUpWidget() {
  const followUps = [
    { id: 1, client: 'Dr. Roberto Sánchez', type: 'Llamada', date: 'Hoy, 10:30 AM', status: 'Pendiente', equipment: 'Ecógrafo V6' },
    { id: 2, client: 'Clínica Las Condes', type: 'Demo', date: 'Hoy, 14:00 PM', status: 'En Progreso', equipment: 'Monitor de Signos Vitales' },
    { id: 3, client: 'Dra. María Gómez', type: 'Email', date: 'Ayer', status: 'Completado', equipment: 'Desfibrilador' },
    { id: 4, client: 'Hospital Central', type: 'Reunión', date: 'Mañana, 09:00 AM', status: 'Agendado', equipment: 'Mesa de Anestesia' },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pendiente': return 'text-orange-400 bg-orange-400/10 border-orange-400/20';
      case 'En Progreso': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'Completado': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'Agendado': return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'Llamada': return <Phone className="w-4 h-4" />;
      case 'Email': return <Mail className="w-4 h-4" />;
      case 'Reunión': return <Calendar className="w-4 h-4" />;
      case 'Demo': return <ArrowUpRight className="w-4 h-4" />;
      default: return <MoreHorizontal className="w-4 h-4" />;
    }
  };

  return (
    <div className="bg-surface/40 backdrop-blur-md border border-white/5 rounded-2xl p-6 h-full flex flex-col shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-white tracking-wide">Seguimientos Activos</h3>
          <p className="text-sm text-textMuted mt-1">Próximos pasos con clientes</p>
        </div>
        <button className="text-xs font-semibold text-primary hover:text-white transition-colors bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20 hover:bg-primary/20">
          Ver todos
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 space-y-4">
        {followUps.map((item) => (
          <div key={item.id} className="flex items-start justify-between p-4 rounded-xl bg-black/20 border border-white/5 hover:border-white/10 hover:bg-black/40 transition-all group">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-textMuted group-hover:text-primary transition-colors border border-white/5">
                {getIcon(item.type)}
              </div>
              <div>
                <h4 className="font-semibold text-white text-sm">{item.client}</h4>
                <p className="text-xs text-textMuted mt-1">{item.equipment} • {item.date}</p>
              </div>
            </div>
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border ${getStatusColor(item.status)}`}>
              {item.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
