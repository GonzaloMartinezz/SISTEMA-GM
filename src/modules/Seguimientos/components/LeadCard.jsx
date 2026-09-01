// ============================================================================
// SISTEMA GM · SEGUIMIENTOS · TARJETA DE LEAD
// ----------------------------------------------------------------------------
// Marcadores visuales de avance + acción inmediata (WhatsApp / Mail / Llamar).
// ============================================================================

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, Mail, Phone, ScanFace, Flame, Clock } from 'lucide-react';
import { getTemperatura, PRIORIDADES, getEtapa } from '../config/pipeline.config';
import { linkTelefono } from '../utils/contacto';

export default function LeadCard({ lead, onEnviarMensaje, onMarcarContacto, onDragStart }) {
  const navigate = useNavigate();
  const temp = getTemperatura(lead.diasSinContacto);
  const prioridad = PRIORIDADES[lead.prioridad] || PRIORIDADES.baja;
  const etapa = getEtapa(lead.etapa);
  const tel = linkTelefono(lead);

  const abrirFicha = (e) => {
    e.stopPropagation();
    navigate(`/notario-360/ficha/${lead.cuentaId}`);
  };

  return (
    <article
      draggable
      onDragStart={(e) => onDragStart(e, lead.id)}
      className="group cursor-grab rounded-lg border border-gray-800 bg-gray-900/80 p-3 transition-all hover:border-gray-600 hover:bg-gray-900 active:cursor-grabbing"
    >
      {/* Encabezado */}
      <div className="mb-2 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h4 className="truncate text-sm font-bold text-white">
            {lead.apellido}, {lead.nombre}
          </h4>
          <p className="truncate font-mono text-[10px] uppercase tracking-wider text-gray-500">
            {lead.clinica}
          </p>
        </div>
        <span
          className={`shrink-0 rounded border px-1.5 py-0.5 font-mono text-[8px] font-bold uppercase tracking-widest ${prioridad.fondo} ${prioridad.color}`}
        >
          {prioridad.label}
        </span>
      </div>

      {/* Equipo y monto */}
      <div className="mb-2.5 rounded border border-gray-800 bg-black/40 px-2 py-1.5">
        <p className="truncate text-[11px] text-gray-300">{lead.equipo}</p>
        <p className={`mt-0.5 font-mono text-xs font-bold ${etapa.color}`}>
          US$ {Number(lead.montoUsd || 0).toLocaleString('es-AR')}
        </p>
      </div>

      {/* Marcadores de avance */}
      <div className="mb-2.5 flex items-center justify-between gap-2 font-mono text-[9px] uppercase tracking-wider">
        <span className={`inline-flex items-center gap-1.5 ${temp.color}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${temp.punto}`} />
          {lead.diasSinContacto}d · {temp.label}
        </span>
        <span className="inline-flex items-center gap-1 text-gray-600">
          <Flame className="h-3 w-3" />
          {lead.interacciones} int.
        </span>
      </div>

      {/* Próximo paso */}
      <p className="mb-2.5 flex items-start gap-1.5 rounded border border-gray-800/70 bg-gray-950/60 px-2 py-1.5 text-[10px] leading-snug text-gray-400">
        <Clock className="mt-0.5 h-3 w-3 shrink-0 text-gray-600" />
        <span className="line-clamp-2">{lead.proximoPaso}</span>
      </p>

      {/* Acción inmediata */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onEnviarMensaje(lead, 'whatsapp');
          }}
          title="Enviar WhatsApp"
          className="flex flex-1 items-center justify-center gap-1 rounded border border-emerald-600/40 bg-emerald-500/10 py-1.5 font-mono text-[9px] font-bold uppercase tracking-widest text-emerald-400 transition-colors hover:bg-emerald-500/20"
        >
          <MessageCircle className="h-3 w-3" />
          WA
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onEnviarMensaje(lead, 'email');
          }}
          title="Enviar email"
          disabled={!lead.email}
          className="flex flex-1 items-center justify-center gap-1 rounded border border-sky-600/40 bg-sky-500/10 py-1.5 font-mono text-[9px] font-bold uppercase tracking-widest text-sky-400 transition-colors hover:bg-sky-500/20 disabled:opacity-30"
        >
          <Mail className="h-3 w-3" />
          Mail
        </button>

        <a
          href={tel || undefined}
          onClick={(e) => {
            e.stopPropagation();
            if (tel) onMarcarContacto(lead.id, 'Llamada');
          }}
          title="Llamar"
          className={`flex items-center justify-center rounded border border-gray-700 px-2 py-1.5 text-gray-400 transition-colors hover:border-gray-500 hover:text-white ${
            tel ? '' : 'pointer-events-none opacity-30'
          }`}
        >
          <Phone className="h-3 w-3" />
        </a>

        {lead.cuentaId && (
          <button
            type="button"
            onClick={abrirFicha}
            title="Abrir Ficha 360°"
            className="flex items-center justify-center rounded border border-gray-700 px-2 py-1.5 text-gray-400 transition-colors hover:border-cyan-500/50 hover:text-cyan-400"
          >
            <ScanFace className="h-3 w-3" />
          </button>
        )}
      </div>
    </article>
  );
}
