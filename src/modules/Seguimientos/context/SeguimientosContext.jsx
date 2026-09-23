// ============================================================================
// SISTEMA GM · M-03 SEGUIMIENTOS · CONTEXTO DEL MÓDULO
// ----------------------------------------------------------------------------
// Un solo lugar donde viven los leads, el historial de etapas, los mensajes y
// las plantillas, más los filtros que comparten las cuatro secciones. Si el
// buscador estuviera en cada vista, buscar algo en el tablero y pasar a
// "Avances" te haría empezar de nuevo.
//
// Los filtros se aplican en dos niveles a propósito:
//   · búsqueda y prioridad recortan `leads` -> cambian las métricas
//   · las etapas visibles NO recortan `leads` -> ocultan columnas del tablero
// Ocultar la columna "Cerrado" es dejar de mirarla, no borrar esas ventas de la
// cartera.
// ============================================================================

import React, {
  createContext, useCallback, useContext, useEffect, useMemo, useRef, useState,
} from 'react';
import {
  listarLeads, listarHistorial, listarPlantillas, listarMensajesDeLeads,
  moverLead, crearLead, actualizarLead, eliminarLead,
  registrarInteraccion, marcarRespondido, guardarPlantilla, eliminarPlantilla,
} from '../services/leadsService';
import { supabase, isSupabaseConfigured } from '../../../services/supabaseClient';
import { ETAPAS, ETAPAS_ID, getEtapa, DIAS_FRIO } from '../config/pipeline.config';

const Ctx = createContext(null);

const TABLAS_EN_VIVO = ['gm_leads', 'gm_lead_etapas', 'gm_plantillas', 'gm_mensajes'];
const ESPERA_RAFAGA_MS = 1200;

