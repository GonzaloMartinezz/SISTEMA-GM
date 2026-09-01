// ============================================================================
// SISTEMA GM · AGENDA INTELIGENTE · ALERTAS TEMPRANAS
// ----------------------------------------------------------------------------
// Lo que hay que preparar hoy para que mañana salga bien.
// ============================================================================

import React, { useMemo } from 'react';
import { AlertTriangle, CalendarClock, Download, Package, Route } from 'lucide-react';
import PanelTerminal, { SinDatos } from '../../../shared/ui/PanelTerminal';
import { generarICS } from '../../../shared/agenda/agendaService';
import { BASE_OPERATIVA } from '../../../shared/agenda/agendaDemo';
import { optimizarRuta, minutosDeViaje } from '../../../shared/geo/ruteo';
import { useAgenda } from '../context/AgendaContext';

export default function AlertasTempranas() {
  const { deManana, delDia } = useAgenda();

  const alertas = useMemo(() => {
    const lista = [];

    const visitasManana = deManana.filter((e) => e.tipo === 'visita');
    if (visitasManana.length) {
      const { totalKm } = optimizarRuta(BASE_OPERATIVA, visitasManana);
      lista.push({
        id: 'ruta',
        icono: Route,
        tono: 'text-teal-400 border-teal-500/40',
        titulo: `${visitasManana.length} visita${visitasManana.length === 1 ? '' : 's'} mañana`,
        detalle: `${totalKm.toFixed(1)} km · ~${minutosDeViaje(totalKm)} min de manejo. Cargá combustible hoy.`,
      });
    }

    const primero = deManana[0];
    if (primero) {
      lista.push({
        id: 'primera',
        icono: CalendarClock,
        tono: 'text-sky-400 border-sky-500/40',
        titulo: `Mañana arrancás ${primero.hora}`,
        detalle: `${primero.titulo} · ${primero.cliente}`,
      });
    }

    const conNota = deManana.filter((e) => e.nota);
    conNota.forEach((e) =>
      lista.push({
        id: `prep-${e.id}`,
        icono: Package,
        tono: 'text-amber-400 border-amber-500/40',
        titulo: `Preparar para ${e.cliente}`,
        detalle: e.nota,
      })
    );

    const pendientesHoy = delDia.filter((e) => e.estado === 'pendiente');
    if (pendientesHoy.length) {
      lista.push({
        id: 'pendientes',
        icono: AlertTriangle,
        tono: 'text-rose-400 border-rose-500/40',
        titulo: `${pendientesHoy.length} compromiso${pendientesHoy.length === 1 ? '' : 's'} sin cerrar hoy`,
        detalle: 'Marcalos como cumplidos o reprogramalos antes de terminar la jornada.',
      });
    }

    return lista;
  }, [deManana, delDia]);

  return (
    <PanelTerminal
      titulo="Alertas tempranas"
      acento="ambar"
      className="min-h-[200px]"
      acciones={
        deManana.length ? (
          <button
            type="button"
            onClick={() => generarICS(deManana, 'agenda-manana-gm.ics')}
            className="inline-flex items-center gap-1 font-mono text-[9px] uppercase tracking-[0.15em] text-gray-500 transition-colors hover:text-teal-400"
          >
            <Download className="h-3 w-3" />
            .ics de mañana
          </button>
        ) : null
      }
    >
      {alertas.length ? (
        <ul className="divide-y divide-gray-800">
          {alertas.map((a) => {
            const Icono = a.icono;
            return (
              <li key={a.id} className="flex items-start gap-2.5 p-3">
                <span className={`mt-0.5 rounded border p-1 ${a.tono}`}>
                  <Icono className="h-3 w-3" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-gray-200">{a.titulo}</p>
                  <p className="mt-0.5 text-[11px] leading-snug text-gray-500">{a.detalle}</p>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <SinDatos mensaje="Nada urgente para preparar" />
      )}
    </PanelTerminal>
  );
}
