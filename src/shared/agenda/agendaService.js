// ============================================================================
// SISTEMA GM · CAPA COMPARTIDA · SERVICIO DE AGENDA
// ----------------------------------------------------------------------------
// Provee los eventos y arma los enlaces de sincronización con Google Calendar.
// ============================================================================

import { supabase, isSupabaseConfigured } from '../../services/supabaseClient';
import { EVENTOS_DEMO, CLIENTES_GEO, BASE_OPERATIVA, HOY, MANANA } from './agendaDemo';

const delay = (ms) => new Promise((r) => setTimeout(r, ms));
const modoDemo = () => !isSupabaseConfigured;

export { HOY, MANANA, BASE_OPERATIVA };

/** Fila de Supabase -> forma que usan la agenda y el mapa. */
const aEvento = (r) => ({
  id: r.codigo || r.id,
  uuid: r.id,
  fecha: r.fecha,
  hora: r.hora,
  duracion: r.duracion,
  tipo: r.tipo,
  titulo: r.titulo,
  cliente: r.cliente,
  clienteId: r.cliente_id,
  direccion: r.direccion,
  lat: Number(r.latitud),
  lng: Number(r.longitud),
  estado: r.estado,
  prioridad: r.prioridad,
  nota: r.nota,
});

export async function listarEventos(fecha) {
  if (modoDemo()) {
    await delay(110);
    const lista = EVENTOS_DEMO.map((e) => ({ ...e }));
    return (fecha ? lista.filter((e) => e.fecha === fecha) : lista).sort((a, b) =>
      a.hora.localeCompare(b.hora)
    );
  }

  let q = supabase.from('gm_agenda').select('*').order('fecha').order('hora');
  if (fecha) q = q.eq('fecha', fecha);

  const { data, error } = await q;
  if (error) {
    console.error('[agendaService] listarEventos:', error.message);
    return [];
  }
  return (data || []).map(aEvento);
}

export async function listarClientesGeo() {
  if (modoDemo()) {
    await delay(80);
    return CLIENTES_GEO.map((c) => ({ ...c }));
  }

  const { data, error } = await supabase
    .from('gm_clientes')
    .select('codigo, negocio, profesional_nombre, profesional_apellido, rubro, localidad, latitud, longitud, estado')
    .eq('activo', true)
    .not('latitud', 'is', null);

  if (error) {
    console.error('[agendaService] listarClientesGeo:', error.message);
    return [];
  }

  return (data || []).map((c) => ({
    id: c.codigo,
    nombre: `${c.profesional_apellido}, ${c.profesional_nombre}`,
    clinica: c.negocio,
    zona: c.localidad,
    lat: Number(c.latitud),
    lng: Number(c.longitud),
    estado: c.estado,
    especialidad: c.rubro,
  }));
}

const aFila = (e) => ({
  codigo: e.id || `EV-${Date.now()}`,
  fecha: e.fecha,
  hora: e.hora,
  duracion: Number(e.duracion) || 30,
  tipo: e.tipo,
  titulo: e.titulo,
  cliente: e.cliente,
  direccion: e.direccion || null,
  latitud: e.lat ?? null,
  longitud: e.lng ?? null,
  prioridad: e.prioridad || 'media',
  nota: e.nota || null,
});

export async function guardarEvento(evento) {
  if (modoDemo()) return { ...evento, id: evento.id || `EV-${Date.now()}` };

  const { data, error } = await supabase
    .from('gm_agenda')
    .insert({ ...aFila(evento), estado: 'pendiente' })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return aEvento(data);
}

export async function actualizarEvento(codigo, cambios) {
  const { data, error } = await supabase
    .from('gm_agenda')
    .update(aFila({ ...cambios, id: codigo }))
    .eq('codigo', codigo)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return aEvento(data);
}

export async function cambiarEstadoEvento(codigo, estado) {
  if (modoDemo()) return { codigo, estado };
  const { error } = await supabase.from('gm_agenda').update({ estado }).eq('codigo', codigo);
  if (error) throw new Error(error.message);
  return { codigo, estado };
}

export async function eliminarEvento(codigo) {
  const { error } = await supabase.from('gm_agenda').delete().eq('codigo', codigo);
  if (error) throw new Error(error.message);
  return true;
}

// ---------------------------------------------------------------------------
// Google Calendar · sincronización
// ---------------------------------------------------------------------------

const aUTC = (fecha, hora, minutosExtra = 0) => {
  const [y, m, d] = fecha.split('-').map(Number);
  const [hh, mm] = hora.split(':').map(Number);
  const local = new Date(y, m - 1, d, hh, mm + minutosExtra);
  return local.toISOString().replace(/[-:]|\.\d{3}/g, '');
};

/** Enlace para crear el evento en Google Calendar (salida hacia el calendario). */
export function linkGoogleCalendar(evento) {
  const inicio = aUTC(evento.fecha, evento.hora);
  const fin = aUTC(evento.fecha, evento.hora, evento.duracion || 30);
  const texto = encodeURIComponent(`${evento.titulo} · ${evento.cliente}`);
  const detalles = encodeURIComponent(
    `${evento.nota || ''}\n\nSistema GM · ${evento.tipo === 'visita' ? 'Visita programada' : 'Llamada agendada'}`
  );
  const lugar = encodeURIComponent(evento.direccion || '');
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${texto}&dates=${inicio}/${fin}&details=${detalles}&location=${lugar}`;
}

/** Archivo .ics con la jornada completa (importable en cualquier calendario). */
export function generarICS(eventos, nombreArchivo = 'agenda-gm.ics') {
  const lineas = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Sistema GM//Agenda//ES',
    'CALSCALE:GREGORIAN',
  ];

  eventos.forEach((e) => {
    lineas.push(
      'BEGIN:VEVENT',
      `UID:${e.id}@sistema-gm`,
      `DTSTAMP:${aUTC(e.fecha, e.hora)}`,
      `DTSTART:${aUTC(e.fecha, e.hora)}`,
      `DTEND:${aUTC(e.fecha, e.hora, e.duracion || 30)}`,
      `SUMMARY:${e.titulo} · ${e.cliente}`,
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
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
