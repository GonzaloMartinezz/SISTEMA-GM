import React from 'react';
import { AlertCircle, CheckSquare } from 'lucide-react';

export default function ClientQuickSummary({ notes = "", isEditing, onChange }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
          <AlertCircle className="w-5 h-5 text-orange-500" />
        </div>
        <h3 className="text-lg font-bold text-slate-800 tracking-wide">Notas & Alertas Rápidas</h3>
      </div>

      {isEditing ? (
        <textarea 
          className="w-full h-32 p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none resize-none"
          placeholder="Escribe notas importantes aquí..."
          value={notes}
          onChange={(e) => onChange && onChange(e.target.value)}
        ></textarea>
      ) : (
        notes ? (
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">
            {notes}
          </div>
        ) : (
          <div className="bg-red-50/50 border border-red-100 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <CheckSquare className="w-5 h-5 text-red-500 mt-0.5" />
              <div>
                <h4 className="font-bold text-red-600 mb-1 tracking-wide uppercase text-sm">Próxima Acción</h4>
                <p className="text-slate-600 text-sm mb-2">
                  No hay notas registradas. Edita el perfil para añadir detalles.
                </p>
                <p className="text-xs font-bold text-red-500 font-mono">Status: PENDIENTE</p>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
}
