// ============================================================================
// SISTEMA GM · MÓDULO 5 · AGENDA INTELIGENTE (Fase 4)
// ----------------------------------------------------------------------------
// Tablero diario de visitas y llamadas, alertas tempranas para preparar el día
// siguiente y sincronización con Google Calendar.
// ============================================================================

import React, { useState } from 'react';
import { Loader2, Download, CalendarDays } from 'lucide-react';

import { AgendaProvider, useAgenda } from '../context/AgendaContext';
import { generarICS } from '../../../shared/agenda/agendaService';
import PanelAgenda from '../components/PanelAgenda';
import AlertasTempranas from '../components/AlertasTempranas';
import PanelMapaRutas from '../components/PanelMapaRutas';
import NuevoEventoModal from '../components/NuevoEventoModal';

const formatoDia = (iso) => {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('es-AR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
  });
};

function Jornada() {
  const { dia, setDia, HOY, MANANA, cargando, metricas, delDia, crearEvento } = useAgenda();
  const [modal, setModal] = useState(false);

  if (cargando) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-teal-400" />
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-gray-500">
            Cargando agenda
          </span>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Barra de jornada */}
      <div className="flex shrink-0 flex-wrap items-center gap-2 border-b border-gray-800 bg-gray-950/80 px-3 py-2.5 md:px-4">
        <div className="flex items-center gap-1">
          {[
            { id: HOY, label: 'Hoy' },
            { id: MANANA, label: 'Mañana' },
          ].map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => setDia(d.id)}
              className={`rounded-md border px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.15em] transition-colors ${
                dia === d.id
                  ? 'border-teal-500/50 bg-teal-500/10 text-teal-400'
                  : 'border-gray-800 text-gray-500 hover:text-gray-300'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>

        <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.15em] text-gray-500">
          <CalendarDays className="h-3.5 w-3.5 text-gray-600" />
          {formatoDia(dia)}
        </span>

        <span className="ml-auto flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.15em] text-gray-500">
          <span>
            <b className="text-gray-200">{metricas.cumplidos}</b>/{metricas.total} cerrados
          </span>
          <button
            type="button"
            onClick={() => generarICS(delDia, `agenda-${dia}.ics`)}
            disabled={!delDia.length}
            className="inline-flex items-center gap-1 rounded border border-gray-800 px-2 py-1 transition-colors hover:border-teal-500/40 hover:text-teal-400 disabled:opacity-30"
          >
            <Download className="h-3 w-3" />
            Exportar .ics
          </button>
        </span>
      </div>

      {/* Split: tablero | preparación */}
      <div className="grid min-h-0 flex-1 grid-cols-1 gap-3 overflow-hidden p-3 lg:grid-cols-[1fr_minmax(300px,34%)]">
        <div className="flex min-h-0 flex-col overflow-hidden">
          <PanelAgenda onNuevoEvento={() => setModal(true)} />
        </div>

        <div className="min-h-0 space-y-3 overflow-y-auto pr-1">
          <AlertasTempranas />
          <PanelMapaRutas />
        </div>
      </div>

      <NuevoEventoModal
        abierto={modal}
        diaPorDefecto={dia}
        onCerrar={() => setModal(false)}
        onGuardar={crearEvento}
      />
    </>
  );
}

export default function AgendaLogisticaDashboard() {
  return (
    <div className="flex h-screen min-h-screen flex-col bg-gray-950 font-sans">
      <AgendaProvider>
        <Jornada />
      </AgendaProvider>
    </div>
  );
}
