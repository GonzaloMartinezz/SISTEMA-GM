// ============================================================================
// SISTEMA GM · MÓDULO 4 · SEGUIMIENTOS (Fase 3)
// ----------------------------------------------------------------------------
// Tablero Kanban de conversión: filtros por nivel de proceso, marcadores de
// avance, arrastre entre etapas y acción inmediata por WhatsApp / mail.
// ============================================================================

import React, { useMemo, useState } from 'react';
import { Loader2 } from 'lucide-react';

import { PipelineProvider, usePipeline } from '../context/PipelineContext';
import { ETAPAS } from '../config/pipeline.config';
import PipelineToolbar from '../components/PipelineToolbar';
import PipelineColumn from '../components/PipelineColumn';
import EnviarMensajeModal from '../components/EnviarMensajeModal';

function Tablero() {
  const { leads, cargando, etapasVisibles, cambiarEtapa, marcarContacto } = usePipeline();
  const [mensaje, setMensaje] = useState(null); // { lead, canal }

  const columnas = useMemo(
    () => ETAPAS.filter((e) => etapasVisibles.includes(e.id)),
    [etapasVisibles]
  );

  const porEtapa = useMemo(() => {
    const mapa = {};
    ETAPAS.forEach((e) => {
      mapa[e.id] = [];
    });
    leads.forEach((l) => {
      if (mapa[l.etapa]) mapa[l.etapa].push(l);
    });
    return mapa;
  }, [leads]);

  const onDragStart = (e, leadId) => {
    e.dataTransfer.setData('text/plain', leadId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const onDrop = (e, etapaId) => {
    const leadId = e.dataTransfer.getData('text/plain');
    if (leadId) cambiarEtapa(leadId, etapaId);
  };

  if (cargando) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-emerald-400" />
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-gray-500">
            Cargando pipeline
          </span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex min-h-0 flex-1 gap-2.5 overflow-x-auto p-2.5 md:p-3">
        {columnas.map((etapa) => (
          <PipelineColumn
            key={etapa.id}
            etapa={etapa}
            leads={porEtapa[etapa.id] || []}
            onDrop={onDrop}
            onDragStart={onDragStart}
            onEnviarMensaje={(lead, canal) => setMensaje({ lead, canal })}
            onMarcarContacto={marcarContacto}
          />
        ))}

        {!columnas.length && (
          <div className="flex flex-1 items-center justify-center font-mono text-[11px] uppercase tracking-[0.2em] text-gray-700">
            No hay etapas seleccionadas
          </div>
        )}
      </div>

      {mensaje && (
        <EnviarMensajeModal
          lead={mensaje.lead}
          canalInicial={mensaje.canal}
          onCerrar={() => setMensaje(null)}
          onEnviado={marcarContacto}
        />
      )}
    </>
  );
}

export default function SeguimientosDashboard() {
  return (
    <div className="flex h-screen min-h-screen flex-col bg-gray-950 font-sans">
      <PipelineProvider>
        <PipelineToolbar />
        <Tablero />
      </PipelineProvider>
    </div>
  );
}
