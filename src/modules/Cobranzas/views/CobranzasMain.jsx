// ============================================================================
// SISTEMA GM · MÓDULO 8 · GESTIÓN DE COBRANZAS (Fase 3)
// ----------------------------------------------------------------------------
// Split-screen obligatorio: a la izquierda el estado de cuenta y la estructura
// financiera (información estática); a la derecha se opera el llamado y se
// audita la gestión, sin perder contexto.
// ============================================================================

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Loader2, AlertTriangle } from 'lucide-react';

import { CuentaProvider, useCuenta } from '../../../shared/cuentas/CuentaContext';
import { listarCuentas } from '../../../shared/cuentas/cuentasService';

import ColaGestionPanel from '../components/ColaGestionPanel';
import EstadoCuentaPanel from '../components/EstadoCuentaPanel';
import EstructuraFinancieraPanel from '../components/EstructuraFinancieraPanel';
import RegistroLlamadaPanel from '../components/RegistroLlamadaPanel';
import AuditoriaPanel from '../components/AuditoriaPanel';

// ---------------------------------------------------------------------------
// Puesto de gestión (consume la cuenta activa)
// ---------------------------------------------------------------------------
function PuestoGestion({ onSiguiente }) {
  const { cuenta, cargando, error, agregarLlamado, agregarNota } = useCuenta();

  const grabar = useCallback(
    async (registro) => {
      await agregarLlamado({
        quienAtiende: registro.quienAtiende,
        contacto: registro.contacto,
        respuesta: registro.respuesta,
        proximoEvento: registro.proximoEvento,
        operador: registro.operador,
      });
      if (registro.nota?.trim()) {
        await agregarNota({
          texto: registro.nota.trim(),
          tipo: 'Operativa',
          operador: registro.operador,
        });
      }
    },
    [agregarLlamado, agregarNota]
  );

  const llamarDespues = useCallback(
    async (registro) => {
      await grabar(registro);
      onSiguiente();
    },
    [grabar, onSiguiente]
  );

  if (cargando) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-rose-400" />
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-gray-500">
            Cargando estado de cuenta
          </span>
        </div>
      </div>
    );
  }

  if (error || !cuenta) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-center">
          <AlertTriangle className="h-6 w-6 text-rose-400" />
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-rose-300">
            {error || 'Cuenta no encontrada'}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="grid min-h-0 flex-1 grid-cols-1 gap-3 overflow-hidden p-3 lg:grid-cols-[minmax(320px,38%)_1fr]">
      {/* ---------- Lado estático ---------- */}
      <div className="min-h-0 space-y-3 overflow-y-auto pr-1">
        <EstadoCuentaPanel cuenta={cuenta} />
        <EstructuraFinancieraPanel cuenta={cuenta} />
      </div>

      {/* ---------- Lado operativo ---------- */}
      <div className="flex min-h-0 flex-col gap-3 overflow-hidden">
        <div className="shrink-0">
          <RegistroLlamadaPanel
            cuenta={cuenta}
            onGrabar={grabar}
            onLlamarDespues={llamarDespues}
            onOmitir={onSiguiente}
          />
        </div>
        <AuditoriaPanel cuenta={cuenta} />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Vista del módulo
// ---------------------------------------------------------------------------
export default function CobranzasMain() {
  const [cuentas, setCuentas] = useState([]);
  const [cuentaId, setCuentaId] = useState(null);
  const [gestionadas, setGestionadas] = useState([]);

  useEffect(() => {
    let vivo = true;
    listarCuentas().then((data) => {
      if (!vivo) return;
      // Primero las que están en mora: es la cola real de trabajo
      const ordenadas = [...data].sort((a, b) => {
        const aMora = String(a.cuenta?.estado || '').toUpperCase().includes('MORA') ? 0 : 1;
        const bMora = String(b.cuenta?.estado || '').toUpperCase().includes('MORA') ? 0 : 1;
        return aMora - bMora;
      });
      setCuentas(ordenadas);
      setCuentaId((prev) => prev || ordenadas[0]?.id || null);
    });
    return () => {
      vivo = false;
    };
  }, []);

  const siguiente = useCallback(() => {
    setGestionadas((prev) => (cuentaId && !prev.includes(cuentaId) ? [...prev, cuentaId] : prev));
    setCuentas((lista) => {
      const i = lista.findIndex((c) => c.id === cuentaId);
      const proxima = lista[(i + 1) % (lista.length || 1)];
      if (proxima) setCuentaId(proxima.id);
      return lista;
    });
  }, [cuentaId]);

  const cuentaActual = useMemo(
    () => cuentas.find((c) => c.id === cuentaId) || null,
    [cuentas, cuentaId]
  );

  const enMora = String(cuentaActual?.cuenta?.estado || '').toUpperCase().includes('MORA');

  return (
    <div className="flex h-screen min-h-screen flex-col bg-gray-950 font-sans">
      {/* Cola de gestión */}
      {cuentas.length > 0 && (
        <ColaGestionPanel
          cuentas={cuentas}
          cuentaActiva={cuentaId}
          gestionadas={gestionadas}
          onSeleccionar={setCuentaId}
          titularActivo={
            cuentaActual
              ? `${cuentaActual.titular.apellido}, ${cuentaActual.titular.nombre}`
              : null
          }
          estadoActivo={cuentaActual?.cuenta?.estado}
          enMora={enMora}
        />
      )}

      {/* Puesto de trabajo */}
      <CuentaProvider cuentaId={cuentaId}>
        <PuestoGestion onSiguiente={siguiente} />
      </CuentaProvider>
    </div>
  );
}
