import React from 'react';
import { FileText, Download, CheckCircle, FileWarning } from 'lucide-react';

export default function AddendumWidget() {
  const addendums = [
    { id: 'AD-2023-142', client: 'Hospital Aleman', status: 'Aprobado', amount: '$45,000' },
    { id: 'AD-2023-143', client: 'Clínica Mayo', status: 'Pendiente Firma', amount: '$12,500' },
    { id: 'AD-2023-144', client: 'Centro Médico Sur', status: 'Revisión', amount: '$8,900' },
  ];

  return (
    <div className="bg-surface/40 backdrop-blur-md border border-white/5 rounded-2xl p-6 shadow-xl flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-secondary/20 flex items-center justify-center border border-secondary/30 shadow-[0_0_15px_rgba(191,0,255,0.2)]">
            <FileText className="w-4 h-4 text-secondary" />
          </div>
          <h3 className="text-lg font-bold text-white tracking-wide">Últimas Adendas</h3>
        </div>
      </div>

      <div className="space-y-3">
        {addendums.map((doc) => (
          <div key={doc.id} className="flex items-center justify-between p-3 rounded-xl bg-black/20 border border-white/5 hover:border-white/10 hover:bg-black/40 transition-colors">
            <div className="flex gap-3 items-center">
              {doc.status === 'Aprobado' ? (
                <CheckCircle className="w-5 h-5 text-green-400" />
              ) : (
                <FileWarning className="w-5 h-5 text-orange-400" />
              )}
              <div>
                <p className="text-sm font-semibold text-white">{doc.client}</p>
                <p className="text-[10px] font-mono text-textMuted">{doc.id} • {doc.amount}</p>
              </div>
            </div>
            
            <button className="text-textMuted hover:text-primary transition-colors p-2 rounded-full hover:bg-white/5">
              <Download className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
