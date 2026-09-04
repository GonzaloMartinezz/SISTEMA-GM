// ============================================================================
// SISTEMA GM · CONFIGURACIÓN MAESTRA DE MÓDULOS
// ----------------------------------------------------------------------------
// Única fuente de verdad del Portal Hub, del interceptor de credenciales y del
// ruteo aislado. Si un módulo no está acá, no existe para el sistema.
// Regla del Plan Maestro: aislamiento modular absoluto y cero contaminación.
//
// Orden del Portal Hub: no es alfabético ni por código (los códigos M-01..M-08
// son identidad interna de cada módulo, usada por Notario 360° y quedan fijos
// para no romper esa trazabilidad). El orden de esta lista es el operativo,
// calcado del uso real: arriba los tres módulos que se abren todos los días
// (Clientes, Seguimientos, Agenda Inteligente) y después el resto en la
// secuencia en que aparecen en la jornada — Equipamientos a primera hora,
// Notario 360° junto a la negociación con el cliente, Mapa y Logística para
// salir a despachar, Cobranzas a la tarde y Tesorería en el cierre del día.
// ============================================================================

import {
  Users,
  Package,
  Wallet,
  Send,
  CalendarClock,
  ScanFace,
  Map,
  ShieldAlert,
} from 'lucide-react';

export const MODULES = [
  {
    id: 'clientes',
    code: 'M-01',
    name: 'Clientes',
    desc: 'Centro de gestión de la cartera activa',
    icon: Users,
    path: '/crm',
    accent: {
      text: 'text-sky-400',
      border: 'hover:border-sky-400/60',
      bg: 'hover:bg-sky-400/[0.07]',
      glow: 'group-hover:shadow-[0_0_40px_-8px_rgba(56,189,248,0.45)]',
      ring: 'focus-visible:ring-sky-400/60',
      bar: 'from-sky-500/20 to-transparent',
      dot: 'bg-sky-400',
    },
    items: [
      'Base de Datos',
      'Informes y Estadísticas',
      'Seguimientos',
      'Historial de Mensajes',
      'Agenda de Clientes',
    ],
  },
  {
    id: 'seguimientos',
    code: 'M-04',
    name: 'Seguimientos',
    desc: 'Pipeline Kanban y acción inmediata',
    icon: Send,
    path: '/seguimientos',
    accent: {
      text: 'text-emerald-400',
      border: 'hover:border-emerald-400/60',
      bg: 'hover:bg-emerald-400/[0.07]',
      glow: 'group-hover:shadow-[0_0_40px_-8px_rgba(52,211,153,0.45)]',
      ring: 'focus-visible:ring-emerald-400/60',
      bar: 'from-emerald-500/20 to-transparent',
      dot: 'bg-emerald-400',
    },
    items: ['Filtros de Proceso', 'Avances', 'WhatsApp y Mailing', 'Respuestas Rápidas'],
  },
  {
    id: 'agenda',
    code: 'M-05',
    name: 'Agenda Inteligente',
    desc: 'Organizador temporal de la jornada',
    icon: CalendarClock,
    path: '/agenda-logistica',
    accent: {
      text: 'text-teal-400',
      border: 'hover:border-teal-400/60',
      bg: 'hover:bg-teal-400/[0.07]',
      glow: 'group-hover:shadow-[0_0_40px_-8px_rgba(45,212,191,0.45)]',
      ring: 'focus-visible:ring-teal-400/60',
      bar: 'from-teal-500/20 to-transparent',
      dot: 'bg-teal-400',
    },
    items: ['Hoy', 'Semana', 'Mes', 'Pendientes y Alertas'],
  },
  {
    id: 'equipamientos',
    code: 'M-02',
    name: 'Equipamientos',
    desc: 'Catálogo técnico y disponibilidad física',
    icon: Package,
    path: '/equipamientos',
    accent: {
      text: 'text-violet-400',
      border: 'hover:border-violet-400/60',
      bg: 'hover:bg-violet-400/[0.07]',
      glow: 'group-hover:shadow-[0_0_40px_-8px_rgba(167,139,250,0.45)]',
      ring: 'focus-visible:ring-violet-400/60',
      bar: 'from-violet-500/20 to-transparent',
      dot: 'bg-violet-400',
    },
    items: ['Base de Datos', 'Información Detallada', 'Control de Stock'],
  },
  {
    id: 'notario360',
    code: 'M-06',
    name: 'Notario 360°',
    desc: 'Notas de todo el sistema y trazabilidad',
    icon: ScanFace,
    path: '/notario-360',
    accent: {
      text: 'text-primary',
      border: 'hover:border-primary/60',
      bg: 'hover:bg-primary/[0.07]',
      glow: 'group-hover:shadow-[0_0_40px_-8px_rgba(0,255,204,0.45)]',
      ring: 'focus-visible:ring-primary/60',
      bar: 'from-primary/20 to-transparent',
      dot: 'bg-primary',
    },
    items: ['Notas', 'Trazabilidad', 'Ficha 360°', 'Cuentas'],
  },
  {
    id: 'logistica',
    code: 'M-07',
    name: 'Mapa y Logística',
    desc: 'Geolocalización y ruteo de campo',
    icon: Map,
    path: '/logistics',
    accent: {
      text: 'text-orange-400',
      border: 'hover:border-orange-400/60',
      bg: 'hover:bg-orange-400/[0.07]',
      glow: 'group-hover:shadow-[0_0_40px_-8px_rgba(251,146,60,0.45)]',
      ring: 'focus-visible:ring-orange-400/60',
      bar: 'from-orange-500/20 to-transparent',
      dot: 'bg-orange-400',
    },
    items: ['Mapa', 'Agenda en el mapa', 'Ruta del día', 'Cobertura'],
  },
  {
    id: 'cobranzas',
    code: 'M-08',
    name: 'Cobranzas',
    desc: 'Ventas, cuotas y resultado del negocio',
    icon: ShieldAlert,
    path: '/cobranzas',
    accent: {
      text: 'text-rose-400',
      border: 'hover:border-rose-400/60',
      bg: 'hover:bg-rose-400/[0.07]',
      glow: 'group-hover:shadow-[0_0_40px_-8px_rgba(251,113,133,0.45)]',
      ring: 'focus-visible:ring-rose-400/60',
      bar: 'from-rose-500/20 to-transparent',
      dot: 'bg-rose-400',
    },
    items: ['Ventas y cobros', 'Calendario de cobros', 'Caja y movimientos', 'Resultado'],
  },
  {
    id: 'tesoreria',
    code: 'M-03',
    name: 'Tesorería',
    desc: 'Panel bimonetario USD / ARS y ROI',
    icon: Wallet,
    path: '/tesoreria',
    accent: {
      text: 'text-amber-400',
      border: 'hover:border-amber-400/60',
      bg: 'hover:bg-amber-400/[0.07]',
      glow: 'group-hover:shadow-[0_0_40px_-8px_rgba(251,191,36,0.45)]',
      ring: 'focus-visible:ring-amber-400/60',
      bar: 'from-amber-500/20 to-transparent',
      dot: 'bg-amber-400',
    },
    items: ['Resumen', 'Ingresos y Egresos', 'Proyecciones', 'Impuestos y Capital'],
  },
];

/** Devuelve la definición de un módulo por su id. */
export const getModuleById = (id) => MODULES.find((m) => m.id === id) || null;

/** Devuelve la definición de un módulo a partir de una ruta (/crm/clients -> clientes). */
export const getModuleByPath = (pathname = '') =>
  MODULES.find((m) => pathname === m.path || pathname.startsWith(m.path + '/')) || null;

export default MODULES;
