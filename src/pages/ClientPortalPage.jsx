import React from 'react';
import SecureDownloads from '../components/portal/SecureDownloads';

export default function ClientPortalPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 flex flex-col h-full">
      <div>
        <h2 className="text-2xl font-bold text-text mb-1">Portal Seguro 3D (Área de Clientes)</h2>
        <p className="text-textMuted">Repositorio protegido para manuales y software pesado.</p>
      </div>

      <div className="flex-1 min-h-[500px]">
        <SecureDownloads />
      </div>
    </div>
  );
}
