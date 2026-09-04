// ============================================================================
// SISTEMA GM · PORTAL HUB
// ----------------------------------------------------------------------------
// Escritorio central del ecosistema cerrado, con la estructura de una terminal
// operativa: marca arriba, botonera de entornos abajo, barra de estado al pie.
// Ocupa exactamente el viewport: sin scroll ni en desktop ni en mobile.
// ============================================================================

import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LockKeyhole, AlertTriangle, Power } from 'lucide-react';

import { MODULES } from '../config/modules.config';
import { ALWAYS_ASK_CREDENTIALS } from '../config/moduleCredentials';
import { useModuleAuth } from '../context/ModuleAuthContext';
import ModuleLauncherCard from '../components/portal/ModuleLauncherCard';
import ActualizarTile from '../components/portal/ActualizarTile';
import PanelActualizacion from '../components/portal/PanelActualizacion';
import LoginCredentialModal from '../components/portal/LoginCredentialModal';
import { actualizarTodo, leerUltimaActualizacion } from '../services/sincronizacion';

const formatClock = (date) =>
  date.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

const formatDateLarga = (date) => {
  const texto = date.toLocaleDateString('es-AR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
  return texto.charAt(0).toUpperCase() + texto.slice(1);
};

const formatRemaining = (expiresAt) =>
  `${Math.max(0, Math.round((expiresAt - Date.now()) / 60000))}m`;

export default function PortalHubPage() {
  const navigate = useNavigate();
  const { sessions, hasAccess, grantAccess, revokeAll, deniedNotice, setDeniedNotice } =
    useModuleAuth();

  const [pendingModule, setPendingModule] = useState(null);
  const [clock, setClock] = useState(() => new Date());

  // ------------------------- actualización general -------------------------
  // El botón que reemplazó a "Salir". Trae de Drive y de Supabase todo lo que
  // se haya cargado por fuera del sistema, y deja a los módulos con los datos
  // frescos antes de entrar a cualquiera.
  const [sync, setSync] = useState('listo');   // listo | trabajando | ok | atencion
  const [syncPaso, setSyncPaso] = useState('');
  const [syncResultado, setSyncResultado] = useState(null);
  const [panelSync, setPanelSync] = useState(false);
  const [ultimaSync, setUltimaSync] = useState(() => leerUltimaActualizacion());

  const handleActualizar = async () => {
    // Si ya se actualizó y sólo se quiere volver a ver el detalle, se abre el
    // panel en vez de repetir todo el trabajo.
    if (sync !== 'listo' && sync !== 'trabajando' && syncResultado) {
      setPanelSync(true);
      return;
    }

    setSync('trabajando');
    setSyncPaso('Arrancando…');
    try {
      const r = await actualizarTodo(setSyncPaso);
      setSyncResultado(r);
      setUltimaSync(r.cuando || new Date());
      setSync(r.ok && (r.conErrores?.length ?? 0) === 0 ? 'ok' : 'atencion');
      setPanelSync(true);
    } catch (err) {
      setSyncResultado({
        ok: false,
        empuje: { disponible: false, motivo: 'error', mensaje: err.message },
        planillas: [],
        conErrores: [],
        sinDatos: [],
        cambios: [],
        resumen: null,
        segundos: 1,
      });
      setSync('atencion');
      setPanelSync(true);
    } finally {
      setSyncPaso('');
    }
  };

  useEffect(() => {
    const timer = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const activeCount = useMemo(
    () => Object.values(sessions).filter((s) => s.expiresAt > Date.now()).length,
    [sessions]
  );

  const handleLaunch = (module) => {
    if (!ALWAYS_ASK_CREDENTIALS && hasAccess(module.id)) {
      navigate(module.path);
      return;
    }
    setDeniedNotice(null);
    setPendingModule(module);
  };

  const handleGranted = (user) => {
    const module = pendingModule;
    if (!module) return;
    grantAccess(module.id, user);
    setPendingModule(null);
    navigate(module.path);
  };

  return (
    <div className="gm-hub relative flex h-full w-full flex-col overflow-hidden bg-[linear-gradient(180deg,#000000_0%,#03050c_28%,#071024_68%,#0a1633_100%)] text-text">
      {/* Halo detrás de la marca */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-[34vh] w-[70vw] max-w-2xl -translate-x-1/2 rounded-full bg-blue-600/[0.13] blur-[110px]" />
      {/* Retícula técnica */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.25]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      />

      {/* ============================ MARCA ============================ */}
      <header className="relative z-10 flex shrink-0 items-center justify-center py-[clamp(0.9rem,3.5vh,2.5rem)]">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-blue-500/25 blur-2xl" />
          <div className="relative h-[clamp(4rem,14vh,8.5rem)] w-[clamp(4rem,14vh,8.5rem)] overflow-hidden rounded-full border border-blue-400/25 bg-black/60 shadow-[0_0_60px_-10px_rgba(59,130,246,0.5)]">
            <img
              src="/LOGOia.png"
              alt="Sistema GM"
              className="h-full w-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        </div>
      </header>

      {/* ====================== AVISO DEL GUARD ====================== */}
      {deniedNotice && (
        <div className="relative z-10 mx-auto mb-2 flex w-full max-w-[1080px] shrink-0 items-center gap-2 rounded-lg border border-amber-900/50 bg-amber-950/40 px-3 py-2 text-[clamp(0.62rem,1.4vh,0.78rem)] text-amber-300">
          <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
          <span className="min-w-0 flex-1 truncate">{deniedNotice}</span>
          <button
            type="button"
            onClick={() => setDeniedNotice(null)}
            className="shrink-0 font-mono text-[9px] uppercase tracking-widest text-amber-500/70 hover:text-amber-300"
          >
            Cerrar
          </button>
        </div>
      )}

      {/* ====================== BOTONERA DE ENTORNOS ====================== */}
      <main className="relative z-10 flex min-h-0 flex-1 flex-col px-[clamp(0.5rem,2.5vw,2rem)] pb-[clamp(0.4rem,1.2vh,0.9rem)]">
        <div className="mx-auto my-auto flex max-h-[680px] min-h-0 w-full max-w-[1080px] flex-1 flex-col rounded-2xl border border-white/[0.09] bg-black/45 p-[clamp(0.5rem,1.5vh,1.15rem)] shadow-[0_30px_90px_-30px_rgba(0,0,0,0.9)] backdrop-blur-xl">
          {/* Encabezado del panel */}
          <div className="mb-[clamp(0.4rem,1.1vh,0.85rem)] flex shrink-0 items-center justify-between gap-2 border-b border-white/[0.06] pb-[clamp(0.3rem,0.9vh,0.7rem)]">
            <span className="flex items-center gap-2 font-mono text-[clamp(0.5rem,1.1vh,0.63rem)] uppercase tracking-[0.26em] text-white/30">
              <LockKeyhole className="h-3 w-3" />
              Entornos operativos
            </span>
            <span className="font-mono text-[clamp(0.5rem,1.1vh,0.63rem)] uppercase tracking-[0.2em] text-white/25">
              {activeCount ? (
                <span className="text-emerald-400/80">{activeCount} activa{activeCount === 1 ? '' : 's'}</span>
              ) : (
                'Requiere credenciales'
              )}
            </span>
          </div>

          {/* Grilla 2 · 3 · 3 (8 módulos + salida) */}
          <div className="grid min-h-0 flex-1 auto-rows-fr grid-cols-2 gap-[clamp(0.3rem,1vh,0.75rem)] sm:grid-cols-3">
            {MODULES.map((module) => {
              const session = sessions[module.id];
              const active = Boolean(session && session.expiresAt > Date.now());
              return (
                <ModuleLauncherCard
                  key={module.id}
                  module={module}
                  active={active}
                  remaining={active ? formatRemaining(session.expiresAt) : ''}
                  onLaunch={handleLaunch}
                />
              );
            })}

            <ActualizarTile
              estado={sync}
              paso={syncPaso}
              ultima={ultimaSync}
              resumen={syncResultado?.resumen}
              motivo={syncResultado?.motivo}
              onActualizar={handleActualizar}
            />
          </div>
        </div>
      </main>

      {/* ======================== BARRA DE ESTADO ======================== */}
      <footer className="relative z-10 flex shrink-0 items-center justify-between gap-3 border-t border-white/[0.06] bg-black/40 px-[clamp(0.75rem,2.5vw,2rem)] py-[clamp(0.3rem,0.9vh,0.6rem)]">
        <span className="truncate font-mono text-[clamp(0.52rem,1.15vh,0.68rem)] text-white/40">
          {formatDateLarga(clock)}
        </span>
        <span className="hidden font-mono text-[clamp(0.52rem,1.15vh,0.68rem)] uppercase tracking-[0.2em] text-white/25 md:inline">
          Sistema GM · Tucumán
        </span>
        <span className="flex items-center gap-3">
          {/* Cerrar sesiones sigue disponible, pero abajo: es algo que se hace
              al terminar el día, no cada vez que se entra. */}
          <button
            type="button"
            onClick={revokeAll}
            disabled={!activeCount}
            title={
              activeCount
                ? `Cerrar ${activeCount} sesión${activeCount === 1 ? '' : 'es'} de módulo abierta${activeCount === 1 ? '' : 's'}`
                : 'No hay sesiones abiertas'
            }
            className="flex items-center gap-1.5 rounded-md border border-white/[0.08] px-2 py-1 font-mono text-[clamp(0.5rem,1.1vh,0.62rem)] uppercase tracking-[0.16em] text-white/35 transition hover:border-rose-500/40 hover:text-rose-400 disabled:cursor-default disabled:opacity-30 disabled:hover:border-white/[0.08] disabled:hover:text-white/35"
          >
            <Power className="h-3 w-3" />
            Salir
          </button>
          <span className="font-mono text-[clamp(0.62rem,1.5vh,0.85rem)] tabular-nums text-white/70">
            {formatClock(clock)}
          </span>
        </span>
      </footer>

      {/* ==================== RESULTADO DE ACTUALIZAR ==================== */}
      <PanelActualizacion
        abierto={panelSync}
        resultado={syncResultado}
        onCerrar={() => setPanelSync(false)}
      />

      {/* ========================= INTERCEPTOR ========================= */}
      {pendingModule && (
        <LoginCredentialModal
          module={pendingModule}
          onClose={() => setPendingModule(null)}
          onSuccess={handleGranted}
        />
      )}
    </div>
  );
}
