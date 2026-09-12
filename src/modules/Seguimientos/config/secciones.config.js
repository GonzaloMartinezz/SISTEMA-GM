// ============================================================================
// SISTEMA GM · M-03 SEGUIMIENTOS · SECCIONES DEL MÓDULO
// ----------------------------------------------------------------------------
// Las cuatro pantallas del módulo, en el orden en que se usan durante el día:
// primero se mira el tablero, después se ve cómo viene avanzando cada venta,
// después se sale a escribir, y las respuestas rápidas son la caja de
// herramientas que alimenta todo lo anterior.
// ============================================================================

import { Columns3, GitBranch, Send, MessageSquareQuote } from 'lucide-react';

export const SECCIONES = [
  {
    id: 'pipeline',
    ruta: 'pipeline',
    nombre: 'Filtros de Proceso',
    bajada: 'Dónde está parada cada oportunidad y qué la está frenando.',
    icono: Columns3,
  },
  {
    id: 'avances',
    ruta: 'avances',
    nombre: 'Avances',
    bajada: 'Cómo se mueven las ventas en el tiempo: qué avanza, qué se estancó y cuánto tarda cada etapa.',
    icono: GitBranch,
  },
  {
    id: 'mensajeria',
    ruta: 'mensajeria',
    nombre: 'WhatsApp y Mailing',
    bajada: 'Lo que se mandó, a quién le toca hoy y desde acá se escribe.',
    icono: Send,
  },
  {
    id: 'plantillas',
    ruta: 'plantillas',
    nombre: 'Respuestas Rápidas',
    bajada: 'Los textos que se reusan todos los días, con las variables del lead ya cargadas.',
    icono: MessageSquareQuote,
  },
];

export default SECCIONES;
