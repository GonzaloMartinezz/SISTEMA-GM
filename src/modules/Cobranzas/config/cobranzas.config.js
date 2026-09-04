// ============================================================================
// SISTEMA GM · M-08 COBRANZAS · CONFIGURACIÓN DEL MÓDULO
// ----------------------------------------------------------------------------
// Todo lo que el módulo considera "una regla del negocio" vive acá y en ningún
// otro lado: los estados, las categorías de gasto, los umbrales de alarma y el
// formato de la plata. Si mañana cambia el criterio de "atrasado", se cambia
// una línea de este archivo y cambia en las cuatro pantallas a la vez.
// ============================================================================

import {
  AlertTriangle, Banknote, Building2, CheckCircle2, CreditCard,
  Fuel, Landmark, Package, Receipt, Truck, User, Wallet, Wrench,
} from 'lucide-react';
import { ESTADO_COLOR, SERIE, RAMPA } from '../../../shared/gm-ui/tokens';

// ---------------------------------------------------------------------------
// Cuánto atraso es "atraso"
// ---------------------------------------------------------------------------
// Un día tarde no es lo mismo que un mes tarde, y tratarlos igual hace que uno
// termine ignorando las dos alarmas. Tres escalones, y el nombre dice qué hacer.
export const ATRASO = [
  { hasta: 7,        id: 'reciente', nombre: 'Recién vencida', tono: 'amarillo', color: ESTADO_COLOR.atencion },
  { hasta: 30,       id: 'firme',    nombre: 'Atrasada',       tono: 'naranja',  color: ESTADO_COLOR.riesgo },
  { hasta: Infinity, id: 'grave',    nombre: 'Muy atrasada',   tono: 'rosa',     color: ESTADO_COLOR.critico },
];

export const getAtraso = (dias) =>
  ATRASO.find((a) => Math.abs(Number(dias) || 0) <= a.hasta) || ATRASO[ATRASO.length - 1];

/** A partir de acá una venta atrasada se considera plata en riesgo real. */
export const DIAS_RIESGO = 30;

/** Ventana por defecto del calendario y de la vista de caja. */
export const DIAS_PROXIMOS = 30;

// ---------------------------------------------------------------------------
// Estados
// ---------------------------------------------------------------------------
export const ESTADOS_VENTA = {
  'al dia':   { nombre: 'Al día',    tono: 'aqua',     color: ESTADO_COLOR.bien,     icono: CheckCircle2 },
  atrasada:   { nombre: 'Atrasada',  tono: 'rosa',     color: ESTADO_COLOR.critico,  icono: AlertTriangle },
  cobrada:    { nombre: 'Cobrada',   tono: 'gris',     color: ESTADO_COLOR.neutro,   icono: CheckCircle2 },
  'sin plan': { nombre: 'Sin plan',  tono: 'amarillo', color: ESTADO_COLOR.atencion, icono: AlertTriangle },
  anulada:    { nombre: 'Anulada',   tono: 'gris',     color: ESTADO_COLOR.neutro,   icono: AlertTriangle },
};

export const getEstadoVenta = (id) =>
  ESTADOS_VENTA[id] || { nombre: id || '—', tono: 'gris', color: ESTADO_COLOR.neutro, icono: CheckCircle2 };

export const ESTADOS_CUOTA = {
  pagada:    { nombre: 'Pagada',    tono: 'aqua',     color: ESTADO_COLOR.bien },
  parcial:   { nombre: 'A medias',  tono: 'amarillo', color: ESTADO_COLOR.atencion },
  vencida:   { nombre: 'Vencida',   tono: 'rosa',     color: ESTADO_COLOR.critico },
  pendiente: { nombre: 'Pendiente', tono: 'gris',     color: ESTADO_COLOR.neutro },
  anulada:   { nombre: 'Anulada',   tono: 'gris',     color: ESTADO_COLOR.neutro },
};

export const getEstadoCuota = (id) =>
  ESTADOS_CUOTA[id] || ESTADOS_CUOTA.pendiente;

// ---------------------------------------------------------------------------
// Categorías de egreso
// ---------------------------------------------------------------------------
// El orden importa: es el orden en que se leen en el resultado del mes, de lo
// que más pesa a lo que menos. La mercadería primero porque es la que decide
// si el mes cierra o no.
export const CATEGORIAS = [
  { id: 'mercaderia', nombre: 'Mercadería', icono: Package,   color: RAMPA[4], ayuda: 'Lo que costó el equipo que vendés.' },
  { id: 'logistica',  nombre: 'Logística',  icono: Truck,     color: RAMPA[3], ayuda: 'Fletes, combustible, peajes, instalación.' },
  { id: 'sueldo',     nombre: 'Sueldo',     icono: User,      color: RAMPA[2], ayuda: 'Tu sueldo y el de quien trabaje con vos.' },
  { id: 'impuestos',  nombre: 'Impuestos',  icono: Landmark,  color: RAMPA[1], ayuda: 'IIBB, monotributo, retenciones.' },
  { id: 'operativo',  nombre: 'Operativo',  icono: Wrench,    color: RAMPA[0], ayuda: 'Depósito, teléfono, contador, software, publicidad.' },
  { id: 'retiro',     nombre: 'Retiro',     icono: Wallet,    color: SERIE.azul, ayuda: 'Plata que sacás del negocio para vos.' },
  { id: 'otro',       nombre: 'Otro',       icono: Receipt,   color: ESTADO_COLOR.neutro, ayuda: 'Lo que no entra en ninguna de las anteriores.' },
];

