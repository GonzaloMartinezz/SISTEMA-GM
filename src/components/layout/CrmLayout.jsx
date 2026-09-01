import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Users, LayoutDashboard, Calendar, Bell, PieChart, ArrowLeft, Settings, Search } from 'lucide-react';
import { cn } from '../ui/NeonButton';

import ExitAuthModal from '../shared/ExitAuthModal';
import CrmSettingsModal from '../crm/CrmSettingsModal';
import NotificationCenter from '../shared/NotificationCenter';

export default function CrmLayout() {
  const navigate = useNavigate();
  
  // States for new features
  const [isExitModalOpen, setIsExitModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const menuItems = [
    { name: 'Clientes', path: '/crm/clients', icon: Users },
    { name: 'Seguimientos', path: '/crm/tracking', icon: LayoutDashboard },
    { name: 'Agenda de Visitas', path: '/crm/agenda', icon: Calendar },
    { name: 'Recordatorios', path: '/crm/reminders', icon: Bell },
    { name: 'Estadísticas', path: '/crm/stats', icon: PieChart },
  ];

  const handleExitSuccess = () => {
    localStorage.removeItem('sm_auth_token');
    setIsExitModalOpen(false);
    window.location.href = '/login';
  };

  return (
    <div className="flex flex-1 w-full h-full bg-crmLightBg overflow-hidden selection:bg-crmTeal/30 text-crmDarkText">
      {/* Sidebar exclusivo de CRM - LIGHT MODE */}
      <aside className="w-64 h-full bg-white border-r border-slate-200 flex flex-col hidden md:flex relative z-20">
        <div className="h-16 flex items-center px-4 border-b border-slate-100 gap-3">
          <button 
            onClick={() => setIsExitModalOpen(true)}
            className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-crmTeal transition-colors"
            title="Volver al Hub"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-black text-slate-800 tracking-wide uppercase">
            S<span className="text-crmTeal">CRM</span>
          </h1>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-4 pl-3">Menú Principal</p>
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group font-medium text-sm",
                isActive 
                  ? "bg-crmTeal/10 text-crmTeal" 
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <item.icon className={cn("h-5 w-5", "group-hover:scale-110 transition-transform")} />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors font-medium text-sm"
          >
            <Settings className="h-5 w-5" />
            <span>Ajustes CRM</span>
          </button>
        </div>
      </aside>

      {/* Contenido Principal */}
      <div className="flex-1 flex flex-col min-w-0 relative h-full">
        <header className="h-16 shrink-0 bg-white border-b border-slate-200 flex items-center justify-between px-6 shadow-sm z-30 hidden md:flex relative">
           <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Buscar contactos, presupuestos..."
              className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 pl-9 pr-4 text-sm text-slate-700 focus:border-crmTeal focus:ring-1 focus:ring-crmTeal outline-none transition-colors"
            />
          </div>
          <div className="flex items-center gap-4">
            {/* Botón de Notificaciones */}
            <button 
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className={cn(
                "relative p-2 transition-colors rounded-lg",
                isNotifOpen ? "bg-slate-100 text-crmTeal" : "text-slate-500 hover:text-crmTeal hover:bg-slate-50"
              )}
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
            <div className="w-8 h-8 rounded-full bg-crmPeach flex items-center justify-center text-orange-700 font-bold text-sm">
              RM
            </div>
          </div>

          {/* Centro de Notificaciones Dropdown */}
          <NotificationCenter isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
        </header>

        <main className="flex-1 overflow-hidden p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>

      {/* Modales Globales del Layout */}
      <ExitAuthModal 
        isOpen={isExitModalOpen} 
        onClose={() => setIsExitModalOpen(false)} 
        onSuccess={handleExitSuccess}
      />
      
      <CrmSettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />
    </div>
  );
}
