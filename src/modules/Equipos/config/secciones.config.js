// ============================================================================
// SISTEMA GM · M-02 EQUIPAMIENTOS · SECCIONES DEL MÓDULO
// ----------------------------------------------------------------------------
// Las tres secciones del Módulo 2. La barra lateral, el encabezado y el ruteo
// salen todos de acá: si una sección no figura en esta lista, no existe.
// ============================================================================

import { Package, FileText, Boxes } from 'lucide-react';

export const SECCIONES = [
  {
    id: 'stock',
    ruta: 'stock',
    nombre: 'Control de Stock',
    bajada: 'Cuánto hay de cada cosa, qué está por llegar y qué hay que reponer.',
    icono: Boxes,
  },
  {
    id: 'base-datos',
    ruta: 'base-datos',
    nombre: 'Base de Datos',
    bajada: 'Todo el equipamiento del negocio, por rubro y con su precio.',
    icono: Package,
  },
  {
    id: 'detalles',
    ruta: 'detalles',
    nombre: 'Información Detallada',
    bajada: 'La ficha técnica de cada equipo, lista para copiar y mandar al cliente.',
    icono: FileText,
  },
];

/** Los tres rubros del negocio. Es el mismo vocabulario que usa Clientes. */
export const RUBROS = ['Odontología', 'Veterinaria', 'Diagnóstico por Imagen'];

/** Un equipo pesado y un consumible no se reponen igual: se separan. */
export const TIPOS = ['Equipo Pesado', 'Consumible', 'Repuesto', 'Accesorio'];

export default SECCIONES;
