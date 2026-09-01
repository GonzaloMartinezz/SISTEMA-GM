import React from 'react';
import TicketManager from '../components/postsale/TicketManager';

export default function PostSalePage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 flex flex-col h-full">
      <div>
        <h2 className="text-2xl font-bold text-text mb-1">Post-Venta y Garantías</h2>
        <p className="text-textMuted">Gestión técnica, instalaciones y mantenimientos preventivos.</p>
      </div>

      <div className="flex-1 min-h-[500px]">
        <TicketManager />
      </div>
    </div>
  );
}
