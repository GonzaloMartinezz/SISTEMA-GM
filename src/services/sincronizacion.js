// ============================================================================
// SISTEMA GM · ACTUALIZACIÓN GENERAL DEL SISTEMA
// ----------------------------------------------------------------------------
// Lo que pasa cuando se toca "Actualizar" en el Portal. Son tres cosas, en
// este orden, y cada una puede fallar sin arrastrar a las otras:
//
//   1. EMPUJAR el Drive a Supabase. Las planillas ya se mandan solas cada
//      minuto; esto fuerza el envío AHORA para no esperar. Va por una función
//      de Supabase, no directo desde el navegador: así el secreto que autoriza
//      a escribir en la base nunca viaja al browser.
//
//   2. MEDIR qué quedó adentro. Se toma una foto del sistema antes y otra
//      después, y se informa la diferencia real: "entraron 3 clientes" sale de
//      comparar, no de suponer.
//
//   3. AVISAR a los módulos que hay datos nuevos, para que lo que esté abierto
//      se recargue solo.
//
// Regla de oro de este archivo: si algo no se pudo hacer, se dice. Un botón de
// actualizar que siempre termina en un tilde verde no sirve para nada, porque
// deja de ser información y pasa a ser decoración.
// ============================================================================

import { supabase, isSupabaseConfigured } from './supabaseClient';

/** Los módulos escuchan esto para recargarse sin que haya que tocar nada. */
export const EVENTO_ACTUALIZADO = 'gm:datos-actualizados';

const CLAVE_ULTIMA = 'gm.ultimaActualizacion';

/** Cuánto se espera a que la planilla más lenta termine de subir. */
const ESPERA_MAX_MS = 45000;

const ahora = () => new Date();

// ---------------------------------------------------------------------------
// Memoria de la última actualización
// ---------------------------------------------------------------------------
// Se guarda en el navegador nada más que para poder mostrar "actualizado hace
// 4 minutos" al volver al Portal. Si el navegador la bloquea, no pasa nada:
// se muestra sin la marca de tiempo.

export function leerUltimaActualizacion() {
  try {
    const crudo = window.localStorage.getItem(CLAVE_ULTIMA);
    return crudo ? new Date(JSON.parse(crudo).cuando) : null;
  } catch {
    return null;
  }
}

function guardarUltimaActualizacion(resultado) {
  try {
    window.localStorage.setItem(
      CLAVE_ULTIMA,
      JSON.stringify({ cuando: ahora().toISOString(), ok: resultado.ok })
    );
  } catch {
    /* modo privado o almacenamiento bloqueado: no es motivo para fallar */
  }
}

// ---------------------------------------------------------------------------
// 1 · Empujar el Drive
// ---------------------------------------------------------------------------

/**
 * Pide a Supabase que dispare la sincronización de todas las planillas.
 *
 * Devuelve siempre un objeto, nunca tira: que no se pueda forzar el envío no
 * es un error del sistema. Las planillas siguen entrando solas cada minuto y
 * la actualización tiene que continuar igual con lo que sí puede hacer.
 */
async function empujarPlanillas() {
  if (!isSupabaseConfigured || typeof supabase.functions?.invoke !== 'function') {
    return { disponible: false, motivo: 'sin-supabase' };
  }

  const corte = new Promise((resolver) =>
    setTimeout(() => resolver({ agotado: true }), ESPERA_MAX_MS)
  );

  try {
    const carrera = await Promise.race([
      supabase.functions.invoke('gm-actualizar-planillas', { body: { forzar: true } }),
      corte,
    ]);

    if (carrera?.agotado) {
      return {
        disponible: true,
        ok: false,
        motivo: 'demoro',
        mensaje:
          'El envío desde Drive tardó más de lo esperado. Puede seguir entrando en segundo plano.',
      };
    }

    const { data, error } = carrera;

    if (error) {
      // 404 = la función todavía no está publicada. Es el caso normal hasta
      // que se deje el puente de Drive configurado, y no es una falla.
      const noPublicada =
        error.message?.includes('404') ||
        error.message?.toLowerCase().includes('not found') ||
        error.context?.status === 404;
      return {
        disponible: false,
        motivo: noPublicada ? 'no-configurado' : 'error',
        mensaje: noPublicada ? null : error.message,
      };
    }

    if (data?.configurado === false) {
      return { disponible: false, motivo: 'no-configurado' };
    }

    return {
      disponible: true,
      ok: true,
      hojas: Number(data?.hojas) || 0,
      filas: Number(data?.filas) || 0,
      errores: Number(data?.errores) || 0,
      detalle: Array.isArray(data?.detalle) ? data.detalle : [],
      segundos: Number(data?.segundos) || null,
    };
  } catch (e) {
    return { disponible: false, motivo: 'error', mensaje: e.message };
  }
}

// ---------------------------------------------------------------------------
// 2 · Medir qué hay adentro
// ---------------------------------------------------------------------------

export async function leerResumen() {
  if (!isSupabaseConfigured) return null;
  const { data, error } = await supabase.rpc('gm_resumen_del_sistema');
  if (error) {
    console.error('[actualizar] gm_resumen_del_sistema', error.message);
    return null;
  }
  return data || null;
}

