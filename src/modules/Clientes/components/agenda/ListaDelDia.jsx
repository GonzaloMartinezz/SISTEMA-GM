// ============================================================================
// SISTEMA GM · M-01 CLIENTES · JORNADA DEL DÍA
// ----------------------------------------------------------------------------
// Los eventos del día elegido en orden cronológico, con la hora grande a la
// izquierda. Cada tarjeta ofrece marcar como realizado y saltar a Google
// Calendar sin salir del panel.
// ============================================================================

import React from 'react';
import { CalendarCheck, CalendarPlus, Check, MapPin, Pencil, Phone, Trash2, Video } from 'lucide-react';
import Chip from '../../../../shared/gm-ui/Chip';
import EstadoVacio from '../../../../shared/gm-ui/EstadoVacio';
import { linkGoogleCalendar } from '../../../../shared/agenda/agendaService';

const ICONO_TIPO = { visita: MapPin, llamada: Phone, reunion: Video };
const TONO_ESTADO = { realizado: 'aqua', pendiente: 'amarillo', cancelado: 'gris' };

export default function ListaDelDia({ eventos = [], onMarcarRealizado, onEditar, onEliminar }) {
  if (!eventos.length) {
    return (
      <EstadoVacio
        icono={CalendarCheck}
        titulo="Día libre"
        texto="No hay visitas ni llamadas agendadas para esta fecha."
      />
    );
  }

  const ordenados = [...eventos].sort((a, b) => (a.hora || '').localeCompare(b.hora || ''));

  return (
    <ul className="space-y-3">
      {ordenados.map((e) => {
        const Icono = ICONO_TIPO[e.tipo] || CalendarCheck;
        const hecho = e.estado === 'realizado';

        return (
          <li
            key={e.id}
            className="flex gap-4 rounded-2xl border border-[#EFE7DB] p-4 transition hover:border-[#D5CABA]"
          >
            <div className="w-14 shrink-0 border-r border-[var(--gm-borde-fuerte)] dark:border-[#333333] pr-3 text-center">
              <p className="text-[18px] font-semibold leading-none text-[#2A2118] dark:text-[#F9FAFB]">{e.hora}</p>
              <p className="mt-1.5 text-[11px] text-[var(--gm-texto-medio)] dark:text-[#6B7280]">{e.duracion || 30}'</p>
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="truncate text-[14px] font-medium text-[#2A2118] dark:text-[#F9FAFB]">{e.titulo}</p>
                <Chip tono={TONO_ESTADO[e.estado] || 'gris'}>{e.estado}</Chip>
              </div>
              <p className="mt-1 flex items-center gap-1.5 truncate text-[13px] text-[#6E6559] dark:text-[#9CA3AF]">
                <Icono size={13} className="shrink-0 text-[var(--gm-texto-medio)] dark:text-[#6B7280]" />
                {e.cliente}
              </p>
              {e.direccion && <p className="mt-0.5 truncate text-[12px] text-[var(--gm-texto-medio)] dark:text-[#6B7280]">{e.direccion}</p>}
              {e.nota && <p className="mt-2 text-[13px] leading-relaxed text-[#6E6559] dark:text-[#9CA3AF]">{e.nota}</p>}
            </div>

            <div className="flex shrink-0 flex-col items-end gap-1">
              <button
                type="button"
                title="Agregar a Google Calendar"
                onClick={() => window.open(linkGoogleCalendar(e), '_blank')}
                className="grid h-9 w-9 place-items-center rounded-xl text-[#948A7C] transition hover:bg-[#FBE5C8] dark:hover:bg-[#2A1608] hover:text-[#2F6DA0]"
              >
                <CalendarPlus size={16} />
              </button>
              {!hecho && (
                <button
                  type="button"
                  title="Marcar como realizado"
                  onClick={() => onMarcarRealizado?.(e)}
                  className="grid h-9 w-9 place-items-center rounded-xl text-[#948A7C] transition hover:bg-[#FBE5C8] dark:hover:bg-[#2A1608] hover:text-[#2F6DA0]"
                >
                  <Check size={16} />
                </button>
              )}
              {onEditar && (
                <button
                  type="button"
                  title="Editar"
                  onClick={() => onEditar(e)}
                  className="grid h-9 w-9 place-items-center rounded-xl text-[#948A7C] transition hover:bg-[#FBE5C8] dark:hover:bg-[#2A1608] hover:text-[#2F6DA0]"
                >
                  <Pencil size={15} />
                </button>
              )}
              {onEliminar && (
                <button
                  type="button"
                  title="Eliminar"
                  onClick={() => onEliminar(e)}
                  className="grid h-9 w-9 place-items-center rounded-xl text-[#948A7C] transition hover:bg-rose-500/10 hover:text-rose-500"
                >
                  <Trash2 size={15} />
                </button>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