export function SeguimientosProvider({ children }) {
  const [leads, setLeads] = useState([]);
  const [historial, setHistorial] = useState([]);
  const [plantillas, setPlantillas] = useState([]);
  const [mensajes, setMensajes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [ultimoCambio, setUltimoCambio] = useState(null);

  // -------------------------------- filtros --------------------------------
  const [busqueda, setBusqueda] = useState('');
  const [etapasVisibles, setEtapasVisibles] = useState(ETAPAS_ID);
  const [soloPrioridadAlta, setSoloPrioridadAlta] = useState(false);

  const cargar = useCallback(async () => {
    setCargando(true);
    setError('');
    try {
      const [ls, hs, ps, ms] = await Promise.all([
        listarLeads(), listarHistorial(), listarPlantillas(), listarMensajesDeLeads(),
      ]);
      setLeads(ls);
      setHistorial(hs);
      setPlantillas(ps);
      setMensajes(ms);
    } catch (e) {
      setError(e.message || 'No se pudieron cargar los seguimientos.');
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

    const canal = supabase.channel('gm-modulo-seguimientos');
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

  /** Mover de etapa es lo que más se hace: se pinta primero y se guarda después. */
  const cambiarEtapa = useCallback(async (codigo, etapaId) => {
    setLeads((prev) => prev.map((l) => (l.id === codigo ? { ...l, etapa: etapaId } : l)));
    try {
      await moverLead(codigo, etapaId);
      // El historial lo escribe un trigger, así que hay que volver a leerlo.
      setHistorial(await listarHistorial());
    } catch (e) {
      setError(`No se pudo mover ${codigo}: ${e.message}`);
      await cargar();
    }
  }, [cargar]);

  const marcarContacto = useCallback(async (codigo, datos) => {
    setLeads((prev) =>
      prev.map((l) =>
        l.id === codigo
          ? {
              ...l,
              diasSinContacto: 0,
              ultimoContacto: new Date().toLocaleDateString('es-AR'),
              interacciones: (l.interacciones || 0) + 1,
            }
          : l
      )
    );
    try {
      await registrarInteraccion(codigo, datos);
      setMensajes(await listarMensajesDeLeads());
    } catch (e) {
      setError(`No se pudo registrar el contacto con ${codigo}: ${e.message}`);
      await cargar(); // se revierte el optimista: si no se guardó, no hay que mostrarlo como guardado
    }
  }, [cargar]);

  /** Marca (o desmarca) un mensaje ya enviado como respondido por el lead. */
  const marcarMensajeRespondido = useCallback(async (mensajeId, valor) => {
    setMensajes((prev) => prev.map((m) => (m.id === mensajeId ? { ...m, respondido: valor } : m)));
    try {
      await marcarRespondido(mensajeId, valor);
    } catch (e) {
      setMensajes(await listarMensajesDeLeads()); // se revierte si falla
    }
  }, []);

  const guardarLead = useCallback(async (lead, esNuevo) => {
    if (esNuevo) await crearLead(lead);
    else await actualizarLead(lead.id, lead);
    await cargar();
  }, [cargar]);

  const borrarLead = useCallback(async (codigo) => {
    await eliminarLead(codigo);
    await cargar();
  }, [cargar]);

  const guardarUnaPlantilla = useCallback(async (p) => {
    await guardarPlantilla(p);
    setPlantillas(await listarPlantillas());
  }, []);

  const borrarUnaPlantilla = useCallback(async (codigo) => {
    await eliminarPlantilla(codigo);
    setPlantillas(await listarPlantillas());
  }, []);

  const toggleEtapa = useCallback((etapaId) => {
    setEtapasVisibles((prev) =>
      prev.includes(etapaId) ? prev.filter((e) => e !== etapaId) : [...prev, etapaId]
    );
  }, []);

  const limpiarFiltros = useCallback(() => {
    setBusqueda('');
    setEtapasVisibles(ETAPAS_ID);
    setSoloPrioridadAlta(false);
  }, []);

  // ------------------------------- derivados -------------------------------

  const leadsFiltrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    return leads.filter((l) => {
      if (soloPrioridadAlta && l.prioridad !== 'alta') return false;
      if (!q) return true;
      return [l.nombre, l.apellido, l.clinica, l.equipo, l.zona, l.id]
        .filter(Boolean)
        .some((campo) => String(campo).toLowerCase().includes(q));
    });
  }, [leads, busqueda, soloPrioridadAlta]);

  const metricas = useMemo(() => {
    const valor = leadsFiltrados.reduce((a, l) => a + Number(l.montoUsd || 0), 0);
    const ponderado = leadsFiltrados.reduce(
      (a, l) => a + (Number(l.montoUsd || 0) * (getEtapa(l.etapa)?.probabilidad || 0)) / 100,
      0
    );
    const abiertos = leadsFiltrados.filter((l) => l.etapa !== 'cerrado');
    return {
      total: leadsFiltrados.length,
      valor,
      ponderado,
      frios: leadsFiltrados.filter((l) => (l.diasSinContacto || 0) > DIAS_FRIO).length,
      abiertos: abiertos.length,
      cerrados: leadsFiltrados.length - abiertos.length,
      valorCerrado: leadsFiltrados
        .filter((l) => l.etapa === 'cerrado')
        .reduce((a, l) => a + Number(l.montoUsd || 0), 0),
    };
  }, [leadsFiltrados]);

  /** Mapa código -> lead, que usan mensajería y avances para no recorrer el array. */
  const porCodigo = useMemo(() => new Map(leads.map((l) => [l.id, l])), [leads]);

  const hayFiltro =
    Boolean(busqueda.trim()) || soloPrioridadAlta || etapasVisibles.length !== ETAPAS.length;

  const valor = useMemo(
    () => ({
      leads: leadsFiltrados, todos: leads, historial, plantillas, mensajes, porCodigo,
      cargando, error, ultimoCambio,
      busqueda, setBusqueda, etapasVisibles, toggleEtapa,
      soloPrioridadAlta, setSoloPrioridadAlta, limpiarFiltros, hayFiltro,
      metricas,
      recargar: cargar, cambiarEtapa, marcarContacto, marcarMensajeRespondido,
      guardarLead, borrarLead, guardarUnaPlantilla, borrarUnaPlantilla,
    }),
    [
      leadsFiltrados, leads, historial, plantillas, mensajes, porCodigo,
      cargando, error, ultimoCambio, busqueda, etapasVisibles,
      soloPrioridadAlta, limpiarFiltros, hayFiltro, metricas,
      cargar, cambiarEtapa, marcarContacto, marcarMensajeRespondido, guardarLead, borrarLead,
      guardarUnaPlantilla, borrarUnaPlantilla, toggleEtapa,
    ]
  );

  return <Ctx.Provider value={valor}>{children}</Ctx.Provider>;
}

export function useSeguimientos() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useSeguimientos debe usarse dentro de <SeguimientosProvider>');
  return ctx;
}

export default SeguimientosProvider;
