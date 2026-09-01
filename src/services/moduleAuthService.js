// ============================================================================
// SISTEMA GM · SERVICIO DE VALIDACIÓN DE ACCESO MODULAR
// ----------------------------------------------------------------------------
// Único punto del sistema que decide si una credencial abre o no un módulo.
// El resto de la app (modal, contexto, guard) jamás compara contraseñas.
// ============================================================================

import { supabase } from './supabaseClient';
import {
  AUTH_MODE,
  findOperator,
  operatorCanAccess,
} from '../config/moduleCredentials';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Valida las credenciales de ingreso a un módulo.
 * @returns {Promise<{ok: boolean, user?: object, message?: string}>}
 */
export async function validateModuleCredentials({ moduleId, username, password }) {
  const user = String(username || '').trim();
  const pass = String(password || '');

  if (!user || !pass) {
    return { ok: false, message: 'Completá usuario y contraseña.' };
  }

  if (AUTH_MODE === 'supabase') {
    return validateWithSupabase({ moduleId, username: user, password: pass });
  }

  // Pequeña latencia artificial: evita el "parpadeo" y desalienta fuerza bruta.
  await delay(350);

  const operator = findOperator(user);
  if (!operator || operator.password !== pass) {
    return { ok: false, message: 'Credenciales incorrectas.' };
  }
  if (!operatorCanAccess(operator, moduleId)) {
    return { ok: false, message: 'El usuario no tiene permiso sobre este módulo.' };
  }

  return {
    ok: true,
    user: {
      username: operator.username,
      displayName: operator.displayName,
      role: operator.role,
    },
  };
}

/** Validación server-side vía función RPC de Supabase (no expone el padrón). */
async function validateWithSupabase({ moduleId, username, password }) {
  try {
    const { data, error } = await supabase.rpc('gm_validar_acceso_modulo', {
      p_modulo: moduleId,
      p_usuario: username,
      p_password: password,
    });

    if (error) {
      console.error('[moduleAuthService] Error de RPC:', error.message);
      return { ok: false, message: 'No se pudo validar contra el servidor.' };
    }

    const row = Array.isArray(data) ? data[0] : data;
    if (!row || row.autorizado !== true) {
      return { ok: false, message: row?.motivo || 'Credenciales incorrectas.' };
    }

    return {
      ok: true,
      user: {
        username,
        displayName: row.nombre || username,
        role: row.rol || 'Operador',
      },
    };
  } catch (err) {
    console.error('[moduleAuthService] Excepción:', err);
    return { ok: false, message: 'Servidor de autenticación no disponible.' };
  }
}

/**
 * Deja registro del intento de acceso (auditoría inmutable).
 * Nunca rompe el flujo: si falla, solo avisa por consola.
 */
export async function logModuleAccess({ moduleId, username, result, detail = null }) {
  if (AUTH_MODE !== 'supabase') return;
  try {
    await supabase.from('gm_access_log').insert({
      modulo: moduleId,
      usuario: String(username || '').trim(),
      resultado: result,
      detalle: detail,
      user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
    });
  } catch (err) {
    console.warn('[moduleAuthService] No se pudo registrar la auditoría:', err?.message);
  }
}
