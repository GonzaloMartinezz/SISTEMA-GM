// ============================================================================
// SISTEMA GM · M-03 · LÍNEA DE TIEMPO DE LAS VENTAS
// ----------------------------------------------------------------------------
// Una fila por lead, un tramo por etapa, sobre un eje de fechas real. Es la
// vista que responde "¿esta venta se está moviendo o está clavada?" sin abrir
// nada: una fila con un solo bloque largo es una venta detenida.
//
// Dos honestidades que están en el dibujo, no en la letra chica:
//   · el tramo que empezó antes de la ventana lleva un borde rayado a la
//     izquierda: no empezó ahí, viene de antes;
//   · el tramo abierto (la etapa de hoy) termina en punta, no en un borde
//     recto, porque todavía no terminó.
// ============================================================================

import React from 'react';
import EstadoVacio from '../../../../shared/gm-ui/EstadoVacio';
import { getEtapa } from '../../config/pipeline.config';
import { fechaCorta } from '../../utils/avance';

const usd = (v) => `US$ ${Math.round(Number(v || 0)).toLocaleString('es-AR')}`;

export default function LineaTiempoLeads({ datos, onLead }) {
  const { filas, marcas } = datos;

  if (!filas.length) {
    return (
      <EstadoVacio
        titulo="Sin movimiento en este rango"
        texto="Ninguna oportunidad tuvo actividad en la ventana elegida. Probá con un rango más largo."
      />
    );
  }

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[860px]">
        {/* ------------------------------ eje ------------------------------- */}
        <div className="flex items-end border-b border-[#EFE7DB] pb-2">
          <div className="w-[228px] shrink-0 pr-4 text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--gm-texto-tenue)]">
            Oportunidad
          </div>
          <div className="relative h-4 flex-1">
            {marcas.map((m) => (
              <span
                key={m.pos}
                className="absolute -translate-x-1/2 whitespace-nowrap text-[11px] text-[var(--gm-texto-tenue)]"
                style={{ left: `${m.pos}%` }}
              >
                {m.texto}
              </span>
            ))}
          </div>
        </div>

        {/* ----------------------------- filas ------------------------------ */}
        <ul className="divide-y divide-[var(--gm-divisor)]">
          {filas.map(({ lead, segmentos }) => (
            <li key={lead.id}>
              <button
                type="button"
                onClick={() => onLead?.(lead)}
                className="flex w-full items-center py-3 text-left transition hover:bg-[var(--gm-superficie-suave)]"
              >
                <div className="w-[228px] shrink-0 pr-4">
                  <p className="truncate text-[13px] font-medium text-[var(--gm-texto)]">
                    {lead.apellido}, {lead.nombre}
                  </p>
                  <p className="truncate text-[11px] text-[var(--gm-texto-suave)]">
                    {lead.clinica} · {usd(lead.montoUsd)}
                  </p>
                </div>

                <div className="relative h-7 flex-1 rounded-lg bg-[#FBF8F3]">
                  {/* Guías verticales, apenas visibles: ubican sin competir. */}
                  {marcas.map((m) => (
                    <span
                      key={`g-${m.pos}`}
                      aria-hidden="true"
                      className="absolute inset-y-0 w-px bg-[var(--gm-superficie-fuerte)]"
                      style={{ left: `${m.pos}%` }}
                    />
                  ))}

                  {segmentos.map((s, i) => (
                    <span
                      key={`${s.etapaId}-${s.desdeIso}-${i}`}
                      title={`${s.etapa} · desde ${fechaCorta(s.desdeIso)}${
                        s.hastaIso ? ` hasta ${fechaCorta(s.hastaIso)}` : ' (en curso)'
                      } · ${s.dias} días${s.recortado ? ' · empezó antes del rango' : ''}`}
                      className="absolute inset-y-1 flex items-center overflow-hidden px-1.5"
                      style={{
                        left: `${s.izquierda}%`,
                        width: `${s.ancho}%`,
                        backgroundColor: s.color,
                        borderTopLeftRadius: s.recortado ? 0 : 6,
                        borderBottomLeftRadius: s.recortado ? 0 : 6,
                        borderTopRightRadius: s.enCurso ? 10 : 6,
                        borderBottomRightRadius: s.enCurso ? 10 : 6,
                        borderLeft: s.recortado ? '3px dashed #FFFFFFAA' : 'none',
                      }}
                    >
                      {s.ancho > 12 && (
                        <span className="truncate text-[11px] font-medium text-white">
                          {s.etapa}
                        </span>
                      )}
                    </span>
                  ))}
                </div>
              </button>
            </li>
          ))}
        </ul>

        {/* ---------------------------- referencia -------------------------- */}
        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-[var(--gm-divisor)] pt-3 text-[11px] text-[var(--gm-texto-suave)]">
          {['comienzo', 'proceso', 'convencer', 'posible-venta', 'cerrado'].map((id) => (
            <span key={id} className="inline-flex items-center gap-1.5">
              <span
                className="h-2.5 w-4 rounded-sm"
                style={{ backgroundColor: getEtapa(id).color }}
              />
              {getEtapa(id).nombre}
            </span>
          ))}
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-4 rounded-sm border-l-[3px] border-dashed border-white bg-[#BC6C31]" />
            empezó antes del rango
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-4 rounded-l-sm rounded-r-full bg-[#BC6C31]" />
            en curso
          </span>
        </div>
      </div>
    </div>
  );
}
