// ============================================================================
// SISTEMA GM · M-06 NOTARIO 360 · VOCABULARIO DEL MÓDULO
// ----------------------------------------------------------------------------
// Los tipos de nota, las clases de cosa que se pueden anotar y los módulos que
// alimentan la bitácora. Todo junto acá porque son decisiones del negocio.
// ============================================================================

import {
  Building2, Send, Package, Landmark, Receipt, Truck, CalendarClock, StickyNote,
  Handshake, TriangleAlert, Lightbulb, Bell, Wrench, MessageCircle, GitBranch,
  Boxes, CheckSquare, MapPin, Phone, Coins, ArrowLeftRight,
} from 'lucide-react';
import { SERIE, ESTADO_COLOR } from '../../../shared/gm-ui/tokens';

/**
 * Qué clase de anotación es. Antes eran dos ("Estratégica" y "Operativa"), que
 * describían la importancia y no el contenido. Estos describen QUÉ es, que es
 * lo que después sirve para encontrarla: un acuerdo se busca distinto que un
 * problema, aunque los dos sean importantes.
 */
export const TIPOS_NOTA = [
  {
    id: 'operativa',
    nombre: 'Operativa',
    bajada: 'Un dato del día a día que conviene no olvidar',
    icono: StickyNote,
    color: '#948A7C',
    tono: 'gris',
  },
  {
    id: 'acuerdo',
    nombre: 'Acuerdo',
    bajada: 'Algo que se pactó y hay que cumplir',
    icono: Handshake,
    color: SERIE.verde,
    tono: 'aqua',
  },
  {
    id: 'problema',
    nombre: 'Problema',
    bajada: 'Algo que salió mal y hay que resolver',
    icono: TriangleAlert,
    color: ESTADO_COLOR.critico,
    tono: 'rosa',
  },
  {
    id: 'estrategica',
    nombre: 'Estratégica',
    bajada: 'Cómo conviene manejar esta relación',
    icono: Wrench,
    color: SERIE.terracota,
    tono: 'naranja',
  },
  {
    id: 'idea',
    nombre: 'Idea',
    bajada: 'Algo para probar más adelante',
    icono: Lightbulb,
    color: SERIE.ambar,
    tono: 'amarillo',
  },
  {
    id: 'recordatorio',
    nombre: 'Recordatorio',
    bajada: 'Para tener presente en una fecha',
    icono: Bell,
    color: SERIE.azul,
    tono: 'azul',
  },
];

export const getTipoNota = (id) => TIPOS_NOTA.find((t) => t.id === id) || TIPOS_NOTA[0];

/**
 * De qué se puede colgar una nota. Los ids son los mismos que emite la vista
 * gm_v_entidades, así que agregar una clase nueva es tocar la vista y esta
 * lista, y nada más.
 */
export const ENTIDADES = [
  { id: 'cliente', nombre: 'Cliente', plural: 'Clientes', icono: Building2, tono: 'azul', modulo: 'M-01' },
  { id: 'lead', nombre: 'Venta', plural: 'Ventas', icono: Send, tono: 'aqua', modulo: 'M-04' },
  { id: 'equipo', nombre: 'Equipo', plural: 'Equipos', icono: Package, tono: 'naranja', modulo: 'M-02' },
  { id: 'cuenta', nombre: 'Cuenta', plural: 'Cuentas', icono: Landmark, tono: 'amarillo', modulo: 'M-06' },
  { id: 'gasto', nombre: 'Gasto', plural: 'Gastos', icono: Receipt, tono: 'rosa', modulo: 'M-03' },
  { id: 'entrega', nombre: 'Entrega', plural: 'Entregas', icono: Truck, tono: 'gris', modulo: 'M-07' },
  { id: 'evento', nombre: 'Compromiso', plural: 'Compromisos', icono: CalendarClock, tono: 'gris', modulo: 'M-05' },
];

export const getEntidad = (id) =>
  ENTIDADES.find((e) => e.id === id) || {
    id: 'general',
    nombre: 'Suelta',
    plural: 'Sueltas',
    icono: StickyNote,
    tono: 'gris',
    modulo: '',
  };

/** A dónde lleva un clic sobre la entidad de una nota. */
export const RUTA_ENTIDAD = {
  cliente: '/crm/base-datos',
  lead: '/seguimientos/pipeline',
  equipo: '/equipamientos/base-datos',
  cuenta: '/notario-360/cuentas',
  gasto: '/tesoreria/ingresos-egresos',
  entrega: '/mapa-logistica',
  evento: '/agenda-logistica/hoy',
};

// ---------------------------------------------------------------------------
// Bitácora
// ---------------------------------------------------------------------------

/** Las clases de hecho que registra el sistema, con su ícono y su color. */
export const CLASES = {
  nota: { nombre: 'Nota', icono: StickyNote, color: '#948A7C' },
  mensaje: { nombre: 'Mensaje', icono: MessageCircle, color: SERIE.verde },
  etapa: { nombre: 'Avance de venta', icono: GitBranch, color: SERIE.terracota },
  stock: { nombre: 'Stock', icono: Boxes, color: SERIE.azul },
  compromiso: { nombre: 'Compromiso', icono: CheckSquare, color: SERIE.ambar },
  visita: { nombre: 'Visita', icono: MapPin, color: SERIE.terracota },
  llamado: { nombre: 'Llamado', icono: Phone, color: SERIE.azul },
  pago: { nombre: 'Pago', icono: Coins, color: SERIE.verde },
  movimiento: { nombre: 'Movimiento', icono: ArrowLeftRight, color: '#948A7C' },
  liquidacion: { nombre: 'Liquidación', icono: Receipt, color: SERIE.ambar },
};

export const getClase = (id) => CLASES[id] || { nombre: id, icono: StickyNote, color: '#948A7C' };

/** Los módulos de donde sale cada hecho de la bitácora. */
export const MODULOS = {
  notario: { nombre: 'Notario 360', codigo: 'M-06', tono: 'amarillo' },
  seguimientos: { nombre: 'Seguimientos', codigo: 'M-04', tono: 'aqua' },
  equipamientos: { nombre: 'Equipamientos', codigo: 'M-02', tono: 'naranja' },
  agenda: { nombre: 'Agenda', codigo: 'M-05', tono: 'azul' },
  cobranzas: { nombre: 'Cobranzas', codigo: 'M-08', tono: 'rosa' },
  tesoreria: { nombre: 'Tesorería', codigo: 'M-03', tono: 'gris' },
  logistica: { nombre: 'Logística', codigo: 'M-07', tono: 'gris' },
};

export const getModulo = (id) => MODULOS[id] || { nombre: id, codigo: '', tono: 'gris' };

/** Ventanas de tiempo de la bitácora. */
export const RANGOS = [
  { id: '7', nombre: '7 días', dias: 7 },
  { id: '30', nombre: '30 días', dias: 30 },
  { id: '90', nombre: '3 meses', dias: 90 },
  { id: '0', nombre: 'Todo', dias: 36500 },
];

export const getRango = (id) => RANGOS.find((r) => r.id === id) || RANGOS[1];
