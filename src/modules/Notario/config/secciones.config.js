// ============================================================================
// SISTEMA GM · M-06 NOTARIO 360 · SECCIONES DEL MÓDULO
// ----------------------------------------------------------------------------
// Este módulo es la memoria del sistema. Los otros ocho hacen: venden, cobran,
// entregan, agendan. Este anota y recuerda.
//
// Cuatro secciones, de lo que escribís vos a lo que escribe el sistema solo:
//   Notas         -> lo que anotás a mano, sobre cualquier cosa del sistema
//   Trazabilidad  -> lo que pasó, juntado de los nueve módulos
//   Ficha 360     -> todo lo que se sabe de UNA cosa, en una pantalla
//   Cuentas       -> el padrón financiero, que es de donde venía el módulo
// ============================================================================

import { NotebookPen, History, ScanFace, Landmark } from 'lucide-react';

export const SECCIONES = [
  {
    id: 'notas',
    ruta: 'notas',
    nombre: 'Notas',
    bajada: 'Todo lo que conviene anotar: de un cliente, de un equipo, de una venta, o suelto.',
    icono: NotebookPen,
  },
  {
    id: 'trazabilidad',
    ruta: 'trazabilidad',
    nombre: 'Trazabilidad',
    bajada: 'Todo lo que pasó en el sistema, junto de cada módulo que registra, en una sola línea de tiempo.',
    icono: History,
  },
  {
    id: 'ficha',
    ruta: 'ficha',
    nombre: 'Ficha 360°',
    bajada: 'Elegí un cliente, un equipo o una venta y vas a ver todo lo que el sistema sabe de eso.',
    icono: ScanFace,
  },
  {
    id: 'cuentas',
    ruta: 'cuentas',
    nombre: 'Cuentas',
    bajada: 'El padrón de cuentas con su estado, su progreso y lo que quedó pendiente.',
    icono: Landmark,
  },
];

export default SECCIONES;
