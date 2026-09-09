// ============================================================================
// SISTEMA GM · M-05 · FICHA DEL COMPROMISO
// ----------------------------------------------------------------------------
// Se abre al tocar un bloque de la agenda. Muestra el compromiso completo y
// deja hacer lo que se hace en el momento: cerrarlo anotando qué pasó,
// cancelarlo, moverlo de día, editarlo o borrarlo.
//
// Cerrar pide (sin obligar) una línea de resultado. Es la diferencia entre una
// agenda que dice "hiciste 5 llamadas" y una que dice qué salió de cada una.
// ============================================================================

import React, { useState } from 'react';
import {
  CalendarPlus, Check, MapPin, Pencil, RotateCcw, Trash2, X, ExternalLink,
} from 'lucide-react';
import ModalGm from '../../../shared/gm-ui/ModalGm';
import BotonGm from '../../../shared/gm-ui/BotonGm';
import Chip from '../../../shared/gm-ui/Chip';
import { getTipo, getEstado, getPrioridad, getOrigen } from '../config/agenda.config';
import { horaFin, diaLargo, sumarDias } from '../utils/calendario';
import { linkGoogleCalendar } from '../services/agendaService';
import { tieneCoordenadas } from '../utils/ruta';

export default function ModalEvento({
  evento, onCerrarModal, onEstado, onMover, onEditar, onEliminar,
}) {
  const [resultado, setResultado] = useState(evento?.resultado || '');
  if (!evento) return null;

  const tipo = getTipo(evento.tipo);
  const estado = getEstado(evento.estado);
  const prioridad = getPrioridad(evento.prioridad);
  const abierto = evento.estado === 'pendiente';
  const origen = evento.origenModulo ? getOrigen(evento.origenModulo) : null;

  return (
    <ModalGm
      abierto
      titulo={evento.titulo}
      bajada={`${evento.id} · ${diaLargo(evento.fecha)} · ${evento.hora}–${horaFin(evento)}`}
      onCerrar={onCerrarModal}
      ancho="max-w-2xl"
      pie={
        <>
          <BotonGm variante="peligro" icono={Trash2} onClick={() => onEliminar?.(evento)}>
            Eliminar
          </BotonGm>
          <span className="flex-1" />
          <BotonGm variante="fantasma" icono={Pencil} onClick={() => onEditar?.(evento)}>
            Editar
          </BotonGm>
          {abierto ? (
            <BotonGm
              variante="solido"
              icono={Check}
              onClick={() => onEstado?.(evento.id, 'cumplido', resultado.trim() || null)}
            >
              Marcar cumplido
            </BotonGm>
          ) : (
            <BotonGm
              variante="contorno"
              icono={RotateCcw}
              onClick={() => onEstado?.(evento.id, 'pendiente')}
            >
              Reabrir
            </BotonGm>
          )}
        </>
      }
    >
      <div className="space-y-5">
        {/* ------------------------------ cabecera ------------------------- */}
        <div className="flex flex-wrap items-center gap-2">
          <span
            className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[12px] font-medium"
            style={{ backgroundColor: `${tipo.color}1A`, borderColor: `${tipo.color}66`, color: '#3D3225' }}
          >
            <tipo.icono size={13} style={{ color: tipo.color }} />
            {tipo.nombre}
          </span>
          <Chip tono={estado.tono} punto>{estado.nombre}</Chip>
          <Chip tono={prioridad.tono}>Prioridad {prioridad.nombre.toLowerCase()}</Chip>
          {origen && (
            <Chip tono={origen.tono}>
              Vino de {origen.nombre} · {evento.origenCodigo}
            </Chip>
          )}
        </div>

        {/* ------------------------------- datos --------------------------- */}
        <dl className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
          <Dato titulo="Con quién" valor={evento.cliente} />
          <Dato titulo="Duración" valor={`${evento.duracion} minutos`} />
          <Dato titulo="Dirección" valor={evento.direccion} ancho />
          {evento.nota && <Dato titulo="Qué preparar" valor={evento.nota} ancho />}
          {evento.resultado && !abierto && (
            <Dato titulo="Qué pasó" valor={evento.resultado} ancho />
          )}
        </dl>

        {evento.tipo === 'visita' && !tieneCoordenadas(evento) && (
          <p className="flex items-start gap-2 rounded-xl border border-[#EDE0CB] bg-[#FCF6EC] px-3.5 py-2.5 text-[12px] leading-relaxed text-[#7A5600]">
            <MapPin size={14} className="mt-0.5 shrink-0" />
            Esta visita no tiene coordenadas cargadas, así que no entra en la ruta del día. Editala
            y pegale la latitud y la longitud para que sume a los kilómetros.
          </p>
        )}

        {/* ---------------------------- cerrar bien ------------------------ */}
        {abierto && (
          <label className="flex flex-col gap-1.5">
            <span className="text-[12px] font-medium text-[var(--gm-texto-medio)]">
              Qué pasó <span className="font-normal text-[var(--gm-texto-tenue)]">(opcional, queda anotado)</span>
            </span>
            <textarea
              rows={2}
              value={resultado}
              onChange={(e) => setResultado(e.target.value)}
              placeholder="Quedó en confirmar el viernes. Pidió la cotización por mail."
              className="w-full rounded-xl border border-[var(--gm-borde)] bg-[var(--gm-superficie)] px-3.5 py-2.5 text-[14px] leading-relaxed text-[var(--gm-texto)] outline-none transition placeholder:text-[var(--gm-texto-tenue)] focus:border-[#2F6DA0] focus:ring-4 focus:ring-[#2F6DA0]/10"
            />
          </label>
        )}

        {/* ----------------------------- acciones -------------------------- */}
        <div className="flex flex-wrap items-center gap-2 border-t border-[#F0EAE1] pt-4">
          <BotonGm
            variante="contorno"
            tamano="sm"
            icono={CalendarPlus}
            onClick={() => onMover?.(evento.id, sumarDias(evento.fecha, 1))}
          >
            Pasar a mañana
          </BotonGm>
          <BotonGm
            variante="contorno"
            tamano="sm"
            icono={CalendarPlus}
            onClick={() => onMover?.(evento.id, sumarDias(evento.fecha, 7))}
          >
            Pasar una semana
          </BotonGm>
          {abierto && (
            <BotonGm
              variante="fantasma"
              tamano="sm"
              icono={X}
              onClick={() => onEstado?.(evento.id, 'cancelado')}
            >
              Cancelar
            </BotonGm>
          )}
          <span className="flex-1" />
          <a
            href={linkGoogleCalendar(evento)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-[var(--gm-borde)] px-3 text-[13px] text-[var(--gm-texto-medio)] transition hover:bg-[var(--gm-superficie-suave)] hover:text-[var(--gm-texto)]"
          >
            <ExternalLink size={14} />
            Copiar a Google Calendar
          </a>
        </div>
      </div>
    </ModalGm>
  );
}

function Dato({ titulo, valor, ancho }) {
  if (!valor) return null;
  return (
    <div className={ancho ? 'sm:col-span-2' : ''}>
      <dt className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--gm-texto-tenue)]">
        {titulo}
      </dt>
      <dd className="mt-1 whitespace-pre-line text-[14px] leading-relaxed text-[var(--gm-texto)]">
        {valor}
      </dd>
    </div>
  );
}
