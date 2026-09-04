// ============================================================================
// SISTEMA GM · M-06 · LA LÍNEA DE TIEMPO DEL SISTEMA
// ----------------------------------------------------------------------------
// Los hechos agrupados por día, con una línea vertical que los cose. Cada uno
// dice de qué módulo salió, porque eso es la mitad de la información: "pago
// recibido" y "mensaje enviado" son cosas distintas aunque estén una debajo de
// la otra.
//
// La hora se muestra sólo cuando el hecho la tiene de verdad. Varias tablas
// guardan fecha sin hora (una visita, una liquidación de mes), y mostrar
// "00:00" haría creer que pasó a la medianoche.
// ============================================================================

import React from 'react';
import Chip from '../../../shared/gm-ui/Chip';
import EstadoVacio from '../../../shared/gm-ui/EstadoVacio';
import { getClase, getModulo } from '../config/notario.config';
import ChipEntidad from './ChipEntidad';

const diaLargo = (iso) => {
  const d = new Date(iso);
  const hoy = new Date();
  const ayer = new Date(Date.now() - 86400000);
  const igual = (a, b) => a.toDateString() === b.toDateString();
  if (igual(d, hoy)) return 'Hoy';
  if (igual(d, ayer)) return 'Ayer';
  return d.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' });
};

/** Sólo hay hora real si el registro no es medianoche exacta. */
const horaDe = (iso) => {
  const d = new Date(iso);
  if (d.getHours() === 0 && d.getMinutes() === 0) return null;
  return d.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
};

export default function LineaBitacora({ grupos, resolver, onHecho }) {
  if (!grupos.length) {
    return (
      <EstadoVacio
        titulo="Sin movimientos en este rango"
        texto="Probá con una ventana de tiempo más larga o sacá algún filtro."
      />
    );
  }

  return (
    <div className="space-y-7">
      {grupos.map(({ dia, hechos }) => (
        <section key={dia}>
          <header className="mb-3 flex items-baseline gap-3">
            <h3 className="text-[13px] font-semibold capitalize text-[#2A2118] dark:text-[#F9FAFB]">{diaLargo(dia)}</h3>
            <span className="h-px flex-1 bg-[#F0EAE1]" />
            <span className="text-[11px] text-[#B0A697] dark:text-[#6B7280]">
              {hechos.length} {hechos.length === 1 ? 'movimiento' : 'movimientos'}
            </span>
          </header>

          <ul className="relative space-y-2 pl-[26px]">
            <span
              className="absolute bottom-3 left-[13px] top-3 w-px bg-[#EFE7DB]"
              aria-hidden="true"
            />

            {hechos.map((h) => {
              const clase = getClase(h.clase);
              const modulo = getModulo(h.modulo);
              const hora = horaDe(h.fecha);

              return (
                <li key={h.clave} className="relative">
                  <span
                    className="absolute -left-[26px] top-3 grid h-[26px] w-[26px] place-items-center rounded-full border-2 border-[#FAF6F0]"
                    style={{ backgroundColor: `${clase.color}1F`, color: clase.color }}
                  >
                    <clase.icono size={13} />
                  </span>

                  <div className="rounded-xl border border-[#E8E0D5] dark:border-[#333333] bg-white dark:bg-[#1E1E1E] px-4 py-3 transition hover:border-[#D5CABA]">
                    <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
                      <span className="text-[14px] font-medium text-[#2A2118] dark:text-[#F9FAFB]">{h.titulo}</span>
                      <Chip tono={modulo.tono}>
                        {modulo.codigo} {modulo.nombre}
                      </Chip>
                      {h.entidad && (
                        <ChipEntidad
                          entidad={h.entidad}
                          codigo={h.entidadCodigo}
                          resuelta={resolver(h.entidad, h.entidadCodigo)}
                          onClick={onHecho ? () => onHecho(h) : undefined}
                        />
                      )}
                      <span className="ml-auto shrink-0 text-[11px] tabular-nums text-[#B0A697] dark:text-[#6B7280]">
                        {hora || 'sin hora'}
                      </span>
                    </div>

                    {h.detalle && (
                      <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-[#948A7C]">
                        {h.detalle}
                      </p>
                    )}
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
