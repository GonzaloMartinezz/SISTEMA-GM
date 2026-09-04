// ============================================================================
// SISTEMA GM · M-05 AGENDA INTELIGENTE · ACCESO A DATOS
// ----------------------------------------------------------------------------
// Dos fuentes bien distintas, y la diferencia importa:
//
//   gm_agenda              -> COMPROMISOS. Ocupan una hora del día. Se crean,
//                             se editan y se cierran. Son tuyos.
//   gm_v_agenda_pendientes -> SUGERENCIAS. Las calcula la base juntando lo que
//                             saben Seguimientos, Equipamientos, Logística,
//                             Cobranzas y Post Venta. No ocupan tiempo hasta
//                             que las agendás, y se apagan solas cuando lo hacés.
//
// Mezclarlas sería cómodo y estaría mal: la agenda tiene que poder decirte
// "hoy tenés 4 horas comprometidas" sin sumarle nueve cosas que todavía no
// decidiste hacer hoy.
// ============================================================================

import { supabase, isSupabaseConfigured } from '../../../services/supabaseClient';
import { EVENTOS_DEMO } from '../data/agendaDemo';

const modoDemo = () => !isSupabaseConfigured;
const demora = (ms) => new Promise((r) => setTimeout(r, ms));

// ---------------------------------------------------------------------------
// Traducción base <-> módulo
// ---------------------------------------------------------------------------

/** Coordenada de Supabase -> número o null. NUNCA 0: ver utils/ruta.js. */
const aCoord = (v) => (v === null || v === undefined || v === '' ? null : Number(v));

const aEvento = (r) => ({
  id: r.codigo || r.id,
  uuid: r.id,
  fecha: r.fecha,
  hora: r.hora,
  duracion: Number(r.duracion) || 30,
  tipo: r.tipo,
  titulo: r.titulo,
  cliente: r.cliente,
  clienteId: r.cliente_id || null,
  leadCodigo: r.lead_codigo || null,
  direccion: r.direccion,
  lat: aCoord(r.latitud),
  lng: aCoord(r.longitud),
  estado: r.estado,
  prioridad: r.prioridad,
  nota: r.nota,
  resultado: r.resultado || null,
  origenModulo: r.origen_modulo || null,
  origenCodigo: r.origen_codigo || null,
  recordatorioMin: r.recordatorio_min ?? 30,
});

/**
 * Módulo -> Supabase. No incluye `estado`: el estado se cambia con su propia
 * función, así una edición del título nunca reabre un compromiso ya cerrado.
 */
const aFila = (e) => ({
  fecha: e.fecha,
  hora: e.hora || '09:00',
  duracion: Number(e.duracion) || 30,
  tipo: e.tipo || 'tarea',
  titulo: e.titulo,
  cliente: e.cliente || null,
  lead_codigo: e.leadCodigo || null,
  direccion: e.direccion || null,
  latitud: e.lat === '' || e.lat == null ? null : Number(e.lat),
  longitud: e.lng === '' || e.lng == null ? null : Number(e.lng),
  prioridad: e.prioridad || 'media',
  nota: e.nota || null,
  origen_modulo: e.origenModulo || null,
  origen_codigo: e.origenCodigo || null,
  recordatorio_min: Number(e.recordatorioMin) || 30,
});

// ---------------------------------------------------------------------------
// Compromisos
// ---------------------------------------------------------------------------

/**
 * Trae los compromisos de un rango. La agenda nunca pide "todo": pide el mes
 * que estás mirando, con un margen a los costados para que las vistas de
 * semana y mes tengan los días vecinos sin una segunda consulta.
 */
export async function listarEventos(desde, hasta) {
  if (modoDemo()) {
    await demora(110);
    return EVENTOS_DEMO.filter((e) => e.fecha >= desde && e.fecha <= hasta).map((e) => ({ ...e }));
  }

  const { data, error } = await supabase
    .from('gm_agenda')
    .select('*')
    .gte('fecha', desde)
    .lte('fecha', hasta)
    .order('fecha')
    .order('hora');

  if (error) {
    console.error('[agenda] listarEventos', error.message);
    return [];
  }
  return (data || []).map(aEvento);
}

export async function crearEvento(evento) {
  if (modoDemo()) return { ...evento, id: `EV-${Date.now()}`, estado: 'pendiente' };
  const { data, error } = await supabase
    .from('gm_agenda')
    .insert({ ...aFila(evento), estado: 'pendiente' })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return aEvento(data);
}

