import React from 'react';
import { Bell } from 'lucide-react';

export default function RemindersPage() {
  return (
    <div className="h-full flex flex-col space-y-6 bg-white rounded-xl p-8 shadow-sm border border-slate-200 animate-in fade-in">
      <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
        <div className="p-3 bg-crmAqua/30 rounded-xl text-crmTeal">
          <Bell className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800">Recordatorios</h2>
          <p className="text-sm text-slate-500">Vista de calendario para tareas y alertas</p>
        </div>
      </div>
      
      <div className="flex-1 flex items-center justify-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
        <div className="text-center">
          <Bell className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-600 mb-1">Módulo de Recordatorios en construcción</h3>
          <p className="text-slate-400 text-sm max-w-sm mx-auto">Aquí podrás ver tu calendario semanal y mensual con todos los recordatorios automáticos y manuales.</p>
        </div>
      </div>
    </div>
  );
}
