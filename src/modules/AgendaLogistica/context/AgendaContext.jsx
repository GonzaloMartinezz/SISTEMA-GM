// ============================================================================
// SISTEMA GM · AGENDA INTELIGENTE · CONTEXTO
// ============================================================================

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  listarEventos,
  guardarEvento,
  actualizarEvento,
  eliminarEvento,
  cambiarEstadoEvento,
  HOY,
  MANANA,
} from '../../../shared/agenda/agendaService';

const AgendaContext = createContext(null);

export function AgendaProvider({ children }) {
  const [eventos, setEventos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [dia, setDia] = useState(HOY);

  useEffect(() => {
    let vivo = true;
    setCargando(true);
    listarEventos()
      .then((data) => vivo && setEventos(data))
      .finally(() => vivo && setCargando(false));
    return () => {
      vivo = false;
    };
  }, []);

  const delDia = useMemo(
    () => eventos.filter((e) => e.fecha === dia).sort((a, b) => a.hora.localeCompare(b.hora)),
    [eventos, dia]
  );

  const deManana = useMemo(
    () => eventos.filter((e) => e.fecha === MANANA).sort((a, b) => a.hora.localeCompare(b.hora)),
    [eventos]
  );

  const marcarEstado = useCallback(async (eventoId, estado) => {
    setEventos((prev) => prev.map((e) => (e.id === eventoId ? { ...e, estado } : e)));
    try {
      await cambiarEstadoEvento(eventoId, estado);
    } catch (err) {
      console.error('[Agenda] No se pudo actualizar el evento:', err.message);
    }
  }, []);

  const crearEvento = useCallback(async (evento) => {
    const guardado = await guardarEvento({ ...evento, estado: 'pendiente' });
    setEventos((prev) => [...prev, guardado]);
    return guardado;
  }, []);

  const editarEvento = useCallback(async (codigo, cambios) => {
    const actualizado = await actualizarEvento(codigo, cambios);
    setEventos((prev) => prev.map((e) => (e.id === codigo ? { ...e, ...actualizado } : e)));
    return actualizado;
  }, []);

  const borrarEvento = useCallback(async (codigo) => {
    await eliminarEvento(codigo);
    setEventos((prev) => prev.filter((e) => e.id !== codigo));
  }, []);

  const metricas = useMemo(() => {
    const visitas = delDia.filter((e) => e.tipo === 'visita').length;
    const llamadas = delDia.filter((e) => e.tipo === 'llamada').length;
    const cumplidos = delDia.filter((e) => e.estado === 'cumplido').length;
    const minutos = delDia.reduce((acc, e) => acc + (e.duracion || 0), 0);
    return { visitas, llamadas, cumplidos, total: delDia.length, minutos };
  }, [delDia]);

  const value = useMemo(
    () => ({
      eventos,
      delDia,
      deManana,
      dia,
      setDia,
      cargando,
      marcarEstado,
      crearEvento,
      editarEvento,
      borrarEvento,
      metricas,
      HOY,
      MANANA,
    }),
    [eventos, delDia, deManana, dia, cargando, marcarEstado, crearEvento, editarEvento, borrarEvento, metricas]
  );

  return <AgendaContext.Provider value={value}>{children}</AgendaContext.Provider>;
}

export function useAgenda() {
  const ctx = useContext(AgendaContext);
  if (!ctx) throw new Error('useAgenda debe usarse dentro de <AgendaProvider>.');
  return ctx;
}

export default AgendaContext;
