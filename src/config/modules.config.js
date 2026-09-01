// ============================================================================
// SISTEMA GM · CONFIGURACIÓN MAESTRA DE MÓDULOS
// ----------------------------------------------------------------------------
// Única fuente de verdad del Portal Hub, del interceptor de credenciales y del
// ruteo aislado. Si un módulo no está acá, no existe para el sistema.
// Regla del Plan Maestro: aislamiento modular absoluto y cero contaminación.
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
    items: ['Stock de Equipamiento', 'Informes de Equipamiento', 'Información Detallada'],
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
    items: ['Ingresos', 'Egresos', 'Proyecciones', 'ROI', 'Ahorros y Capital'],
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
    items: ['Visitas y Llamadas', 'Alertas Tempranas', 'Google Calendar'],
  },
  {
    id: 'notario360',
    code: 'M-06',
    name: 'Notario 360°',
    desc: 'Perfil ejecutivo y auditoría de cuenta',
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
    items: ['Progreso de Venta', 'Clasificación', 'Trazabilidad', 'Notas Estratégicas'],
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
    items: ['Geolocalización', 'Marcadores', 'Ruteo Automático', 'Google Maps'],
  },
  {
    id: 'cobranzas',
    code: 'M-08',
    name: 'Cobranzas',
    desc: 'Recupero de cartera y morosidad',
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
    items: ['Estado de Cuenta', 'Estructura Financiera', 'Registro de Llamados', 'Auditoría'],
  },
];

/** Devuelve la definición de un módulo por su id. */
export const getModuleById = (id) => MODULES.find((m) => m.id === id) || null;

/** Devuelve la definición de un módulo a partir de una ruta (/crm/clients -> clientes). */
export const getModuleByPath = (pathname = '') =>
  MODULES.find((m) => pathname === m.path || pathname.startsWith(m.path + '/')) || null;

export default MODULES;