export async function actualizarEvento(codigo, cambios) {
  if (modoDemo()) return { ...cambios, id: codigo };
  const { data, error } = await supabase
    .from('gm_agenda')
    .update(aFila(cambios))
    .eq('codigo', codigo)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return aEvento(data);
}

/** Cerrar un compromiso puede dejar anotado qué pasó. */
export async function cambiarEstado(codigo, estado, resultado = null) {
  if (modoDemo()) return true;
  const cambios = { estado };
  if (resultado !== null) cambios.resultado = resultado;
  const { error } = await supabase.from('gm_agenda').update(cambios).eq('codigo', codigo);
  if (error) throw new Error(error.message);
  return true;
}

/** Mover de día u hora sin abrir el formulario entero. */
export async function reprogramar(codigo, fecha, hora) {
  if (modoDemo()) return true;
  const cambios = { fecha };
  if (hora) cambios.hora = hora;
  const { error } = await supabase.from('gm_agenda').update(cambios).eq('codigo', codigo);
  if (error) throw new Error(error.message);
  return true;
}

export async function eliminarEvento(codigo) {
  if (modoDemo()) return true;
  const { error } = await supabase.from('gm_agenda').delete().eq('codigo', codigo);
  if (error) throw new Error(error.message);
  return true;
}

// ---------------------------------------------------------------------------
// Bandeja de pendientes
// ---------------------------------------------------------------------------

const aPendiente = (r) => ({
  // La clave es el par módulo+código: es lo único que identifica una sugerencia,
  // y es lo que después queda guardado en el compromiso para apagarla.
  clave: `${r.modulo}:${r.origen_codigo}`,
  modulo: r.modulo,
  origenCodigo: r.origen_codigo,
  tipoSugerido: r.tipo_sugerido,
  motivo: r.motivo,
  titular: r.titular,
  referencia: r.referencia,
  detalle: r.detalle,
  montoUsd: Number(r.monto_usd || 0),
  prioridad: r.prioridad,
  fechaObjetivo: r.fecha_objetivo || null,
  urgencia: Number(r.urgencia) || 3,
});

export async function listarPendientes() {
  if (modoDemo()) {
    await demora(90);
    return [];
  }
  const { data, error } = await supabase
    .from('gm_v_agenda_pendientes')
    .select('*')
    .order('urgencia')
    .order('modulo');

  if (error) {
    console.error('[agenda] listarPendientes', error.message);
    return [];
  }
  return (data || []).map(aPendiente);
}

// ---------------------------------------------------------------------------
// Salidas a calendario. No es una sincronización y no se anuncia como tal:
// son dos formas de sacar lo que ya está acá hacia afuera, sin vuelta.
// ---------------------------------------------------------------------------

const aUTC = (fecha, hora, minutosExtra = 0) => {
  const [a, m, d] = String(fecha).split('-').map(Number);
  const [hh, mm] = String(hora || '09:00').split(':').map(Number);
  const dt = new Date(a, m - 1, d, hh, mm + minutosExtra);
  return dt.toISOString().replace(/[-:]|\.\d{3}/g, '');
};

export function linkGoogleCalendar(evento) {
  const inicio = aUTC(evento.fecha, evento.hora);
  const fin = aUTC(evento.fecha, evento.hora, evento.duracion || 30);
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: `${evento.titulo}${evento.cliente ? ` · ${evento.cliente}` : ''}`,
    dates: `${inicio}/${fin}`,
    details: evento.nota || '',
    location: evento.direccion || '',
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function generarICS(eventos, nombreArchivo = 'agenda-gm.ics') {
  const lineas = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Sistema GM//Agenda//ES'];
  eventos.forEach((e) => {
    lineas.push(
      'BEGIN:VEVENT',
      `UID:${e.id}@sistema-gm`,
      `DTSTAMP:${aUTC(e.fecha, e.hora)}`,
      `DTSTART:${aUTC(e.fecha, e.hora)}`,
      `DTEND:${aUTC(e.fecha, e.hora, e.duracion || 30)}`,
      `SUMMARY:${e.titulo}${e.cliente ? ` · ${e.cliente}` : ''}`,
      `LOCATION:${e.direccion || ''}`,
      `DESCRIPTION:${(e.nota || '').replace(/\n/g, ' ')}`,
      'END:VEVENT'
    );
  });
  lineas.push('END:VCALENDAR');

  const blob = new Blob([lineas.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = nombreArchivo;
  a.click();
  URL.revokeObjectURL(url);
}
