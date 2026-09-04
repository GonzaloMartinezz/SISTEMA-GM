// ============================================================================
// SISTEMA GM · M-07 MAPA Y LOGÍSTICA · CONTEXTO DEL MÓDULO
// ----------------------------------------------------------------------------
// Los clientes ubicados, los compromisos de la agenda y el punto seleccionado,
// que es lo que comparten las cuatro secciones: si tocás a un cliente en el
// Mapa y pasás a Ruta del día, sigue siendo el mismo el que está marcado.
//
// Una decisión que importa: un compromiso hereda las coordenadas de su cliente
// cuando no tiene las propias. En la Agenda se puede cargar un evento sin
// coordenadas —es lo normal— y sin esta herencia esos eventos no aparecerían en
// el mapa, que es justamente para lo que existe este módulo.
// ============================================================================

import React, {
  createContext, useCallback, useContext, useEffect, useMemo, useRef, useState,
} from 'react';
import { listarClientes, listarCompromisos, contarSinCoordenadas } from '../services/mapaService';
import { supabase, isSupabaseConfigured } from '../../../services/supabaseClient';
import { DIAS_ABANDONO } from '../config/mapa.config';

const Ctx = createContext(null);

const TABLAS_EN_VIVO = ['gm_clientes', 'gm_agenda', 'gm_leads'];
const ESPERA_RAFAGA_MS = 1200;

const hoyIso = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const sumarDias = (iso, n) => {
  const [a, m, d] = iso.split('-').map(Number);
  const f = new Date(a, m - 1, d + n);
  return `${f.getFullYear()}-${String(f.getMonth() + 1).padStart(2, '0')}-${String(f.getDate()).padStart(2, '0')}`;
};

/** Días desde una fecha ISO. Sin fecha devuelve null, que NO es lo mismo que 0. */
export const diasDesde = (iso) => {
  if (!iso) return null;
  const [a, m, d] = String(iso).split('-').map(Number);
  return Math.floor((Date.now() - new Date(a, m - 1, d).getTime()) / 86400000);
};

