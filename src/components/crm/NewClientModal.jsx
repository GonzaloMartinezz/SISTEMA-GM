import React, { useState } from 'react';
import { X } from 'lucide-react';
import { createClient } from '../../services/api';

export default function NewClientModal({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    specialty: 'Odontología',
    clinic: '',
    phone: '',
    zone: '',
  });
  const [zoneSuggestions, setZoneSuggestions] = useState([]);
  const [isSearchingZone, setIsSearchingZone] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Funcioón para buscar zonas en OpenStreetMap (Nominatim)
  const searchZone = async (query) => {
    setFormData({ ...formData, zone: query });
    if (query.length < 3) {
      setZoneSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    
    setIsSearchingZone(true);
    setShowSuggestions(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}, Tucuman, Argentina&addressdetails=1&limit=5`);
      const data = await res.json();
      setZoneSuggestions(data);
    } catch (err) {
      console.error("Error fetching location:", err);
    } finally {
      setIsSearchingZone(false);
    }
  };

  const handleSelectZone = (suggestion) => {
    // Formateamos para mostrar calle y ciudad
    const address = suggestion?.address || {};
    const road = address?.road || '';
    const city = address?.city || address?.town || address?.village || address?.suburb || '';
    const formatted = road ? `${road}, ${city}` : suggestion?.display_name?.split(',').slice(0,2).join(',');
    
    setFormData({ ...formData, zone: formatted || '' });
    setShowSuggestions(false);
  };

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await createClient(formData);
      onSuccess(); // Refresca la tabla
      onClose(); // Cierra el modal
      setFormData({ name: '', specialty: 'Odontología', clinic: '', phone: '', zone: '' }); // Reset
    } catch (err) {
      setError('Ocurrió un error al guardar el cliente. Verifica la conexión.');
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
          <h2 className="text-xl font-bold text-slate-800 tracking-wide">Nuevo Cliente</h2>
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
          <form id="new-client-form" onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">Nombre Completo *</label>
              <input 
                type="text" 
                required
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-slate-800 focus:border-crmTeal focus:ring-1 focus:ring-crmTeal outline-none transition-all"
                placeholder="Ej. Dr. Roberto Martínez"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">Especialidad *</label>
                <select 
                  value={formData.specialty}
                  onChange={e => setFormData({...formData, specialty: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-slate-800 focus:border-crmTeal focus:ring-1 focus:ring-crmTeal outline-none transition-all"
                >
                  <option value="Odontología">Odontología</option>
                  <option value="Veterinaria">Veterinaria</option>
                  <option value="Diagnóstico">Diagnóstico por Imagen</option>
                  <option value="Medicina General">Medicina General</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">Teléfono</label>
                <input 
                  type="text" 
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-slate-800 focus:border-crmTeal focus:ring-1 focus:ring-crmTeal outline-none transition-all"
                  placeholder="Ej. 5491122334455"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">Clínica / Institución</label>
              <input 
                type="text" 
                value={formData.clinic}
                onChange={e => setFormData({...formData, clinic: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-slate-800 focus:border-crmTeal focus:ring-1 focus:ring-crmTeal outline-none transition-all"
                placeholder="Ej. Hospital Privado del Norte"
              />
            </div>

            <div className="space-y-1 relative">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">Zona / Dirección</label>
              <div className="relative">
                <input 
                  type="text" 
                  value={formData.zone}
                  onChange={e => searchZone(e.target.value)}
                  onFocus={() => { if(formData.zone.length >= 3) setShowSuggestions(true) }}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-slate-800 focus:border-crmTeal focus:ring-1 focus:ring-crmTeal outline-none transition-all"
                  placeholder="Ej. Barrio Sur, Tucumán"
                  autoComplete="off"
                />
                {isSearchingZone && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-crmTeal border-t-transparent rounded-full animate-spin"></div>
                )}
              </div>
              
              {/* Dropdown de Sugerencias */}
              {showSuggestions && zoneSuggestions.length > 0 && (
                <ul className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-48 overflow-y-auto overflow-x-hidden">
                  {zoneSuggestions.map((s, idx) => (
                    <li 
                      key={idx}
                      onClick={() => handleSelectZone(s)}
                      className="px-4 py-3 hover:bg-slate-50 cursor-pointer text-sm text-slate-700 border-b border-slate-100 last:border-0 transition-colors"
                    >
                      <span className="font-bold text-slate-800 block">{s.display_name.split(',')[0]}</span>
                      <span className="text-xs text-slate-500 truncate">{s.display_name}</span>
                    </li>
                  ))}
                </ul>
              )}
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
            form="new-client-form"
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-crmTeal hover:bg-crmTeal/90 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Guardando...
              </>
            ) : 'Guardar Cliente'}
          </button>
        </div>
      </div>
    </div>
  );
}
