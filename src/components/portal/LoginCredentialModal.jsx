// ============================================================================
// SISTEMA GM · INTERCEPTOR DE SEGURIDAD
// ----------------------------------------------------------------------------
// Modal que se superpone al Hub cuando se intenta abrir un módulo. Exige
// Número de Usuario + Contraseña. Sin validación no hay ruteo ni datos.
// ============================================================================

import React, { useEffect, useRef, useState } from 'react';
import { X, Lock, CheckCircle2, Loader2, AlertTriangle, Timer } from 'lucide-react';
import { validateModuleCredentials, logModuleAccess } from '../../services/moduleAuthService';
import { MAX_LOGIN_ATTEMPTS, LOCKOUT_SECONDS } from '../../config/moduleCredentials';

export default function LoginCredentialModal({ module, onClose, onSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [checking, setChecking] = useState(false);
  const [granted, setGranted] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [lockUntil, setLockUntil] = useState(0);
  const [now, setNow] = useState(Date.now());
  const userInputRef = useRef(null);

  // Espejos de estado y handlers para los listeners globales
  const grantedRef = useRef(granted);
  const checkingRef = useRef(checking);
  const cerrarRef = useRef(onClose);
  grantedRef.current = granted;
  checkingRef.current = checking;
  cerrarRef.current = onClose;

  const locked = lockUntil > now;
  const lockRemaining = Math.max(0, Math.ceil((lockUntil - now) / 1000));

  // Foco inicial: SOLO al montar el modal.
  // (Si esto dependiera de props que cambian —onClose se recrea en cada render
  //  del Hub por el reloj— el foco volvería al primer campo cada segundo y sería
  //  imposible tipear la contraseña.)
  useEffect(() => {
    userInputRef.current?.focus();
  }, []);

  // Cierre con ESC. Se lee la última versión de los handlers por ref para no
  // reinstalar el listener en cada render.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== 'Escape') return;
      if (grantedRef.current || checkingRef.current) return;
      cerrarRef.current?.();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Reloj del bloqueo
  useEffect(() => {
    if (!lockUntil) return undefined;
    const timer = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(timer);
  }, [lockUntil]);

  if (!module) return null;

  const Icon = module.icon;
  const accent = module.accent;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (checking || granted || locked) return;

    setChecking(true);
    setError('');

    const result = await validateModuleCredentials({
      moduleId: module.id,
      username,
      password,
    });

    if (result.ok) {
      setGranted(true);
      setChecking(false);
      logModuleAccess({ moduleId: module.id, username, result: 'AUTORIZADO' });
      setTimeout(() => onSuccess(result.user), 1100);
      return;
    }

    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);
    setChecking(false);
    setPassword('');
    setError(result.message || 'Credenciales incorrectas.');
    logModuleAccess({
      moduleId: module.id,
      username,
      result: 'RECHAZADO',
      detail: result.message,
    });

    if (nextAttempts >= MAX_LOGIN_ATTEMPTS) {
      setLockUntil(Date.now() + LOCKOUT_SECONDS * 1000);
      setNow(Date.now());
      setAttempts(0);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Credenciales para ${module.name}`}
        className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-y-auto rounded-2xl border border-white/10 bg-[#08090c] shadow-[0_30px_120px_-20px_rgba(0,0,0,0.9)] animate-in fade-in zoom-in-95 duration-200 md:min-h-[380px] md:flex-row md:overflow-hidden"
      >
        {/* Panel izquierdo · identidad del módulo */}
        <div className="relative hidden md:flex w-2/5 flex-col justify-between border-r border-white/5 bg-gradient-to-b from-white/[0.04] to-transparent p-8">
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-textMuted">
            <span className={`h-1.5 w-1.5 rounded-full ${accent.dot}`} />
            {module.code}
          </div>

          <div className="flex flex-col items-start">
            <Icon
              className={`mb-5 h-14 w-14 ${granted ? 'text-emerald-400' : accent.text} transition-colors duration-500`}
              strokeWidth={1.25}
            />
            <h4 className="text-2xl font-bold leading-tight tracking-tight text-white">
              {module.name}
            </h4>
            <p className="mt-2 text-sm leading-relaxed text-textMuted">{module.desc}</p>
          </div>

          <ul className="space-y-1.5">
            {module.items.slice(0, 5).map((item) => (
              <li key={item} className="flex items-center gap-2 text-[11px] text-textMuted/70">
                <span className="h-px w-3 bg-white/20" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Panel derecho · formulario */}
        <div className="relative flex w-full flex-col justify-center p-8 md:w-3/5 md:p-12">
          {!granted && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar"
              className="absolute right-4 top-4 rounded-lg p-2 text-textMuted transition-colors hover:bg-white/5 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          )}

          {granted ? (
            <div className="flex flex-col items-center justify-center py-8 animate-in fade-in zoom-in duration-300">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 ring-1 ring-emerald-400/40">
                <CheckCircle2 className="h-8 w-8 text-emerald-400" />
              </div>
              <h3 className="text-lg font-bold uppercase tracking-[0.25em] text-emerald-400">
                Acceso autorizado
              </h3>
              <div className="mt-4 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-emerald-500/70">
                <span className="h-1.5 w-1.5 animate-ping rounded-full bg-emerald-500" />
                Cargando entorno aislado…
              </div>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                  <Lock className="h-5 w-5 text-white/70" />
                </div>
                <h3 className="text-xl font-bold tracking-tight text-white">
                  Validación de credenciales
                </h3>
                <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.2em] text-textMuted">
                  Ingreso a {module.name}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1.5">
                  <label
                    htmlFor="gm-user"
                    className="pl-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-textMuted"
                  >
                    Número de usuario
                  </label>
                  <input
                    id="gm-user"
                    ref={userInputRef}
                    type="text"
                    inputMode="numeric"
                    autoComplete="off"
                    value={username}
                    disabled={locked || checking}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="000"
                    className="w-full rounded-lg border border-white/10 bg-black/60 px-4 py-3 font-mono text-sm tracking-[0.15em] text-white outline-none transition-colors placeholder:text-white/20 focus:border-white/30 focus:bg-black disabled:opacity-40"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="gm-pass"
                    className="pl-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-textMuted"
                  >
                    Contraseña
                  </label>
                  <input
                    id="gm-pass"
                    type="password"
                    autoComplete="off"
                    value={password}
                    disabled={locked || checking}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-lg border border-white/10 bg-black/60 px-4 py-3 font-mono text-sm tracking-[0.15em] text-white outline-none transition-colors placeholder:text-white/20 focus:border-white/30 focus:bg-black disabled:opacity-40"
                    required
                  />
                </div>

                {error && !locked && (
                  <div className="flex items-center gap-2 rounded-lg border border-rose-900/60 bg-rose-950/40 px-3 py-2.5 text-xs text-rose-300">
                    <AlertTriangle className="h-4 w-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {locked && (
                  <div className="flex items-center gap-2 rounded-lg border border-amber-900/60 bg-amber-950/40 px-3 py-2.5 text-xs text-amber-300">
                    <Timer className="h-4 w-4 shrink-0" />
                    <span>
                      Demasiados intentos. Reintentá en{' '}
                      <b className="font-mono">{lockRemaining}s</b>.
                    </span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={locked || checking}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/[0.06] py-3.5 text-xs font-bold uppercase tracking-[0.25em] text-white transition-all hover:border-white/30 hover:bg-white/[0.12] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {checking ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Verificando
                    </>
                  ) : (
                    'Ingresar'
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
