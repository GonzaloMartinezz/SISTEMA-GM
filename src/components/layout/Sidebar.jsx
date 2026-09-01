import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Package, Truck, Wallet, ShieldAlert, FolderKey, Settings, BookOpen } from 'lucide-react';
import { cn } from '../ui/NeonButton';

export default function Sidebar() {
  const menuItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'CRM & Leads', path: '/crm', icon: Users },
    { name: 'Inventario', path: '/inventory', icon: Package },
    { name: 'Logística & Rutas', path: '/logistics', icon: Truck },
    { name: 'Finanzas', path: '/finance', icon: Wallet },
    { name: 'Folletería Técnica', path: '/brochures', icon: BookOpen },
    { name: 'Post-Venta', path: '/post-sale', icon: ShieldAlert },
    { name: 'Portal Seguro', path: '/portal', icon: FolderKey },
  ];

  return (
    <aside className="w-64 h-screen bg-surface border-r border-surfaceHighlight flex flex-col hidden md:flex sticky top-0">
      <div className="h-16 flex items-center px-6 border-b border-surfaceHighlight">
        <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary tracking-widest">
          SYS<span className="text-text">MARTINEZ</span>
        </h1>
      </div>

      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 group",
              isActive 
                ? "bg-primary/10 text-primary shadow-[inset_2px_0_0_#00ffcc]" 
                : "text-textMuted hover:bg-surfaceHighlight hover:text-text"
            )}
          >
            <item.icon className={cn("h-5 w-5", "group-hover:scale-110 transition-transform")} />
            <span className="font-medium">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-surfaceHighlight">
        <button className="flex items-center gap-3 px-4 py-2 w-full rounded-lg text-textMuted hover:bg-surfaceHighlight hover:text-text transition-colors">
          <Settings className="h-5 w-5" />
          <span className="font-medium">Configuración</span>
        </button>
      </div>
    </aside>
  );
}
