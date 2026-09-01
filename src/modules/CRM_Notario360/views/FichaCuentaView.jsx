// ============================================================================
// SISTEMA GM · NOTARIO 360° · FICHA DE CUENTA (Fase 2)
// ----------------------------------------------------------------------------
// Vista de perfil ejecutivo y auditoría: cabecera persistente + botonera de
// acciones rápidas + las seis pestañas tabuladas, sin recargar la página.
// ============================================================================

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Loader2, AlertTriangle, ChevronDown } from 'lucide-react';

import { CuentaProvider, useCuenta } from '../../../shared/cuentas/CuentaContext';
import { listarCuentas } from '../../../shared/cuentas/cuentasService';
import { NOTARIO_TABS, TAB_POR_DEFECTO } from '../config/tabs.config';

import ClientTopBar from '../components/ClientTopBar';
import QuickActionBar from '../components/QuickActionBar';
import TabNavigation from '../components/TabNavigation';
import NotaEstrategicaModal from '../components/NotaEstrategicaModal';
import RegistroLlamadoModal from '../components/RegistroLlamadoModal';

import TabGenerales from '../components/TabGenerales';
import TabDomicilios from '../components/TabDomicilios';
import TabMargenes from '../components/TabMargenes';
import TabPagos from '../components/TabPagos';
import TabMovimientos from '../components/TabMovimientos';
import TabHistoriales from '../components/TabHistoriales';

// ---------------------------------------------------------------------------
// Selector de cuenta (permite saltar de ficha sin volver al padrón)
// ---------------------------------------------------------------------------
function SelectorCuenta({ cuentaActual, onSeleccionar }) {
  const [cuentas, setCuentas] = useState([]);

  useEffect(() => {
    let vivo = true;
    listarCuentas().then((data) => vivo && setCuentas(data));
    return () => {
      vivo = false;
    };
  }, []);

  if (cuentas.length < 2) return null;

  return (
    <div className="relative">
      <select
        value={cuentaActual || ''}
        onChange={(e) => onSeleccionar(e.target.value)}
        className="appearance-none rounded-md border border-gray-700 bg-gray-900 py-1.5 pl-3 pr-8 font-mono text-[10px] uppercase tracking-[0.12em] text-gray-300 outline-none transition-colors hover:border-gray-500 focus:border-cyan-500"
      >
        {cuentas.map((c) => (
          <option key={c.id} value={c.id}>
            {c.titular.apellido}, {c.titular.nombre} · {c.id}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-500" />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Consola de la ficha
// ---------------------------------------------------------------------------
function FichaConsola({ cuentaId, onCambiarCuenta }) {
  const { cuenta, cargando, error, agregarNota, agregarLlamado } = useCuenta();
  const [tabActiva, setTabActiva] = useState(TAB_POR_DEFECTO);
  const [modalNota, setModalNota] = useState(false);
  const [modalLlamado, setModalLlamado] = useState(false);

  const abrirAgenda = () => {
    if (!cuenta) return;
    const titulo = encodeURIComponent(
      `Visita · ${cuenta.titular.apellido}, ${cuenta.titular.nombre}`
    );
    const detalle = encodeURIComponent(
      `Cuenta ${cuenta.id} · ${cuenta.comercial?.proximoPaso || 'Seguimiento comercial'}`
    );
    window.open(
      `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${titulo}&details=${detalle}`,
      '_blank',
      'noreferrer'
    );
  };

  if (cargando) {
    return (
      <div className="flex h-full items-center justify-center rounded-xl border border-gray-800 bg-gray-950">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-cyan-400" />
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-gray-500">
            Cargando ficha
          </span>
        </div>
      </div>
    );
  }

  if (error || !cuenta) {
    return (
      <div className="flex h-full items-center justify-center rounded-xl border border-rose-900/50 bg-gray-950">
        <div className="flex flex-col items-center gap-3 px-6 text-center">
          <AlertTriangle className="h-6 w-6 text-rose-400" />
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-rose-300">
            {error || 'Cuenta no encontrada'}
          </span>
        </div>
      </div>
    );
  }

  const contenido = {
    generales: <TabGenerales />,
    domicilios: <TabDomicilios />,
    margenes: <TabMargenes />,
    pagos: <TabPagos />,
    movimientos: <TabMovimientos />,
    historiales: (
      <TabHistoriales
        onRegistrarLlamado={() => setModalLlamado(true)}
        onNuevaNota={() => setModalNota(true)}
      />
    ),
  };

  const tabActual = NOTARIO_TABS.find((t) => t.id === tabActiva);

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-gray-800 bg-gray-950 shadow-2xl">
      {/* Barra de contexto */}
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-gray-800 bg-black/60 px-4 py-2 md:px-6">
        <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-gray-600">
          Notario 360° · Ficha de cuenta
        </span>
        <SelectorCuenta cuentaActual={cuentaId || cuenta.id} onSeleccionar={onCambiarCuenta} />
      </div>

      <ClientTopBar cuenta={cuenta} />

      <QuickActionBar
        cuenta={cuenta}
        onNuevaNota={() => setModalNota(true)}
        onRegistrarLlamado={() => setModalLlamado(true)}
        onAgendar={abrirAgenda}
      />

      <TabNavigation activa={tabActiva} onCambiar={setTabActiva} />

      {/* Descripción de la pestaña activa */}
      <div className="shrink-0 border-b border-gray-800/60 bg-gray-950 px-4 py-1.5 md:px-6">
        <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-gray-600">
          {tabActual?.desc}
        </p>
      </div>

      {/* Contenido de la pestaña */}
      <div className="min-h-0 flex-1 bg-gray-950 p-3 md:p-4">{contenido[tabActiva]}</div>

      {/* Modales */}
      <NotaEstrategicaModal
        abierto={modalNota}
        onCerrar={() => setModalNota(false)}
        onGuardar={agregarNota}
      />
      <RegistroLlamadoModal
        abierto={modalLlamado}
        onCerrar={() => setModalLlamado(false)}
        onGuardar={agregarLlamado}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Vista exportada
// ---------------------------------------------------------------------------
export default function FichaCuentaView() {
  const { cuentaId: paramId } = useParams();
  const [cuentaId, setCuentaId] = useState(paramId || null);

  useEffect(() => {
    if (paramId) setCuentaId(paramId);
  }, [paramId]);

  return (
    <CuentaProvider cuentaId={cuentaId}>
      <FichaConsola cuentaId={cuentaId} onCambiarCuenta={setCuentaId} />
    </CuentaProvider>
  );
}
