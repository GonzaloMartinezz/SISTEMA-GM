// ============================================================================
// SISTEMA GM · UI · TARJETA DE INDICADOR
// ----------------------------------------------------------------------------
// Tarjeta neutra con un acento fino: una barra de 3px al costado y el ícono
// teñido. El número es lo único que resalta, que es de lo que se trata un
// indicador. Nada de rellenos de color pleno: cansan en jornadas largas y le
// compiten al dato.
// ============================================================================

import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useTema } from './TemaProvider';

const FLECHA = { sube: TrendingUp, baja: TrendingDown, igual: Minus };

export default function TarjetaKpi({
  etiqueta,
  valor,
  detalle,
  variacion,
  tendencia = 'igual',
  icono: Icono,
  tono = 'azul',
}) {
  const { tinte, acentoTono } = useTema();
  const Flecha = FLECHA[tendencia] || Minus;
  const t = tinte[tono] || tinte.azul;
  const acento = acentoTono[tono] || acentoTono.azul;

  // Un importe largo (US$ 1.234.567) no puede partirse en dos renglones: por
  // encima de 9 caracteres el número baja un escalón de tamaño.
  const largo = String(valor ?? '').length;
  const tamanoValor = largo > 12 ? 'text-[22px]' : largo > 9 ? 'text-[26px]' : 'text-[30px]';

  return (
    <div className="relative overflow-hidden rounded-2xl border border-[var(--gm-borde)] bg-[var(--gm-superficie)] p-5 pl-6 shadow-[var(--gm-sombra-panel)]">
      <span
        className="absolute inset-y-0 left-0 w-[3px]"
        style={{ backgroundColor: acento }}
        aria-hidden="true"
      />

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--gm-texto-medio)]">
            {etiqueta}
          </p>
          <p
            className={`mt-2 ${tamanoValor} whitespace-nowrap leading-none tracking-tight text-[var(--gm-texto)]`}
          >
            {valor}
          </p>
        </div>
        {Icono && (
          <span
            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl"
            style={{ backgroundColor: t.bg, color: t.fg }}
          >
            <Icono size={19} strokeWidth={2} />
          </span>
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1">
        {variacion != null && (
          <span className="inline-flex items-center gap-1 text-[13px]" style={{ color: acento }}>
            <Flecha size={14} strokeWidth={2.4} />
            {variacion}
          </span>
        )}
        {detalle && <span className="text-[13px] text-[var(--gm-texto-medio)]">{detalle}</span>}
      </div>
    </div>
  );
}
