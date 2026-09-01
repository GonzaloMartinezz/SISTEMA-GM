import React, { useState } from 'react';
import { PhoneForwarded, PhoneMissed, Save, Clock } from 'lucide-react';

export default function RegistroLlamadaPanel() {
  const [quienAtiende, setQuienAtiende] = useState('');
  const [respuestaGestion, setRespuestaGestion] = useState('');
  const [observaciones, setObservaciones] = useState('');

  return (
    <div className="bg-gray-900 border border-gray-800 flex flex-col h-full">
      <div className="bg-gray-800 text-red-400 font-bold text-center py-2 border-b border-gray-800 uppercase tracking-widest text-xs">
        Gestión Operativa de Llamados
      </div>
      
      {/* Formulario de Registro */}
      <div className="p-4 space-y-4 font-mono text-xs flex-shrink-0">
        <div className="grid grid-cols-[120px_1fr] items-center gap-2">
          <label className="text-gray-500 uppercase font-bold">Quién Atiende</label>
          <input 
            type="text" 
            value={quienAtiende}
            onChange={(e) => setQuienAtiende(e.target.value)}
            placeholder="Ej: Secretaria, Titular, Familiar"
            className="bg-gray-950 border border-gray-700 text-gray-200 px-2 py-1.5 focus:border-red-500 outline-none"
          />
        </div>

        <div className="grid grid-cols-[120px_1fr] items-center gap-2">
          <label className="text-gray-500 uppercase font-bold">Respuesta</label>
          <select 
            value={respuestaGestion}
            onChange={(e) => setRespuestaGestion(e.target.value)}
            className="bg-gray-950 border border-gray-700 text-gray-200 px-2 py-1.5 focus:border-red-500 outline-none cursor-pointer"
          >
            <option value="">Seleccione respuesta de gestión...</option>
            <option value="compromiso_pago">Compromiso de Pago</option>
            <option value="no_reconoce_deuda">No Reconoce Deuda</option>
            <option value="pide_refinanciacion">Solicita Refinanciación</option>
            <option value="volver_a_llamar">Volver a Llamar</option>
            <option value="buzon">Buzón de Voz / No Contesta</option>
          </select>
        </div>

        <div className="grid grid-cols-[120px_1fr] items-start gap-2">
          <label className="text-gray-500 uppercase font-bold mt-1">Observaciones</label>
          <textarea 
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
            rows="3"
            placeholder="Nota o grabación de respuesta..."
            className="bg-gray-950 border border-gray-700 text-gray-200 px-2 py-1.5 focus:border-red-500 outline-none resize-none"
          />
        </div>

        {/* Botonera de Acción de Cobranza */}
        <div className="flex gap-2 justify-end border-t border-gray-800 pt-4 mt-2">
          <button className="flex items-center gap-1 bg-gray-950 border border-gray-700 text-gray-400 hover:text-gray-200 px-3 py-1.5 transition-colors">
            <PhoneMissed className="w-3 h-3" /> Omitir Llamado
          </button>
          <button className="flex items-center gap-1 bg-gray-950 border border-yellow-700/50 text-yellow-500 hover:bg-yellow-900/20 px-3 py-1.5 transition-colors">
            <Clock className="w-3 h-3" /> Llamar Después
          </button>
          <button className="flex items-center gap-1 bg-red-950/30 border border-red-700 text-red-400 hover:bg-red-900/50 px-4 py-1.5 font-bold transition-colors shadow-[0_0_10px_rgba(248,113,113,0.1)]">
            <Save className="w-3 h-3" /> Grabar Respuesta
          </button>
        </div>
      </div>

      {/* Historial de Notas Grabadas */}
      <div className="flex-1 flex flex-col border-t border-gray-800 min-h-0 bg-gray-950">
        <div className="text-gray-500 text-[10px] uppercase font-bold p-2 border-b border-gray-800 sticky top-0 bg-gray-950">
          Historial de Llamados al Titular
        </div>
        <div className="overflow-auto p-2 space-y-2 flex-1">
          {/* Ejemplo de registro iterativo */}
          <div className="border border-gray-800 p-2 bg-gray-900">
            <div className="flex justify-between text-[10px] text-gray-500 mb-1">
              <span>28/08/2026 - 14:30 hs</span>
              <span className="text-yellow-400">Volver a Llamar</span>
            </div>
            <p className="text-xs text-gray-300 font-mono">
              Atendió la secretaria (María). El Dr. está en cirugía, pidió que nos comuniquemos el viernes por la mañana para coordinar transferencia.
            </p>
          </div>
          <div className="border border-gray-800 p-2 bg-gray-900">
            <div className="flex justify-between text-[10px] text-gray-500 mb-1">
              <span>25/08/2026 - 09:15 hs</span>
              <span className="text-red-400">Buzón de Voz</span>
            </div>
            <p className="text-xs text-gray-300 font-mono">
              Se dejó mensaje en el contestador indicando el vencimiento próximo de la cuota 2.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
