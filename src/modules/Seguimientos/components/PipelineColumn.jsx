// ============================================================================
// SISTEMA GM · SEGUIMIENTOS · COLUMNA DEL TABLERO
// ============================================================================

import React, { useState } from 'react';
import LeadCard from './LeadCard';

export default function PipelineColumn({
  etapa,
  leads,
  onDrop,
  onDragStart,
  onEnviarMensaje,
  onMarcarContacto,
}) {
  const [encima, setEncima] = useState(false);

  const valor = leads.reduce((acc, l) => acc + Number(l.montoUsd || 0), 0);

  return (
    <section
      onDragOver={(e) => {
        e.preventDefault();
        setEncima(true);
      }}
      onDragLeave={() => setEncima(false)}
      onDrop={(e) => {
        e.preventDefault();
        setEncima(false);
        onDrop(e, etapa.id);
      }}
      className={`flex min-h-0 w-[280px] shrink-0 flex-col rounded-lg border transition-colors ${
        encima ? `${etapa.borde} ${etapa.fondo}` : 'border-gray-800 bg-gray-950/60'
      }`}
    >
      {/* Encabezado de etapa */}
      <header className="shrink-0 border-b border-gray-800 px-3 py-2">
        <div className="flex items-center justify-between gap-2">
          <h3
            className={`font-mono text-[11px] font-bold uppercase tracking-[0.15em] ${etapa.color}`}
          >
            {etapa.label}
          </h3>
          <span className="rounded bg-black/50 px-1.5 py-0.5 font-mono text-[10px] font-bold text-gray-400">
            {leads.length}
          </span>
        </div>
        <div className="mt-1.5 flex items-center justify-between gap-2">
          <span className="font-mono text-[9px] uppercase tracking-wider text-gray-600">
            {etapa.probabilidad}% prob.
          </span>
          <span className="font-mono text-[10px] font-bold text-gray-400">
            US$ {valor.toLocaleString('es-AR')}
          </span>
        </div>
        <div className="mt-1.5 h-0.5 w-full overflow-hidden rounded-full bg-gray-800">
          <div className={`h-full ${etapa.barra}`} style={{ width: `${etapa.probabilidad}%` }} />
        </div>
      </header>

      {/* Tarjetas */}
      <div className="min-h-0 flex-1 space-y-2 overflow-y-auto p-2">
        {leads.map((lead) => (
          <LeadCard
            key={lead.id}
            lead={lead}
            onDragStart={onDragStart}
            onEnviarMensaje={onEnviarMensaje}
            onMarcarContacto={onMarcarContacto}
          />
        ))}

        {!leads.length && (
          <div className="flex h-24 items-center justify-center rounded border border-dashed border-gray-800 font-mono text-[9px] uppercase tracking-[0.2em] text-gray-700">
            Soltá un lead acá
          </div>
        )}
      </div>
    </section>
  );
}
