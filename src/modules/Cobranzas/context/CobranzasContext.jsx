// ============================================================================
// SISTEMA GM · M-07 COBRANZAS · CONTEXTO DEL MÓDULO
// ----------------------------------------------------------------------------
// Ventas, cuotas, movimientos de caja y resultado mensual, cargados una vez y
// compartidos por las cuatro secciones. La venta seleccionada también se
// comparte: si abrís una venta en "Ventas y cobros" y pasás al Calendario,
// sigue siendo la misma la que está marcada.
//
// Después de registrar un cobro o un gasto se recarga todo, no sólo la tabla
// tocada. Un cobro cambia el saldo de la venta, el estado de la cuota, la caja
// del mes y el resultado del período: actualizar una sola cosa dejaría el resto
// de las pantallas mostrando números viejos, que es peor que no mostrar nada.
// ============================================================================

import React, {
  createContext, useCallback, useContext, useEffect, useMemo, useRef, useState,
} from 'react';
import {
  listarVentas, listarCuotas, listarCaja, listarResultado,
  listarClientes, listarEquipos, listarGastosRecurrentes,
  crearVenta, registrarCobro, crearEgreso,
} from '../services/cobranzasService';
import { supabase, isSupabaseConfigured } from '../../../services/supabaseClient';
import { cartera, deudaPorCliente, totales } from '../utils/finanzas';
import { mesActual } from '../utils/calendario';

const Ctx = createContext(null);

const TABLAS_EN_VIVO = ['gm_ventas', 'gm_cuotas', 'gm_cobros', 'gm_egresos'];
const ESPERA_RAFAGA_MS = 1200;

export function CobranzasProvider({ children }) {
  const [ventas, setVentas] = useState([]);
  const [cuotas, setCuotas] = useState([]);
  const [movimientos, setMovimientos] = useState([]);
  const [meses, setMeses] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [equipos, setEquipos] = useState([]);
  const [gastos, setGastos] = useState([]);

  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [ultimoCambio, setUltimoCambio] = useState(null);

  const [ventaActiva, setVentaActiva] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [estadoFiltro, setEstadoFiltro] = useState('todas');
  const [mesVisible, setMesVisible] = useState(mesActual);

  const cargar = useCallback(async () => {
    setCargando(true);
    setError('');
    try {
      const [vs, qs, mv, ms, cls, eqs, gs] = await Promise.all([
        listarVentas(),
        listarCuotas(),
        listarCaja(),
        listarResultado(),
        listarClientes(),
        listarEquipos(),
        listarGastosRecurrentes(),
      ]);
      setVentas(vs);
      setCuotas(qs);
      setMovimientos(mv);
      setMeses(ms);
      setClientes(cls);
      setEquipos(eqs);
      setGastos(gs);
    } catch (e) {
      setError(e.message || 'No se pudieron cargar las cobranzas.');
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => { cargar(); }, [cargar]);

  // -------------------------- cambios en vivo ------------------------------
  const temporizador = useRef(null);

  useEffect(() => {
    if (!isSupabaseConfigured || typeof supabase.channel !== 'function') return undefined;
    const canal = supabase.channel('gm-modulo-cobranzas');
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

  // ------------------------------ derivados --------------------------------

  const cuotasPorVenta = useMemo(() => {
    const mapa = new Map();
    cuotas.forEach((c) => {
      if (!mapa.has(c.ventaCodigo)) mapa.set(c.ventaCodigo, []);
      mapa.get(c.ventaCodigo).push(c);
    });
    mapa.forEach((lista) => lista.sort((a, b) => a.numero - b.numero));
    return mapa;
  }, [cuotas]);

  const ventasFiltradas = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    return ventas.filter((v) => {
      if (estadoFiltro !== 'todas' && v.estadoCobro !== estadoFiltro) return false;
      if (!q) return true;
      return [v.cliente, v.titular, v.detalle, v.codigo, v.localidad, v.rubro, v.equipoCodigo]
        .filter(Boolean)
        .some((x) => String(x).toLowerCase().includes(q));
    });
  }, [ventas, busqueda, estadoFiltro]);

  /** La venta abierta, siempre tomada de la lista viva y no de una copia. */
  const ventaSeleccionada = useMemo(
    () => (ventaActiva ? ventas.find((v) => v.codigo === ventaActiva) || null : null),
    [ventaActiva, ventas]
  );

  const cuotasDeLaVenta = useMemo(
    () => (ventaActiva ? cuotasPorVenta.get(ventaActiva) || [] : []),
    [ventaActiva, cuotasPorVenta]
  );

  const resumenCartera = useMemo(() => cartera(ventas), [ventas]);
  const deudores = useMemo(() => deudaPorCliente(ventas), [ventas]);
  const resumenPeriodo = useMemo(() => totales(meses), [meses]);

  /** Cuenta por estado, para los filtros. Se calcula sobre TODAS las ventas,
   *  no sobre las filtradas: un contador que cambia al filtrar no sirve. */
  const conteoPorEstado = useMemo(() => {
    const base = { todas: ventas.length, 'al dia': 0, atrasada: 0, cobrada: 0, 'sin plan': 0 };
    ventas.forEach((v) => {
      if (base[v.estadoCobro] != null) base[v.estadoCobro] += 1;
    });
    return base;
  }, [ventas]);

  // ------------------------------ acciones ---------------------------------

  const nuevaVenta = useCallback(async (datos) => {
    const r = await crearVenta(datos);
    await cargar();
    if (r?.codigo) setVentaActiva(r.codigo);
    return r;
  }, [cargar]);

  const nuevoCobro = useCallback(async (datos) => {
    const r = await registrarCobro(datos);
    await cargar();
    return r;
  }, [cargar]);

  const nuevoEgreso = useCallback(async (datos) => {
    const r = await crearEgreso(datos);
    await cargar();
    return r;
  }, [cargar]);

  const valor = useMemo(
    () => ({
      ventas, cuotas, movimientos, meses, clientes, equipos, gastos,
      cargando, error, ultimoCambio, recargar: cargar,
      busqueda, setBusqueda,
      estadoFiltro, setEstadoFiltro, conteoPorEstado,
      mesVisible, setMesVisible,
      ventaActiva, setVentaActiva, ventaSeleccionada, cuotasDeLaVenta, cuotasPorVenta,
      ventasFiltradas, resumenCartera, deudores, resumenPeriodo,
      nuevaVenta, nuevoCobro, nuevoEgreso,
    }),
    [
      ventas, cuotas, movimientos, meses, clientes, equipos, gastos,
      cargando, error, ultimoCambio, cargar,
      busqueda, estadoFiltro, conteoPorEstado, mesVisible,
      ventaActiva, ventaSeleccionada, cuotasDeLaVenta, cuotasPorVenta,
      ventasFiltradas, resumenCartera, deudores, resumenPeriodo,
      nuevaVenta, nuevoCobro, nuevoEgreso,
    ]
  );

  return <Ctx.Provider value={valor}>{children}</Ctx.Provider>;
}

export function useCobranzas() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useCobranzas se usa dentro de <CobranzasProvider>');
  return ctx;
}

export default CobranzasProvider;
