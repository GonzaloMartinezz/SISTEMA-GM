import React, { useState } from 'react';
import { GlassCard } from '../ui/GlassCard';
import { Lock, FileArchive, Download, Folder } from 'lucide-react';

const mockFiles = [
  { id: 1, name: "Driver_Ecografo_v2.1.zip", type: "Software", size: "145 MB", date: "10 May 2024" },
  { id: 2, name: "Manual_Calibracion_Tomografo.pdf", type: "Documentación", size: "12 MB", date: "02 May 2024" },
  { id: 3, name: "Garantias_Digitales_2024.zip", type: "Legal", size: "45 MB", date: "15 Abr 2024" },
];

export default function SecureDownloads() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [accessCode, setAccessCode] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    // Simulación de acceso por DNI/Matrícula
    if (accessCode.length > 5) {
      setIsUnlocked(true);
    }
  };

  if (!isUnlocked) {
    return (
      <GlassCard className="h-full flex flex-col items-center justify-center p-8 bg-surfaceHighlight/10">
        <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-6">
          <Lock className="w-8 h-8 text-accent" />
        </div>
        <h3 className="text-2xl font-bold text-text mb-2 text-center">Portal de Acceso Seguro</h3>
        <p className="text-textMuted text-center max-w-md mb-8">
          Ingrese su número de DNI o Matrícula Profesional para acceder a sus manuales, software y certificados de garantía.
        </p>
        
        <form onSubmit={handleLogin} className="w-full max-w-sm flex flex-col gap-4">
          <input 
            type="password" 
            placeholder="DNI o Matrícula"
            value={accessCode}
            onChange={(e) => setAccessCode(e.target.value)}
            className="w-full bg-background border border-surfaceHighlight rounded-lg py-3 px-4 text-center text-lg tracking-[0.5em] text-text focus:border-accent focus:ring-1 focus:ring-accent outline-none font-mono"
            required
          />
          <button 
            type="submit"
            className="w-full bg-accent/20 text-accent border border-accent/30 py-3 rounded-lg font-bold hover:bg-accent/30 hover:shadow-neon-pink transition-all"
          >
            VALIDAR ACCESO
          </button>
        </form>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="flex flex-col h-full border-primary/20">
      <div className="flex justify-between items-end mb-8 border-b border-surfaceHighlight pb-4">
        <div>
          <h3 className="text-xl font-bold text-text flex items-center gap-2">
            <Folder className="w-6 h-6 text-primary" />
            Repositorio del Cliente
          </h3>
          <p className="text-sm text-textMuted mt-1">Sesión iniciada correctamente.</p>
        </div>
        <button onClick={() => setIsUnlocked(false)} className="text-xs text-textMuted hover:text-accent transition-colors underline">
          Cerrar Sesión
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockFiles.map(file => (
          <div key={file.id} className="bg-background border border-surfaceHighlight p-4 rounded-xl hover:border-primary/50 transition-colors group">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-surfaceHighlight/30 rounded-lg group-hover:bg-primary/10 transition-colors">
                <FileArchive className="w-6 h-6 text-textMuted group-hover:text-primary transition-colors" />
              </div>
              <button className="text-textMuted hover:text-primary p-2">
                <Download className="w-5 h-5" />
              </button>
            </div>
            <p className="font-medium text-text text-sm truncate" title={file.name}>{file.name}</p>
            <div className="flex items-center justify-between mt-3 text-xs text-textMuted">
              <span className="bg-surfaceHighlight px-2 py-0.5 rounded">{file.type}</span>
              <span>{file.size}</span>
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
