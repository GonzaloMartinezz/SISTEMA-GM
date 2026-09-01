import React, { useState, useEffect } from 'react';
import { X, User, Phone, MapPin, Building2, MessageSquare, Edit3, Save } from 'lucide-react';
import { useClient } from '../../context/ClientContext';
import ClientScoring from './ClientScoring';
import ClientTimeline from './ClientTimeline';
import ClientQuickSummary from './ClientQuickSummary';
import { supabase } from '../../services/supabaseClient';

export default function ClientProfileModal() {
  const { isProfileOpen, selectedClient, closeClientProfile } = useClient();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (selectedClient) {
      setFormData({
        name: selectedClient.name || '',
        clinic: selectedClient.clinic || '',
        phone: selectedClient.phone || '',
        zone: selectedClient.zone || '',
        specialty: selectedClient.specialty || '',
        scoring: selectedClient.scoring || selectedClient.score || 50,
        notes: selectedClient.notes || ''
      });
      setIsEditing(false);
    }
  }, [selectedClient]);

  if (!isProfileOpen || !selectedClient || !formData) return null;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('clients')
        .update({
          name: formData.name,
          clinic: formData.clinic,
          phone: formData.phone,
          zone: formData.zone,
          specialty: formData.specialty,
          score: formData.scoring,
          notes: formData.notes
        })
        .eq('id', selectedClient.id);

      if (error) throw error;
      
      // Ideally we would update the client in context or trigger a refresh
      // For now we just close edit mode
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating client:', err);
      alert('Error al guardar los cambios.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 transition-opacity flex justify-center items-center p-4 md:p-8"
        onClick={closeClientProfile}
      >
        {/* Modal Container */}
        <div 
          className="bg-slate-50 w-full max-w-5xl h-full max-h-[90vh] rounded-[32px] shadow-2xl flex flex-col overflow-hidden relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header del Perfil */}
          <div className="p-6 md:p-8 border-b border-slate-200 bg-white relative shrink-0">
            <button 
              onClick={closeClientProfile}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="flex items-start gap-6">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-crmTeal/20 to-crmAqua/20 border border-crmTeal/20 flex items-center justify-center shadow-sm shrink-0">
                <User className="w-10 h-10 text-crmTeal" />
              </div>
              
              <div className="flex-1 pt-1">
                {isEditing ? (
                  <div className="space-y-3 max-w-xl">
                    <input 
                      type="text" 
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="text-2xl font-bold text-slate-800 w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 focus:border-crmTeal focus:ring-1 focus:ring-crmTeal outline-none"
                      placeholder="Nombre del Cliente"
                    />
                    <input 
                      type="text" 
                      name="clinic"
                      value={formData.clinic}
                      onChange={handleChange}
                      className="text-sm font-bold text-crmTeal uppercase tracking-widest w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 focus:border-crmTeal focus:ring-1 focus:ring-crmTeal outline-none"
                      placeholder="Empresa / Clínica"
                    />
                  </div>
                ) : (
                  <>
                    <h2 className="text-3xl font-bold text-slate-800 tracking-wide">{formData.name}</h2>
                    <p className="text-crmTeal font-bold mt-1 uppercase tracking-widest text-sm">{formData.clinic}</p>
                  </>
                )}
                
                <div className="flex flex-wrap gap-4 mt-4">
                  <div className="flex items-center gap-2 text-sm text-slate-500 font-medium bg-white px-3 py-1.5 rounded-lg border border-slate-100 shadow-sm">
                    <Phone className="w-4 h-4 text-slate-400" />
                    {isEditing ? (
                      <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="bg-transparent outline-none w-32" />
                    ) : (formData.phone || '+54 9 11 2233-4455')}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-500 font-medium bg-white px-3 py-1.5 rounded-lg border border-slate-100 shadow-sm">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    {isEditing ? (
                      <input type="text" name="zone" value={formData.zone} onChange={handleChange} className="bg-transparent outline-none w-32" />
                    ) : (formData.zone || 'Centro Médico')}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-500 font-medium bg-white px-3 py-1.5 rounded-lg border border-slate-100 shadow-sm">
                    <Building2 className="w-4 h-4 text-slate-400" />
                    {isEditing ? (
                      <input type="text" name="specialty" value={formData.specialty} onChange={handleChange} className="bg-transparent outline-none w-32" />
                    ) : (formData.specialty || 'Especialidad')}
                  </div>
                </div>
              </div>

              {/* Botones de acción derecha superior */}
              <div className="flex flex-col gap-3 ml-auto mt-2">
                {isEditing ? (
                  <button onClick={handleSave} disabled={isSaving} className="bg-crmTeal hover:bg-teal-600 text-white font-bold py-2.5 px-5 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm disabled:opacity-50">
                    <Save className="w-4 h-4" />
                    {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                  </button>
                ) : (
                  <button onClick={() => setIsEditing(true)} className="px-5 py-2.5 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-colors font-bold bg-white shadow-sm flex items-center gap-2">
                    <Edit3 className="w-4 h-4" />
                    Editar Perfil
                  </button>
                )}
                <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2.5 px-5 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm">
                  <MessageSquare className="w-4 h-4" />
                  WhatsApp
                </button>
              </div>
            </div>
          </div>

          {/* Contenido (Scrollable) */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-50/50">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Columna Izquierda: Termómetro y Resumen */}
              <div className="space-y-8">
                <ClientScoring 
                  score={formData.scoring} 
                  isEditing={isEditing} 
                  onChange={(val) => setFormData(p => ({...p, scoring: val}))} 
                />
                <ClientQuickSummary 
                  notes={formData.notes} 
                  isEditing={isEditing}
                  onChange={(val) => setFormData(p => ({...p, notes: val}))}
                />
              </div>
              
              {/* Columna Derecha: Timeline (Historial) */}
              <div className="space-y-8 h-full min-h-[400px]">
                <ClientTimeline clientId={selectedClient.id} />
              </div>

            </div>
          </div>
          
        </div>
      </div>
    </>
  );
}
