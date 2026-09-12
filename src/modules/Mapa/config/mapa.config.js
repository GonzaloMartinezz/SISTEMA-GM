// ============================================================================
// SISTEMA GM · M-06 MAPA Y LOGÍSTICA · VOCABULARIO Y PARÁMETROS
// ============================================================================

import { Building2, MapPin, Phone, MessageCircle, Mail, CheckSquare, Truck } from 'lucide-react';
import { SERIE, ESTADO_COLOR } from '../../../shared/gm-ui/tokens';

/**
 * De dónde salen los mosaicos de calles.
 *
 * Se usa el mapa claro de CARTO sobre datos de OpenStreetMap: es abierto, no
 * pide clave ni cuenta, y su gris pálido deja que los pines de colores sean lo
 * único que resalta — que es exactamente lo que un mapa de trabajo necesita.
 * El crédito es obligatorio por licencia y va abajo a la derecha, siempre.
 *
 * Si algún día querés otro proveedor, se cambia esta sola función.
 */
export const TILES = {
  url: (t) => `https://basemaps.cartocdn.com/light_all/${t.z}/${t.x}/${t.y}.png`,
  credito: '© OpenStreetMap · © CARTO',
};

export const ZOOM_MIN = 5;
export const ZOOM_MAX = 18;

/** Cada cuántos grados va una línea de la retícula, según el zoom. */
export const PASO_RETICULA = (zoom) => {
  if (zoom >= 14) return 0.01;
  if (zoom >= 12) return 0.05;
  if (zoom >= 10) return 0.1;
  if (zoom >= 8) return 0.5;
  return 1;
};

/**
 * De dónde salís y a dónde volvés. Es el mismo punto que usa la Agenda para
 * medir la ruta del día: si se muda el depósito, se cambia en los dos lados.
 */
export const BASE_OPERATIVA = {
  codigo: '__base__',
  nombre: 'Base GM',
  lat: -26.8241,
  lng: -65.2226,
  direccion: 'San Miguel de Tucumán',
};

/** Velocidad urbana promedio para estimar el manejo (Tucumán, con tráfico). */
export const KM_POR_HORA = 28;
export const minutosDeViaje = (km) => Math.round((km / KM_POR_HORA) * 60);

/**
 * El color del pin lo define el ESTADO de la relación, no el rubro. Es lo que
 * uno necesita ver desde lejos: quién debe, quién está al día, quién todavía no
 * compró. El rubro va escrito en la ficha, que es donde se lee de cerca.
 */
export const ESTADOS = {
  corriente: { nombre: 'Al día', color: ESTADO_COLOR.bien, tono: 'aqua' },
  mora: { nombre: 'En mora', color: ESTADO_COLOR.critico, tono: 'rosa' },
  lead: { nombre: 'Venta en curso', color: SERIE.ambar, tono: 'amarillo' },
  inactivo: { nombre: 'Inactivo', color: '#948A7C', tono: 'gris' },
};

export const getEstado = (id) => ESTADOS[id] || ESTADOS.inactivo;

export const RUBRO_ICONO = {
  Odontología: Building2,
  Veterinaria: Building2,
  'Diagnóstico por Imagen': Building2,
};

/** Los tipos de compromiso de la agenda, con el color que ya tienen ahí. */
export const TIPOS_COMPROMISO = {
  visita: { nombre: 'Visitar', icono: MapPin, color: SERIE.terracota, tono: 'naranja', enCalle: true },
  llamada: { nombre: 'Llamar', icono: Phone, color: SERIE.azul, tono: 'azul', enCalle: false },
  mensaje: { nombre: 'Escribir', icono: MessageCircle, color: SERIE.verde, tono: 'aqua', enCalle: false },
  mail: { nombre: 'Mandar mail', icono: Mail, color: SERIE.ambar, tono: 'amarillo', enCalle: false },
  tarea: { nombre: 'Tarea', icono: CheckSquare, color: '#948A7C', tono: 'gris', enCalle: false },
  entrega: { nombre: 'Entregar', icono: Truck, color: SERIE.terracota, tono: 'naranja', enCalle: true },
};

export const getTipoCompromiso = (id) => TIPOS_COMPROMISO[id] || TIPOS_COMPROMISO.tarea;

/** Ventanas de la agenda sobre el mapa. */
export const HORIZONTES = [
  { id: 'hoy', nombre: 'Hoy', dias: 0 },
  { id: 'manana', nombre: 'Mañana', dias: 1 },
  { id: 'semana', nombre: 'Esta semana', dias: 7 },
  { id: 'mes', nombre: 'Este mes', dias: 30 },
];

export const getHorizonte = (id) => HORIZONTES.find((h) => h.id === id) || HORIZONTES[0];

/** Días sin visitar a partir de los cuales una zona se considera abandonada. */
export const DIAS_ABANDONO = 60;

// ---------------------------------------------------------------------------
// Salidas a Google Maps
// ---------------------------------------------------------------------------
// El mapa del sistema es para MIRAR y decidir; para manejar se usa Google Maps,
// que es lo que ya tenés en el teléfono y sabe de tráfico y de cortes. Por eso
// el módulo no intenta competir con eso: te lo entrega en un clic.

/** Ver el punto exacto en Google Maps. */
export const linkUbicacion = (p) =>
  `https://www.google.com/maps/search/?api=1&query=${p.lat},${p.lng}`;

/** Cómo llegar desde donde estás hasta el punto. */
export const linkComoLlegar = (p) =>
  `https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lng}&travelmode=driving`;

/** La vuelta completa: sale de la base, pasa por todas y vuelve. */
export function linkRutaCompleta(paradas, base = BASE_OPERATIVA) {
  if (!paradas.length) return null;
  const punto = (p) => `${p.lat},${p.lng}`;
  const intermedias = paradas.map(punto).join('|');
  return (
    'https://www.google.com/maps/dir/?api=1' +
    `&origin=${punto(base)}&destination=${punto(base)}` +
    `&waypoints=${encodeURIComponent(intermedias)}&travelmode=driving`
  );
}

export const soloDigitos = (v = '') => String(v).replace(/\D/g, '');

export const linkWhatsApp = (tel) => {
  const d = soloDigitos(tel);
  return d ? `https://wa.me/54${d}` : null;
};

export const linkTelefono = (tel) => {
  const d = soloDigitos(tel);
  return d ? `tel:+54${d}` : null;
};
