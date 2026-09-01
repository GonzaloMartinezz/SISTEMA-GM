// ============================================================================
// SISTEMA GM · MÓDULO 7 · MAPA Y LOGÍSTICA (Fase 4)
// ----------------------------------------------------------------------------
// Geolocalización de la cartera, marcadores inteligentes por estado y ruteo
// automático cruzado con los horarios de la Agenda.
// ============================================================================

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Loader2 } from 'lucide-react';

import { listarClientesGeo, listarEventos, HOY } from '../../../shared/agenda/agendaService';
import { BASE_OPERATIVA } from '../../../shared/agenda/agendaDemo';
import { optimizarRuta, rutaCronologica } from '../../../shared/geo/ruteo';
import { ESTADOS_CLIENTE, ESPECIALIDADES } from '../config/mapa.config';

import FiltrosMapa from '../components/FiltrosMapa';
import MapaClientes from '../components/MapaClientes';
import PanelRuta from '../components/PanelRuta';

export default function MapaLogisticaDashboard() {
  const [clientes, setClientes] = useState([]);
  const [visitas, setVisitas] = useState([]);
  const [cargando, setCargando] = useState(true);

  const [busqueda, setBusqueda] = useState('');
  const [estados, setEstados] = useState(() => Object.keys(ESTADOS_CLIENTE));
  const [especialidades, setEspecialidades] = useState(() => [...ESPECIALIDADES]);
  const [mostrarRuta, setMostrarRuta] = useState(true);
  const [seleccionado, setSeleccionado] = useState(null);

  useEffect(() => {
    let vivo = true;
    Promise.all([listarClientesGeo(), listarEventos(HOY)])
      .then(([geo, eventos]) => {
        if (!vivo) return;
        setClientes(geo);
        setVisitas(eventos.filter((e) => e.tipo === 'visita' && e.estado !== 'cancelado'));
      })
      .finally(() => vivo && setCargando(false));
    return () => {
      vivo = false;
    };
  }, []);

  const toggleEstado = useCallback(
    (id) =>
      setEstados((prev) => (prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id])),
    []
  );

  const toggleEspecialidad = useCallback(
    (esp) =>
      setEspecialidades((prev) =>
        prev.includes(esp) ? prev.filter((e) => e !== esp) : [...prev, esp]
      ),
    []
  );

  const visibles = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    return clientes.filter((c) => {
      if (!estados.includes(c.estado)) return false;
      if (!especialidades.includes(c.especialidad)) return false;
      if (!q) return true;
      return [c.nombre, c.clinica, c.zona].some((campo) =>
        String(campo).toLowerCase().includes(q)
      );
    });
  }, [clientes, estados, especialidades, busqueda]);

  const ruta = useMemo(
    () => (mostrarRuta ? optimizarRuta(BASE_OPERATIVA, visitas) : { orden: [], totalKm: 0 }),
    [visitas, mostrarRuta]
  );

  const ahorro = useMemo(() => {
    if (!mostrarRuta || !visitas.length) return 0;
    return rutaCronologica(BASE_OPERATIVA, visitas).totalKm - ruta.totalKm;
  }, [visitas, ruta, mostrarRuta]);

  if (cargando) {
    return (
      <div className="flex h-screen min-h-screen items-center justify-center bg-gray-950">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-orange-400" />
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-gray-500">
            Cargando geolocalización
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen min-h-screen flex-col bg-gray-950 font-sans">
      <FiltrosMapa
        busqueda={busqueda}
        setBusqueda={setBusqueda}
        estados={estados}
        toggleEstado={toggleEstado}
        especialidades={especialidades}
        toggleEspecialidad={toggleEspecialidad}
        mostrarRuta={mostrarRuta}
        setMostrarRuta={setMostrarRuta}
        totalVisibles={visibles.length}
        totalClientes={clientes.length}
      />

      <div className="grid min-h-0 flex-1 grid-cols-1 gap-3 overflow-hidden p-3 lg:grid-cols-[1fr_minmax(300px,32%)]">
        <MapaClientes
          clientes={visibles}
          ruta={ruta.orden}
          seleccionado={seleccionado}
          onSeleccionar={setSeleccionado}
        />

        <div className="min-h-0 overflow-y-auto pr-1">
          <PanelRuta ruta={ruta} ahorro={ahorro} seleccionado={seleccionado} />
        </div>
      </div>
    </div>
  );
}
