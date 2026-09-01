// ============================================================================
// SISTEMA GM · SEGUIMIENTOS · CONTEXTO DEL PIPELINE
// ============================================================================

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { listarLeads, moverLead, registrarInteraccion } from '../services/leadsService';
import { ETAPAS } from '../config/pipeline.config';

const PipelineContext = createContext(null);

export function PipelineProvider({ children }) {
  const [leads, setLeads] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [etapasVisibles, setEtapasVisibles] = useState(() => ETAPAS.map((e) => e.id));
  const [soloPrioridadAlta, setSoloPrioridadAlta] = useState(false);

  useEffect(() => {
    let vivo = true;
    listarLeads()
      .then((data) => vivo && setLeads(data))
      .finally(() => vivo && setCargando(false));
    return () => {
      vivo = false;
    };
  }, []);

  const cambiarEtapa = useCallback(async (leadId, etapaId) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, etapa: etapaId } : l))
    );
    try {
      await moverLead(leadId, etapaId);
    } catch (err) {
      console.error('[Pipeline] No se pudo mover el lead:', err.message);
    }
  }, []);

  const marcarContacto = useCallback(async (leadId, canal) => {
    const hoy = new Date().toLocaleDateString('es-AR');
    setLeads((prev) =>
      prev.map((l) =>
        l.id === leadId
          ? {
              ...l,
              diasSinContacto: 0,
              ultimoContacto: hoy,
              interacciones: (l.interacciones || 0) + 1,
            }
          : l
      )
    );
    registrarInteraccion(leadId, canal);
  }, []);

  const toggleEtapa = useCallback((etapaId) => {
    setEtapasVisibles((prev) =>
      prev.includes(etapaId) ? prev.filter((e) => e !== etapaId) : [...prev, etapaId]
    );
  }, []);

  const leadsFiltrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    return leads.filter((l) => {
      if (soloPrioridadAlta && l.prioridad !== 'alta') return false;
      if (!q) return true;
      return [l.nombre, l.apellido, l.clinica, l.equipo, l.zona]
        .filter(Boolean)
        .some((campo) => campo.toLowerCase().includes(q));
    });
  }, [leads, busqueda, soloPrioridadAlta]);

  const metricas = useMemo(() => {
    const total = leadsFiltrados.length;
    const valor = leadsFiltrados.reduce((acc, l) => acc + Number(l.montoUsd || 0), 0);
    const ponderado = leadsFiltrados.reduce((acc, l) => {
      const etapa = ETAPAS.find((e) => e.id === l.etapa);
      return acc + (Number(l.montoUsd || 0) * (etapa?.probabilidad || 0)) / 100;
    }, 0);
    const frios = leadsFiltrados.filter((l) => (l.diasSinContacto || 0) > 7).length;
    return { total, valor, ponderado, frios };
  }, [leadsFiltrados]);

  const value = useMemo(
    () => ({
      leads: leadsFiltrados,
      todos: leads,
      cargando,
      busqueda,
      setBusqueda,
      etapasVisibles,
      toggleEtapa,
      soloPrioridadAlta,
      setSoloPrioridadAlta,
      cambiarEtapa,
      marcarContacto,
      metricas,
    }),
    [
      leadsFiltrados,
      leads,
      cargando,
      busqueda,
      etapasVisibles,
      toggleEtapa,
      soloPrioridadAlta,
      cambiarEtapa,
      marcarContacto,
      metricas,
    ]
  );

  return <PipelineContext.Provider value={value}>{children}</PipelineContext.Provider>;
}

export function usePipeline() {
  const ctx = useContext(PipelineContext);
  if (!ctx) throw new Error('usePipeline debe usarse dentro de <PipelineProvider>.');
  return ctx;
}

export default PipelineContext;
