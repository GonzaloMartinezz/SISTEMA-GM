// ============================================================================
// SISTEMA GM · M-09 TESORERÍA · SECCIONES DEL MÓDULO
// ----------------------------------------------------------------------------
// Las cuatro pantallas del módulo. Son las mismas cuatro vistas que tenía la
// consola anterior (resumen · ingresos y egresos · proyecciones · impuestos y
// capital): cambia el diseño, no lo que se puede hacer.
// ============================================================================

import { LayoutDashboard, ArrowLeftRight, TrendingUp, Landmark } from 'lucide-react';

export const SECCIONES = [
  {
    id: 'resumen',
    ruta: 'resumen',
    nombre: 'Resumen',
    bajada: 'Cómo viene el mes: lo que entra, lo que sale y lo que queda.',
    icono: LayoutDashboard,
  },
  {
    id: 'ingresos-egresos',
    ruta: 'ingresos-egresos',
    nombre: 'Ingresos y Egresos',
    bajada: 'La liquidación mes a mes y los gastos fijos del negocio.',
    icono: ArrowLeftRight,
  },
  {
    id: 'proyecciones',
    ruta: 'proyecciones',
    nombre: 'Proyecciones',
    bajada: 'A dónde llega el negocio si sigue este ritmo, y cuánto deja cada operación.',
    icono: TrendingUp,
  },
  {
    id: 'fiscal',
    ruta: 'fiscal',
    nombre: 'Impuestos y Capital',
    bajada: 'Qué se lleva el fisco, cuánto capital hay y con qué parámetros se calcula todo.',
    icono: Landmark,
  },
];

export default SECCIONES;