export const getCategoria = (id) =>
  CATEGORIAS.find((c) => c.id === id) ||
  { id: id || 'otro', nombre: id || 'Otro', icono: Receipt, color: ESTADO_COLOR.neutro, ayuda: '' };

/** El retiro no es un gasto del negocio: es plata tuya que ya ganaste.
 *  Se excluye del costo para no ensuciar el margen. */
export const CATEGORIAS_DE_COSTO = ['mercaderia', 'logistica', 'sueldo', 'impuestos', 'operativo', 'otro'];

// ---------------------------------------------------------------------------
// Medios de pago
// ---------------------------------------------------------------------------
export const MEDIOS = [
  { id: 'transferencia', nombre: 'Transferencia', icono: Building2 },
  { id: 'efectivo',      nombre: 'Efectivo',      icono: Banknote },
  { id: 'cheque',        nombre: 'Cheque',        icono: Receipt },
  { id: 'tarjeta',       nombre: 'Tarjeta',       icono: CreditCard },
  { id: 'otro',          nombre: 'Otro',          icono: Fuel },
];

export const getMedio = (id) =>
  MEDIOS.find((m) => m.id === id) || { id: id || 'otro', nombre: id || 'Otro', icono: Receipt };

export const CONCEPTOS_COBRO = [
  { id: 'cuota',    nombre: 'Pago de cuotas', ayuda: 'Se imputa solo, de la cuota más vieja en adelante.' },
  { id: 'anticipo', nombre: 'Anticipo',       ayuda: 'No se imputa a ninguna cuota: es de la venta.' },
  { id: 'ajuste',   nombre: 'Ajuste',         ayuda: 'Corrección manual. Tampoco toca las cuotas.' },
];

// ---------------------------------------------------------------------------
// Formato
// ---------------------------------------------------------------------------
export const usd = (v) =>
  `US$ ${Math.round(Number(v || 0)).toLocaleString('es-AR')}`;

export const usdExacto = (v) =>
  `US$ ${Number(v || 0).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export const usdCorto = (v) => {
  const n = Number(v || 0);
  const abs = Math.abs(n);
  const signo = n < 0 ? '−' : '';
  if (abs >= 1000) return `${signo}${(abs / 1000).toFixed(abs >= 10000 ? 0 : 1)}k`;
  return `${signo}${Math.round(abs)}`;
};

export const ars = (v) =>
  v == null ? null : `$ ${Math.round(Number(v)).toLocaleString('es-AR')}`;

const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

export const MESES_CORTOS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun',
  'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

export const DIAS_SEMANA = ['lun', 'mar', 'mié', 'jue', 'vie', 'sáb', 'dom'];

/** Construye la fecha componente a componente. `new Date('2026-09-01')` la lee
 *  como UTC y en Argentina devuelve el 31 de agosto: el bug clásico del mes. */
export const aFecha = (iso) => {
  if (!iso) return null;
  const [a, m, d] = String(iso).slice(0, 10).split('-').map(Number);
  if (!a || !m || !d) return null;
  return new Date(a, m - 1, d);
};

export const hoyIso = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export const fechaCorta = (iso) => {
  const f = aFecha(iso);
  return f ? `${f.getDate()} ${MESES_CORTOS[f.getMonth()]}` : '—';
};

export const fechaLarga = (iso) => {
  const f = aFecha(iso);
  return f ? `${f.getDate()} de ${MESES[f.getMonth()]} de ${f.getFullYear()}` : '—';
};

export const mesLargo = (mesIso) => {
  const [a, m] = String(mesIso || '').split('-').map(Number);
  return a && m ? `${MESES[m - 1]} de ${a}` : '—';
};

/** Plurales bien hechos. "1 días" delata que el texto lo escribió una máquina. */
export const plural = (n, singular, pluralPalabra) =>
  `${n} ${Math.abs(Number(n)) === 1 ? singular : pluralPalabra}`;

export const dias = (n) => plural(n, 'día', 'días');

export default {
  ATRASO, ESTADOS_VENTA, ESTADOS_CUOTA, CATEGORIAS, MEDIOS,
  DIAS_RIESGO, DIAS_PROXIMOS,
};
