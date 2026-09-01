// ============================================================================
// SISTEMA GM · SEGUIMIENTOS · NIVELES DE PROCESO
// ----------------------------------------------------------------------------
// Única fuente de verdad del pipeline. El tablero, los filtros y las métricas
// se construyen a partir de esta lista.
// ============================================================================

export const ETAPAS = [
  {
    id: 'comienzo',
    label: 'Comienzo',
    desc: 'Primer contacto realizado',
    color: 'text-sky-400',
    borde: 'border-sky-500/40',
    fondo: 'bg-sky-500/10',
    barra: 'bg-sky-500',
    probabilidad: 15,
  },
  {
    id: 'proceso',
    label: 'En Proceso',
    desc: 'Necesidad detectada, cotizando',
    color: 'text-cyan-400',
    borde: 'border-cyan-500/40',
    fondo: 'bg-cyan-500/10',
    barra: 'bg-cyan-500',
    probabilidad: 35,
  },
  {
    id: 'convencer',
    label: 'Convencer Más',
    desc: 'Hay objeciones para trabajar',
    color: 'text-amber-400',
    borde: 'border-amber-500/40',
    fondo: 'bg-amber-500/10',
    barra: 'bg-amber-500',
    probabilidad: 55,
  },
  {
    id: 'posible-venta',
    label: 'Posible Venta',
    desc: 'Listo para cerrar',
    color: 'text-violet-400',
    borde: 'border-violet-500/40',
    fondo: 'bg-violet-500/10',
    barra: 'bg-violet-500',
    probabilidad: 80,
  },
  {
    id: 'cerrado',
    label: 'Cerrado',
    desc: 'Operación concretada',
    color: 'text-emerald-400',
    borde: 'border-emerald-500/40',
    fondo: 'bg-emerald-500/10',
    barra: 'bg-emerald-500',
    probabilidad: 100,
  },
];

export const getEtapa = (id) => ETAPAS.find((e) => e.id === id) || ETAPAS[0];

/** Semáforo de contacto: cuántos días sin tocar al lead. */
export const TEMPERATURA = [
  { max: 3, label: 'Al día', color: 'text-emerald-400', punto: 'bg-emerald-400' },
  { max: 7, label: 'Tibio', color: 'text-amber-400', punto: 'bg-amber-400' },
  { max: 15, label: 'Enfriando', color: 'text-orange-400', punto: 'bg-orange-400' },
  { max: Infinity, label: 'Frío', color: 'text-rose-400', punto: 'bg-rose-400' },
];

export const getTemperatura = (dias = 0) =>
  TEMPERATURA.find((t) => dias <= t.max) || TEMPERATURA[TEMPERATURA.length - 1];

export const PRIORIDADES = {
  alta: { label: 'Alta', color: 'text-rose-400', fondo: 'bg-rose-500/10 border-rose-500/30' },
  media: { label: 'Media', color: 'text-amber-400', fondo: 'bg-amber-500/10 border-amber-500/30' },
  baja: { label: 'Baja', color: 'text-gray-400', fondo: 'bg-gray-500/10 border-gray-600/40' },
};

export default ETAPAS;
