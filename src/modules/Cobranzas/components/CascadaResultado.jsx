// ============================================================================
// SISTEMA GM · M-07 · DE LO VENDIDO A LO QUE QUEDA
// ----------------------------------------------------------------------------
// La cascada del período: se arranca del total vendido y cada escalón resta
// algo hasta llegar a la ganancia. Es la explicación completa de por qué el
// número final es el que es.
//
// Está dibujada con divs y no con un gráfico de librería a propósito: acá lo
// que importa es leer el monto de cada renglón, no comparar áreas. Una tabla
// con barras se lee mejor y no se rompe en el celular.
// ============================================================================

import React from 'react';
import { usd } from '../config/cobranzas.config';
import { ESTADO_COLOR, RAMPA, SERIE } from '../../../shared/gm-ui/tokens';

const COLOR = {
  base: SERIE.azul,
  resta: RAMPA[2],
  subtotal: SERIE.ambar,
  final: ESTADO_COLOR.bien,
};

export default function CascadaResultado({ pasos = [] }) {
  const tope = Math.max(...pasos.map((p) => Math.abs(p.valor)), 1);

  return (
    <ul className="space-y-2.5">
      {pasos.map((p) => {
        const esNegativo = p.valor < 0;
        const esCierre = p.tipo === 'final' || p.tipo === 'subtotal';
        const color = p.tipo === 'final' && p.valor < 0 ? ESTADO_COLOR.critico : COLOR[p.tipo];
        const ancho = (Math.abs(p.valor) / tope) * 100;

        return (
          <li
            key={p.etiqueta}
            className={esCierre ? 'border-t border-[#EFE7DB] pt-2.5' : ''}
          >
            <div className="flex items-baseline justify-between gap-3">
              <span
                className={`text-[13px] ${
                  esCierre ? 'font-semibold text-[#2A2118]' : 'text-[#6E6559]'
                }`}
              >
                {p.etiqueta}
              </span>
              <span
                className={`shrink-0 tabular-nums ${
                  esCierre ? 'text-[16px] font-semibold' : 'text-[13px]'
                }`}
                style={{ color: esCierre ? color : esNegativo ? '#8A3F11' : '#2A2118' }}
              >
                {esNegativo ? '− ' : ''}{usd(Math.abs(p.valor))}
              </span>
            </div>
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[#F3EDE4]">
              <span
                className="block h-full rounded-full transition-all"
                style={{ width: `${ancho}%`, backgroundColor: color }}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
