// ============================================================================
// SISTEMA GM · M-09 TESORERÍA · CONTEXTO DEL MÓDULO
// ----------------------------------------------------------------------------
// La aritmética no se toca: sigue viviendo en finanzasService (obtenerFinanzas,
// liquidarMes, simularOperacion). Este contexto sólo la trae, la comparte con
// las cuatro secciones y agrega lo que el módulo nuevo necesita: la moneda de
// visualización, el ABM y los cambios en vivo.
// ============================================================================

import React, {
  createContext, useCallback, useContext, useEffect, useMemo, useRef, useState,
} from 'react';
import {
  obtenerFinanzas, guardarParametros, guardarMes, eliminarMes, guardarGasto, eliminarGasto,
} from '../../../shared/finanzas/finanzasService';
import { supabase, isSupabaseConfigured } from '../../../services/supabaseClient';
import { serieHorizonte, resumenHorizonte, saludFinanciera } from '../utils/horizonte';

const Ctx = createContext(null);

const TABLAS_EN_VIVO = ['gm_parametros', 'gm_meses', 'gm_gastos', 'gm_flujo'];
const ESPERA_RAFAGA_MS = 1200;

export function FinanzasProvider({ children }) {
  const [datos, setDatos] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [ultimoCambio, setUltimoCambio] = useState(null);

  /** USD o ARS: es sólo cómo se muestra. Todo se guarda siempre en dólares. */
  const [moneda, setMoneda] = useState('USD');

  /** A qué distancia se mira el negocio: semana, mes, 12 meses o 5 años. */
  const [periodo, setPeriodo] = useState('mes');

  const cargar = useCallback(async () => {
    setCargando(true);
    setError('');
    try {
      setDatos(await obtenerFinanzas());
    } catch (e) {
      setError(e.message || 'No se pudieron cargar las finanzas.');
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  // -------------------------------------------------------------------------
  // Cambios en vivo: lo que se corrige en la planilla de Drive entra solo
  // -------------------------------------------------------------------------
  const temporizador = useRef(null);

  useEffect(() => {
    if (!isSupabaseConfigured || typeof supabase.channel !== 'function') return undefined;

    const canal = supabase.channel('gm-modulo-finanzas');
    TABLAS_EN_VIVO.forEach((tabla) => {
      canal.on('postgres_changes', { event: '*', schema: 'public', table: tabla }, () => {
        setUltimoCambio(new Date());
        clearTimeout(temporizador.current);
        temporizador.current = setTimeout(cargar, ESPERA_RAFAGA_MS);
      });
    });
    canal.subscribe();

    return () => {
      clearTimeout(temporizador.current);
      supabase.removeChannel(canal);
    };
  }, [cargar]);

  // -------------------------------------------------------------------------
  // ABM. Cada guardado vuelve a liquidar: un gasto nuevo cambia el resultado.
  // -------------------------------------------------------------------------

  const guardarUnMes = useCallback(async (mes) => {
    await guardarMes(mes);
    await cargar();
  }, [cargar]);

  const borrarUnMes = useCallback(async (mes) => {
    await eliminarMes(mes);
    await cargar();
  }, [cargar]);

  const guardarUnGasto = useCallback(async (gasto) => {
    await guardarGasto(gasto);
    await cargar();
  }, [cargar]);

  const borrarUnGasto = useCallback(async (codigo) => {
    await eliminarGasto(codigo);
    await cargar();
  }, [cargar]);

  const guardarParams = useCallback(async (cambios) => {
    await guardarParametros(cambios);
    await cargar();
  }, [cargar]);

  // -------------------------------------------------------------------------
  // Presentación de importes
  // -------------------------------------------------------------------------

  const tipoCambio = datos?.params?.tipoCambio || 1;

  /** Formatea un importe en dólares según la moneda elegida. */
  const enMoneda = useCallback(
    (v) =>
      moneda === 'USD'
        ? `US$ ${Number(v || 0).toLocaleString('es-AR', { maximumFractionDigits: 0 })}`
        : `$ ${Math.round(Number(v || 0) * tipoCambio).toLocaleString('es-AR')}`,
    [moneda, tipoCambio]
  );

  /** Versión corta para ejes de gráfico (12,5k / 1,2M). */
  const enMonedaCorta = useCallback(
    (v) => {
      const n = Number(v || 0) * (moneda === 'USD' ? 1 : tipoCambio);
      const abs = Math.abs(n);
      if (abs >= 1e6) return `${(n / 1e6).toFixed(abs >= 1e7 ? 0 : 1)}M`;
      if (abs >= 1000) return `${(n / 1000).toFixed(abs >= 1e5 ? 0 : 1)}k`;
      return String(Math.round(n));
    },
    [moneda, tipoCambio]
  );

  // -------------------------------------------------------------------------
  // Derivados del horizonte elegido. Se calculan una vez y los usan las vistas.
  // -------------------------------------------------------------------------
  const serie = useMemo(() => serieHorizonte(datos, periodo), [datos, periodo]);
  const resumenPeriodo = useMemo(() => resumenHorizonte(serie), [serie]);
  const salud = useMemo(() => saludFinanciera(datos), [datos]);

  const valor = useMemo(
    () => ({
      datos, cargando, error, ultimoCambio,
      moneda, setMoneda, tipoCambio, enMoneda, enMonedaCorta,
      periodo, setPeriodo, serie, resumenPeriodo, salud,
      recargar: cargar,
      guardarUnMes, borrarUnMes, guardarUnGasto, borrarUnGasto, guardarParams,
    }),
    [
      datos, cargando, error, ultimoCambio, moneda, tipoCambio, enMoneda, enMonedaCorta,
      periodo, serie, resumenPeriodo, salud,
      cargar, guardarUnMes, borrarUnMes, guardarUnGasto, borrarUnGasto, guardarParams,
    ]
  );

  return <Ctx.Provider value={valor}>{children}</Ctx.Provider>;
}

export function useFinanzas() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useFinanzas debe usarse dentro de <FinanzasProvider>');
  return ctx;
}

export default FinanzasProvider;
