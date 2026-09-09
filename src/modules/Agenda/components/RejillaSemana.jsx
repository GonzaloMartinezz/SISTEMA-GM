// ============================================================================
// SISTEMA GM · M-05 · LA SEMANA EN SIETE COLUMNAS
// ----------------------------------------------------------------------------
// Cada columna es un día, con su barra de carga arriba. La barra es lo que hace
// útil esta vista: mirando siete listas no se ve cuál día está saturado y cuál
// vacío, mirando siete barras sí, y es exactamente la pregunta que uno le hace
// a la semana cuando tiene que meter algo nuevo.
//
// Los compromisos se pueden arrastrar de un día a otro. Mover algo de día es la
// operación más común de una semana y no debería costar abrir un formulario.
// ============================================================================

import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { getTipo } from '../config/agenda.config';
import { cargaDelDia, diaCorto, esHoy, esFinDeSemana, horasYminutos, numeroDia } from '../utils/calendario';
import BarraCarga from './BarraCarga';

export default function RejillaSemana({ dias, eventosDe, onEvento, onNuevo, onMover }) {
  const [encima, setEncima] = useState(null);

  const soltar = (dia) => (e) => {
    e.preventDefault();
    setEncima(null);
    const codigo = e.dataTransfer.getData('text/plain');
    if (codigo) onMover?.(codigo, dia);
  };

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
      {dias.map((dia) => {
        const eventos = eventosDe(dia);
        const carga = cargaDelDia(eventos);
        const hoy = esHoy(dia);

        return (
          <section
            key={dia}
            onDragOver={(e) => {
              e.preventDefault();
              setEncima(dia);
            }}
            onDragLeave={() => setEncima((d) => (d === dia ? null : d))}
            onDrop={soltar(dia)}
            className={`flex min-h-[240px] flex-col rounded-2xl border transition ${
              encima === dia
                ? 'border-[#B4551A] bg-[var(--gm-acento-suave-bg)] /50'
                : hoy
                  ? 'border-[var(--gm-borde-fuerte)] bg-[var(--gm-superficie)] '
                  : esFinDeSemana(dia)
                    ? 'border-[#EFE7DB] bg-[var(--gm-fondo)] '
                    : 'border-[var(--gm-borde)]  bg-[var(--gm-superficie-suave)] '
            }`}
          >
            <header className="border-b border-[#EFE7DB] px-3 py-2.5">
              <div className="flex items-baseline justify-between gap-2">
                <span
                  className={`text-[12px] font-semibold capitalize ${
                    hoy ? 'text-[var(--gm-acento)]' : 'text-[var(--gm-texto-medio)] '
                  }`}
                >
                  {diaCorto(dia)}
                </span>
                {/* Un día con dos visitas ya cumplidas no está "ocupado": está
                    cerrado. Decir "0 min" al lado de dos tarjetas confunde. */}
                <span className={`text-[11px] ${hoy ? 'text-[var(--gm-acento)]' : 'text-[var(--gm-texto-tenue)] '}`}>
                  {carga.minutos
                    ? horasYminutos(carga.minutos)
                    : eventos.length
                      ? 'todo cerrado'
                      : 'libre'}
                </span>
              </div>
              <div className="mt-2">
                <BarraCarga carga={carga} compacto />
              </div>
            </header>

            <div className="flex flex-1 flex-col gap-1.5 overflow-y-auto p-2">
              {eventos.map((ev) => {
                const tipo = getTipo(ev.tipo);
                const cerrado = ev.estado !== 'pendiente';
                return (
                  <button
                    key={ev.id}
                    type="button"
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData('text/plain', ev.id);
                      e.dataTransfer.effectAllowed = 'move';
                    }}
                    onClick={() => onEvento?.(ev)}
                    title={`${ev.hora} · ${ev.titulo}`}
                    className={`cursor-grab overflow-hidden rounded-lg border px-2 py-1.5 text-left transition hover:shadow-[0_6px_16px_-10px_rgba(26,26,24,0.35)] active:cursor-grabbing ${
                      cerrado ? 'opacity-55' : ''
                    }`}
                    style={{
                      backgroundColor: cerrado ? '#F6F1E9' : `${tipo.color}14`,
                      borderColor: cerrado ? '#E8E0D5' : `${tipo.color}44`,
                      borderLeft: `3px solid ${cerrado ? '#D5CABA' : tipo.color}`,
                    }}
                  >
                    <span className="flex items-center gap-1.5">
                      <tipo.icono size={11} style={{ color: cerrado ? '#B0A697' : tipo.color }} />
                      <span className="text-[11px] tabular-nums text-[var(--gm-texto-medio)]">{ev.hora}</span>
                    </span>
                    <p
                      className={`truncate text-[12px] font-medium text-[var(--gm-texto)]  ${
                        cerrado ? 'line-through' : ''
                      }`}
                    >
                      {ev.titulo}
                    </p>
                    {ev.cliente && (
                      <p className="truncate text-[11px] text-[var(--gm-texto-suave)]">{ev.cliente}</p>
                    )}
                  </button>
                );
              })}

              <button
                type="button"
                onClick={() => onNuevo?.(dia)}
                aria-label={`Agendar el ${numeroDia(dia)}`}
                className="mt-auto flex items-center justify-center gap-1 rounded-lg border border-dashed border-[#DDD3C4] py-2 text-[11px] text-[var(--gm-texto-tenue)] transition hover:border-[#B4551A] hover:text-[var(--gm-acento-fuerte)]"
              >
                <Plus size={12} />
                Agendar
              </button>
            </div>
          </section>
        );
      })}
    </div>
  );
}
