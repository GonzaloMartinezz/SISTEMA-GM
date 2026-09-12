// ============================================================================
// SISTEMA GM · M-04 AGENDA INTELIGENTE · VOCABULARIO DEL MÓDULO
// ----------------------------------------------------------------------------
// Tipos de compromiso, estados, prioridades y los parámetros de la jornada.
// Todo lo que en el módulo viejo estaba desparramado por cinco componentes
// (colores de estado, íconos, la base operativa, la velocidad de manejo) vive
// acá, porque son decisiones del negocio y hay que poder cambiarlas en un lugar.
// ============================================================================

import { MapPin, Phone, MessageCircle, Mail, CheckSquare } from 'lucide-react';
import { SERIE, ESTADO_COLOR } from '../../../shared/gm-ui/tokens';

/**
 * Los cinco tipos de compromiso. Antes eran dos (visita y llamada) y todo lo
 * demás quedaba fuera de la agenda: los mensajes y los mails son la mayor parte
 * del día y no estaban en ningún lado.
 *
 * `enCalle` distingue lo que te obliga a salir. Es lo que separa un día de
 * ocho llamadas de un día de cuatro visitas cruzando Tucumán, aunque los dos
 * sumen las mismas horas.
 */
export const TIPOS = [
  {
    id: 'visita',
    nombre: 'Visita',
    plural: 'Visitas',
    icono: MapPin,
    color: SERIE.terracota,
    tono: 'naranja',
    enCalle: true,
  },
  {
    id: 'llamada',
    nombre: 'Llamada',
    plural: 'Llamadas',
    icono: Phone,
    color: SERIE.azul,
    tono: 'azul',
    enCalle: false,
  },
  {
    id: 'mensaje',
    nombre: 'Mensaje',
    plural: 'Mensajes',
    icono: MessageCircle,
    color: SERIE.verde,
    tono: 'aqua',
    enCalle: false,
  },
  {
    id: 'mail',
    nombre: 'Mail',
    plural: 'Mails',
    icono: Mail,
    color: SERIE.ambar,
    tono: 'amarillo',
    enCalle: false,
  },
  {
    id: 'tarea',
    nombre: 'Tarea',
    plural: 'Tareas',
    icono: CheckSquare,
    color: '#948A7C',
    tono: 'gris',
    enCalle: false,
  },
];

export const getTipo = (id) => TIPOS.find((t) => t.id === id) || TIPOS[TIPOS.length - 1];

export const ESTADOS = {
  pendiente: { nombre: 'Pendiente', color: ESTADO_COLOR.neutro, tono: 'gris' },
  cumplido: { nombre: 'Cumplido', color: ESTADO_COLOR.bien, tono: 'aqua' },
  cancelado: { nombre: 'Cancelado', color: ESTADO_COLOR.critico, tono: 'rosa' },
};

export const getEstado = (id) => ESTADOS[id] || ESTADOS.pendiente;

export const PRIORIDADES = {
  alta: { nombre: 'Alta', tono: 'rosa' },
  media: { nombre: 'Media', tono: 'amarillo' },
  baja: { nombre: 'Baja', tono: 'gris' },
};

export const getPrioridad = (id) => PRIORIDADES[id] || PRIORIDADES.media;

// ---------------------------------------------------------------------------
// Parámetros de la jornada
// ---------------------------------------------------------------------------

/** De qué hora a qué hora se dibuja el día. Fuera de esta franja también se
 *  muestran los compromisos, pero la carga se mide contra estas horas. */
export const JORNADA = { desde: 8, hasta: 20 };

export const MINUTOS_JORNADA = (JORNADA.hasta - JORNADA.desde) * 60;

/**
 * De dónde salís y a dónde volvés. Está acá y no enterrada en un componente
 * porque es EL dato a cambiar cuando se mude el depósito: la ruta del día, los
 * kilómetros y el tiempo de manejo se miden todos desde este punto.
 */
export const BASE_OPERATIVA = {
  nombre: 'Base GM · San Miguel de Tucumán',
  lat: -26.8241,
  lng: -65.2226,
};

/** Velocidad promedio para estimar el manejo. En Tucumán, con tráfico y
 *  estacionamiento, 28 km/h es más honesto que cualquier número de ruta. */
export const KM_POR_HORA = 28;

export const minutosDeViaje = (km) => Math.round((km / KM_POR_HORA) * 60);

/** Los módulos que alimentan la bandeja de pendientes, con su nombre para
 *  mostrar. Los ids son los mismos que emite gm_v_agenda_pendientes. */
export const ORIGENES = {
  seguimientos: { nombre: 'Seguimientos', modulo: 'M-03', tono: 'aqua' },
  equipamientos: { nombre: 'Equipamientos', modulo: 'M-02', tono: 'naranja' },
  logistica: { nombre: 'Logística', modulo: 'M-06', tono: 'azul' },
  cobranzas: { nombre: 'Cobranzas', modulo: 'M-07', tono: 'amarillo' },
  postventa: { nombre: 'Post Venta', modulo: 'M-09', tono: 'rosa' },
  manual: { nombre: 'Cargado a mano', modulo: '', tono: 'gris' },
};

export const getOrigen = (id) => ORIGENES[id] || ORIGENES.manual;

export const URGENCIAS = {
  1: { nombre: 'Atrasado', color: ESTADO_COLOR.critico },
  2: { nombre: 'Para esta semana', color: ESTADO_COLOR.atencion },
  3: { nombre: 'Puede esperar', color: ESTADO_COLOR.neutro },
};
