// ============================================================================
// SISTEMA GM · M-04 AGENDA INTELIGENTE · CONTEXTO DEL MÓDULO
// ----------------------------------------------------------------------------
// El estado que comparten las cuatro vistas: la fecha en la que estás parado,
// los compromisos del rango cargado y la bandeja de pendientes.
//
// La fecha es UNA sola para todo el módulo. Si cambiás de día en "Hoy" y pasás
// a "Semana", ves la semana de ESE día. La alternativa —una fecha por vista—
// hace que moverse entre secciones te haga perder el lugar, que es justo lo que
// una agenda no puede hacer.
//
// El rango de carga es el mes de la fecha ± una semana. Alcanza para las tres
// vistas de calendario sin volver a pedir nada al cambiar de sección, y evita
// traer un año entero para mostrar un día.
// ============================================================================

import React, {
  createContext, useCallback, useContext, useEffect, useMemo, useRef, useState,
} from 'react';
import {
  listarEventos, listarPendientes, crearEvento, actualizarEvento,
  cambiarEstado, reprogramar, eliminarEvento,
} from '../services/agendaService';
import { supabase, isSupabaseConfigured } from '../../../services/supabaseClient';
import {
  hoyIso, sumarDias, aFecha, aIso, porHora, cargaDelDia,
} from '../utils/calendario';

const Ctx = createContext(null);

const TABLAS_EN_VIVO = ['gm_agenda', 'gm_leads', 'gm_lead_etapas', 'gm_equipos'];
const ESPERA_RAFAGA_MS = 1200;

/** El mes de `iso` con una semana de margen a cada lado. */
function rangoDeCarga(iso) {
  const d = aFecha(iso);
  const primero = new Date(d.getFullYear(), d.getMonth(), 1);
  const ultimo = new Date(d.getFullYear(), d.getMonth() + 1, 0);
  return { desde: sumarDias(aIso(primero), -7), hasta: sumarDias(aIso(ultimo), 7) };
}

export function AgendaProvider({ children }) {
  const [fecha, setFecha] = useState(hoyIso);
  const [eventos, setEventos] = useState([]);
  const [pendientes, setPendientes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [ultimoCambio, setUltimoCambio] = useState(null);

  /** Qué tipos se están mostrando. Vacío nunca: siempre hay al menos uno. */
  const [tiposVisibles, setTiposVisibles] = useState(['visita', 'llamada', 'mensaje', 'mail', 'tarea']);
  const [ocultarCerrados, setOcultarCerrados] = useState(false);

  const rango = useMemo(() => rangoDeCarga(fecha), [fecha]);

  const cargar = useCallback(async () => {
    setCargando(true);
    setError('');
    try {
      const [evs, pend] = await Promise.all([
        listarEventos(rango.desde, rango.hasta),
        listarPendientes(),
      ]);
      setEventos(evs);
      setPendientes(pend);
    } catch (e) {
      setError(e.message || 'No se pudo cargar la agenda.');
    } finally {
      setCargando(false);
    }
  }, [rango.desde, rango.hasta]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  // ------------------------- cambios en vivo -------------------------------
  // La agenda escucha además las tablas que alimentan la bandeja: si en el
  // módulo 4 marcás un contacto, el pendiente de escribirle tiene que
  // desaparecer de acá sin que haya que recargar nada.
  const temporizador = useRef(null);

  useEffect(() => {
    if (!isSupabaseConfigured || typeof supabase.channel !== 'function') return undefined;

    const canal = supabase.channel('gm-modulo-agenda');
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

  const guardarEvento = useCallback(async (evento, esNuevo) => {
    if (esNuevo) await crearEvento(evento);
    else await actualizarEvento(evento.id, evento);
    await cargar();
  }, [cargar]);

  /** Cerrar o reabrir. Es lo que más se toca, así que se pinta primero. */
  const marcarEstado = useCallback(async (codigo, estado, resultado = null) => {
    setEventos((prev) =>
      prev.map((e) => (e.id === codigo ? { ...e, estado, resultado: resultado ?? e.resultado } : e))
    );
    try {
      await cambiarEstado(codigo, estado, resultado);
      // Reabrir o cerrar cambia la bandeja: un pendiente agendado que se
      // cancela vuelve a sugerirse.
      setPendientes(await listarPendientes());
    } catch (e) {
      setError(`No se pudo actualizar ${codigo}: ${e.message}`);
      await cargar();
    }
  }, [cargar]);

  const moverEvento = useCallback(async (codigo, nuevaFecha, hora) => {
    setEventos((prev) =>
      prev.map((e) => (e.id === codigo ? { ...e, fecha: nuevaFecha, hora: hora || e.hora } : e))
    );
    try {
      await reprogramar(codigo, nuevaFecha, hora);
    } catch (e) {
      setError(`No se pudo reprogramar ${codigo}: ${e.message}`);
      await cargar();
    }
  }, [cargar]);

  const borrarEvento = useCallback(async (codigo) => {
    await eliminarEvento(codigo);
    await cargar();
  }, [cargar]);

  /** Pasa una sugerencia de la bandeja al calendario, con su origen anotado. */
  const agendarPendiente = useCallback(async (evento) => {
    await crearEvento(evento);
    await cargar();
  }, [cargar]);

  const toggleTipo = useCallback((id) => {
    setTiposVisibles((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  }, []);

  const irA = useCallback((iso) => setFecha(iso), []);
  const irHoy = useCallback(() => setFecha(hoyIso()), []);

  // ------------------------------- derivados -------------------------------

  const visibles = useMemo(
    () =>
      eventos.filter((e) => {
        if (!tiposVisibles.includes(e.tipo)) return false;
        if (ocultarCerrados && e.estado !== 'pendiente') return false;
        return true;
      }),
    [eventos, tiposVisibles, ocultarCerrados]
  );

  /** Mapa fecha -> eventos ordenados por hora. Lo usan las tres vistas. */
  const porFecha = useMemo(() => {
    const mapa = new Map();
    visibles.forEach((e) => {
      if (!mapa.has(e.fecha)) mapa.set(e.fecha, []);
      mapa.get(e.fecha).push(e);
    });
    mapa.forEach((lista) => lista.sort(porHora));
    return mapa;
  }, [visibles]);

  const eventosDe = useCallback((iso) => porFecha.get(iso) || [], [porFecha]);

  const delDia = useMemo(() => eventosDe(fecha), [eventosDe, fecha]);
  const carga = useMemo(() => cargaDelDia(delDia), [delDia]);

  const valor = useMemo(
    () => ({
      fecha, setFecha, irA, irHoy,
      eventos, visibles, porFecha, eventosDe, delDia, carga,
      pendientes, cargando, error, ultimoCambio,
      tiposVisibles, toggleTipo, ocultarCerrados, setOcultarCerrados,
      recargar: cargar,
      guardarEvento, marcarEstado, moverEvento, borrarEvento, agendarPendiente,
    }),
    [
      fecha, irA, irHoy, eventos, visibles, porFecha, eventosDe, delDia, carga,
      pendientes, cargando, error, ultimoCambio, tiposVisibles, toggleTipo, ocultarCerrados,
      cargar, guardarEvento, marcarEstado, moverEvento, borrarEvento, agendarPendiente,
    ]
  );

  return <Ctx.Provider value={valor}>{children}</Ctx.Provider>;
}

export function useAgenda() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAgenda debe usarse dentro de <AgendaProvider>');
  return ctx;
}

export default AgendaProvider;
