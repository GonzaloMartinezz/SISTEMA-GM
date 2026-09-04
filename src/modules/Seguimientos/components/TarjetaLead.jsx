// ============================================================================
// SISTEMA GM · M-04 · TARJETA DEL TABLERO
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
      className="group relative cursor-grab overflow-hidden rounded-xl border border-[#E8E0D5] dark:border-[#333333] bg-white dark:bg-[#1E1E1E] p-3.5 pl-4 shadow-[0_1px_2px_rgba(26,26,24,0.04)] transition hover:border-[#D5CABA] hover:shadow-[0_8px_20px_-12px_rgba(26,26,24,0.25)] active:cursor-grabbing"
    >
      <span
        className="absolute inset-y-0 left-0 w-[3px]"
        style={{ backgroundColor: etapa.color }}
        aria-hidden="true"
      />

      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-[14px] font-semibold text-[#2A2118] dark:text-[#F9FAFB]">
            {lead.apellido}, {lead.nombre}
          </p>
          <p className="truncate text-[12px] text-[#948A7C]">{lead.clinica}</p>
        </div>
        <Chip tono={prioridad.tono}>{prioridad.nombre}</Chip>
      </div>

      <div className="mt-3 rounded-lg bg-[#FCFAF6] dark:bg-[#2D2D2D] px-3 py-2">
        <p className="truncate text-[12px] text-[#6E6559] dark:text-[#9CA3AF]">{lead.equipo || 'Sin equipo definido'}</p>
        <p className="mt-0.5 text-[15px] font-semibold" style={{ color: etapa.color }}>
          {usd(lead.montoUsd)}
        </p>
      </div>

      <div className="mt-2.5 flex items-center justify-between gap-2">
        <ChipTemperatura dias={lead.diasSinContacto} />
        <span className="text-[11px] text-[#B0A697] dark:text-[#6B7280]">{lead.interacciones || 0} int.</span>
      </div>

      {lead.proximoPaso && (
        <p className="mt-2 line-clamp-2 text-[12px] leading-relaxed text-[#948A7C]">
          {lead.proximoPaso}
        </p>
      )}

      <div className="mt-3 flex items-center gap-1 border-t border-[#F4EFE7] pt-2.5">
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
          ? 'text-[#B0A697] dark:text-[#6B7280] hover:bg-[#FBEAE0] hover:text-[#A63A0C]'
          : 'text-[#948A7C] hover:bg-[#F3EDE4] dark:hover:bg-[#121212] hover:text-[#2A2118] dark:text-[#F9FAFB]'
      }`}
    >
      <Icono size={15} strokeWidth={2} />
    </button>
  );
}
