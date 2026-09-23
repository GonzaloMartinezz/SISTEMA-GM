// ============================================================================
// SISTEMA GM · CAPA COMPARTIDA · SERVICIO DE CUENTAS
// ----------------------------------------------------------------------------
// Fuente de verdad: Supabase (vista gm_v_cuentas + tablas gm_*).
// Si no hay credenciales configuradas, cae a los datos de demostración para
// que el sistema siga siendo navegable sin conexión.
// ============================================================================

import { supabase, isSupabaseConfigured } from '../../services/supabaseClient';
import { CUENTAS_DEMO } from './cuentasDemo';

const delay = (ms) => new Promise((r) => setTimeout(r, ms));
const modoDemo = () => !isSupabaseConfigured;

/** Resuelve el uuid interno de una cuenta a partir de su código visible. */
async function uuidDeCuenta(codigo) {
  const { data, error } = await supabase.rpc('gm_cuenta_uuid', { p_codigo: codigo });
  if (error) throw new Error(error.message);
  return data;
}

// ---------------------------------------------------------------------------
// LECTURA
// ---------------------------------------------------------------------------

/** Listado liviano para selectores, padrón y cola de cobranzas. */
export async function listarCuentas() {
  if (modoDemo()) {
    await delay(100);
    return CUENTAS_DEMO.map((c) => ({
      id: c.id,
      titular: c.titular,
      cuenta: c.cuenta,
      comercial: c.comercial,
    }));
  }

  const { data, error } = await supabase
    .from('gm_v_cuentas')
    .select('id, titular, cuenta, comercial')
    .order('id');

  if (error) throw new Error(error.message);
  return data || [];
}

/** Ficha completa. Sin código devuelve la primera cuenta. */
export async function obtenerCuenta(codigo) {
  if (modoDemo()) {
    await delay(140);
    return codigo ? CUENTAS_DEMO.find((c) => c.id === codigo) || null : CUENTAS_DEMO[0];
  }

  let q = supabase.from('gm_v_cuentas').select('*');
  q = codigo ? q.eq('id', codigo) : q.order('id').limit(1);

  const { data, error } = await q.maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}

// ---------------------------------------------------------------------------
// ESCRITURA · gestión diaria
// ---------------------------------------------------------------------------

export async function guardarNota(codigoCuenta, nota) {
  const fecha = new Date().toLocaleDateString('es-AR');
  if (modoDemo()) return { ...nota, fecha };

  const cuentaId = await uuidDeCuenta(codigoCuenta);
  const { error } = await supabase.from('gm_notas').insert({
    cuenta_id: cuentaId,
    texto: nota.texto,
    tipo: nota.tipo,
    operador: nota.operador,
  });
  if (error) throw new Error(error.message);
  return { ...nota, fecha };
}

export async function guardarLlamado(codigoCuenta, llamado) {
  const fecha = new Date().toLocaleString('es-AR', {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
  if (modoDemo()) return { ...llamado, fecha };

  const cuentaId = await uuidDeCuenta(codigoCuenta);
  const { error } = await supabase.from('gm_llamados').insert({
    cuenta_id: cuentaId,
    quien_atiende: llamado.quienAtiende,
    contacto: llamado.contacto,
    respuesta: llamado.respuesta,
    proximo_evento: llamado.proximoEvento,
    operador: llamado.operador,
  });
  if (error) throw new Error(error.message);
  return { ...llamado, fecha };
}

// ---------------------------------------------------------------------------
// ABM de clientes (padrón)
// ---------------------------------------------------------------------------

const aFilaCliente = (c) => ({
  codigo: c.codigo,
  negocio: c.negocio,
  profesional_nombre: c.profesionalNombre,
  profesional_apellido: c.profesionalApellido,
  rubro: c.rubro,
  clasificacion: c.clasificacion,
  dni: c.dni || null,
  cuit: c.cuit || null,
  telefono: c.telefono || null,
  celular: c.celular || null,
  email: c.email || null,
  ubicacion: c.ubicacion || null,
  localidad: c.localidad || null,
  provincia: c.provincia || 'Tucumán',
  latitud: c.latitud ?? null,
  longitud: c.longitud ?? null,
  estado: c.estado || 'lead',
  notas: c.notas || '',
});

export async function listarClientes({ rubro, busqueda } = {}) {
  if (modoDemo()) return [];

  let q = supabase.from('gm_clientes').select('*').eq('activo', true).order('negocio');
  if (rubro) q = q.eq('rubro', rubro);
  if (busqueda) q = q.or(`negocio.ilike.%${busqueda}%,profesional_apellido.ilike.%${busqueda}%`);

  const { data, error } = await q;
  if (error) throw new Error(error.message);
  return data || [];
}

export async function crearCliente(cliente) {
  const { data, error } = await supabase
    .from('gm_clientes')
    .insert(aFilaCliente(cliente))
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function actualizarCliente(id, cambios) {
  const { data, error } = await supabase
    .from('gm_clientes')
    .update(aFilaCliente({ ...cambios }))
    .eq('id', id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

/** Baja lógica por defecto; con `definitivo` borra la fila y todo lo colgado. */
export async function eliminarCliente(id, { definitivo = false } = {}) {
  const { error } = definitivo
    ? await supabase.from('gm_clientes').delete().eq('id', id)
    : await supabase.from('gm_clientes').update({ activo: false }).eq('id', id);
  if (error) throw new Error(error.message);
  return true;
}

// ---------------------------------------------------------------------------
// IMPORTACIÓN MASIVA
// ---------------------------------------------------------------------------

export async function importarClientesMasivo(clientes) {
  if (!clientes || clientes.length === 0) return 0;
  
  // Transformamos el array mapeando al formato de Supabase
  const filas = clientes.map(aFilaCliente);
  
  const { data, error } = await supabase
    .from('gm_clientes')
    .insert(filas)
    .select();
    
  if (error) throw new Error(error.message);
  return data ? data.length : 0;
}

// ---------------------------------------------------------------------------
// ABM genérico para las tablas hijas de una cuenta
// ---------------------------------------------------------------------------

const TABLAS_CUENTA = {
  domicilios: 'gm_domicilios',
  periodos: 'gm_periodos',
  pagos: 'gm_pagos',
  movimientos: 'gm_movimientos',
  llamados: 'gm_llamados',
  notas: 'gm_notas',
  visitas: 'gm_visitas',
};

export async function crearRegistro(entidad, fila) {
  const tabla = TABLAS_CUENTA[entidad];
  if (!tabla) throw new Error(`Entidad desconocida: ${entidad}`);
  const { data, error } = await supabase.from(tabla).insert(fila).select().single();
  if (error) throw new Error(error.message);
  return data;
}

export async function actualizarRegistro(entidad, id, cambios) {
  const tabla = TABLAS_CUENTA[entidad];
  if (!tabla) throw new Error(`Entidad desconocida: ${entidad}`);
  const { data, error } = await supabase.from(tabla).update(cambios).eq('id', id).select().single();
  if (error) throw new Error(error.message);
  return data;
}

export async function eliminarRegistro(entidad, id) {
  const tabla = TABLAS_CUENTA[entidad];
  if (!tabla) throw new Error(`Entidad desconocida: ${entidad}`);
  const { error } = await supabase.from(tabla).delete().eq('id', id);
  if (error) throw new Error(error.message);
  return true;
}
