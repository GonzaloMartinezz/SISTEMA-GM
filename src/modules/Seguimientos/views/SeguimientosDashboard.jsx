import React, { useState } from 'react';
import { MessageCircle, Mail, Filter, Zap } from 'lucide-react';

export default function SeguimientosDashboard() {
  const [filtroNivel, setFiltroNivel] = useState('todos');

  // Datos mockeados de clientes potenciales
  const leads = [
    { id: 1, nombre: 'Dr. Alejandro Ríos', clinica: 'OdontoSalud', nivel: 'Convencer Más', equipo: 'Sillón Premium', tel: '+5493815551234', email: 'arios@mail.com' },
    { id: 2, nombre: 'Dra. Sofía Mendez', clinica: 'Vet Central', nivel: 'Posible Venta', equipo: 'Ecógrafo Portátil', tel: '+5493815559876', email: 'smendez@mail.com' },
  ];

  return (
    <div className="min-h-screen bg-gray-950 p-4 font-sans flex flex-col h-screen">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-green-400 font-bold tracking-widest uppercase text-xl flex items-center gap-2">
            <Zap className="w-6 h-6" /> Seguimientos y Mensajes
          </h1>
          <p className="text-gray-500 text-xs font-mono uppercase mt-1">Gestión de Clientes Potenciales y Respuestas Rápidas</p>
        </div>
        
        {/* Filtros de Nivel de Proceso de Venta */}
        <div className="flex items-center gap-2 bg-gray-900 border border-gray-800 p-1">
          <Filter className="w-4 h-4 text-gray-500 mx-2" />
          {['Todos', 'Comienzo', 'En Proceso', 'Convencer Más', 'Posible Venta'].map(nivel => (
            <button
              key={nivel}
              onClick={() => setFiltroNivel(nivel.toLowerCase())}
              className={`px-3 py-1 text-xs font-mono uppercase transition-colors ${
                filtroNivel === nivel.toLowerCase() || (filtroNivel === 'todos' && nivel === 'Todos')
                  ? 'bg-gray-800 text-green-400 border border-gray-700' 
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {nivel}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-4 flex-1 min-h-0">
        {/* Lista de Leads */}
        <div className="w-2/3 flex flex-col gap-3 min-h-0 overflow-auto pr-2">
          {leads.map(lead => (
            <div key={lead.id} className="bg-gray-900 border border-gray-800 p-4 flex justify-between items-center group hover:border-green-500/30 transition-colors">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-gray-200 font-bold uppercase text-sm">{lead.nombre}</h3>
                  <span className={`text-[10px] px-2 py-0.5 border font-mono uppercase ${
                    lead.nivel === 'Posible Venta' ? 'border-green-500 text-green-400 bg-green-950/30' : 
                    lead.nivel === 'Convencer Más' ? 'border-yellow-500 text-yellow-400 bg-yellow-950/30' : 
                    'border-gray-600 text-gray-400'
                  }`}>
                    {lead.nivel}
                  </span>
                </div>
                <p className="text-gray-500 text-xs font-mono">{lead.clinica} • Interés: <span className="text-gray-300">{lead.equipo}</span></p>
              </div>
              
              {/* Botones de Contacto Directo */}
              <div className="flex gap-2">
                <button 
                  onClick={() => window.open(`https://wa.me/${lead.tel}`, '_blank')}
                  className="bg-[#075E54]/20 border border-[#25D366] text-[#25D366] hover:bg-[#075E54]/40 p-2 rounded flex items-center justify-center transition-colors"
                  title="WhatsApp"
                >
                  <MessageCircle className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => window.location.href = `mailto:${lead.email}`}
                  className="bg-blue-900/20 border border-blue-500 text-blue-400 hover:bg-blue-900/40 p-2 rounded flex items-center justify-center transition-colors"
                  title="Mail"
                >
                  <Mail className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Panel de Respuestas Rápidas */}
        <div className="w-1/3 bg-gray-900 border border-gray-800 p-4 flex flex-col min-h-0">
          <h2 className="text-gray-400 font-bold text-xs uppercase mb-4 border-b border-gray-800 pb-2 flex items-center gap-2">
            <MessageCircle className="w-4 h-4" /> Plantillas de Mensajes
          </h2>
          <div className="overflow-auto space-y-3 flex-1 font-mono text-xs pr-2">
            <PlantillaItem 
              titulo="Saludo Inicial" 
              texto="¡Hola! ¿Cómo estás? Soy Gonzalo de Titanio. Te envío el catálogo actualizado de equipos para el consultorio."
            />
            <PlantillaItem 
              titulo="Seguimiento / Convencer" 
              texto="¿Pudiste revisar el presupuesto? Avisame si querés que te congele el precio con una seña mínima."
            />
            <PlantillaItem 
              titulo="Coordinar Visita" 
              texto="Este jueves ando por tu zona. ¿Te parece si paso 10 minutitos a dejarte folletería nueva sin compromiso?"
            />
            <PlantillaItem 
              titulo="Promoción Insumos" 
              texto="¡Ingresó stock de kits quirúrgicos! Tenemos una promo especial por pago de contado esta semana."
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function PlantillaItem({ titulo, texto }) {
  return (
    <div className="border border-gray-800 bg-gray-950 p-3 hover:border-gray-600 transition-colors group">
      <div className="flex justify-between items-center mb-2">
        <span className="text-cyan-400 font-bold uppercase">{titulo}</span>
        <button className="text-[10px] text-gray-500 border border-gray-700 px-2 py-0.5 hover:bg-gray-800 hover:text-gray-300 uppercase transition-colors">
          Copiar
        </button>
      </div>
      <p className="text-gray-400 leading-relaxed">{texto}</p>
    </div>
  );
}
