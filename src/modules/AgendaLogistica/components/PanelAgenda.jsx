// ============================================================================
// SISTEMA GM · AGENDA INTELIGENTE · TABLERO DIARIO
// ----------------------------------------------------------------------------
// Visitas programadas y llamadas agendadas, en línea de tiempo.
// ============================================================================

import React from 'react';
import {
  MapPin,
  Phone,
  Check,
  X,
  CalendarPlus,
  Clock,
  ExternalLink,
  Pencil,
  Trash2,
} from 'lucide-react';
import PanelTerminal, { SinDatos } from '../../../shared/ui/PanelTerminal';
import { linkGoogleCalendar } from '../../../shared/agenda/agendaService';
import { useAgenda } from '../context/AgendaContext';

const ESTADOS = {
  pendiente: { label: 'Pendiente', color: 'text-gray-400', punto: 'bg-gray-500' },
  cumplido: { label: 'Cumplido', color: 'text-emerald-400', punto: 'bg-emerald-400' },
  cancelado: { label: 'Cancelado', color: 'text-rose-400', punto: 'bg-rose-400' },
};

const PRIORIDAD = {
  alta: 'border-rose-500/40 text-rose-400',
  media: 'border-amber-500/40 text-amber-400',
  baja: 'border-gray-700 text-gray-500',
};

export default function PanelAgenda({ onNuevoEvento, onEditarEvento, onEliminarEvento }) {
  const { delDia, marcarEstado, metricas } = useAgenda();

  return (
    <PanelTerminal
      titulo="Tablero del día"
      className="min-h-0 flex-1"
      acciones={
        <div className="flex items-center gap-3">
          <span className="hidden font-mono text-[9px] uppercase tracking-[0.15em] text-gray-600 sm:inline">
            {metricas.visitas} visitas · {metricas.llamadas} llamadas ·{' '}
            {Math.round(metricas.minutos / 60)}h
          </span>
          <button
            type="button"
            onClick={onNuevoEvento}
            className="inline-flex items-center gap-1 font-mono text-[9px] uppercase tracking-[0.15em] text-gray-500 transition-colors hover:text-teal-400"
          >
            <CalendarPlus className="h-3 w-3" />
            Nuevo
          </button>
        </div>
      }
    >
      {delDia.length ? (
        <ul className="divide-y divide-gray-800">
          {delDia.map((ev) => {
            const estado = ESTADOS[ev.estado] || ESTADOS.pendiente;
            const Icono = ev.tipo === 'visita' ? MapPin : Phone;
            const cerrado = ev.estado !== 'pendiente';

            return (
              <li
                key={ev.id}
                className={`flex gap-3 p-3 transition-colors hover:bg-gray-900/60 ${cerrado ? 'opacity-60' : ''}`}
              >
                {/* Hora */}
                <div className="w-14 shrink-0 text-right">
                  <p className="font-mono text-sm font-bold tabular-nums text-white">{ev.hora}</p>
                  <p className="font-mono text-[9px] uppercase tracking-wider text-gray-600">
                    {ev.duracion}′
                  </p>
                </div>

                {/* Línea de tiempo */}
                <div className="flex w-4 shrink-0 flex-col items-center">
                  <span className={`mt-1.5 h-2 w-2 rounded-full ${estado.punto}`} />
                  <span className="mt-1 w-px flex-1 bg-gray-800" />
                </div>

                {/* Contenido */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p
                        className={`truncate text-sm font-semibold text-gray-100 ${cerrado ? 'line-through' : ''}`}
                      >
                        {ev.titulo}
                      </p>
                      <p className="truncate font-mono text-[10px] uppercase tracking-wider text-gray-500">
                        {ev.cliente}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 rounded border px-1.5 py-0.5 font-mono text-[8px] font-bold uppercase tracking-widest ${PRIORIDAD[ev.prioridad] || PRIORIDAD.baja}`}
                    >
                      {ev.prioridad}
                    </span>
                  </div>

                  <p className="mt-1 flex items-center gap-1.5 font-mono text-[10px] text-gray-500">
                    <Icono className="h-3 w-3 shrink-0 text-gray-600" />
                    <span className="truncate">{ev.direccion}</span>
                  </p>

                  {ev.nota && (
                    <p className="mt-1.5 rounded border border-gray-800 bg-gray-950/60 px-2 py-1 text-[10px] leading-snug text-gray-400">
                      {ev.nota}
                    </p>
                  )}

                  {/* Acciones */}
                  <div className="mt-2 flex flex-wrap items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => marcarEstado(ev.id, cerrado ? 'pendiente' : 'cumplido')}
                      className={`inline-flex items-center gap-1 rounded border px-2 py-1 font-mono text-[9px] font-bold uppercase tracking-widest transition-colors ${
                        ev.estado === 'cumplido'
                          ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400'
                          : 'border-gray-700 text-gray-400 hover:border-emerald-500/50 hover:text-emerald-400'
                      }`}
                    >
                      <Check className="h-3 w-3" />
                      Cumplido
                    </button>

                    <button
                      type="button"
                      onClick={() => marcarEstado(ev.id, 'cancelado')}
                      className="inline-flex items-center gap-1 rounded border border-gray-700 px-2 py-1 font-mono text-[9px] font-bold uppercase tracking-widest text-gray-500 transition-colors hover:border-rose-500/50 hover:text-rose-400"
                    >
                      <X className="h-3 w-3" />
                      Cancelar
                    </button>

                    <a
                      href={linkGoogleCalendar(ev)}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 rounded border border-gray-700 px-2 py-1 font-mono text-[9px] font-bold uppercase tracking-widest text-gray-500 transition-colors hover:border-teal-500/50 hover:text-teal-400"
                    >
                      <ExternalLink className="h-3 w-3" />
                      Calendar
                    </a>

                    {onEditarEvento && (
                      <button
                        type="button"
                        onClick={() => onEditarEvento(ev)}
                        title="Editar"
                        className="inline-flex items-center gap-1 rounded border border-gray-700 px-2 py-1 font-mono text-[9px] font-bold uppercase tracking-widest text-gray-500 transition-colors hover:border-cyan-500/50 hover:text-cyan-400"
                      >
                        <Pencil className="h-3 w-3" />
                      </button>
                    )}

                    {onEliminarEvento && (
                      <button
                        type="button"
                        onClick={() => onEliminarEvento(ev)}
                        title="Eliminar"
                        className="inline-flex items-center gap-1 rounded border border-gray-700 px-2 py-1 font-mono text-[9px] font-bold uppercase tracking-widest text-gray-500 transition-colors hover:border-rose-500/50 hover:text-rose-400"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    )}

                    <span
                      className={`ml-auto inline-flex items-center gap-1 font-mono text-[9px] uppercase tracking-widest ${estado.color}`}
                    >
                      <Clock className="h-3 w-3" />
                      {estado.label}
                    </span>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <SinDatos mensaje="No hay compromisos para este día" />
      )}
    </PanelTerminal>
  );
}
