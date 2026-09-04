// ============================================================================
// SISTEMA GM · M-01 CLIENTES · SERVICIO DE MENSAJES
// ----------------------------------------------------------------------------
// Trazabilidad de la comunicación (gm_mensajes). Cada fila es un envío o una
// respuesta, atada al cliente por cliente_id. Sin Supabase configurado devuelve
// lista vacía: la vista muestra su estado vacío, nunca datos inventados.
// ============================================================================

import { supabase, isSupabaseConfigured } from '../../../services/supabaseClient';

const modoDemo = () => !isSupabaseConfigured;

/** Fila de Supabase -> forma que consume la vista. */
const aMensaje = (r) => ({
  id: r.id,
  clienteId: r.cliente_id,
  cliente: r.gm_clientes?.negocio || 'Cliente sin asignar',
  profesional: r.gm_clientes
    ? `${r.gm_clientes.profesional_apellido || ''}, ${r.gm_clientes.profesional_nombre || ''}`.replace(/^, |, $/, '')
    : '',
  rubro: r.gm_clientes?.rubro || null,
  fecha: r.fecha,
  canal: r.canal, // whatsapp | mail | llamada
  direccion: r.direccion, // enviado | recibido
  plantilla: r.plantilla,
  asunto: r.asunto,
  texto: r.texto,
  respondido: !!r.respondido,
  operador: r.operador,
});

const SELECT =
  '*, gm_clientes(negocio, profesional_nombre, profesional_apellido, rubro)';

export async function listarMensajes({ desde, canal, limite = 300 } = {}) {
  if (modoDemo()) return [];

  let q = supabase.from('gm_mensajes').select(SELECT).order('fecha', { ascending: false }).limit(limite);
  if (desde) q = q.gte('fecha', desde);
  if (canal) q = q.eq('canal', canal);

  const { data, error } = await q;
  if (error) {
    console.error('[mensajesService] listarMensajes:', error.message);
    return [];
  }
  return (data || []).map(aMensaje);
}

export async function registrarMensaje(mensaje) {
  const fila = {
    cliente_id: mensaje.clienteId || null,
    fecha: mensaje.fecha || new Date().toISOString(),
    canal: mensaje.canal,
    direccion: mensaje.direccion || 'enviado',
    plantilla: mensaje.plantilla || null,
    asunto: mensaje.asunto || null,
    texto: mensaje.texto,
    respondido: !!mensaje.respondido,
    operador: mensaje.operador || null,
  };

  const { data, error } = await supabase.from('gm_mensajes').insert(fila).select(SELECT).single();
  if (error) throw new Error(error.message);
  return aMensaje(data);
}

export async function marcarRespondido(id, respondido = true) {
  const { error } = await supabase.from('gm_mensajes').update({ respondido }).eq('id', id);
  if (error) throw new Error(error.message);
  return true;
}

export async function eliminarMensaje(id) {
  const { error } = await supabase.from('gm_mensajes').delete().eq('id', id);
  if (error) throw new Error(error.message);
  return true;
}
