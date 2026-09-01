import React from 'react';
import { Route, Plus, MessageCircle, AlertTriangle } from 'lucide-react';

export default function ControladorLogistico() {
  return (
    <div className="bg-gray-900/90 border border-purple-500/30 backdrop-blur-md p-3 flex justify-between items-center shadow-[0_0_20px_rgba(139,92,246,0.15)]">
      <div className="flex gap-2">
        <button className="flex items-center gap-2 bg-gray-950 border border-gray-700 text-gray-300 hover:border-purple-500 hover:text-purple-400 px-4 py-2 transition-colors text-xs font-bold uppercase tracking-wider">
          <Route className="w-4 h-4" />
          Recalcular Ruta
        </button>
        <button className="flex items-center gap-2 bg-gray-950 border border-gray-700 text-gray-300 hover:border-cyan-500 hover:text-cyan-400 px-4 py-2 transition-colors text-xs font-bold uppercase tracking-wider">
          <Plus className="w-4 h-4" />
          Añadir Parada
        </button>
      </div>
      
      <div className="flex gap-2">
        <button className="flex items-center gap-2 bg-[#075E54]/20 border border-[#25D366]/50 text-[#25D366] hover:bg-[#075E54]/40 px-4 py-2 transition-colors text-xs font-bold uppercase tracking-wider">
          <MessageCircle className="w-4 h-4" />
          Aviso Demora (WhatsApp)
        </button>
        <button className="flex items-center gap-2 bg-red-950/30 border border-red-700/50 text-red-400 hover:bg-red-900/50 px-4 py-2 transition-colors text-xs font-bold uppercase tracking-wider">
          <AlertTriangle className="w-4 h-4" />
          Reportar Siniestro
        </button>
      </div>
    </div>
  );
}
