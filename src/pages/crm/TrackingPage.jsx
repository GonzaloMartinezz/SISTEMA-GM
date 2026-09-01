import React from 'react';
import PipelineKanban from '../../components/crm/PipelineKanban';

export default function TrackingPage() {
  return (
    <div className="h-full flex flex-col space-y-4">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Seguimientos (Pipeline)</h2>
          <p className="text-sm text-slate-500">Mueve a los clientes a través del embudo de conversión</p>
        </div>
      </div>
      <div className="flex-1 bg-crmLightBg rounded-xl overflow-hidden shadow-sm border border-slate-200">
        <PipelineKanban />
      </div>
    </div>
  );
}
