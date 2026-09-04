// ============================================================================
// SISTEMA GM · M-08 COBRANZAS · SECCIONES DEL MÓDULO
// ----------------------------------------------------------------------------
// El módulo contesta cuatro preguntas, en el orden en que aparecen en la
// cabeza de uno cuando abre el sistema a la mañana:
//   ¿quién me debe y cuánto?   -> Ventas y cobros
//   ¿qué me entra este mes?    -> Calendario
//   ¿por dónde se me va?       -> Caja
//   ¿al final gano o pierdo?   -> Resultado
// ============================================================================

import { HandCoins, CalendarDays, ArrowLeftRight, TrendingUp } from 'lucide-react';

export const SECCIONES = [
  {
    id: 'ventas',
    ruta: 'ventas',
    nombre: 'Ventas y cobros',
    bajada: 'Cada venta con su anticipo, su plan de cuotas y cuánto falta cobrar.',
    icono: HandCoins,
  },
  {
    id: 'calendario',
    ruta: 'calendario',
    nombre: 'Calendario de cobros',
    bajada: 'Qué vence este mes, qué quedó atrás y qué se viene, día por día.',
    icono: CalendarDays,
  },
  {
    id: 'caja',
    ruta: 'caja',
    nombre: 'Caja y movimientos',
    bajada: 'Toda la plata que entra y sale del negocio, con su categoría.',
    icono: ArrowLeftRight,
  },
  {
    id: 'resultado',
    ruta: 'resultado',
    nombre: 'Resultado',
    bajada: 'Ingresos, gastos, sueldo y margen mes a mes. Si ganás o perdés.',
    icono: TrendingUp,
  },
];

export default SECCIONES;
