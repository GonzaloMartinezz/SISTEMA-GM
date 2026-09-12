// ============================================================================
// SISTEMA GM · M-01 CLIENTES · FICHA DE LA OPORTUNIDAD
// ----------------------------------------------------------------------------
// Detalle de un lead con pestañas horizontales: resumen comercial, avance por
// etapa y datos de contacto. Es el mismo lenguaje visual que la ficha de
// cliente, para que moverse entre secciones no obligue a reaprender nada.
// ============================================================================

import React, { useState } from 'react';
import { Mail, MessageCircle, Phone, Target, TrendingUp, Contact } from 'lucide-react';
import ModalGm from '../../../../shared/gm-ui/ModalGm';
import Tabs from '../../../../shared/gm-ui/Tabs';
import Chip from '../../../../shared/gm-ui/Chip';
import Avatar from '../../../../shared/gm-ui/Avatar';
import BotonGm from '../../../../shared/gm-ui/BotonGm';
import { ETAPAS, getEtapa } from '../../../Seguimientos/config/pipeline.config';
import { RAMPA } from '../../../../shared/gm-ui/tokens';
import { usd } from '../../../../shared/gm-ui/graficos';

const TONO_PRIORIDAD = { alta: 'naranja', media: 'amarillo', baja: 'gris' };

const soloDigitos = (t) => String(t || '').replace(/\D/g, '');
const waLink = (tel) => {
  const n = soloDigitos(tel || '');
  return n ? `https://wa.me/${n.length <= 10 ? `54${n}` : n}` : null;
};

function Dato({ etiqueta, valor }) {
  return (
    <div className="min-w-0">
      <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--gm-texto-medio)] dark:text-[#6B7280]">{etiqueta}</p>
      <p className="mt-1 break-words text-[14px] text-[#2A2118] dark:text-[#F9FAFB]">{valor || '—'}</p>
    </div>
  );
}

export default function FichaLeadPanel({ lead, onCerrar }) {
  const [tab, setTab] = useState('resumen');
  if (!lead) return null;

  const etapa = getEtapa(lead.etapa);
  const indiceEtapa = ETAPAS.findIndex((e) => e.id === lead.etapa);
  const wa = waLink(lead.telefono);

  const tabs = [
    { id: 'resumen', nombre: 'Resumen', icono: Target },
    { id: 'avance', nombre: 'Avance', icono: TrendingUp },
    { id: 'contacto', nombre: 'Contacto', icono: Contact },
  ];

  return (
    <ModalGm abierto titulo="Oportunidad" onCerrar={onCerrar} ancho="max-w-2xl">
      <div className="flex flex-wrap items-start gap-4">
        <Avatar nombre={lead.clinica || `${lead.nombre} ${lead.apellido}`} tamano="lg" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-[20px] font-semibold leading-tight text-[#2A2118] dark:text-[#F9FAFB]">{lead.clinica}</h3>
            <Chip tono="azul" punto>{etapa.label}</Chip>
            <Chip tono={TONO_PRIORIDAD[lead.prioridad] || 'gris'}>prioridad {lead.prioridad}</Chip>
          </div>
          <p className="mt-1 text-[14px] text-[#6E6559] dark:text-[#9CA3AF]">
            {lead.apellido}, {lead.nombre} · {lead.especialidad}
          </p>
          <p className="mt-0.5 text-[12px] text-[var(--gm-texto-medio)] dark:text-[#6B7280]">
            {lead.id} · {lead.zona || 'zona sin cargar'}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--gm-texto-medio)] dark:text-[#6B7280]">Monto</p>
          <p className="mt-1 text-[24px] font-semibold leading-none text-[#2A2118] dark:text-[#F9FAFB]">
            {usd(lead.montoUsd)}
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {wa && (
          <BotonGm variante="suave" tamano="sm" icono={MessageCircle} onClick={() => window.open(wa, '_blank')}>
            WhatsApp
          </BotonGm>
        )}
        {lead.telefono && (
          <BotonGm variante="contorno" tamano="sm" icono={Phone} onClick={() => window.open(`tel:${lead.telefono}`)}>
            Llamar
          </BotonGm>
        )}
        {lead.email && (
          <BotonGm variante="contorno" tamano="sm" icono={Mail} onClick={() => window.open(`mailto:${lead.email}`)}>
            Mail
          </BotonGm>
        )}
      </div>

      <Tabs opciones={tabs} valor={tab} onChange={setTab} className="mt-6" />

      <div className="pt-5">
        {tab === 'resumen' && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Dato etiqueta="Equipamiento" valor={lead.equipo} />
            <Dato etiqueta="Monto estimado" valor={usd(lead.montoUsd)} />
            <Dato etiqueta="Probabilidad de cierre" valor={`${etapa.probabilidad}%`} />
            <Dato etiqueta="Interacciones" valor={lead.interacciones} />
            <Dato etiqueta="Último contacto" valor={lead.ultimoContacto} />
            <Dato etiqueta="Días sin contacto" valor={lead.diasSinContacto} />
            <div className="sm:col-span-2 rounded-xl bg-[#FCFAF6] dark:bg-[#2D2D2D] p-4">
              <Dato etiqueta="Próximo paso" valor={lead.proximoPaso} />
            </div>
          </div>
        )}

        {tab === 'avance' && (
          <ol className="space-y-3">
            {ETAPAS.map((e, i) => {
              const alcanzada = i <= indiceEtapa;
              const actual = i === indiceEtapa;
              return (
                <li key={e.id} className="flex items-center gap-3">
                  <span
                    className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-[12px] font-semibold text-[#FFFFFF]"
                    style={{ backgroundColor: alcanzada ? RAMPA[i % RAMPA.length] : 'var(--gm-borde)' }}
                  >
                    <span className={alcanzada ? '' : 'text-[var(--gm-texto-medio)] dark:text-[#6B7280]'}>{i + 1}</span>
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className={`text-[14px] ${actual ? 'font-semibold text-[#2A2118] dark:text-[#F9FAFB]' : 'text-[#6E6559] dark:text-[#9CA3AF]'}`}>
                      {e.label}
                    </p>
                    <p className="text-[12px] text-[var(--gm-texto-medio)] dark:text-[#6B7280]">{e.desc}</p>
                  </div>
                  {actual && <Chip tono="azul">etapa actual</Chip>}
                </li>
              );
            })}
          </ol>
        )}

        {tab === 'contacto' && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Dato etiqueta="Profesional" valor={`${lead.apellido}, ${lead.nombre}`} />
            <Dato etiqueta="Negocio" valor={lead.clinica} />
            <Dato etiqueta="Teléfono" valor={lead.telefono} />
            <Dato etiqueta="Correo" valor={lead.email} />
            <Dato etiqueta="Zona" valor={lead.zona} />
            <Dato etiqueta="Rubro" valor={lead.especialidad} />
          </div>
        )}
      </div>
    </ModalGm>
  );
}
