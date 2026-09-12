// ============================================================================
// SISTEMA GM · M-04 AGENDA INTELIGENTE · SECCIONES DEL MÓDULO
// ----------------------------------------------------------------------------
// Cuatro distancias para mirar el tiempo, en el orden en que se usan:
// el día se mira todo el tiempo, la semana para acomodar, el mes para planear,
// y la bandeja de pendientes es de donde sale lo que hay que poner en el día.
//
// Las secciones viejas eran "Visitas y Llamadas", "Alertas Tempranas" y
// "Google Calendar". Las visitas y llamadas ahora son un tipo de compromiso
// entre cinco; las alertas viven dentro de Pendientes, que es donde se actúa
// sobre ellas; y lo de Google Calendar nunca fue una sincronización real (era
// un link y una descarga .ics), así que dejó de anunciarse como sección: las
// dos salidas siguen estando, en el compromiso donde se usan.
// ============================================================================

import { Sun, CalendarRange, CalendarDays, Inbox } from 'lucide-react';

export const SECCIONES = [
  {
    id: 'hoy',
    ruta: 'hoy',
    nombre: 'Hoy',
    bajada: 'La jornada hora por hora, con la ruta de las visitas y lo que falta cerrar.',
    icono: Sun,
  },
  {
    id: 'semana',
    ruta: 'semana',
    nombre: 'Semana',
    bajada: 'Los siete días de un vistazo, para ver dónde entra lo que falta acomodar.',
    icono: CalendarRange,
  },
  {
    id: 'mes',
    ruta: 'mes',
    nombre: 'Mes',
    bajada: 'El mes completo: qué semanas están cargadas y cuáles quedaron vacías.',
    icono: CalendarDays,
  },
  {
    id: 'pendientes',
    ruta: 'pendientes',
    nombre: 'Pendientes y Alertas',
    bajada: 'Lo que los otros módulos saben que te falta hacer, listo para agendar de un clic.',
    icono: Inbox,
  },
];

export default SECCIONES;
