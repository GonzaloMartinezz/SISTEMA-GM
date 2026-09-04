// ============================================================================
// SISTEMA GM · M-01 CLIENTES · FICHA DEL CLIENTE
// ----------------------------------------------------------------------------
// Ficha con pestañas horizontales: arriba la identidad y los accesos directos
// (WhatsApp, mail, mapa), abajo el detalle cortado en pestañas. Todo lo que el
// sistema sabe de una cuenta, sin salir de la Base de Datos.
// ============================================================================

import React, { useMemo, useState } from 'react';
import {
  Mail, MapPin, MessageCircle, Phone, IdCard, Activity, MessagesSquare, CalendarDays,
} from 'lucide-react';
import ModalGm from '../../../../shared/gm-ui/ModalGm';
import Tabs from '../../../../shared/gm-ui/Tabs';
import Chip from '../../../../shared/gm-ui/Chip';
import Avatar from '../../../../shared/gm-ui/Avatar';
import BotonGm from '../../../../shared/gm-ui/BotonGm';
import EstadoVacio from '../../../../shared/gm-ui/EstadoVacio';

const TONO_RUBRO = { Odontología: 'azul', Veterinaria: 'aqua', 'Diagnóstico por Imagen': 'naranja' };
const TONO_CANAL = { whatsapp: 'aqua', mail: 'azul', llamada: 'amarillo' };

