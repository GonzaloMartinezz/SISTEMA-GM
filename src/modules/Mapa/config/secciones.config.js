// ============================================================================
// SISTEMA GM · M-06 MAPA Y LOGÍSTICA · SECCIONES DEL MÓDULO
// ----------------------------------------------------------------------------
// El módulo contesta cuatro preguntas, en el orden en que aparecen en el día:
//   ¿dónde está cada cliente?      -> Mapa
//   ¿a quién le toca y dónde vive? -> Agenda en el mapa
//   ¿en qué orden salgo?           -> Ruta del día
//   ¿qué zona estoy abandonando?   -> Cobertura
// ============================================================================

import { Map, CalendarRange, Route, LayoutGrid } from 'lucide-react';

export const SECCIONES = [
  {
    id: 'mapa',
    ruta: 'mapa',
    nombre: 'Mapa',
    bajada: 'Todos los clientes ubicados. Tocá un punto y tenés su ficha, cómo llamarlo y cómo llegar.',
    icono: Map,
  },
  {
    id: 'agenda',
    ruta: 'agenda',
    nombre: 'Agenda en el mapa',
    bajada: 'Qué te toca hoy, mañana, esta semana o este mes, y dónde queda cada uno.',
    icono: CalendarRange,
  },
  {
    id: 'ruta',
    ruta: 'ruta',
    nombre: 'Ruta del día',
    bajada: 'El orden más corto para las visitas del día, con los kilómetros y el enlace a Google Maps.',
    icono: Route,
  },
  {
    id: 'cobertura',
    ruta: 'cobertura',
    nombre: 'Cobertura',
    bajada: 'Cuántos clientes tenés por zona, cuánto valen y hace cuánto que no pasás por ahí.',
    icono: LayoutGrid,
  },
];

export default SECCIONES;
