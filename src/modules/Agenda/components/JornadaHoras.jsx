// ============================================================================
// SISTEMA GM · M-05 · LA JORNADA HORA POR HORA
// ----------------------------------------------------------------------------
// El día dibujado sobre un eje de horas, que es la única forma de ver los
// huecos. Una lista ordenada te dice qué tenés; esto te dice además dónde entra
// lo que falta, que es la pregunta que uno le hace a una agenda.
//
// Tres cosas que el dibujo tiene que decir sin que nadie las explique:
//   · Lo que se pisa va lado a lado, no encima. Y se marca, porque dos cosas a
//     la misma hora casi siempre es un error de carga.
//   · Lo que cae fuera del horario de trabajo igual se muestra: el eje se
//     estira hasta cubrirlo. Esconder un compromiso de las 7 de la mañana
//     porque la jornada "empieza" a las 8 es la peor forma de perderlo.
//   · Si el día es hoy, una línea marca la hora actual.
// ============================================================================

import React, { useEffect, useMemo, useRef } from 'react';
import { Check, X } from 'lucide-react';
import EstadoVacio from '../../../shared/gm-ui/EstadoVacio';
import { getTipo, getEstado, JORNADA } from '../config/agenda.config';
import { aMinutos, horaFin, repartirEnCarriles, esHoy } from '../utils/calendario';

const ALTO_HORA = 62; // px por hora

