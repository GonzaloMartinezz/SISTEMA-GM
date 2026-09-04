// ============================================================================
// SISTEMA GM · UI · TARJETA DE INDICADOR CON MINIGRÁFICO
// ----------------------------------------------------------------------------
// Igual que TarjetaKpi, más una curva chiquita atrás con la evolución. El
// número sigue siendo lo que se lee; la curva sólo contesta "¿viene subiendo
// o bajando?" sin ocupar un panel entero.
//
// La curva no lleva ejes ni valores a propósito: no es un gráfico para leer
// cifras, es una forma. Los números están en el panel de abajo.
// ============================================================================

import React, { useId } from 'react';
import { Area, AreaChart, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useTema } from './TemaProvider';

const FLECHA = { sube: TrendingUp, baja: TrendingDown, igual: Minus };

export default function TarjetaKpiSerie({
  etiqueta,
  valor,
  detalle,
  variacion,
  tendencia = 'igual',
  icono: Icono,
  tono = 'azul',
  serie = [],
}) {
  const { tinte, acentoTono } = useTema();
  const id = useId().replace(/:/g, '');
  const Flecha = FLECHA[tendencia] || Minus;
  const t = tinte[tono] || tinte.azul;
  const acento = acentoTono[tono] || acentoTono.azul;

  const largo = String(valor ?? '').length;
  const tamanoValor = largo > 12 ? 'text-[22px]' : largo > 9 ? 'text-[26px]' : 'text-[30px]';

  const datos = serie.map((v, i) => ({ i, v: Number(v) || 0 }));

  return (
    <div className="relative overflow-hidden rounded-2xl border border-[var(--gm-borde)] bg-[var(--gm-superficie)] p-5 pl-6 shadow-[var(--gm-sombra-panel)]">
      <span
        className="absolute inset-y-0 left-0 w-[3px]"
        style={{ backgroundColor: acento }}
        aria-hidden="true"
      />

      {/* La curva vive detrás del contenido, sin robarle lugar al número. */}
      {datos.length > 1 && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[52px] opacity-[0.55]" aria-hidden="true">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={datos} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id={`grad-${id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={acento} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={acento} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="v"
                stroke={acento}
                strokeWidth={1.5}
                fill={`url(#grad-${id})`}
                isAnimationActive={false}
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="relative flex items-start justify-between gap-3">
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

      <div className="relative mt-4 flex flex-wrap items-center gap-x-2 gap-y-1">
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
