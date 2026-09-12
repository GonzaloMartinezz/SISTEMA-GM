// ============================================================================
// SISTEMA GM · M-01 CLIENTES · INTERACCIONES RECIENTES
// ----------------------------------------------------------------------------
// El registro que pide el Módulo 1: quién fue tocado por última vez, hace
// cuántos días y en qué etapa quedó. El semáforo de contacto ordena la lista:
// arriba lo que se está enfriando.
// ============================================================================

import React, { useMemo } from 'react';
import { Flame } from 'lucide-react';
import Tabla from '../../../../shared/gm-ui/Tabla';
import Chip from '../../../../shared/gm-ui/Chip';
import Avatar from '../../../../shared/gm-ui/Avatar';
import { getEtapa } from '../../../Seguimientos/config/pipeline.config';
import { usd } from '../../../../shared/gm-ui/graficos';

/** Semáforo de contacto en versión clara. El texto siempre acompaña al color. */
const temperatura = (dias = 0) => {
  if (dias <= 3) return { texto: 'Al día', tono: 'aqua' };
  if (dias <= 7) return { texto: 'Tibio', tono: 'amarillo' };
  if (dias <= 15) return { texto: 'Enfriando', tono: 'naranja' };
  return { texto: 'Frío', tono: 'rosa' };
};

export default function InteraccionesRecientes({ leads = [], onVerLead }) {
  const filas = useMemo(
    () => [...leads].sort((a, b) => (b.diasSinContacto || 0) - (a.diasSinContacto || 0)),
    [leads]
  );

  const columnas = [
    {
      clave: 'cliente',
      titulo: 'Cliente',
      render: (l) => (
        <div className="flex min-w-0 items-center gap-3">
          <Avatar nombre={l.clinica || `${l.nombre} ${l.apellido}`} tamano="sm" />
          <div className="min-w-0">
            <p className="truncate font-medium text-[#2A2118] dark:text-[#F9FAFB]">{l.clinica}</p>
            <p className="truncate text-[12px] text-[var(--gm-texto-medio)] dark:text-[#6B7280]">
              {l.apellido}, {l.nombre}
            </p>
          </div>
        </div>
      ),
    },
    {
      clave: 'equipo',
      titulo: 'Oportunidad',
      render: (l) => (
        <div className="min-w-0">
          <p className="truncate text-[#6E6559] dark:text-[#9CA3AF]">{l.equipo || '—'}</p>
          <p className="text-[12px] text-[var(--gm-texto-medio)] dark:text-[#6B7280]">{usd(l.montoUsd)}</p>
        </div>
      ),
    },
    {
      clave: 'etapa',
      titulo: 'Etapa',
      render: (l) => <Chip tono="azul">{getEtapa(l.etapa).label}</Chip>,
    },
    {
      clave: 'interacciones',
      titulo: 'Interacciones',
      render: (l) => <span className="font-medium text-[#2A2118] dark:text-[#F9FAFB]">{l.interacciones || 0}</span>,
    },
    {
      clave: 'ultimoContacto',
      titulo: 'Último contacto',
      render: (l) => (
        <div className="min-w-0">
          <p className="text-[#6E6559] dark:text-[#9CA3AF]">{l.ultimoContacto || 'sin registrar'}</p>
          <p className="text-[12px] text-[var(--gm-texto-medio)] dark:text-[#6B7280]">hace {l.diasSinContacto} días</p>
        </div>
      ),
    },
    {
      clave: 'temperatura',
      titulo: 'Contacto',
      render: (l) => {
        const t = temperatura(l.diasSinContacto);
        return (
          <Chip tono={t.tono} punto>
            {t.texto}
          </Chip>
        );
      },
    },
  ];

  return (
    <Tabla
      columnas={columnas}
      filas={filas}
      claveFila={(l) => l.id}
      onFilaClick={onVerLead}
      alto="max-h-[420px]"
      vacioIcono={Flame}
      vacioTitulo="Sin interacciones registradas"
      vacioTexto="Las oportunidades cargadas en el pipeline aparecen acá ordenadas por cuánto hace que no se las toca."
    />
  );
}