export default function JornadaHoras({ fecha, eventos, onEvento, onCerrar, onCancelar }) {
  const contenedor = useRef(null);

  const { desde, hasta, bloques } = useMemo(() => {
    const repartidos = repartirEnCarriles(eventos);
    let min = JORNADA.desde * 60;
    let max = JORNADA.hasta * 60;
    repartidos.forEach((b) => {
      min = Math.min(min, Math.floor(b.ini / 60) * 60);
      max = Math.max(max, Math.ceil(b.fin / 60) * 60);
    });
    return { desde: min, hasta: max, bloques: repartidos };
  }, [eventos]);

  const horas = useMemo(
    () => Array.from({ length: (hasta - desde) / 60 + 1 }, (_, i) => desde + i * 60),
    [desde, hasta]
  );

  const alto = ((hasta - desde) / 60) * ALTO_HORA;
  const pos = (min) => ((min - desde) / 60) * ALTO_HORA;

  const ahora = new Date();
  const minutosAhora = ahora.getHours() * 60 + ahora.getMinutes();
  const marcaAhora = esHoy(fecha) && minutosAhora >= desde && minutosAhora <= hasta;

  // Al abrir el día se centra en la hora actual (o en el primer compromiso),
  // así no hay que scrollear para ver dónde estás parado.
  useEffect(() => {
    if (!contenedor.current) return;
    const objetivo = marcaAhora ? minutosAhora : bloques[0]?.ini ?? JORNADA.desde * 60;
    contenedor.current.scrollTop = Math.max(0, pos(objetivo) - 120);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fecha]);

  if (!eventos.length) {
    return (
      <EstadoVacio
        titulo="Día libre"
        texto="No hay nada agendado. Mirá la bandeja de pendientes: ahí está lo que los otros módulos saben que te falta."
      />
    );
  }

  return (
    <div ref={contenedor} className="max-h-[560px] overflow-y-auto pr-1">
      <div className="relative" style={{ height: alto + 16 }}>
        {/* --------------------------- eje de horas ------------------------- */}
        {horas.map((h) => (
          <div key={h} className="absolute inset-x-0 flex items-start" style={{ top: pos(h) }}>
            <span className="w-12 shrink-0 -translate-y-1.5 pr-2 text-right text-[11px] tabular-nums text-[var(--gm-texto-tenue)]">
              {String(Math.floor(h / 60)).padStart(2, '0')}:00
            </span>
            <span className="mt-px h-px flex-1 bg-[#F0EAE1]" />
          </div>
        ))}

        {/* --------------------------- hora actual -------------------------- */}
        {marcaAhora && (
          <div
            className="pointer-events-none absolute inset-x-0 z-20 flex items-center"
            style={{ top: pos(minutosAhora) }}
          >
            <span className="w-12 shrink-0 pr-2 text-right text-[11px] font-semibold text-[var(--gm-acento)]">
              {String(ahora.getHours()).padStart(2, '0')}:
              {String(ahora.getMinutes()).padStart(2, '0')}
            </span>
            <span className="h-[2px] flex-1 bg-[#B4551A]" />
          </div>
        )}

        {/* --------------------------- compromisos -------------------------- */}
        <div className="absolute inset-y-0 left-12 right-0">
          {bloques.map(({ evento, carril, carriles, ini, fin, pisa }) => {
            const tipo = getTipo(evento.tipo);
            const estado = getEstado(evento.estado);
            const cerrado = evento.estado !== 'pendiente';
            const ancho = 100 / (carriles || 1);
            const altoBloque = Math.max(((fin - ini) / 60) * ALTO_HORA - 4, 26);

            return (
              <button
                key={evento.id}
                type="button"
                onClick={() => onEvento?.(evento)}
                title={`${evento.hora}–${horaFin(evento)} · ${evento.titulo}`}
                className={`group absolute overflow-hidden rounded-lg border px-2.5 py-1.5 text-left transition hover:z-10 hover:shadow-[0_8px_20px_-10px_rgba(26,26,24,0.35)] ${
                  cerrado ? 'opacity-55' : ''
                }`}
                style={{
                  top: pos(ini) + 2,
                  height: altoBloque,
                  left: `calc(${carril * ancho}% + 2px)`,
                  width: `calc(${ancho}% - 6px)`,
                  backgroundColor: cerrado ? '#F6F1E9' : `${tipo.color}14`,
                  borderColor: cerrado ? '#E8E0D5' : `${tipo.color}55`,
                  borderLeft: `3px solid ${cerrado ? '#D5CABA' : tipo.color}`,
                }}
              >
                <span className="flex items-center gap-1.5">
                  <tipo.icono size={12} style={{ color: cerrado ? '#B0A697' : tipo.color }} />
                  <span className="truncate text-[11px] tabular-nums text-[var(--gm-texto-medio)]">
                    {evento.hora}–{horaFin(evento)}
                  </span>
                  {pisa && (
                    <span
                      className="ml-auto h-1.5 w-1.5 shrink-0 rounded-full bg-[#B4551A]"
                      title="Se superpone con otro compromiso"
                    />
                  )}
                </span>

                <p
                  className={`mt-0.5 truncate text-[13px] font-medium text-[var(--gm-texto)]  ${
                    cerrado ? 'line-through' : ''
                  }`}
                >
                  {evento.titulo}
                </p>
                {altoBloque > 68 && evento.cliente && (
                  <p className="truncate text-[11px] text-[var(--gm-texto-suave)]">{evento.cliente}</p>
                )}
                {altoBloque > 94 && evento.nota && (
                  <p className="mt-1 truncate text-[11px] text-[var(--gm-texto-tenue)]">{evento.nota}</p>
                )}

                {/* Cerrar o cancelar sin abrir el compromiso. */}
                <span className="absolute right-1.5 top-1.5 hidden items-center gap-0.5 group-hover:flex">
                  <span
                    role="button"
                    tabIndex={-1}
                    aria-label={cerrado ? 'Reabrir' : 'Marcar cumplido'}
                    title={cerrado ? 'Reabrir' : 'Marcar cumplido'}
                    onClick={(ev) => {
                      ev.stopPropagation();
                      onCerrar?.(evento);
                    }}
                    className="grid h-5 w-5 place-items-center rounded bg-[var(--gm-superficie)] /90 text-[#2E9B76] hover:bg-[var(--gm-superficie)]"
                  >
                    <Check size={12} />
                  </span>
                  {!cerrado && (
                    <span
                      role="button"
                      tabIndex={-1}
                      aria-label="Cancelar"
                      title="Cancelar"
                      onClick={(ev) => {
                        ev.stopPropagation();
                        onCancelar?.(evento);
                      }}
                      className="grid h-5 w-5 place-items-center rounded bg-[var(--gm-superficie)] /90 text-[var(--gm-acento)] hover:bg-[var(--gm-superficie)]"
                    >
                      <X size={12} />
                    </span>
                  )}
                </span>

                {cerrado && (
                  <span className="sr-only">{estado.nombre}</span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