const soloDigitos = (t = '') => t.replace(/\D/g, '');
const waLink = (tel) => {
  const n = soloDigitos(tel || '');
  return n ? `https://wa.me/${n.length <= 10 ? `54${n}` : n}` : null;
};
const mapaLink = (c) =>
  c?.ubicacion
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        `${c.ubicacion}, ${c.localidad || ''} ${c.provincia || ''}`
      )}`
    : null;

const fechaCorta = (v) =>
  v ? new Date(v).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

function Dato({ etiqueta, valor }) {
  return (
    <div className="min-w-0">
      <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#B0A697] dark:text-[#6B7280]">{etiqueta}</p>
      <p className="mt-1 break-words text-[14px] text-[#2A2118] dark:text-[#F9FAFB]">{valor || '—'}</p>
    </div>
  );
}

export default function FichaClientePanel({ cliente, leads = [], mensajes = [], eventos = [], onCerrar }) {
  const [tab, setTab] = useState('generales');

  const nombreProf = useMemo(
    () => [cliente?.profesional_apellido, cliente?.profesional_nombre].filter(Boolean).join(', '),
    [cliente]
  );

  const misLeads = useMemo(
    () => leads.filter((l) => l.clinica && cliente && l.clinica === cliente.negocio),
    [leads, cliente]
  );
  const misMensajes = useMemo(
    () => mensajes.filter((m) => m.clienteId === cliente?.id),
    [mensajes, cliente]
  );
  const misEventos = useMemo(
    () => eventos.filter((e) => e.cliente && cliente && e.cliente === cliente.negocio),
    [eventos, cliente]
  );

  if (!cliente) return null;

  const tabs = [
    { id: 'generales', nombre: 'Generales', icono: IdCard },
    { id: 'seguimiento', nombre: 'Seguimiento', icono: Activity, contador: misLeads.length },
    { id: 'mensajes', nombre: 'Mensajes', icono: MessagesSquare, contador: misMensajes.length },
    { id: 'agenda', nombre: 'Agenda', icono: CalendarDays, contador: misEventos.length },
  ];

  const wa = waLink(cliente.celular || cliente.telefono);
  const mapa = mapaLink(cliente);

  return (
    <ModalGm abierto titulo="Ficha del cliente" onCerrar={onCerrar} ancho="max-w-3xl">
      {/* --------------------------- Identidad --------------------------- */}
      <div className="flex flex-wrap items-start gap-4">
        <Avatar nombre={cliente.negocio || nombreProf} tamano="lg" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-[20px] font-semibold leading-tight text-[#2A2118] dark:text-[#F9FAFB]">
              {cliente.negocio}
            </h3>
            <Chip tono={TONO_RUBRO[cliente.rubro] || 'gris'} punto>
              {cliente.rubro || 'Sin rubro'}
            </Chip>
            {cliente.clasificacion && <Chip tono="gris">{cliente.clasificacion}</Chip>}
          </div>
          <p className="mt-1 text-[14px] text-[#6E6559] dark:text-[#9CA3AF]">{nombreProf || 'Profesional sin cargar'}</p>
          <p className="mt-0.5 text-[12px] text-[#B0A697] dark:text-[#6B7280]">
            {cliente.codigo} · cliente desde {fechaCorta(cliente.cliente_desde)}
          </p>
        </div>
      </div>

      {/* ------------------------ Accesos directos ------------------------ */}
      <div className="mt-4 flex flex-wrap gap-2">
        {wa && (
          <BotonGm variante="suave" tamano="sm" icono={MessageCircle} onClick={() => window.open(wa, '_blank')}>
            WhatsApp
          </BotonGm>
        )}
        {cliente.telefono && (
          <BotonGm variante="contorno" tamano="sm" icono={Phone} onClick={() => window.open(`tel:${cliente.telefono}`)}>
            Llamar
          </BotonGm>
        )}
        {cliente.email && (
          <BotonGm variante="contorno" tamano="sm" icono={Mail} onClick={() => window.open(`mailto:${cliente.email}`)}>
            Mail
          </BotonGm>
        )}
        {mapa && (
          <BotonGm variante="contorno" tamano="sm" icono={MapPin} onClick={() => window.open(mapa, '_blank')}>
            Ver en el mapa
          </BotonGm>
        )}
      </div>

      {/* ----------------------------- Detalle ---------------------------- */}
      <Tabs opciones={tabs} valor={tab} onChange={setTab} className="mt-6" />

      <div className="pt-5">
        {tab === 'generales' && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Dato etiqueta="Nombre de negocio" valor={cliente.negocio} />
            <Dato etiqueta="Profesional" valor={nombreProf} />
            <Dato etiqueta="Teléfono" valor={cliente.telefono} />
            <Dato etiqueta="Celular / WhatsApp" valor={cliente.celular} />
            <Dato etiqueta="Correo" valor={cliente.email} />
            <Dato etiqueta="Estado" valor={cliente.estado} />
            <div className="sm:col-span-2">
              <Dato
                etiqueta="Ubicación del negocio"
                valor={[cliente.ubicacion, cliente.localidad, cliente.provincia].filter(Boolean).join(' · ')}
              />
            </div>
            {cliente.notas && (
              <div className="sm:col-span-2 rounded-xl bg-[#FCFAF6] dark:bg-[#2D2D2D] p-4">
                <Dato etiqueta="Notas" valor={cliente.notas} />
              </div>
            )}
          </div>
        )}

        {tab === 'seguimiento' &&
          (misLeads.length ? (
            <ul className="space-y-2.5">
              {misLeads.map((l) => (
                <li key={l.id} className="rounded-xl border border-[#EFE7DB] p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-[14px] font-medium text-[#2A2118] dark:text-[#F9FAFB]">{l.equipo || 'Oportunidad'}</p>
                    <Chip tono="azul">{l.etapa}</Chip>
                  </div>
                  <p className="mt-1.5 text-[13px] text-[#948A7C]">
                    US$ {Number(l.montoUsd || 0).toLocaleString('es-AR')} · {l.interacciones} interacciones ·
                    último contacto {l.ultimoContacto || 'sin registrar'}
                  </p>
                  {l.proximoPaso && (
                    <p className="mt-2 text-[13px] text-[#6E6559] dark:text-[#9CA3AF]">Próximo paso: {l.proximoPaso}</p>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <EstadoVacio
              icono={Activity}
              titulo="Sin oportunidades abiertas"
              texto="Este cliente no tiene ningún lead cargado en el pipeline de Seguimientos."
            />
          ))}

        {tab === 'mensajes' &&
          (misMensajes.length ? (
            <ul className="space-y-2.5">
              {misMensajes.map((m) => (
                <li key={m.id} className="rounded-xl border border-[#EFE7DB] p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <Chip tono={TONO_CANAL[m.canal] || 'gris'}>{m.canal}</Chip>
                    <span className="text-[12px] text-[#B0A697] dark:text-[#6B7280]">
                      {m.direccion === 'recibido' ? 'Recibido' : 'Enviado'} · {fechaCorta(m.fecha)}
                    </span>
                  </div>
                  {m.asunto && <p className="mt-2 text-[14px] font-medium text-[#2A2118] dark:text-[#F9FAFB]">{m.asunto}</p>}
                  <p className="mt-1 text-[13px] leading-relaxed text-[#6E6559] dark:text-[#9CA3AF]">{m.texto}</p>
                </li>
              ))}
            </ul>
          ) : (
            <EstadoVacio
              icono={MessagesSquare}
              titulo="Todavía no hay mensajes"
              texto="Cuando se envíe o reciba una comunicación con esta cuenta va a quedar registrada acá."
            />
          ))}

        {tab === 'agenda' &&
          (misEventos.length ? (
            <ul className="space-y-2.5">
              {misEventos.map((e) => (
                <li key={e.id} className="flex items-center gap-4 rounded-xl border border-[#EFE7DB] p-4">
                  <div className="w-16 shrink-0 text-center">
                    <p className="text-[18px] font-semibold leading-none text-[#2A2118] dark:text-[#F9FAFB]">{e.hora}</p>
                    <p className="mt-1 text-[11px] uppercase tracking-wide text-[#B0A697] dark:text-[#6B7280]">
                      {fechaCorta(e.fecha)}
                    </p>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[14px] font-medium text-[#2A2118] dark:text-[#F9FAFB]">{e.titulo}</p>
                    <p className="truncate text-[13px] text-[#948A7C]">{e.direccion || e.nota || e.tipo}</p>
                  </div>
                  <Chip tono={e.estado === 'realizado' ? 'aqua' : 'amarillo'}>{e.estado}</Chip>
                </li>
              ))}
            </ul>
          ) : (
            <EstadoVacio
              icono={CalendarDays}
              titulo="Sin citas programadas"
              texto="Agendá una visita o una llamada desde la sección Agenda de Clientes."
            />
          ))}
      </div>
    </ModalGm>
  );
}
