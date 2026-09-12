// ============================================================================
// SISTEMA GM · M-03 · COLUMNA DEL TABLERO
// ----------------------------------------------------------------------------
// Encabezado con la etapa, cuántas oportunidades tiene y cuánta plata suma.
// La barra de abajo es la probabilidad de la etapa, no el avance de la columna:
// dice qué parte de ese monto es razonable esperar que entre.
// ============================================================================

import React, { useState } from 'react';
import { useSeguimientos } from '../context/SeguimientosContext';
import TarjetaLead from './TarjetaLead';

const usd = (v) => `US$ ${Number(v || 0).toLocaleString('es-AR')}`;

export default function ColumnaEtapa({ etapa, leads, onMensaje, onEditar, onEliminar }) {
  const { cambiarEtapa, marcarContacto } = useSeguimientos();
  const [encima, setEncima] = useState(false);

  const valor = leads.reduce((a, l) => a + Number(l.montoUsd || 0), 0);

  const soltar = (e) => {
    e.preventDefault();
    setEncima(false);
    const codigo = e.dataTransfer.getData('text/plain');
    if (codigo) cambiarEtapa(codigo, etapa.id);
  };

  const arrastrar = (e, codigo) => {
    e.dataTransfer.setData('text/plain', codigo);
    e.dataTransfer.effectAllowed = 'move';
  };

  return (
    <section
      onDragOver={(e) => {
        e.preventDefault();
        setEncima(true);
      }}
      onDragLeave={() => setEncima(false)}
      onDrop={soltar}
      className={`flex w-full flex-col rounded-2xl border transition sm:w-[276px] sm:shrink-0 ${
        encima ? 'border-[#B4551A] bg-[var(--gm-acento-suave-bg)]/50' : 'border-[var(--gm-borde)] bg-[var(--gm-superficie-suave)]'
      }`}
    >
      <header className="border-b border-[#EFE7DB] px-4 py-3.5">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: etapa.color }} />
          <h3 className="min-w-0 flex-1 truncate text-[14px] font-semibold text-[var(--gm-texto)]">
            {etapa.nombre}
          </h3>
          <span className="rounded-full bg-[var(--gm-superficie-fuerte)] px-2 py-0.5 text-[11px] font-semibold text-[var(--gm-texto-medio)]">
            {leads.length}
          </span>
        </div>

        <p className="mt-2 text-[15px] font-semibold text-[var(--gm-texto)]">{usd(valor)}</p>
        <p className="text-[11px] text-[var(--gm-texto-tenue)]">
          {etapa.probabilidad}% de probabilidad · {usd((valor * etapa.probabilidad) / 100)} ponderado
        </p>

        <div className="mt-2 h-1 overflow-hidden rounded-full bg-[#EFE7DB]">
          <span
            className="block h-full rounded-full"
            style={{ width: `${etapa.probabilidad}%`, backgroundColor: etapa.color }}
          />
        </div>
      </header>

      <div className="flex min-h-[120px] flex-1 flex-col gap-2.5 overflow-y-auto p-3">
        {leads.length === 0 ? (
          <p className="grid flex-1 place-items-center rounded-xl border border-dashed border-[#DDD3C4] px-3 py-8 text-center text-[12px] text-[var(--gm-texto-tenue)]">
            Soltá una tarjeta acá
          </p>
        ) : (
          leads.map((l) => (
            <TarjetaLead
              key={l.id}
              lead={l}
              onMensaje={onMensaje}
              onContacto={marcarContacto}
              onEditar={onEditar}
              onEliminar={onEliminar}
              onArrastrar={arrastrar}
            />
          ))
        )}
      </div>
    </section>
  );
}
