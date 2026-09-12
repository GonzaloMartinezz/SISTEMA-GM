// ============================================================================
// SISTEMA GM · M-01 CLIENTES · EMBUDO DEL PIPELINE
// ----------------------------------------------------------------------------
// Embudo horizontal: una barra por etapa, con la cantidad de oportunidades, el
// monto en juego y qué porcentaje del total representa. El ancho de la barra es
// proporcional a la etapa más cargada, así se ve de un vistazo dónde se traba
// el proceso. Cada barra lleva su valor escrito: el color nunca es el único dato.
// ============================================================================

import React from 'react';
import { ETAPAS } from '../../../Seguimientos/config/pipeline.config';
import { RAMPA, GM } from '../../../../shared/gm-ui/tokens';
import { usd } from '../../../../shared/gm-ui/graficos';
import EstadoVacio from '../../../../shared/gm-ui/EstadoVacio';

export default function EmbudoPipeline({ leads = [] }) {
  if (!leads.length) {
    return (
      <EstadoVacio
        titulo="El pipeline está vacío"
        texto="Cuando se carguen oportunidades en Seguimientos vas a ver acá en qué etapa está cada una."
      />
    );
  }

  const filas = ETAPAS.map((e, i) => {
    const delEtapa = leads.filter((l) => l.etapa === e.id);
    return {
      id: e.id,
      etiqueta: e.label,
      descripcion: e.desc,
      cantidad: delEtapa.length,
      monto: delEtapa.reduce((s, l) => s + Number(l.montoUsd || 0), 0),
      probabilidad: e.probabilidad,
      color: RAMPA[i % RAMPA.length],
    };
  });

  const tope = Math.max(...filas.map((f) => f.cantidad), 1);
  const total = leads.length;

  return (
    <div className="space-y-4">
      {filas.map((f) => (
        <div key={f.id}>
          <div className="mb-1.5 flex flex-wrap items-baseline justify-between gap-2">
            <div className="flex items-baseline gap-2">
              <span className="text-[14px] font-medium text-[#2A2118] dark:text-[#F9FAFB]">{f.etiqueta}</span>
              <span className="text-[12px] text-[var(--gm-texto-medio)] dark:text-[#6B7280]">{f.descripcion}</span>
            </div>
            <div className="flex items-baseline gap-3 text-[13px]">
              <span className="font-semibold text-[#2A2118] dark:text-[#F9FAFB]">
                {f.cantidad} {f.cantidad === 1 ? 'oportunidad' : 'oportunidades'}
              </span>
              <span className="text-[#948A7C]">{usd(f.monto)}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-8 flex-1 overflow-hidden rounded-lg bg-[#F3EDE4] dark:bg-[#121212]">
              <div
                className="flex h-full items-center justify-end rounded-lg px-2.5 transition-[width] duration-500"
                style={{
                  width: `${Math.max((f.cantidad / tope) * 100, f.cantidad ? 8 : 0)}%`,
                  backgroundColor: f.color,
                }}
              >
                {f.cantidad > 0 && (
                  <span className="text-[12px] font-semibold text-[#FFFFFF]">
                    {Math.round((f.cantidad / total) * 100)}%
                  </span>
                )}
              </div>
            </div>
            <span
              className="w-[92px] shrink-0 text-right text-[12px]"
              style={{ color: GM.textoSuave }}
            >
              cierre {f.probabilidad}%
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
