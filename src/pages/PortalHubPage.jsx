import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Package, Truck, Wallet, ShieldAlert, FolderKey, Settings, BookOpen, Send } from 'lucide-react';
import { GlassCard } from '../components/ui/GlassCard';

export default function PortalHubPage() {
  const navigate = useNavigate();

  const modules = [
    { 
      id: 'notario-360', 
      name: 'Notario 360°', 
      desc: 'Gestor de Cuentas', 
      icon: LayoutDashboard, 
      path: '/notario-360',
      color: 'text-blue-400',
      bgHover: 'hover:border-blue-400/50 hover:bg-blue-400/10',
      glow: 'group-hover:shadow-[0_0_30px_rgba(96,165,250,0.3)]'
    },
    { 
      id: 'tesoreria', 
      name: 'Tesorería', 
      desc: 'Ingresos y Proyecciones', 
      icon: Wallet, 
      path: '/tesoreria',
      color: 'text-yellow-400',
      bgHover: 'hover:border-yellow-400/50 hover:bg-yellow-400/10',
      glow: 'group-hover:shadow-[0_0_30px_rgba(250,204,21,0.3)]'
    },
    { 
      id: 'seguimientos', 
      name: 'Seguimientos', 
      desc: 'Acción Rápida', 
      icon: Send, 
      path: '/seguimientos',
      color: 'text-green-500',
      bgHover: 'hover:border-green-500/50 hover:bg-green-500/10',
      glow: 'group-hover:shadow-[0_0_30px_rgba(34,197,94,0.3)]'
    },
    { 
      id: 'agenda-logistica', 
      name: 'Agenda & Mapa', 
      desc: 'Trazado y Control', 
      icon: Truck, 
      path: '/agenda-logistica',
      color: 'text-accent',
      bgHover: 'hover:border-accent/50 hover:bg-accent/10',
      glow: 'group-hover:shadow-[0_0_30px_rgba(255,0,85,0.3)]'
    },
    { 
      id: 'cobranzas', 
      name: 'Cobranzas', 
      desc: 'Gestión Morosos', 
      icon: ShieldAlert, 
      path: '/cobranzas',
      color: 'text-red-500',
      bgHover: 'hover:border-red-500/50 hover:bg-red-500/10',
      glow: 'group-hover:shadow-[0_0_30px_rgba(239,68,68,0.3)]'
    },
    { 
      id: 'equipamientos', 
      name: 'Equipamientos', 
      desc: 'Catálogo y Stock', 
      icon: Package, 
      path: '/equipamientos',
      color: 'text-purple-400',
      bgHover: 'hover:border-purple-400/50 hover:bg-purple-400/10',
      glow: 'group-hover:shadow-[0_0_30px_rgba(192,132,252,0.3)]'
    }
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Fondo y Ambientación */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 mix-blend-overlay pointer-events-none"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-primary/10 blur-[120px] rounded-full pointer-events-none"></div>
      
      {/* Header Hub */}
      <div className="relative z-10 text-center mb-16 animate-in slide-in-from-top-10 duration-700 fade-in">
        <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 tracking-[0.2em] uppercase mb-4 drop-shadow-2xl">
          Portal <span className="text-primary">Hub</span>
        </h1>
        <p className="text-textMuted text-lg tracking-widest uppercase font-mono">
          Selecciona un entorno operativo
        </p>
      </div>

      {/* Grid de Lanzadores */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl w-full">
        {modules.map((mod, index) => {
          const Icon = mod.icon;
          return (
            <GlassCard
              key={mod.id}
              onClick={() => navigate(mod.path)}
              className={`p-8 cursor-pointer border border-white/5 bg-black/40 backdrop-blur-md transition-all duration-500 group ${mod.bgHover} ${mod.glow} animate-in zoom-in-95 duration-500 fade-in`}
              style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'both' }}
            >
              <div className={`w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
                <Icon className={`w-8 h-8 ${mod.color}`} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2 tracking-wide group-hover:text-white transition-colors">
                {mod.name}
              </h3>
              <p className="text-sm text-textMuted group-hover:text-gray-300 transition-colors">
                {mod.desc}
              </p>
            </GlassCard>
          );
        })}
      </div>

      {/* Quick Settings Bar */}
      <div className="absolute bottom-8 right-8 z-10">
        <button className="p-4 rounded-full bg-surface/80 backdrop-blur border border-white/10 text-textMuted hover:text-white hover:border-white/30 transition-all shadow-lg hover:rotate-90 duration-500">
          <Settings className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
