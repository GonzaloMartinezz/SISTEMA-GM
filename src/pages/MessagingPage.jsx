import React from 'react';
import { Send, MessageSquare, Plus } from 'lucide-react';
import { GlassCard } from '../components/ui/GlassCard';

export default function MessagingPage() {
  const templates = [
    { id: 1, name: 'Bienvenida Nuevo Lead', category: 'General', uses: 45 },
    { id: 2, name: 'Recordatorio Pago', category: 'Cobranzas', uses: 128 },
    { id: 3, name: 'Promo Ecógrafos', category: 'Marketing', uses: 32 },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-8">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2 tracking-wide">Mensajería Automática</h2>
        <p className="text-textMuted text-sm">Gestiona tus plantillas de WhatsApp y analiza la interacción con clientes.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* KPI Cards */}
        <GlassCard className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-green-500/10 text-green-500">
              <Send className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-textMuted">Mensajes Enviados</p>
              <h4 className="text-2xl font-bold text-white">1,248</h4>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-textMuted">Tasa de Respuesta</p>
              <h4 className="text-2xl font-bold text-white">68%</h4>
            </div>
          </div>
        </GlassCard>
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">Plantillas de WhatsApp</h3>
          <button className="flex items-center gap-2 bg-green-500 text-black px-4 py-2 rounded-md hover:bg-green-400 transition-colors font-bold text-sm">
            <Plus className="w-4 h-4" /> Nueva Plantilla
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {templates.map(tpl => (
            <GlassCard key={tpl.id} className="p-6 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-green-400 bg-green-500/10 px-2 py-1 rounded">
                  {tpl.category}
                </span>
                <h4 className="text-lg font-bold text-white mt-3 mb-2">{tpl.name}</h4>
                <p className="text-sm text-textMuted line-clamp-2">
                  Hola [Nombre], gracias por contactarte. Te envío la info...
                </p>
              </div>
              <div className="mt-6 flex items-center justify-between">
                <span className="text-xs text-textMuted">{tpl.uses} envíos</span>
                <button className="text-green-400 hover:text-green-300 transition-colors text-sm font-semibold flex items-center gap-1">
                  <Send className="w-4 h-4" /> Enviar Ahora
                </button>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  );
}
