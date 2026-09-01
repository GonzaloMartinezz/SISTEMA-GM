// ============================================================================
// SISTEMA GM · GUARDIA DE MÓDULO
// ----------------------------------------------------------------------------
// Envoltura obligatoria de toda ruta de módulo. Sin sesión válida para ESE
// módulo, devuelve al Hub. Además renueva la sesión con la actividad real del
// usuario y monta la cabecera persistente.
// ============================================================================

import React, { useCallback, useEffect, useRef } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';

import { getModuleById } from '../config/modules.config';
import { useModuleAuth } from '../context/ModuleAuthContext';
import ModuleTopBar from '../components/shared/ModuleTopBar';

const TOUCH_THROTTLE_MS = 60000;

export default function ModuleGuard({ moduleId, showTopBar = true, children }) {
  const module = getModuleById(moduleId);
  const location = useLocation();
  const navigate = useNavigate();
  const { hasAccess, getSession, revokeAccess, touchSession, setDeniedNotice } = useModuleAuth();

  const authorized = hasAccess(moduleId);
  const session = getSession(moduleId);
  const lastTouch = useRef(0);
  const exiting = useRef(false);

  // Aviso al Hub solo cuando el corte NO fue una salida voluntaria
  useEffect(() => {
    if (authorized || !module || exiting.current) return;
    setDeniedNotice(
      `Acceso a "${module.name}" no autorizado o sesión expirada. Volvé a ingresar tus credenciales.`
    );
  }, [authorized, module, setDeniedNotice]);

  // Renovación de sesión por actividad (throttled a 1 minuto)
  useEffect(() => {
    if (!authorized) return undefined;

    const onActivity = () => {
      const now = Date.now();
      if (now - lastTouch.current < TOUCH_THROTTLE_MS) return;
      lastTouch.current = now;
      touchSession(moduleId);
    };

    const events = ['mousedown', 'keydown', 'wheel', 'touchstart'];
    events.forEach((evt) => window.addEventListener(evt, onActivity, { passive: true }));
    return () => events.forEach((evt) => window.removeEventListener(evt, onActivity));
  }, [authorized, moduleId, touchSession]);

  const handleExit = useCallback(() => {
    exiting.current = true;
    setDeniedNotice(null);
    revokeAccess(moduleId);
    navigate('/', { replace: true });
  }, [moduleId, navigate, revokeAccess, setDeniedNotice]);

  if (!module) {
    console.error(`[ModuleGuard] Módulo desconocido: "${moduleId}"`);
    return <Navigate to="/" replace />;
  }

  if (!authorized) {
    return <Navigate to="/" replace state={{ from: location.pathname }} />;
  }

  return (
    <div className="flex h-full w-full flex-col bg-background">
      {showTopBar && <ModuleTopBar module={module} session={session} onExit={handleExit} />}
      <div className="gm-module-content relative flex min-h-0 flex-1 flex-col overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
