import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Activity, BarChart2, TrendingUp, ArrowLeft, Settings } from 'lucide-react';
import { cn } from '../ui/NeonButton';
import Navbar from './Navbar';

export default function AnalyticsLayout() {
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Métricas Generales', path: '/dashboard', icon: Activity },
    { name: 'Reportes Mensuales', path: '/dashboard/reports', icon: BarChart2 },
    { name: 'Proyecciones', path: '/dashboard/projections', icon: TrendingUp },
  ];

  return (
    <div className="flex h-screen bg-background overflow-hidden selection:bg-crmSand/30">
      <aside className="w-64 h-screen bg-surface border-r border-surfaceHighlight flex flex-col hidden md:flex sticky top-0">
        <div className="h-16 flex items-center px-4 border-b border-surfaceHighlight gap-3">
          <button 
            onClick={() => navigate('/hub')}
            className="p-2 rounded-lg bg-surfaceHighlight hover:bg-white/10 text-textMuted hover:text-white transition-colors"
            title="Volver al Hub"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-crmSand to-yellow-500 tracking-widest uppercase">
            Analítica <span className="text-text">Global</span>
          </h1>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
          <p className="text-[10px] font-bold text-textMuted uppercase tracking-[0.2em] mb-4 pl-4">Centro de Mando</p>
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 group",
                isActive 
                  ? "bg-crmSand/10 text-crmSand shadow-[inset_2px_0_0_#E6D5BE]" 
                  : "text-textMuted hover:bg-surfaceHighlight hover:text-text"
              )}
            >
              <item.icon className={cn("h-5 w-5", "group-hover:scale-110 transition-transform")} />
              <span className="font-medium text-sm">{item.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-surfaceHighlight">
          <button className="flex items-center gap-3 px-4 py-2 w-full rounded-lg text-textMuted hover:bg-surfaceHighlight hover:text-text transition-colors">
            <Settings className="h-5 w-5" />
            <span className="font-medium text-sm">Ajustes Analítica</span>
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 relative">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