export function MapaProvider({ children }) {
  const [clientes, setClientes] = useState([]);
  const [compromisos, setCompromisos] = useState([]);
  const [sinCoordenadas, setSinCoordenadas] = useState(0);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [ultimoCambio, setUltimoCambio] = useState(null);

  const [seleccionado, setSeleccionado] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [estadosVisibles, setEstadosVisibles] = useState([]);  // vacío = todos
  const [rubrosVisibles, setRubrosVisibles] = useState([]);     // vacío = todos
  const [zonaActiva, setZonaActiva] = useState(null);

  const cargar = useCallback(async () => {
    setCargando(true);
    setError('');
    try {
      const hoy = hoyIso();
      const [cs, evs, sinCoord] = await Promise.all([
        listarClientes(),
        // Un mes hacia adelante y una semana hacia atrás: alcanza para las
        // cuatro ventanas de la agenda sin traer el año entero.
        listarCompromisos(sumarDias(hoy, -7), sumarDias(hoy, 40)),
        contarSinCoordenadas(),
      ]);
      setClientes(cs);
      setCompromisos(evs);
      setSinCoordenadas(sinCoord);
    } catch (e) {
      setError(e.message || 'No se pudo cargar el mapa.');
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
    const canal = supabase.channel('gm-modulo-mapa');
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

  // ------------------------------- derivados -------------------------------

  const porCodigo = useMemo(() => new Map(clientes.map((c) => [c.codigo, c])), [clientes]);

  /**
   * Los compromisos con coordenadas resueltas: las propias, o las del cliente.
   * Los que quedan sin ninguna se marcan `ubicable: false` en vez de tirarse,
   * para poder decir cuántos son.
   */
  const compromisosUbicados = useMemo(
    () =>
      compromisos.map((c) => {
        const cli = c.clienteCodigo ? porCodigo.get(c.clienteCodigo) : null;
        const lat = Number.isFinite(c.lat) ? c.lat : cli?.lat ?? null;
        const lng = Number.isFinite(c.lng) ? c.lng : cli?.lng ?? null;
        return {
          ...c,
          lat, lng,
          ubicable: Number.isFinite(lat) && Number.isFinite(lng),
          heredada: !Number.isFinite(c.lat) && Number.isFinite(lat),
          cli: cli || null,
          localidad: cli?.localidad || null,
        };
      }),
    [compromisos, porCodigo]
  );

  const clientesFiltrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    return clientes.filter((c) => {
      if (estadosVisibles.length && !estadosVisibles.includes(c.estado)) return false;
      if (rubrosVisibles.length && !rubrosVisibles.includes(c.rubro)) return false;
      if (zonaActiva && c.localidad !== zonaActiva) return false;
      if (!q) return true;
      return [c.nombre, c.titular, c.localidad, c.direccion, c.codigo, c.rubro]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q));
    });
  }, [clientes, busqueda, estadosVisibles, rubrosVisibles, zonaActiva]);

  /** Las zonas con lo que hace falta para saber cuál se está abandonando. */
  const zonas = useMemo(() => {
    const mapa = new Map();
    clientes.forEach((c) => {
      const z = c.localidad || 'Sin zona';
      if (!mapa.has(z)) mapa.set(z, { zona: z, clientes: [], monto: 0 });
      const g = mapa.get(z);
      g.clientes.push(c);
      g.monto += c.montoEnJuego;
    });
    return [...mapa.values()]
      .map((g) => {
        const visitas = g.clientes.map((c) => diasDesde(c.ultimaVisita)).filter((d) => d != null);
        // La zona se mide por su cliente MÁS OLVIDADO, no por el promedio: un
        // promedio bajo esconde al que hace tres meses que nadie visita.
        const masOlvidado = visitas.length ? Math.max(...visitas) : null;
        const nuncaVisitados = g.clientes.filter((c) => !c.ultimaVisita).length;
        return {
          ...g,
          total: g.clientes.length,
          enMora: g.clientes.filter((c) => c.estado === 'mora').length,
          conVenta: g.clientes.filter((c) => c.leadCodigo).length,
          masOlvidado,
          nuncaVisitados,
          abandonada: nuncaVisitados > 0 || (masOlvidado != null && masOlvidado >= DIAS_ABANDONO),
          compromisos: compromisosUbicados.filter((e) => e.localidad === g.zona).length,
        };
      })
      .sort((a, b) => b.monto - a.monto || b.total - a.total);
  }, [clientes, compromisosUbicados]);

  const rubros = useMemo(
    () => [...new Set(clientes.map((c) => c.rubro).filter(Boolean))].sort(),
    [clientes]
  );

  const toggle = (lista, set) => (id) =>
    set(lista.includes(id) ? lista.filter((x) => x !== id) : [...lista, id]);

  const limpiarFiltros = useCallback(() => {
    setBusqueda('');
    setEstadosVisibles([]);
    setRubrosVisibles([]);
    setZonaActiva(null);
  }, []);

  const hayFiltro =
    Boolean(busqueda.trim()) || estadosVisibles.length > 0 || rubrosVisibles.length > 0 || Boolean(zonaActiva);

  const valor = useMemo(
    () => ({
      clientes, clientesFiltrados, porCodigo, compromisos: compromisosUbicados, zonas, rubros,
      sinCoordenadas, cargando, error, ultimoCambio,
      seleccionado, setSeleccionado,
      busqueda, setBusqueda,
      estadosVisibles, toggleEstado: toggle(estadosVisibles, setEstadosVisibles),
      rubrosVisibles, toggleRubro: toggle(rubrosVisibles, setRubrosVisibles),
      zonaActiva, setZonaActiva,
      hayFiltro, limpiarFiltros, hoyIso, sumarDias,
      recargar: cargar,
    }),
    [
      clientes, clientesFiltrados, porCodigo, compromisosUbicados, zonas, rubros,
      sinCoordenadas, cargando, error, ultimoCambio, seleccionado, busqueda,
      estadosVisibles, rubrosVisibles, zonaActiva, hayFiltro, limpiarFiltros, cargar,
    ]
  );

  return <Ctx.Provider value={valor}>{children}</Ctx.Provider>;
}

export function useMapa() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useMapa debe usarse dentro de <MapaProvider>');
  return ctx;
}

export { hoyIso, sumarDias };
export default MapaProvider;