export async function leerEstadoPlanillas() {
  if (!isSupabaseConfigured) return [];
  const { data, error } = await supabase.rpc('gm_estado_sincronizacion');
  if (error) {
    console.error('[actualizar] gm_estado_sincronizacion', error.message);
    return [];
  }
  return (data || []).map((r) => ({
    modulo: r.modulo,
    item: r.item,
    hoja: r.hoja,
    tabla: r.tabla,
    ultimaSync: r.ultima_sync,
    minutosDesde: r.minutos_desde,
    filas: r.filas,
    ok: r.ok,
    errores: r.errores,
    detalleError: r.detalle_error,
    filasEnTabla: Number(r.filas_en_tabla ?? 0),
    estado: r.estado,
  }));
}

/** Qué cambió entre la foto de antes y la de después. */
function diferencias(antes, despues) {
  if (!antes || !despues) return [];

  const NOMBRES = {
    clientes: ['cliente', 'clientes'],
    equipos: ['equipo', 'equipos'],
    leads: ['seguimiento', 'seguimientos'],
    agenda: ['evento en agenda', 'eventos en agenda'],
    notas: ['nota', 'notas'],
    ventas: ['venta', 'ventas'],
    cuotas: ['cuota', 'cuotas'],
    cobros: ['cobro', 'cobros'],
    egresos: ['gasto', 'gastos'],
    entregas: ['entrega', 'entregas'],
    tickets: ['ticket abierto', 'tickets abiertos'],
  };

  return Object.entries(NOMBRES)
    .map(([clave, [uno, varios]]) => {
      const d = (Number(despues[clave]) || 0) - (Number(antes[clave]) || 0);
      return d === 0 ? null : { clave, delta: d, texto: `${Math.abs(d)} ${Math.abs(d) === 1 ? uno : varios}` };
    })
    .filter(Boolean);
}

// ---------------------------------------------------------------------------
// 3 · La actualización completa
// ---------------------------------------------------------------------------

/**
 * @param {(paso: string) => void} onPaso  para ir contando qué está haciendo
 */
export async function actualizarTodo(onPaso = () => {}) {
  const arranque = Date.now();

  // Todas las salidas de esta función devuelven EXACTAMENTE la misma forma.
  // Una salida temprana a la que le falte un campo hace que quien la recibe
  // reviente al leer .length, y se lleva puesta la pantalla entera. Ya pasó.
  if (!isSupabaseConfigured) {
    return {
      ok: false,
      motivo: 'sin-supabase',
      empuje: { disponible: false, motivo: 'sin-supabase' },
      planillas: [],
      conErrores: [],
      sinDatos: [],
      cambios: [],
      resumen: null,
      antes: null,
      mensaje:
        'Faltan las variables de Supabase en el entorno. Sin eso no hay de dónde traer los datos.',
      segundos: 0,
      cuando: ahora(),
    };
  }

  onPaso('Mirando qué hay cargado…');
  const antes = await leerResumen();

  onPaso('Pidiendo a Drive que mande lo último…');
  const empuje = await empujarPlanillas();

  onPaso('Revisando planilla por planilla…');
  const [despues, planillas] = await Promise.all([leerResumen(), leerEstadoPlanillas()]);

  const cambios = diferencias(antes, despues);
  const conErrores = planillas.filter((p) => (p.errores || 0) > 0);
  const sinDatos = planillas.filter((p) => p.estado === 'sin datos');

  const resultado = {
    ok: conErrores.length === 0,
    empuje,
    planillas,
    conErrores,
    sinDatos,
    cambios,
    resumen: despues,
    antes,
    segundos: Math.max(Math.round((Date.now() - arranque) / 1000), 1),
    cuando: ahora(),
  };

  guardarUltimaActualizacion(resultado);

  onPaso('Avisando a los módulos…');
  try {
    window.dispatchEvent(new CustomEvent(EVENTO_ACTUALIZADO, { detail: resultado }));
  } catch {
    /* entornos sin window: nada que avisar */
  }

  return resultado;
}

/**
 * Para que un módulo se recargue solo cuando se toca Actualizar en el Portal.
 * Se usa así, dentro de un useEffect:
 *   useEffect(() => alEscucharActualizacion(cargar), [cargar]);
 */
export function alEscucharActualizacion(recargar) {
  const mano = () => recargar();
  window.addEventListener(EVENTO_ACTUALIZADO, mano);
  return () => window.removeEventListener(EVENTO_ACTUALIZADO, mano);
}

/** "hace 4 minutos", para la marca del Portal. */
export function haceCuanto(fecha) {
  if (!fecha) return null;
  const min = Math.floor((Date.now() - new Date(fecha).getTime()) / 60000);
  if (min < 1) return 'recién';
  if (min === 1) return 'hace 1 minuto';
  if (min < 60) return `hace ${min} minutos`;
  const h = Math.floor(min / 60);
  if (h === 1) return 'hace 1 hora';
  if (h < 24) return `hace ${h} horas`;
  const d = Math.floor(h / 24);
  return d === 1 ? 'ayer' : `hace ${d} días`;
}
