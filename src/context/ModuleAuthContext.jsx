// ============================================================================
// SISTEMA GM · CONTEXTO DE SESIONES MODULARES
// ----------------------------------------------------------------------------
// Cada módulo tiene su PROPIA sesión, con su propia expiración. Entrar a
// Tesorería no habilita Cobranzas. Las sesiones viven en sessionStorage: si se
// cierra la pestaña, todo vuelve a pedir credenciales.
// ============================================================================

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { SESSION_TTL_MINUTES } from '../config/moduleCredentials';

const STORAGE_KEY = 'gm_module_sessions';
const TTL_MS = SESSION_TTL_MINUTES * 60 * 1000;

const ModuleAuthContext = createContext(null);

const readStorage = () => {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
};

const writeStorage = (sessions) => {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  } catch {
    /* modo privado o storage lleno: la sesión vive solo en memoria */
  }
};

const pruneExpired = (sessions) => {
  const now = Date.now();
  const clean = {};
  let changed = false;
  Object.entries(sessions).forEach(([id, session]) => {
    if (session && session.expiresAt > now) clean[id] = session;
    else changed = true;
  });
  return { clean, changed };
};

export function ModuleAuthProvider({ children }) {
  const [sessions, setSessions] = useState(() => pruneExpired(readStorage()).clean);
  const [deniedNotice, setDeniedNotice] = useState(null);
  const sessionsRef = useRef(sessions);

  sessionsRef.current = sessions;

  // Persistencia
  useEffect(() => {
    writeStorage(sessions);
  }, [sessions]);

  // Barrido de sesiones vencidas cada 20 segundos
  useEffect(() => {
    const timer = setInterval(() => {
      const { clean, changed } = pruneExpired(sessionsRef.current);
      if (changed) setSessions(clean);
    }, 20000);
    return () => clearInterval(timer);
  }, []);

  const hasAccess = useCallback(
    (moduleId) => {
      const session = sessions[moduleId];
      return Boolean(session && session.expiresAt > Date.now());
    },
    [sessions]
  );

  const getSession = useCallback((moduleId) => sessions[moduleId] || null, [sessions]);

  const grantAccess = useCallback((moduleId, user) => {
    const now = Date.now();
    setSessions((prev) => ({
      ...prev,
      [moduleId]: {
        moduleId,
        user,
        grantedAt: now,
        expiresAt: now + TTL_MS,
      },
    }));
    setDeniedNotice(null);
  }, []);

  /** Renueva la ventana de la sesión (se llama con la actividad del usuario). */
  const touchSession = useCallback((moduleId) => {
    setSessions((prev) => {
      const session = prev[moduleId];
      if (!session || session.expiresAt <= Date.now()) return prev;
      return { ...prev, [moduleId]: { ...session, expiresAt: Date.now() + TTL_MS } };
    });
  }, []);

  const revokeAccess = useCallback((moduleId) => {
    setSessions((prev) => {
      if (!prev[moduleId]) return prev;
      const next = { ...prev };
      delete next[moduleId];
      return next;
    });
  }, []);

  const revokeAll = useCallback(() => setSessions({}), []);

  const value = useMemo(
    () => ({
      sessions,
      hasAccess,
      getSession,
      grantAccess,
      revokeAccess,
      revokeAll,
      touchSession,
      deniedNotice,
      setDeniedNotice,
      ttlMinutes: SESSION_TTL_MINUTES,
    }),
    [
      sessions,
      hasAccess,
      getSession,
      grantAccess,
      revokeAccess,
      revokeAll,
      touchSession,
      deniedNotice,
    ]
  );

  return <ModuleAuthContext.Provider value={value}>{children}</ModuleAuthContext.Provider>;
}

export function useModuleAuth() {
  const ctx = useContext(ModuleAuthContext);
  if (!ctx) {
    throw new Error('useModuleAuth debe usarse dentro de <ModuleAuthProvider>.');
  }
  return ctx;
}

export default ModuleAuthContext;
