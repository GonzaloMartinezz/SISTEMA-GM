// ============================================================================
// SISTEMA GM · M-05 NOTARIO 360 · CONTEXTO DEL MÓDULO
// ----------------------------------------------------------------------------
// Las notas, el índice de entidades, la bitácora y las cuentas, más el buscador
// que comparten las cuatro secciones.
//
// El buscador es uno solo y vive arriba a propósito: en un módulo cuya razón de
// ser es encontrar algo que anotaste hace tres meses, buscar tiene que ser lo
// primero que hay a mano, y tiene que seguir aplicando cuando pasás de Notas a
// Trazabilidad.
// ============================================================================

import React, {
  createContext, useCallback, useContext, useEffect, useMemo, useRef, useState,
} from 'react';
import {
  listarNotas, listarEntidades, listarBitacora, listarCuentas,
  crearNota, actualizarNota, fijarNota, eliminarNota,
  crearCuenta, actualizarCuenta,
} from '../services/notarioService';
import { supabase, isSupabaseConfigured } from '../../../services/supabaseClient';

const Ctx = createContext(null);

// La bitácora lee de diez tablas; se escucha a las que se mueven de verdad.
const TABLAS_EN_VIVO = [
  'gm_notas', 'gm_mensajes', 'gm_lead_etapas', 'gm_movimientos_stock', 'gm_agenda',
];
const ESPERA_RAFAGA_MS = 1500;

