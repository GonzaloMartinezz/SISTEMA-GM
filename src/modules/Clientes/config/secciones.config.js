// ============================================================================
// SISTEMA GM · M-01 CLIENTES · SECCIONES DEL MÓDULO
// ----------------------------------------------------------------------------
// Las cinco secciones del Módulo 1 tal como están definidas en el Plan Maestro.
// La barra lateral, el encabezado y el ruteo salen todos de acá: si una sección
// no figura en esta lista, no aparece en ningún lado.
// ============================================================================

import { Database, PieChart, Activity, MessagesSquare, CalendarDays } from 'lucide-react';

export const SECCIONES = [
  {
    id: 'base-datos',
    ruta: 'base-datos',
    nombre: 'Base de Datos',
    bajada: 'Directorio centralizado con la información de todas las cuentas.',
    icono: Database,
  },
  {
    id: 'informes',
    ruta: 'informes',
    nombre: 'Informes y Estadísticas',
    bajada: 'Gráficos de rendimiento y análisis de la cartera de clientes.',
    icono: PieChart,
  },
  {
    id: 'seguimientos',
    ruta: 'seguimientos',
    nombre: 'Seguimientos',
    bajada: 'Registro de las interacciones recientes y estado del pipeline.',
    icono: Activity,
  },
  {
    id: 'mensajes',
    ruta: 'mensajes',
    nombre: 'Historial de Mensajes',
    bajada: 'Trazabilidad de toda la comunicación enviada y recibida.',
    icono: MessagesSquare,
  },
  {
    id: 'agenda',
    ruta: 'agenda',
    nombre: 'Agenda de Clientes',
    bajada: 'Panel específico para gestionar tiempos y citas por cuenta.',
    icono: CalendarDays,
  },
];

export const getSeccion = (id) => SECCIONES.find((s) => s.id === id || s.ruta === id) || null;

export default SECCIONES;
