// ============================================================================
// SISTEMA GM · M-01 CLIENTES · CONTEXTO DEL MÓDULO
// ----------------------------------------------------------------------------
// Carga una sola vez las cuatro fuentes del módulo (clientes, leads, mensajes y
// agenda) y las comparte con las cinco secciones. Cambiar de sección no vuelve
// a pegarle a la base: el módulo se siente instantáneo.
// Todo el ABM pasa por acá, así la tabla, la ficha y los indicadores se
// actualizan juntos sin recargar la página.
//
// Además escucha los cambios en vivo de Supabase (Realtime): si alguien edita
// una planilla de Drive o carga algo desde otra pantalla, el módulo se refresca
// solo, sin que haya que apretar Actualizar.
// ============================================================================

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  listarClientes,
  crearCliente,
  actualizarCliente,
  eliminarCliente,
} from '../../../shared/cuentas/cuentasService';
import { listarLeads } from '../../Seguimientos/services/leadsService';
import { listarEventos } from '../../../shared/agenda/agendaService';
import { listarMensajes } from '../services/mensajesService';
import { supabase, isSupabaseConfigured } from '../../../services/supabaseClient';

const Ctx = createContext(null);

/** Tablas que alimentan este módulo: si cambia alguna, hay que recargar. */
const TABLAS_EN_VIVO = ['gm_clientes', 'gm_leads', 'gm_mensajes', 'gm_agenda'];

/** Un alta masiva desde una planilla dispara muchos eventos seguidos: se
 *  espera a que pare la ráfaga y recién ahí se recarga una sola vez. */
const ESPERA_RAFAGA_MS = 1200;

export function ClientesProvider({ children }) {
  const [clientes, setClientes] = useState([]);
  const [leads, setLeads] = useState([]);
  const [mensajes, setMensajes] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  const cargar = useCallback(async () => {
    setCargando(true);
    setError('');
    try {
      const [cli, lea, men, eve] = await Promise.all([
        listarClientes(),
        listarLeads(),
        listarMensajes(),
        listarEventos(),
      ]);
      setClientes(cli);
      setLeads(lea);
      setMensajes(men);
      setEventos(eve);
    } catch (e) {
      setError(e.message || 'No se pudieron cargar los datos del módulo.');
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  // -------------------------------------------------------------------------
  // Cambios en vivo: lo que entra desde las planillas de Drive aparece solo
  // -------------------------------------------------------------------------
  const temporizador = useRef(null);
  const [ultimoCambio, setUltimoCambio] = useState(null);

  useEffect(() => {
    // Sin Supabase (o con un cliente sin Realtime) el módulo sigue andando:
    // simplemente se refresca con el botón Actualizar.
    if (!isSupabaseConfigured || typeof supabase.channel !== 'function') return undefined;

    const canal = supabase.channel('gm-modulo-clientes');

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
  // ABM · actualiza el estado local para no repetir la consulta completa
  // -------------------------------------------------------------------------

  const altaCliente = useCallback(async (datos) => {
    const nuevo = await crearCliente(datos);
    setClientes((prev) => [...prev, nuevo].sort((a, b) => (a.negocio || '').localeCompare(b.negocio || '')));
    return nuevo;
  }, []);

  const editarCliente = useCallback(async (id, datos) => {
    const actualizado = await actualizarCliente(id, datos);
    setClientes((prev) => prev.map((c) => (c.id === id ? actualizado : c)));
    return actualizado;
  }, []);

  const bajaCliente = useCallback(async (id) => {
    await eliminarCliente(id);
    setClientes((prev) => prev.filter((c) => c.id !== id));
    return true;
  }, []);

  // -------------------------------------------------------------------------
  // Derivados que usan varias secciones a la vez
  // -------------------------------------------------------------------------

  const porRubro = useMemo(() => {
    const mapa = new Map();
    clientes.forEach((c) => {
      const r = c.rubro || 'Sin rubro';
      mapa.set(r, (mapa.get(r) || 0) + 1);
    });
    return [...mapa.entries()].map(([rubro, cantidad]) => ({ rubro, cantidad }));
  }, [clientes]);

  const indiceClientes = useMemo(() => {
    const m = new Map();
    clientes.forEach((c) => m.set(c.id, c));
    return m;
  }, [clientes]);

  const valor = useMemo(
    () => ({
      clientes,
      leads,
      mensajes,
      eventos,
      cargando,
      error,
      porRubro,
      indiceClientes,
      ultimoCambio,
      recargar: cargar,
      altaCliente,
      editarCliente,
      bajaCliente,
    }),
    [
      clientes, leads, mensajes, eventos, cargando, error, ultimoCambio,
      porRubro, indiceClientes, cargar, altaCliente, editarCliente, bajaCliente,
    ]
  );

  return <Ctx.Provider value={valor}>{children}</Ctx.Provider>;
}

export function useClientes() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useClientes debe usarse dentro de <ClientesProvider>');
  return ctx;
}

export default ClientesProvider;
