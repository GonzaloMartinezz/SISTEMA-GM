// ============================================================================
// SISTEMA GM · M-01 CLIENTES · LISTA DE MENSAJES
// ----------------------------------------------------------------------------
// Trazabilidad completa: cada comunicación con su canal, su sentido (enviado o
// recibido), el cliente y el texto. Se agrupa por día para que se lea como una
// bitácora y no como una tabla más.
// ============================================================================

import React, { useMemo } from 'react';
import {
  ArrowDownLeft, ArrowUpRight, Check, Mail, MessageCircle, MessagesSquare, Phone, Trash2, Undo2,
} from 'lucide-react';
import Avatar from '../../../../shared/gm-ui/Avatar';
import Chip from '../../../../shared/gm-ui/Chip';
import EstadoVacio from '../../../../shared/gm-ui/EstadoVacio';

const ICONO_CANAL = { whatsapp: MessageCircle, mail: Mail, llamada: Phone };
const TONO_CANAL = { whatsapp: 'aqua', mail: 'azul', llamada: 'amarillo' };

const claveDia = (iso) => String(iso || '').slice(0, 10);

const tituloDia = (iso) => {
  const hoy = new Date().toISOString().slice(0, 10);
  if (iso === hoy) return 'Hoy';
  const ayer = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  if (iso === ayer) return 'Ayer';
  return new Date(`${iso}T12:00:00`).toLocaleDateString('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
};

const hora = (iso) =>
  iso ? new Date(iso).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }) : '';

export default function ListaMensajes({ mensajes = [], onMarcarRespondido, onEliminar }) {
  const grupos = useMemo(() => {
    const mapa = new Map();
    mensajes.forEach((m) => {
      const k = claveDia(m.fecha);
      if (!mapa.has(k)) mapa.set(k, []);
      mapa.get(k).push(m);
    });
    return [...mapa.entries()].sort((a, b) => b[0].localeCompare(a[0]));
  }, [mensajes]);

  if (!grupos.length) {
    return (
      <EstadoVacio
        icono={MessagesSquare}
        titulo="Sin comunicaciones registradas"
        texto="Cada WhatsApp, mail o llamada que se registre desde el sistema queda acá con su fecha y su cliente."
      />
    );
  }

  return (
    <div className="space-y-7">
      {grupos.map(([dia, items]) => (
        <section key={dia}>
          <div className="mb-3 flex items-center gap-3">
            <h3 className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#948A7C]">
              {tituloDia(dia)}
            </h3>
            <span className="h-px flex-1 bg-[#EFE7DB]" />
            <span className="text-[12px] text-[var(--gm-texto-medio)] dark:text-[#6B7280]">{items.length}</span>
          </div>

          <ul className="space-y-3">
            {items.map((m) => {
              const Icono = ICONO_CANAL[m.canal] || MessagesSquare;
              const recibido = m.direccion === 'recibido';
              return (
                <li
                  key={m.id}
                  className="flex gap-3.5 rounded-2xl border border-[#EFE7DB] bg-[var(--gm-superficie)] dark:bg-[#1E1E1E] p-4 transition hover:border-[#D5CABA]"
                >
                  <Avatar nombre={m.cliente} tamano="md" />

                  {(onMarcarRespondido || onEliminar) && (
                    <div className="order-last flex shrink-0 flex-col items-end gap-1">
                      {onMarcarRespondido && !recibido && (
                        <button
                          type="button"
                          title={m.respondido ? 'Marcar como sin respuesta' : 'Marcar como respondido'}
                          onClick={() => onMarcarRespondido(m)}
                          className="grid h-8 w-8 place-items-center rounded-lg text-[var(--gm-texto-medio)] transition hover:bg-[var(--gm-superficie-fuerte)] hover:text-[var(--gm-texto)]"
                        >
                          {m.respondido ? <Undo2 size={14} /> : <Check size={14} />}
                        </button>
                      )}
                      {onEliminar && (
                        <button
                          type="button"
                          title="Eliminar"
                          onClick={() => onEliminar(m)}
                          className="grid h-8 w-8 place-items-center rounded-lg text-[var(--gm-texto-medio)] transition hover:bg-rose-500/10 hover:text-rose-500"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="truncate text-[14px] font-medium text-[#2A2118] dark:text-[#F9FAFB]">{m.cliente}</span>
                      <Chip tono={TONO_CANAL[m.canal] || 'gris'}>
                        <Icono size={12} />
                        {m.canal}
                      </Chip>
                      <span
                        className={`inline-flex items-center gap-1 text-[12px] font-medium ${
                          recibido ? 'text-[#2F6DA0]' : 'text-[#2F6DA0]'
                        }`}
                      >
                        {recibido ? <ArrowDownLeft size={13} /> : <ArrowUpRight size={13} />}
                        {recibido ? 'Recibido' : 'Enviado'}
                      </span>
                      <span className="ml-auto shrink-0 text-[12px] text-[var(--gm-texto-medio)] dark:text-[#6B7280]">{hora(m.fecha)}</span>
                    </div>

                    {m.asunto && (
                      <p className="mt-1.5 text-[14px] font-medium text-[#2A2118] dark:text-[#F9FAFB]">{m.asunto}</p>
                    )}
                    <p className="mt-1 text-[13px] leading-relaxed text-[#6E6559] dark:text-[#9CA3AF]">{m.texto}</p>

                    <div className="mt-2 flex flex-wrap items-center gap-3 text-[12px] text-[var(--gm-texto-medio)] dark:text-[#6B7280]">
                      {m.plantilla && <span>Plantilla: {m.plantilla}</span>}
                      {m.operador && <span>Operador: {m.operador}</span>}
                      {!recibido && (
                        <span className={m.respondido ? 'text-[#2F6DA0]' : 'text-[#B4551A]'}>
                          {m.respondido ? 'Respondido' : 'Sin respuesta'}
                        </span>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
