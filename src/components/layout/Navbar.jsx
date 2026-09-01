import React from 'react';
import { Search, Bell, User } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="h-16 border-b border-surfaceHighlight bg-surface/50 backdrop-blur-lg flex items-center justify-between px-6 sticky top-0 z-40 w-full">
      
      {/* Buscador Global Avanzado */}
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-textMuted h-4 w-4" />
          <input 
            type="text" 
            placeholder="Buscar clientes por nombre, especialidad o zona..." 
            className="w-full bg-background border border-surfaceHighlight rounded-full py-2 pl-10 pr-4 text-sm text-text focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-textMuted"
            aria-label="Buscador global"
          />
        </div>
      </div>

      {/* Acciones de Usuario */}
      <div className="flex items-center gap-4 ml-4">
        <button className="p-2 text-textMuted hover:text-primary transition-colors relative" aria-label="Notificaciones">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-2 w-2 h-2 bg-accent rounded-full animate-pulse"></span>
        </button>
        
        <div className="flex items-center gap-3 pl-4 border-l border-surfaceHighlight">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-text">Admin Ventas</p>
            <p className="text-xs text-primary">Conectado</p>
          </div>
          <div className="h-9 w-9 rounded-full bg-surfaceHighlight flex items-center justify-center border border-primary/30">
            <User className="h-5 w-5 text-textMuted" />
          </div>
        </div>
      </div>
    </nav>
  );
}
