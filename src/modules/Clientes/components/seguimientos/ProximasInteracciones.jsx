// ============================================================================
// SISTEMA GM · M-01 CLIENTES · PRÓXIMAS INTERACCIONES
// ----------------------------------------------------------------------------
// Lo que viene: visitas y llamadas agendadas de hoy en adelante, ordenadas por
// fecha y hora. Cada fila abre WhatsApp o el mapa sin salir del panel.
// ============================================================================

import React, { useMemo } from 'react';
import { CalendarClock, MapPin, Phone, Video } from 'lucide-react';
import Avatar from '../../../../shared/gm-ui/Avatar';
import EstadoVacio from '../../../../shared/gm-ui/EstadoVacio';

const ICONO_TIPO = { visita: MapPin, llamada: Phone, reunion: Video };

// La prioridad va como punto de color con title, no como chip: el panel es
// angosto y el nombre del cliente vale más que la etiqueta.
const COLOR_PRIORIDAD = { alta: '#B4551A', media: '#C08A1E', baja: '#B0A697' };

const hoyISO = () => new Date().toISOString().slice(0, 10);

const etiquetaDia = (iso) => {
  const hoy = hoyISO();
  if (iso === hoy) return 'Hoy';
  const manana = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
  if (iso === manana) return 'Mañana';
  return new Date(`${iso}T12:00:00`).toLocaleDateString('es-AR', { day: '2-digit', month: 'short' });
};

export default function ProximasInteracciones({ eventos = [], limite = 6 }) {
  const proximos = useMemo(() => {
    const hoy = hoyISO();
    return eventos
      .filter((e) => e.fecha >= hoy && e.estado !== 'realizado')
      .sort((a, b) => `${a.fecha}${a.hora}`.localeCompare(`${b.fecha}${b.hora}`))
      .slice(0, limite);
  }, [eventos, limite]);

  if (!proximos.length) {
    return (
      <EstadoVacio
        icono={CalendarClock}
        titulo="No hay nada agendado"
        texto="Programá una visita o una llamada desde la sección Agenda de Clientes."
      />
    );
  }

  return (
    <ul className="divide-y divide-[#F4EFE7]">
      {proximos.map((e) => {
        const Icono = ICONO_TIPO[e.tipo] || CalendarClock;
        return (
          <li key={e.id} className="flex items-center gap-4 py-3.5 first:pt-0 last:pb-0">
            <Avatar nombre={e.cliente || e.titulo} tamano="md" />

            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-2 text-[14px] font-medium text-[#2A2118] dark:text-[#F9FAFB]">
                <span
                  title={`Prioridad ${e.prioridad || 'media'}`}
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ backgroundColor: COLOR_PRIORIDAD[e.prioridad] || COLOR_PRIORIDAD.media }}
                />
                <span className="truncate">{e.cliente || e.titulo}</span>
              </p>
              <p className="mt-0.5 flex items-center gap-1.5 truncate pl-4 text-[13px] text-[#948A7C]">
                <Icono size={13} className="shrink-0" />
                <span className="truncate">{e.titulo}</span>
              </p>
            </div>

            <div className="shrink-0 text-right">
              <p className="text-[14px] font-semibold text-[#2A2118] dark:text-[#F9FAFB]">{e.hora}</p>
              <p className="mt-0.5 text-[12px] text-[#B0A697] dark:text-[#6B7280]">{etiquetaDia(e.fecha)}</p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
