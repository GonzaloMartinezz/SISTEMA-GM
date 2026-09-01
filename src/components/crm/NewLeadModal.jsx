import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { createPipelineLead } from '../../services/api';
import { supabase } from '../../services/supabaseClient';

export default function NewLeadModal({ isOpen, onClose, onSuccess, initialStage = 'comienzo' }) {
  const [formData, setFormData] = useState({
    client_id: '',
    stage_id: initialStage,
    equipment: '',
    amount: '',
  });
  const [clients, setClients] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Cargar lista de clientes para el select
  useEffect(() => {
    if (isOpen) {
      supabase.from('clients').select('id, name').order('name').then(({ data }) => {
        if (data) setClients(data);
      });
      setFormData(prev => ({ ...prev, stage_id: initialStage }));
    }
  }, [isOpen, initialStage]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await createPipelineLead(formData);
      onSuccess(); // Refresca el Kanban
      onClose(); // Cierra el modal
      setFormData({ client_id: '', stage_id: 'comienzo', equipment: '', amount: '' }); // Reset
    } catch (err) {
      setError('Ocurrió un error al crear el lead. Verifica la conexión.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg shadow-xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50">
          <h2 className="text-xl font-bold text-slate-800 tracking-wide">Nueva Cotización / Lead</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}
          <form id="new-lead-form" onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">Seleccionar Cliente *</label>
              <select 
                required
                value={formData.client_id}
                onChange={e => setFormData({...formData, client_id: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-slate-800 focus:border-crmTeal focus:ring-1 focus:ring-crmTeal outline-none transition-all"
              >
                <option value="" disabled>-- Seleccione un cliente --</option>
                {clients.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">Equipo / Producto Cotizado *</label>
              <input 
                type="text" 
                required
                value={formData.equipment}
                onChange={e => setFormData({...formData, equipment: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-slate-800 focus:border-crmTeal focus:ring-1 focus:ring-crmTeal outline-none transition-all"
                placeholder="Ej. Sillón Odontológico Premium"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">Etapa del Embudo</label>
                <select 
                  value={formData.stage_id}
                  onChange={e => setFormData({...formData, stage_id: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-slate-800 focus:border-crmTeal focus:ring-1 focus:ring-crmTeal outline-none transition-all"
                >
                  <option value="comienzo">Comienzo / Charlas</option>
                  <option value="proceso">En Proceso</option>
                  <option value="convencer">Convencer Más</option>
                  <option value="posible">Posible Venta</option>
                  <option value="cerrado">Cerrado / Afiliado</option>
                  <option value="postventa">Post-Venta e Inst.</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">Monto Estimado (USD)</label>
                <input 
                  type="number" 
                  step="0.01"
                  value={formData.amount}
                  onChange={e => setFormData({...formData, amount: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-slate-800 focus:border-crmTeal focus:ring-1 focus:ring-crmTeal outline-none transition-all"
                  placeholder="Ej. 2500"
                />
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
          <button 
            type="button" 
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition-colors"
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            form="new-lead-form"
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-crmTeal hover:bg-crmTeal/90 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Guardando...
              </>
            ) : 'Crear Lead'}
          </button>
        </div>
      </div>
    </div>
  );
}
