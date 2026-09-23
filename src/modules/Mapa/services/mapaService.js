// ============================================================================
// SISTEMA GM · M-06 MAPA Y LOGÍSTICA · ACCESO A DATOS
// ----------------------------------------------------------------------------
// Dos fuentes:
//   gm_v_mapa_clientes -> el punto y su ficha completa (lectura)
//   gm_agenda          -> los compromisos que se dibujan sobre el mapa
//
// Además se cuentan aparte los clientes SIN coordenadas. No se dibujan —no se
// puede— pero el módulo tiene que decir cuántos son: un mapa que muestra seis
// de ocho clientes sin avisarlo hace tomar decisiones sobre una foto incompleta.
// ============================================================================

import { supabase, isSupabaseConfigured } from '../../../services/supabaseClient';
import { CLIENTES_DEMO, COMPROMISOS_DEMO } from '../data/mapaDemo';

const modoDemo = () => !isSupabaseConfigured;
const demora = (ms) => new Promise((r) => setTimeout(r, ms));

const num = (v) => (v === null || v === undefined || v === '' ? null : Number(v));

const aCliente = (r) => ({
  codigo: r.codigo,
  nombre: r.nombre,
  titular: r.titular || null,
  rubro: r.rubro,
  clasificacion: r.clasificacion,
  estado: r.estado,
  telefono: r.telefono || r.celular || null,
  celular: r.celular || null,
  email: r.email || null,
  direccion: r.direccion || null,
  localidad: r.localidad || 'Sin zona',
  provincia: r.provincia,
  lat: num(r.lat),
  lng: num(r.lng),
  clienteDesde: r.cliente_desde,
  notas: r.notas || null,
  ultimaVisita: r.ultima_visita || null,
  proximaFecha: r.proxima_fecha || null,
  proximoTipo: r.proximo_tipo || null,
  proximoTitulo: r.proximo_titulo || null,
  compromisosAbiertos: Number(r.compromisos_abiertos) || 0,
  leadCodigo: r.lead_codigo || null,
  leadEtapa: r.lead_etapa || null,
  montoEnJuego: Number(r.monto_en_juego) || 0,
  notasCargadas: Number(r.notas_cargadas) || 0,
});

export async function listarClientes() {
  if (modoDemo()) {
    await demora(110);
    return CLIENTES_DEMO.map((c) => ({ ...c }));
  }
  const { data, error } = await supabase.from('gm_v_mapa_clientes').select('*').order('nombre');
  if (error) throw new Error(error.message);
  return (data || []).map(aCliente);
}

/** Cuántos clientes activos quedaron fuera del mapa por no tener coordenadas. */
export async function contarSinCoordenadas() {
  if (modoDemo()) return 0;
  const { count, error } = await supabase
    .from('gm_clientes')
    .select('id', { count: 'exact', head: true })
    .eq('activo', true)
    .is('latitud', null);
  if (error) throw new Error(error.message);
  return count || 0;
}

// ---------------------------------------------------------------------------
// Compromisos sobre el mapa
// ---------------------------------------------------------------------------

const aCompromiso = (r) => ({
  codigo: r.codigo,
  fecha: r.fecha,
  hora: r.hora,
  duracion: Number(r.duracion) || 30,
  tipo: r.tipo,
  titulo: r.titulo,
  cliente: r.cliente || null,
  clienteCodigo: r.gm_clientes?.codigo || null,
  direccion: r.direccion || null,
  lat: num(r.latitud),
  lng: num(r.longitud),
  estado: r.estado,
  prioridad: r.prioridad,
  nota: r.nota || null,
});

export async function listarCompromisos(desde, hasta) {
  if (modoDemo()) {
    await demora(90);
    return COMPROMISOS_DEMO.filter((c) => c.fecha >= desde && c.fecha <= hasta).map((c) => ({ ...c }));
  }
  const { data, error } = await supabase
    .from('gm_agenda')
    .select('*, gm_clientes(codigo)')
    .eq('estado', 'pendiente')
    .gte('fecha', desde)
    .lte('fecha', hasta)
    .order('fecha')
    .order('hora');

  if (error) throw new Error(error.message);
  return (data || []).map(aCompromiso);
}
