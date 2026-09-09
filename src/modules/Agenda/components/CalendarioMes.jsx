// ============================================================================
// SISTEMA GM · M-05 · EL MES
// ----------------------------------------------------------------------------
// Rejilla de lunes a domingo. Cada celda muestra los primeros compromisos y una
// barra fina de carga abajo: a esta escala no importa QUÉ hay cada día sino
// CUÁNTO, porque la pregunta del mes es dónde queda lugar.
//
// Los días de otro mes se dibujan apagados pero se dibujan: una semana partida
// al medio esconde justo los días en que se planifica el mes que viene.
// ============================================================================

import React from 'react';
import { getTipo } from '../config/agenda.config';
import { cargaDelDia, esHoy, esFinDeSemana, numeroDia } from '../utils/calendario';

const NOMBRES = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
const MAX_VISIBLES = 3;

export default function CalendarioMes({ celdas, eventosDe, seleccion, onDia, onEvento, onMover }) {
  const [encima, setEncima] = React.useState(null);

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[760px]">
        <div className="grid grid-cols-7 gap-2 pb-2">
          {NOMBRES.map((n) => (
            <div
              key={n}
              className="px-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--gm-texto-tenue)]"
            >
              {n}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {celdas.map(({ iso, delMes }) => {
            const eventos = eventosDe(iso);
            const carga = cargaDelDia(eventos);
            const hoy = esHoy(iso);
            const elegido = iso === seleccion;

            return (
              <button
                key={iso}
                type="button"
                onClick={() => onDia?.(iso)}
                onDragOver={(e) => {
                  e.preventDefault();
                  setEncima(iso);
                }}
                onDragLeave={() => setEncima((d) => (d === iso ? null : d))}
                onDrop={(e) => {
                  e.preventDefault();
                  setEncima(null);
                  const codigo = e.dataTransfer.getData('text/plain');
                  if (codigo) onMover?.(codigo, iso);
                }}
                className={`flex h-[122px] flex-col rounded-xl border p-2 text-left transition ${
                  encima === iso
                    ? 'border-[#B4551A] bg-[var(--gm-acento-suave-bg)] /60'
                    : elegido
                      ? 'border-[#B4551A] bg-[var(--gm-superficie)] '
                      : delMes
                        ? esFinDeSemana(iso)
                          ? 'border-[#EFE7DB] bg-[var(--gm-fondo)]  hover:border-[var(--gm-borde-fuerte)]'
                          : 'border-[var(--gm-borde)]  bg-[var(--gm-superficie)]  hover:border-[var(--gm-borde-fuerte)]'
                        : 'border-[#F0EAE1]  bg-[#FBF8F3]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`grid h-6 w-6 place-items-center rounded-full text-[12px] font-semibold ${
                      hoy
                        ? 'bg-[#B4551A] text-white'
                        : delMes
                          ? 'text-[var(--gm-texto)] '
                          : 'text-[#C6BCAC]'
                    }`}
                  >
                    {numeroDia(iso)}
                  </span>
                  {eventos.length > 0 && (
                    <span className="text-[10px] text-[var(--gm-texto-tenue)]">{eventos.length}</span>
                  )}
                </div>

                <div className="mt-1 flex flex-1 flex-col gap-1 overflow-hidden">
                  {eventos.slice(0, MAX_VISIBLES).map((ev) => {
                    const tipo = getTipo(ev.tipo);
                    const cerrado = ev.estado !== 'pendiente';
                    return (
                      <span
                        key={ev.id}
                        draggable
                        onDragStart={(e) => {
                          e.stopPropagation();
                          e.dataTransfer.setData('text/plain', ev.id);
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          onEvento?.(ev);
                        }}
                        title={`${ev.hora} · ${ev.titulo}`}
                        className={`flex items-center gap-1 overflow-hidden rounded px-1 py-0.5 text-[10px] leading-tight ${
                          cerrado ? 'opacity-50 line-through' : ''
                        }`}
                        style={{ backgroundColor: `${tipo.color}18`, color: '#3D3225' }}
                      >
                        <span
                          className="h-1.5 w-1.5 shrink-0 rounded-full"
                          style={{ backgroundColor: tipo.color }}
                        />
                        <span className="shrink-0 tabular-nums">{ev.hora}</span>
                        <span className="truncate">{ev.titulo}</span>
                      </span>
                    );
                  })}
                  {eventos.length > MAX_VISIBLES && (
                    <span className="px-1 text-[10px] text-[var(--gm-texto-suave)]">
                      +{eventos.length - MAX_VISIBLES} más
                    </span>
                  )}
                </div>

                {eventos.length > 0 && (
                  <span className="mt-1 block h-1 overflow-hidden rounded-full bg-[#F0EAE1]">
                    <span
                      className="block h-full rounded-full"
                      style={{
                        width: `${Math.min(carga.pct, 100)}%`,
                        backgroundColor: carga.excedido
                          ? '#A63A0C'
                          : carga.lleno
                            ? '#C08A1E'
                            : '#2E9B76',
                      }}
                    />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
