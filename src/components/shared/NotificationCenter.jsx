import React, { useEffect, useRef } from 'react';
import { Bell, Check, Circle, AlertCircle, ShoppingCart } from 'lucide-react';

export default function NotificationCenter({ isOpen, onClose }) {
  const dropdownRef = useRef(null);

  // Cerrar al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const notifications = [
    {
      id: 1,
      title: "Nuevo Cliente Registrado",
      desc: "Dr. Ana Silva ha sido añadida a la base de datos.",
      time: "Hace 5 min",
      icon: Circle,
      iconColor: "text-blue-500",
      bgColor: "bg-blue-50",
      unread: true
    },
    {
      id: 2,
      title: "Propuesta Aprobada",
      desc: "Centro Odontológico Sur aceptó el presupuesto del sillón.",
      time: "Hace 1 hora",
      icon: Check,
      iconColor: "text-green-500",
      bgColor: "bg-green-50",
      unread: true
    },
    {
      id: 3,
      title: "Recordatorio de Visita",
      desc: "Tienes una demostración programada con Sanatorio X a las 16:00.",
      time: "Hace 2 horas",
      icon: AlertCircle,
      iconColor: "text-orange-500",
      bgColor: "bg-orange-50",
      unread: false
    },
    {
      id: 4,
      title: "Stock Bajo",
      desc: "Faltan repuestos para Turbinas NSK en inventario.",
      time: "Ayer",
      icon: ShoppingCart,
      iconColor: "text-red-500",
      bgColor: "bg-red-50",
      unread: false
    }
  ];

  return (
    <div 
      ref={dropdownRef}
      className="absolute top-14 right-6 w-80 sm:w-96 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in slide-in-from-top-2 fade-in duration-200"
    >
      {/* Header */}
      <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-slate-800">Notificaciones</h3>
          <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">2 Nuevas</span>
        </div>
        <button className="text-xs font-semibold text-crmTeal hover:text-crmTeal/80 transition-colors">
          Marcar como leídas
        </button>
      </div>

      {/* Body */}
      <div className="max-h-[400px] overflow-y-auto">
        {notifications.map((notif) => {
          const Icon = notif.icon;
          return (
            <div 
              key={notif.id} 
              className={`p-4 border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer flex gap-4 ${notif.unread ? 'bg-blue-50/30' : ''}`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${notif.bgColor}`}>
                <Icon className={`w-5 h-5 ${notif.iconColor}`} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h4 className={`text-sm font-bold ${notif.unread ? 'text-slate-900' : 'text-slate-700'}`}>
                    {notif.title}
                  </h4>
                  <span className="text-[10px] font-medium text-slate-400 whitespace-nowrap ml-2">
                    {notif.time}
                  </span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {notif.desc}
                </p>
              </div>
              {notif.unread && (
                <div className="w-2 h-2 rounded-full bg-crmTeal mt-1.5 shrink-0"></div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
        <button className="text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors">
          Ver todas las notificaciones
        </button>
      </div>
    </div>
  );
}
