import React from 'react';
import ClientTable from '../components/crm/ClientTable';
import PipelineKanban from '../components/crm/PipelineKanban';

export default function CrmPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 flex flex-col h-full">
      <div>
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-crmGreen to-crmSand mb-1 tracking-wide">CRM & Gestión de Leads</h2>
        <p className="text-textMuted">Administra tus contactos, da seguimiento y cierra ventas por WhatsApp.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 flex-1 min-h-[500px]">
        {/* Tabla de Clientes - 2 Columnas en pantallas grandes */}
        <div className="xl:col-span-2 flex flex-col">
          <ClientTable />
        </div>
        
        {/* Kanban Pipeline - 1 Columna, scroll vertical si es necesario */}
        <div className="xl:col-span-1 bg-surface/30 rounded-xl p-4 border border-surfaceHighlight flex flex-col">
          <h3 className="text-lg font-semibold text-text mb-4">Pipeline Activo</h3>
          <div className="flex-1 overflow-hidden">
            <PipelineKanban />
          </div>
        </div>
      </div>
    </div>
  );
}
