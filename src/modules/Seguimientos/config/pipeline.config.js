// ============================================================================
// SISTEMA GM · M-03 SEGUIMIENTOS · ETAPAS, TEMPERATURA Y PRIORIDAD
// ----------------------------------------------------------------------------
// Las cinco etapas son un orden, no cinco categorías sueltas: van de "recién
// lo saludé" a "ya cobré". Por eso el color es una rampa de un solo tono que se
// va oscureciendo, la misma que usa el embudo. Si fueran cinco colores
// distintos, el tablero diría que son cosas diferentes cuando en realidad son
// el mismo camino en distintos puntos.
//
// La probabilidad de cada etapa es la que pondera la cartera. No es una
// estadística: es el criterio del negocio, y está acá a la vista justamente
// para poder discutirlo cuando la realidad diga otra cosa.
// ============================================================================

import { RAMPA, ESTADO_COLOR } from '../../../shared/gm-ui/tokens';

export const ETAPAS = [
  {
    id: 'comienzo',
    nombre: 'Comienzo',
    bajada: 'Primer contacto realizado',
    probabilidad: 15,
    color: RAMPA[0],
  },
  {
    id: 'proceso',
    nombre: 'En Proceso',
    bajada: 'Necesidad detectada, cotizando',
    probabilidad: 35,
    color: RAMPA[1],
  },
  {
    id: 'convencer',
    nombre: 'Convencer Más',
    bajada: 'Hay objeciones para trabajar',
    probabilidad: 55,
    color: RAMPA[2],
  },
  {
    id: 'posible-venta',
    nombre: 'Posible Venta',
    bajada: 'Listo para cerrar',
    probabilidad: 80,
    color: RAMPA[3],
  },
  {
    id: 'cerrado',
    nombre: 'Cerrado',
    bajada: 'Operación concretada',
    probabilidad: 100,
    color: RAMPA[4],
  },
];

export const ETAPAS_ID = ETAPAS.map((e) => e.id);

export const getEtapa = (id) => ETAPAS.find((e) => e.id === id) || ETAPAS[0];

/** Posición de la etapa en el camino (0..4). -1 si no la conocemos. */
export const indiceEtapa = (id) => ETAPAS.findIndex((e) => e.id === id);

/**
 * Semáforo por días sin contacto. Los umbrales son del negocio: un lead de
 * equipamiento aguanta bastante más que uno de consumo, pero pasadas dos
 * semanas ya hay que dar por perdido el impulso de la primera charla.
 */
export const TEMPERATURA = [
  { max: 3, nombre: 'Al día', color: ESTADO_COLOR.bien },
  { max: 7, nombre: 'Tibio', color: ESTADO_COLOR.atencion },
  { max: 15, nombre: 'Enfriando', color: ESTADO_COLOR.riesgo },
  { max: Infinity, nombre: 'Frío', color: ESTADO_COLOR.critico },
];

export const getTemperatura = (dias = 0) => TEMPERATURA.find((t) => dias <= t.max);

/** Días sin contacto a partir de los cuales un lead entra en la lista de hoy. */
export const DIAS_FRIO = 7;

export const PRIORIDADES = {
  alta: { nombre: 'Alta', tono: 'rosa' },
  media: { nombre: 'Media', tono: 'amarillo' },
  baja: { nombre: 'Baja', tono: 'gris' },
};

export const getPrioridad = (id) => PRIORIDADES[id] || PRIORIDADES.baja;

export default ETAPAS;
