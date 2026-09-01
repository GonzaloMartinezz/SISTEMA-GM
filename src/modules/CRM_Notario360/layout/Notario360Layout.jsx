import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { 
  Search, Bell, LayoutDashboard, Users, FileText, 
  MessageSquare, Calendar, HelpCircle, Settings
} from 'lucide-react';

export default function Notario360Layout() {
  const location = useLocation();

  const getPageTitle = () => {
    if (location.pathname.includes('/padron')) return 'Padrón de Clientes / Leads';
    if (location.pathname.includes('/dashboard')) return 'Dashboard Analytics';
    if (location.pathname.includes('/mensajes')) return 'Historial de Mensajes';
    if (location.pathname.includes('/deals')) return 'Deals & Proyectos';
    if (location.pathname.includes('/actividades')) return 'Actividades';
    if (location.pathname.includes('/reportes')) return 'Reportes y Estadísticas';
    return 'Notario 360°';
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] font-sans flex text-gray-800">
      
      {/* Sidebar Izquierdo */}
      <aside className="w-64 bg-[#F8FAFC] border-r border-gray-200 hidden md:flex flex-col h-screen fixed left-0">
        <div className="p-6 flex items-center gap-2">
          <div className="w-8 h-8 bg-black rounded-md flex items-center justify-center">
            <span className="text-white font-bold text-lg">T</span>
          </div>
          <span className="font-bold text-xl tracking-tight text-gray-900">Titanio 360</span>
        </div>
        
        <div className="px-4 mb-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search..." 
              className="w-full bg-white border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 space-y-1">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block px-2 mt-4">Menu</span>
          
          <SidebarItem to="/notario-360/dashboard" icon={LayoutDashboard} label="Dashboard" />
          <SidebarItem to="/notario-360/padron" icon={Users} label="Padrón Completo" />
          <SidebarItem to="/notario-360/deals" icon={FileText} label="Deals & Proyectos" />
          <SidebarItem to="/notario-360/mensajes" icon={MessageSquare} label="Mensajes" />
          
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block px-2 mt-8">Insights</span>
          
          <SidebarItem to="/notario-360/actividades" icon={Calendar} label="Actividades" />
          <SidebarItem to="/notario-360/reportes" icon={FileText} label="Reportes" />
        </nav>

        <div className="p-4 border-t border-gray-200 space-y-1">
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-gray-500 hover:text-gray-900 hover:bg-gray-100/50 font-medium">
            <HelpCircle className="w-5 h-5 text-gray-400" />
            <span className="text-sm">Help Center</span>
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-gray-500 hover:text-gray-900 hover:bg-gray-100/50 font-medium">
            <Settings className="w-5 h-5 text-gray-400" />
            <span className="text-sm">Settings</span>
          </button>
          <div className="mt-4 pt-4 border-t border-gray-200 flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
              <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="User" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-800">Gonzalo Martinez</p>
              <p className="text-xs text-gray-500">admin@titanio.com</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 h-screen flex flex-col bg-white">
        
        {/* Top Header */}
        <header className="h-16 border-b border-gray-100 flex items-center justify-between px-8 shrink-0">
          <h1 className="text-xl font-bold text-gray-800">{getPageTitle()}</h1>
          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="bg-gray-50 border border-gray-200 rounded-full pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
              />
            </div>
            <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          </div>
        </header>

        {/* Dynamic Content (Outlet) */}
        <div className="flex-1 overflow-hidden p-6 bg-gray-50/50">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

function SidebarItem({ to, icon: Icon, label }) {
  return (
    <NavLink 
      to={to}
      className={({ isActive }) => `w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
        isActive 
          ? 'bg-white shadow-sm text-gray-900 font-semibold border border-gray-100' 
          : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100/50 font-medium'
      }`}
    >
      {({ isActive }) => (
        <>
          <Icon className={`w-5 h-5 ${isActive ? 'text-gray-900' : 'text-gray-400'}`} />
          <span className="text-sm">{label}</span>
        </>
      )}
    </NavLink>
  );
}
