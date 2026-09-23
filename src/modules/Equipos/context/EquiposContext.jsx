// ============================================================================
// SISTEMA GM · M-02 EQUIPAMIENTOS · CONTEXTO DEL MÓDULO
// ----------------------------------------------------------------------------
// Carga una sola vez el catálogo, las fichas técnicas y los movimientos, y los
// comparte con las tres secciones. Escucha además los cambios en vivo: si
// cargás un equipo en la planilla de Drive, aparece acá sin recargar la página.
// ============================================================================

import React, {
  createContext, useCallback, useContext, useEffect, useMemo, useRef, useState,
} from 'react';
import {
  listarEquipos, listarSpecs, listarMovimientos,
  crearEquipo, actualizarEquipo, eliminarEquipo,
  guardarSpec, eliminarSpec, moverStock,
} from '../services/equiposService';
import { supabase, isSupabaseConfigured } from '../../../services/supabaseClient';

const Ctx = createContext(null);

const TABLAS_EN_VIVO = ['gm_equipos', 'gm_equipo_specs', 'gm_movimientos_stock'];
const ESPERA_RAFAGA_MS = 1200;

export function EquiposProvider({ children }) {
  const [equipos, setEquipos] = useState([]);
  const [specs, setSpecs] = useState([]);
  const [movimientos, setMovimientos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [ultimoCambio, setUltimoCambio] = useState(null);

  const cargar = useCallback(async () => {
    setCargando(true);
    setError('');
    try {
      const [eq, sp, mv] = await Promise.all([listarEquipos(), listarSpecs(), listarMovimientos()]);
      setEquipos(eq);
      setSpecs(sp);
      setMovimientos(mv);
    } catch (e) {
      setError(e.message || 'No se pudo cargar el equipamiento.');
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  // -------------------------------------------------------------------------
  // Cambios en vivo desde las planillas de Drive o desde otra pantalla
  // -------------------------------------------------------------------------
  const temporizador = useRef(null);

  useEffect(() => {
    if (!isSupabaseConfigured || typeof supabase.channel !== 'function') return undefined;

    const canal = supabase.channel('gm-modulo-equipos');
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
  // Acciones. Todas recargan lo que cambió, no toda la pantalla.
  // -------------------------------------------------------------------------

  const altaEquipo = useCallback(async (datos) => {
    await crearEquipo(datos);
    setEquipos(await listarEquipos());
  }, []);

  const editarEquipo = useCallback(async (id, datos) => {
    await actualizarEquipo(id, datos);
    setEquipos(await listarEquipos());
  }, []);

  const bajaEquipo = useCallback(async (id) => {
    await eliminarEquipo(id);
    setEquipos(await listarEquipos());
  }, []);

  const guardarFicha = useCallback(async (spec) => {
    await guardarSpec(spec);
    setSpecs(await listarSpecs());
  }, []);

  const borrarFicha = useCallback(async (id) => {
    await eliminarSpec(id);
    setSpecs(await listarSpecs());
  }, []);

  /** Venta, compra o llegada de mercadería. Devuelve el stock resultante. */
  const registrarMovimiento = useCallback(async (datos) => {
    const resultado = await moverStock(datos);
    const [eq, mv] = await Promise.all([listarEquipos(), listarMovimientos()]);
    setEquipos(eq);
    setMovimientos(mv);
    return resultado;
  }, []);

  // -------------------------------------------------------------------------
  // Derivados que usan varias secciones
  // -------------------------------------------------------------------------

  /** Ficha técnica agrupada por código de equipo. */
  const specsPorEquipo = useMemo(() => {
    const mapa = new Map();
    specs.forEach((s) => {
      const k = s.equipoCodigo;
      if (!k) return;
      if (!mapa.has(k)) mapa.set(k, []);
      mapa.get(k).push(s);
    });
    mapa.forEach((lista) => lista.sort((a, b) => a.orden - b.orden));
    return mapa;
  }, [specs]);

  const porRubro = useMemo(() => {
    const mapa = new Map();
    equipos.forEach((e) => {
      const r = e.rubro || 'Sin rubro';
      mapa.set(r, (mapa.get(r) || 0) + 1);
    });
    return [...mapa.entries()].map(([rubro, cantidad]) => ({ rubro, cantidad }));
  }, [equipos]);

  /**
   * El mismo capital inmovilizado que ya se suma en la KPI, partido por
   * rubro. Sirve para el gráfico de "Base de Datos": no alcanza con saber
   * que hay US$ X trabados, importa saber en cuál de los tres rubros están.
   */
  const inmovilizadoPorRubro = useMemo(() => {
    const mapa = new Map();
    equipos.forEach((e) => {
      const r = e.rubro || 'Sin rubro';
      const actual = mapa.get(r) || { rubro: r, inmovilizado: 0, unidades: 0 };
      actual.inmovilizado += e.inmovilizadoUsd;
      actual.unidades += e.stock;
      mapa.set(r, actual);
    });
    return [...mapa.values()].sort((a, b) => b.inmovilizado - a.inmovilizado);
  }, [equipos]);

  const resumen = useMemo(() => {
    const inmovilizado = equipos.reduce((s, e) => s + e.inmovilizadoUsd, 0);
    const potencial = equipos.reduce((s, e) => s + e.stock * e.precioUsd, 0);
    const margenes = equipos.filter((e) => e.precioUsd > 0).map((e) => e.margenPct);
    return {
      total: equipos.length,
      unidades: equipos.reduce((s, e) => s + e.stock, 0),
      enTransito: equipos.reduce((s, e) => s + e.transito, 0),
      inmovilizado,
      potencial,
      margenPromedio: margenes.length
        ? margenes.reduce((s, m) => s + m, 0) / margenes.length
        : 0,
      sinStock: equipos.filter((e) => e.estadoStock === 'sin stock').length,
      criticos: equipos.filter((e) => e.estadoStock === 'crítico' || e.estadoStock === 'sin stock').length,
    };
  }, [equipos]);

  const valor = useMemo(
    () => ({
      equipos, specs, movimientos, cargando, error, ultimoCambio,
      specsPorEquipo, porRubro, inmovilizadoPorRubro, resumen,
      recargar: cargar,
      altaEquipo, editarEquipo, bajaEquipo,
      guardarFicha, borrarFicha, registrarMovimiento,
    }),
    [
      equipos, specs, movimientos, cargando, error, ultimoCambio,
      specsPorEquipo, porRubro, inmovilizadoPorRubro, resumen, cargar,
      altaEquipo, editarEquipo, bajaEquipo, guardarFicha, borrarFicha, registrarMovimiento,
    ]
  );

  return <Ctx.Provider value={valor}>{children}</Ctx.Provider>;
}

export function useEquipos() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useEquipos debe usarse dentro de <EquiposProvider>');
  return ctx;
}

export default EquiposProvider;
