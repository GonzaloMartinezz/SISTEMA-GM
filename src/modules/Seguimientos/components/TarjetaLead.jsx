// ============================================================================
// SISTEMA GM · M-03 · TARJETA DEL TABLERO
// ----------------------------------------------------------------------------
// Tarjeta blanca con una barrita del color de su etapa. Muestra lo mínimo para
// decidir sin abrirla: quién, qué equipo, cuánta plata, hace cuánto que no se
// lo toca y cuál es el próximo paso. Las acciones (WhatsApp, mail, llamar) están
// a un clic porque son lo que más se hace en el día.
// ============================================================================

import React from 'react';
import { MessageCircle, Mail, Phone, Pencil, Trash2, ScanFace } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Chip from '../../../shared/gm-ui/Chip';
import { ChipTemperatura } from './ChipEtapa';
import { getEtapa, getPrioridad } from '../config/pipeline.config';
import { linkTelefono } from '../utils/contacto';

const usd = (v) => `US$ ${Number(v || 0).toLocaleString('es-AR')}`;

export default function TarjetaLead({
  lead, onMensaje, onContacto, onEditar, onEliminar, onArrastrar,
}) {
  const navigate = useNavigate();
  const etapa = getEtapa(lead.etapa);
  const prioridad = getPrioridad(lead.prioridad);
  const tel = linkTelefono(lead);

  const parar = (fn) => (e) => {
    e.stopPropagation();
    e.preventDefault();
    fn?.();
  };

  return (
    <article
      draggable
      onDragStart={(e) => onArrastrar?.(e, lead.id)}
      className="group relative cursor-grab overflow-hidden rounded-xl border border-[var(--gm-borde)] bg-[var(--gm-superficie)] p-3.5 pl-4 shadow-[0_1px_2px_rgba(26,26,24,0.04)] transition hover:border-[var(--gm-borde-fuerte)] hover:shadow-[0_8px_20px_-12px_rgba(26,26,24,0.25)] active:cursor-grabbing"
    >
      <span
        className="absolute inset-y-0 left-0 w-[3px]"
        style={{ backgroundColor: etapa.color }}
        aria-hidden="true"
      />

      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-[14px] font-semibold text-[var(--gm-texto)]">
            {lead.apellido}, {lead.nombre}
          </p>
          <p className="truncate text-[12px] text-[var(--gm-texto-suave)]">{lead.clinica}</p>
        </div>
        <Chip tono={prioridad.tono}>{prioridad.nombre}</Chip>
      </div>

      <div className="mt-3 rounded-lg bg-[var(--gm-superficie-suave)] px-3 py-2">
        <p className="truncate text-[12px] text-[var(--gm-texto-medio)]">{lead.equipo || 'Sin equipo definido'}</p>
        <p className="mt-0.5 text-[15px] font-semibold" style={{ color: etapa.color }}>
          {usd(lead.montoUsd)}
        </p>
      </div>

      <div className="mt-2.5 flex items-center justify-between gap-2">
        <ChipTemperatura dias={lead.diasSinContacto} />
        <span className="text-[11px] text-[var(--gm-texto-tenue)]">{lead.interacciones || 0} int.</span>
      </div>

      {lead.proximoPaso && (
        <p className="mt-2 line-clamp-2 text-[12px] leading-relaxed text-[var(--gm-texto-suave)]">
          {lead.proximoPaso}
        </p>
      )}

      <div className="mt-3 flex items-center gap-1 border-t border-[var(--gm-divisor)] pt-2.5">
        <BotonIcono
          etiqueta="Escribir por WhatsApp"
          icono={MessageCircle}
          onClick={parar(() => onMensaje?.(lead, 'whatsapp'))}
          deshabilitado={!lead.telefono}
        />
        <BotonIcono
          etiqueta="Escribir por mail"
          icono={Mail}
          onClick={parar(() => onMensaje?.(lead, 'email'))}
          deshabilitado={!lead.email}
        />
        <BotonIcono
          etiqueta="Llamar y anotar el contacto"
          icono={Phone}
          onClick={parar(() => {
            if (tel) window.open(tel, '_self');
            onContacto?.(lead.id, { canal: 'Llamada', texto: 'Llamada telefónica.' });
          })}
          deshabilitado={!tel}
        />
        {lead.cuentaId && (
          <BotonIcono
            etiqueta="Ver ficha 360°"
            icono={ScanFace}
            onClick={parar(() => navigate(`/notario-360/ficha/${lead.cuentaId}`))}
          />
        )}

        <span className="flex-1" />

        <BotonIcono etiqueta="Editar" icono={Pencil} onClick={parar(() => onEditar?.(lead))} />
        <BotonIcono
          etiqueta="Eliminar"
          icono={Trash2}
          peligro
          onClick={parar(() => onEliminar?.(lead))}
        />
      </div>
    </article>
  );
}

function BotonIcono({ etiqueta, icono: Icono, onClick, deshabilitado, peligro }) {
  return (
    <button
      type="button"
      title={etiqueta}
      aria-label={etiqueta}
      onClick={onClick}
      disabled={deshabilitado}
      className={`grid h-8 w-8 place-items-center rounded-lg transition disabled:cursor-not-allowed disabled:opacity-30 ${
        peligro
          ? 'text-[var(--gm-texto-tenue)]  hover:bg-[var(--gm-acento-suave-bg)] hover:text-[var(--gm-acento)]'
          : 'text-[var(--gm-texto-suave)] hover:bg-[var(--gm-superficie-fuerte)]  hover:text-[var(--gm-texto)] '
      }`}
    >
      <Icono size={15} strokeWidth={2} />
    </button>
  );
}
