import React, { useState, useEffect } from 'react';
import { History, Phone, MessageCircle, MapPin, Mail, Send, Loader2 } from 'lucide-react';
import { supabase } from '../../services/supabaseClient';

export default function ClientTimeline({ clientId }) {
  const [interactions, setInteractions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  
  const [newInteraction, setNewInteraction] = useState({
    type: 'WhatsApp',
    note: ''
  });

  const fetchInteractions = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('client_interactions')
        .select('*')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false });

      if (error) {
        // Fallback to mock data if table doesn't exist yet
        console.warn('Could not fetch interactions (maybe table does not exist):', error);
        setInteractions([]);
      } else {
        setInteractions(data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (clientId) fetchInteractions();
  }, [clientId]);

  const handleAddInteraction = async (e) => {
    e.preventDefault();
    if (!newInteraction.note.trim()) return;

    setIsAdding(true);
    try {
      const { error } = await supabase
        .from('client_interactions')
        .insert({
          client_id: clientId,
          type: newInteraction.type,
          note: newInteraction.note
        });

      if (error) throw error;
      
      setNewInteraction({ ...newInteraction, note: '' });
      fetchInteractions();
    } catch (err) {
      console.error('Error adding interaction:', err);
      alert('Asegúrate de haber ejecutado el SQL para crear la tabla client_interactions');
    } finally {
      setIsAdding(false);
    }
  };

  const getTypeStyle = (type) => {
    switch(type) {
      case 'WhatsApp': return { icon: MessageCircle, color: 'text-green-600', bg: 'bg-green-100' };
      case 'Visita Presencial': return { icon: MapPin, color: 'text-red-500', bg: 'bg-red-100' };
      case 'Llamada': return { icon: Phone, color: 'text-blue-500', bg: 'bg-blue-100' };
      case 'Email': return { icon: Mail, color: 'text-purple-500', bg: 'bg-purple-100' };
      default: return { icon: History, color: 'text-slate-500', bg: 'bg-slate-100' };
    }
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm h-full flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
          <History className="w-5 h-5 text-crmTeal" />
        </div>
        <h3 className="text-lg font-bold text-slate-800 tracking-wide">Historial 360°</h3>
      </div>

      {/* Formulario rápido para agregar interacción */}
      <form onSubmit={handleAddInteraction} className="mb-8 bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col gap-3 shrink-0">
        <div className="flex gap-2">
          <select 
            value={newInteraction.type} 
            onChange={(e) => setNewInteraction({...newInteraction, type: e.target.value})}
            className="bg-white text-slate-800 border border-slate-200 rounded-lg text-sm px-3 py-2 outline-none focus:border-crmTeal"
          >
            <option value="WhatsApp">WhatsApp</option>
            <option value="Llamada">Llamada</option>
            <option value="Visita Presencial">Visita Presencial</option>
            <option value="Email">Email</option>
          </select>
          <input 
            type="text" 
            placeholder="¿De qué hablaron?" 
            value={newInteraction.note}
            onChange={(e) => setNewInteraction({...newInteraction, note: e.target.value})}
            className="flex-1 bg-white text-slate-800 border border-slate-200 rounded-lg text-sm px-3 py-2 outline-none focus:border-crmTeal"
          />
          <button 
            type="submit" 
            disabled={isAdding || !newInteraction.note.trim()}
            className="bg-crmTeal hover:bg-teal-600 text-white rounded-lg px-4 py-2 flex items-center justify-center transition-colors disabled:opacity-50"
          >
            {isAdding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </div>
      </form>

      <div className="flex-1 overflow-y-auto pr-4">
        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <Loader2 className="w-6 h-6 animate-spin text-slate-300" />
          </div>
        ) : interactions.length === 0 ? (
          <div className="text-center text-sm text-slate-400 mt-10">No hay interacciones registradas.</div>
        ) : (
          <div className="relative border-l-2 border-slate-100 ml-3 space-y-8 pb-4">
            {interactions.map((interaction) => {
              const style = getTypeStyle(interaction.type);
              const Icon = style.icon;
              return (
                <div key={interaction.id} className="relative pl-6 group">
                  {/* Punto en la línea de tiempo */}
                  <div className={`absolute -left-[17px] top-0 w-8 h-8 rounded-full flex items-center justify-center border-4 border-white shadow-sm ${style.bg}`}>
                    <Icon className={`w-3.5 h-3.5 ${style.color}`} />
                  </div>
                  
                  {/* Contenido */}
                  <div>
                    <div className="flex items-baseline justify-between mb-1">
                      <h4 className={`text-sm font-bold uppercase tracking-wider ${style.color}`}>
                        {interaction.type}
                      </h4>
                      <span className="text-xs text-slate-400 font-mono font-medium">
                        {formatDate(interaction.created_at)}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100 group-hover:border-slate-200 transition-colors shadow-sm whitespace-pre-wrap">
                      {interaction.note}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