export function NotarioProvider({ children }) {
  const [notas, setNotas] = useState([]);
  const [entidades, setEntidades] = useState([]);
  const [bitacora, setBitacora] = useState([]);
  const [cuentas, setCuentas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [ultimoCambio, setUltimoCambio] = useState(null);

  const [busqueda, setBusqueda] = useState('');
  const [tiposVisibles, setTiposVisibles] = useState([]);       // vacío = todos
  const [entidadesVisibles, setEntidadesVisibles] = useState([]); // vacío = todas
  const [etiquetaActiva, setEtiquetaActiva] = useState(null);

  const cargar = useCallback(async () => {
    setCargando(true);
    setError('');
    try {
      const [ns, es, bs, cs] = await Promise.all([
        listarNotas(), listarEntidades(), listarBitacora(), listarCuentas(),
      ]);
      setNotas(ns);
      setEntidades(es);
      setBitacora(bs);
      setCuentas(cs);
    } catch (e) {
      setError(e.message || 'No se pudo cargar el módulo.');
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  // ------------------------- cambios en vivo -------------------------------
  const temporizador = useRef(null);

  useEffect(() => {
    if (!isSupabaseConfigured || typeof supabase.channel !== 'function') return undefined;

    const canal = supabase.channel('gm-modulo-notario');
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

  // ------------------------------- acciones --------------------------------

  const guardarNota = useCallback(async (nota, esNueva) => {
    if (esNueva) await crearNota(nota);
    else await actualizarNota(nota.id, nota);
    await cargar();
  }, [cargar]);

  const alternarFijada = useCallback(async (codigo, fijada) => {
    setNotas((prev) => prev.map((n) => (n.id === codigo ? { ...n, fijada } : n)));
    try {
      await fijarNota(codigo, fijada);
    } catch (e) {
      setError(`No se pudo fijar ${codigo}: ${e.message}`);
      await cargar();
    }
  }, [cargar]);

  const borrarNota = useCallback(async (codigo) => {
    await eliminarNota(codigo);
    await cargar();
  }, [cargar]);

  const guardarCuenta = useCallback(async (cuenta, esNueva) => {
    if (esNueva) await crearCuenta(cuenta);
    else await actualizarCuenta(cuenta.numero, cuenta);
    await cargar();
  }, [cargar]);

  const limpiarFiltros = useCallback(() => {
    setBusqueda('');
    setTiposVisibles([]);
    setEntidadesVisibles([]);
    setEtiquetaActiva(null);
  }, []);

  const toggle = (lista, set) => (id) =>
    set(lista.includes(id) ? lista.filter((x) => x !== id) : [...lista, id]);

  // ------------------------------- derivados -------------------------------

  /** Mapa "entidad:codigo" -> entidad, para resolver de qué habla cada nota. */
  const porClave = useMemo(
    () => new Map(entidades.map((e) => [`${e.entidad}:${e.codigo}`, e])),
    [entidades]
  );

  const resolver = useCallback(
    (entidad, codigo) => (entidad && codigo ? porClave.get(`${entidad}:${codigo}`) || null : null),
    [porClave]
  );

  /**
   * Las notas filtradas y ordenadas. Las fijadas van SIEMPRE arriba, sin
   * importar la fecha: para eso se fijan.
   */
  const notasFiltradas = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    return notas
      .filter((n) => {
        if (tiposVisibles.length && !tiposVisibles.includes(n.tipo)) return false;
        if (entidadesVisibles.length) {
          const clase = n.entidad || 'general';
          if (!entidadesVisibles.includes(clase)) return false;
        }
        if (etiquetaActiva && !n.etiquetas.includes(etiquetaActiva)) return false;
        if (!q) return true;
        const ent = resolver(n.entidad, n.entidadCodigo);
        return [n.titulo, n.texto, n.entidadCodigo, ent?.nombre, ...(n.etiquetas || [])]
          .filter(Boolean)
          .some((c) => String(c).toLowerCase().includes(q));
      })
      .slice()
      .sort((a, b) => {
        if (a.fijada !== b.fijada) return a.fijada ? -1 : 1;
        return new Date(b.creada) - new Date(a.creada);
      });
  }, [notas, busqueda, tiposVisibles, entidadesVisibles, etiquetaActiva, resolver]);

  /** Todas las etiquetas usadas, con cuántas notas tiene cada una. */
  const etiquetas = useMemo(() => {
    const cuenta = new Map();
    notas.forEach((n) => (n.etiquetas || []).forEach((e) => cuenta.set(e, (cuenta.get(e) || 0) + 1)));
    return [...cuenta.entries()]
      .map(([nombre, total]) => ({ nombre, total }))
      .sort((a, b) => b.total - a.total || a.nombre.localeCompare(b.nombre));
  }, [notas]);

  /** Notas de una entidad puntual, para la Ficha 360. */
  const notasDe = useCallback(
    (entidad, codigo) => notas.filter((n) => n.entidad === entidad && n.entidadCodigo === codigo),
    [notas]
  );

  const bitacoraDe = useCallback(
    (entidad, codigo) =>
      bitacora.filter((h) => h.entidad === entidad && h.entidadCodigo === codigo),
    [bitacora]
  );

  const hayFiltro =
    Boolean(busqueda.trim()) ||
    tiposVisibles.length > 0 ||
    entidadesVisibles.length > 0 ||
    Boolean(etiquetaActiva);

  const valor = useMemo(
    () => ({
      notas, notasFiltradas, entidades, bitacora, cuentas, etiquetas,
      cargando, error, ultimoCambio,
      busqueda, setBusqueda,
      tiposVisibles, toggleTipo: toggle(tiposVisibles, setTiposVisibles),
      entidadesVisibles, toggleEntidad: toggle(entidadesVisibles, setEntidadesVisibles),
      etiquetaActiva, setEtiquetaActiva,
      hayFiltro, limpiarFiltros,
      resolver, notasDe, bitacoraDe,
      recargar: cargar, guardarNota, alternarFijada, borrarNota, guardarCuenta,
    }),
    [
      notas, notasFiltradas, entidades, bitacora, cuentas, etiquetas,
      cargando, error, ultimoCambio, busqueda, tiposVisibles, entidadesVisibles,
      etiquetaActiva, hayFiltro, limpiarFiltros, resolver, notasDe, bitacoraDe,
      cargar, guardarNota, alternarFijada, borrarNota, guardarCuenta,
    ]
  );

  return <Ctx.Provider value={valor}>{children}</Ctx.Provider>;
}

export function useNotario() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useNotario debe usarse dentro de <NotarioProvider>');
  return ctx;
}

export default NotarioProvider;
