// ============================================================================
// SISTEMA GM · CREDENCIALES Y POLÍTICA DE ACCESO
// ----------------------------------------------------------------------------
// Modo LOCAL  -> valida contra esta tabla (desarrollo / operación offline).
// Modo SUPABASE -> valida server-side contra la RPC gm_validar_acceso_modulo.
// Se controla con la variable de entorno VITE_AUTH_MODE ("local" | "supabase").
//
// ⚠ IMPORTANTE: en modo LOCAL las credenciales viajan dentro del bundle del
// navegador. Sirve para operar ya mismo, pero para producción real usá el modo
// "supabase" (ver BACKEND/supabase/schema_module_access.sql).
// ============================================================================

/** Minutos de vida de la sesión de un módulo antes de exigir credenciales otra vez. */
export const SESSION_TTL_MINUTES = 45;

/** Intentos fallidos permitidos antes de bloquear temporalmente el modal. */
export const MAX_LOGIN_ATTEMPTS = 5;

/** Segundos de bloqueo tras agotar los intentos. */
export const LOCKOUT_SECONDS = 60;

/** Modo de validación activo. */
export const AUTH_MODE = import.meta.env.VITE_AUTH_MODE === 'supabase' ? 'supabase' : 'local';

/**
 * Padrón de operadores.
 * - modules: '*' habilita todos los módulos.
 * - modules: ['tesoreria', 'cobranzas'] habilita solo esos ids (ver modules.config.js).
 */
export const OPERATORS = [
  {
    username: '483',
    password: '120304',
    displayName: 'G. Martínez',
    role: 'Titular',
    modules: '*',
  },
];

/** Busca un operador por número de usuario. */
export const findOperator = (username) =>
  OPERATORS.find((op) => op.username === String(username || '').trim()) || null;

/** Determina si un operador tiene habilitado un módulo. */
export const operatorCanAccess = (operator, moduleId) => {
  if (!operator) return false;
  if (operator.modules === '*') return true;
  return Array.isArray(operator.modules) && operator.modules.includes(moduleId);
};

/**
 * true  -> el Hub pide credenciales en CADA ingreso (regla estricta del Plan Maestro).
 * false -> si la sesión del módulo sigue viva, entra directo sin volver a pedirlas.
 */
export const ALWAYS_ASK_CREDENTIALS = true;
