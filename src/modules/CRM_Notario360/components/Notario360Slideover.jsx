import React, { useState } from 'react';
import { X, Phone, Mail, Calendar, MessageSquare, Plus, Clock, FileText, CheckCircle2 } from 'lucide-react';

export default function Notario360Slideover({ isOpen, onClose, client }) {
  const [newComment, setNewComment] = useState('');

  if (!isOpen || !client) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Slideover Panel */}
      <div className={`fixed inset-y-0 right-0 w-full md:w-[450px] bg-white shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">Vista Notario 360°</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          
          {/* Perfil Header */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl border-2 border-white shadow-sm">
              {client.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">{client.name}</h3>
              <p className="text-sm text-gray-500 font-medium">{client.company || 'Particular'}</p>
              <div className="flex gap-2 mt-2">
                <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 bg-gray-100 text-gray-600 rounded-md">
                  <Phone className="w-3 h-3" /> Llamar
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 bg-gray-100 text-gray-600 rounded-md">
                  <Mail className="w-3 h-3" /> Mail
                </span>
              </div>
            </div>
          </div>

          {/* Progreso de Venta / Scoring */}
          <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
            <div className="flex justify-between items-end mb-2">
              <div>
                <h4 className="text-sm font-semibold text-gray-800">Progreso de Negociación</h4>
                <p className="text-xs text-gray-500 mt-1">Etapa: {client.status}</p>
              </div>
              <span className="text-2xl font-bold text-blue-600">{client.progress || 65}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
              <div 
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${client.progress || 65}%` }}
              ></div>
            </div>
          </div>

          {/* Información General */}
          <div>
            <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-gray-400" /> Datos Principales
            </h4>
            <div className="bg-white border border-gray-100 rounded-xl p-4 grid grid-cols-2 gap-y-4 gap-x-2 text-sm">
              <div>
                <span className="block text-gray-400 text-xs mb-1">Tipo de Cliente</span>
                <span className="font-medium text-gray-900">Profesional Independiente</span>
              </div>
              <div>
                <span className="block text-gray-400 text-xs mb-1">Presupuesto</span>
                <span className="font-medium text-gray-900">{client.price || '$0'}</span>
              </div>
              <div>
                <span className="block text-gray-400 text-xs mb-1">Último Contacto</span>
                <span className="font-medium text-gray-900">{client.date || 'Hace 2 días'}</span>
              </div>
              <div>
                <span className="block text-gray-400 text-xs mb-1">Próximo Paso</span>
                <span className="font-medium text-gray-900 line-clamp-1">{client.nextStep || 'Sin definir'}</span>
              </div>
            </div>
          </div>

          {/* Historial (Timeline) */}
          <div>
            <h4 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-400" /> Historial de Seguimiento
            </h4>
            <div className="relative pl-4 space-y-6 before:absolute before:inset-0 before:ml-[5px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-gray-200 before:to-transparent">
              
              <div className="relative flex items-start gap-4">
                <div className="absolute left-[-16px] w-8 h-8 rounded-full bg-blue-50 border-4 border-white flex items-center justify-center text-blue-500 shadow-sm">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="bg-white border border-gray-100 rounded-lg p-3 shadow-sm w-full">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-sm text-gray-900">Reunión Inicial</span>
                    <span className="text-xs text-gray-400">Hace 2 días</span>
                  </div>
                  <p className="text-sm text-gray-600">Presentación del equipamiento principal y discusión de márgenes.</p>
                </div>
              </div>

              <div className="relative flex items-start gap-4">
                <div className="absolute left-[-16px] w-8 h-8 rounded-full bg-gray-50 border-4 border-white flex items-center justify-center text-gray-400 shadow-sm">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div className="bg-white border border-gray-100 rounded-lg p-3 shadow-sm w-full">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-sm text-gray-900">WhatsApp Enviado</span>
                    <span className="text-xs text-gray-400">Hace 5 días</span>
                  </div>
                  <p className="text-sm text-gray-600">Se le envió el catálogo PDF y la lista de precios actualizada.</p>
                </div>
              </div>

            </div>
          </div>
          
        </div>

        {/* Agregar Comentarios (Footer fijo) */}
        <div className="p-4 bg-gray-50 border-t border-gray-100">
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="Escribe una nota de ayuda o comentario..."
              className="flex-1 bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg p-2.5 transition-colors shadow-sm">
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>

      </div>
    </>
  );
}
