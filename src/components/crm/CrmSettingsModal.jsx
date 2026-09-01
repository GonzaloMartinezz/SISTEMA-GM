import React, { useState } from 'react';
import { X, Sliders, Bell, Users, Palette, CheckCircle2 } from 'lucide-react';
import { cn } from '../ui/NeonButton';

export default function CrmSettingsModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('general');
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1000);
  };

  const tabs = [
    { id: 'general', name: 'General', icon: Sliders },
    { id: 'notifications', name: 'Notificaciones', icon: Bell },
    { id: 'users', name: 'Permisos', icon: Users },
    { id: 'appearance', name: 'Apariencia', icon: Palette },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[500px]">
        
        {/* Sidebar Tabs */}
        <div className="w-full md:w-64 bg-slate-50 border-r border-slate-100 p-6 flex flex-col gap-2">
          <div className="mb-6 flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded bg-crmTeal/10 flex items-center justify-center">
              <Sliders className="w-4 h-4 text-crmTeal" />
            </div>
            <h2 className="text-lg font-bold text-slate-800">Ajustes CRM</h2>
          </div>
          
          <nav className="flex-1 space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left",
                  activeTab === tab.id 
                    ? "bg-white text-crmTeal shadow-sm border border-slate-200" 
                    : "text-slate-600 hover:bg-slate-200 hover:text-slate-900 border border-transparent"
                )}
              >
                <tab.icon className={cn("w-4 h-4", activeTab === tab.id ? "text-crmTeal" : "text-slate-400")} />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col bg-white">
          <div className="flex justify-end p-4 border-b border-slate-100">
            <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 p-8 overflow-y-auto">
            {/* Tab: General */}
            {activeTab === 'general' && (
              <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
                <div>
                  <h3 className="text-xl font-bold text-slate-800 mb-1">Configuración General</h3>
                  <p className="text-sm text-slate-500 mb-6">Administra las preferencias generales del módulo CRM.</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">Moneda Principal</h4>
                      <p className="text-xs text-slate-500">Moneda por defecto para cotizaciones</p>
                    </div>
                    <select className="bg-white border border-slate-200 text-sm rounded-lg px-3 py-1.5 outline-none focus:border-crmTeal focus:ring-1 focus:ring-crmTeal">
                      <option>USD ($)</option>
                      <option>ARS ($)</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">Sincronización Automática</h4>
                      <p className="text-xs text-slate-500">Sincronizar base de datos con el servidor central cada 5 min</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-crmTeal"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Notificaciones */}
            {activeTab === 'notifications' && (
              <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
                <div>
                  <h3 className="text-xl font-bold text-slate-800 mb-1">Preferencias de Notificaciones</h3>
                  <p className="text-sm text-slate-500 mb-6">Elige qué eventos disparan alertas.</p>
                </div>
                
                <div className="space-y-4">
                  {['Nuevos Clientes Registrados', 'Actualizaciones en el Pipeline', 'Recordatorios de Agenda', 'Cambios en el Scoring'].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="text-sm font-bold text-slate-700">{item}</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked={idx !== 3} />
                        <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-crmTeal"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Other tabs as placeholders */}
            {['users', 'appearance'].includes(activeTab) && (
              <div className="flex flex-col items-center justify-center h-full text-center animate-in fade-in zoom-in-95 duration-200">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                  <Sliders className="w-8 h-8 text-slate-300" />
                </div>
                <h3 className="text-lg font-bold text-slate-800">Próximamente</h3>
                <p className="text-sm text-slate-500 mt-2 max-w-xs">
                  Las opciones avanzadas de permisos y personalización visual estarán disponibles en futuras actualizaciones.
                </p>
              </div>
            )}
          </div>

          <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
            <button 
              onClick={onClose}
              className="px-5 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button 
              onClick={handleSave}
              className="px-6 py-2 text-sm font-bold text-white bg-crmTeal hover:bg-crmTeal/90 rounded-lg shadow-sm transition-colors flex items-center gap-2"
            >
              {saved ? (
                <><CheckCircle2 className="w-4 h-4" /> Guardado</>
              ) : 'Guardar Cambios'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
