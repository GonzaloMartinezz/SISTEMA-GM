import React, { useState } from 'react';
import { GlassCard } from '../ui/GlassCard';
import { Settings, AlertOctagon, CheckCircle, Clock } from 'lucide-react';
import WhatsAppButton from '../crm/WhatsAppButton';

const mockTickets = [
  { id: "TK-102", client: "Dr. Carlos Ruiz", equipo: "Sillón Odontológico", issue: "Falla en el pedal de elevación", priority: "Alta", status: "Pendiente", date: "2024-05-15", phone: "+5491122223333" },
  { id: "TK-103", client: "Centro Radiológico", equipo: "Tomógrafo 3D", issue: "Mantenimiento Preventivo (6 meses)", priority: "Media", status: "Programado", date: "2024-05-18", phone: "+5491144445555" },
  { id: "TK-101", client: "VetLife", equipo: "Ecógrafo Portátil", issue: "Calibración de software", priority: "Baja", status: "Resuelto", date: "2024-05-10", phone: "+5491166667777" },
];

export default function TicketManager() {
  return (
    <GlassCard className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-bold text-text flex items-center gap-2">
            <Settings className="w-5 h-5 text-primary" />
            Gestión de Tickets y Garantías
          </h3>
          <p className="text-sm text-textMuted">Seguimiento de instalaciones y fallas técnicas</p>
        </div>
        <button className="bg-primary/10 text-primary border border-primary/30 px-4 py-2 rounded-md text-sm font-semibold hover:bg-primary/20 transition-all">
          Nuevo Ticket
        </button>
      </div>

      <div className="flex-1 overflow-x-auto">
        <table className="w-full text-left text-sm min-w-[700px]">
          <thead className="text-textMuted bg-background/50 border-y border-surfaceHighlight">
            <tr>
              <th className="px-4 py-3 font-medium">Ticket ID</th>
              <th className="px-4 py-3 font-medium">Cliente / Equipo</th>
              <th className="px-4 py-3 font-medium">Problema</th>
              <th className="px-4 py-3 font-medium text-center">Prioridad</th>
              <th className="px-4 py-3 font-medium text-center">Estado</th>
              <th className="px-4 py-3 font-medium text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surfaceHighlight">
            {mockTickets.map(ticket => (
              <tr key={ticket.id} className="hover:bg-surfaceHighlight/50 transition-colors group">
                <td className="px-4 py-3 font-mono text-xs text-primary">{ticket.id}</td>
                <td className="px-4 py-3">
                  <p className="font-medium text-text">{ticket.client}</p>
                  <p className="text-xs text-textMuted">{ticket.equipo}</p>
                </td>
                <td className="px-4 py-3">
                  <p className="text-text max-w-[200px] truncate" title={ticket.issue}>{ticket.issue}</p>
                  <p className="text-xs text-textMuted flex items-center gap-1 mt-1">
                    <Clock className="w-3 h-3" /> {ticket.date}
                  </p>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className={`text-xs font-bold ${ticket.priority === 'Alta' ? 'text-accent' : ticket.priority === 'Media' ? 'text-secondary' : 'text-primary'}`}>
                    {ticket.priority}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase border ${
                    ticket.status === 'Resuelto' ? 'bg-[#25D366]/10 text-[#25D366] border-[#25D366]/30' :
                    ticket.status === 'Programado' ? 'bg-secondary/10 text-secondary border-secondary/30' :
                    'bg-accent/10 text-accent border-accent/30'
                  }`}>
                    {ticket.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-2">
                    <WhatsAppButton 
                      phone={ticket.phone} 
                      message={`Hola ${ticket.client}, te contacto por el ticket ${ticket.id} referente a tu ${ticket.equipo}.`}
                      className="p-1.5"
                    />
                    {ticket.status !== 'Resuelto' && (
                      <button className="p-1.5 text-textMuted hover:text-[#25D366] transition-colors" title="Marcar Resuelto">
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </GlassCard>
  );
}
