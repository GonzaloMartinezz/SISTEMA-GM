// ============================================================================
// SISTEMA GM · NOTARIO 360° · INDICADOR DE PROGRESO DE VENTA
// ============================================================================

import React from 'react';

const colorPorProgreso = (valor) => {
  if (valor >= 75) return { stroke: '#34d399', text: 'text-emerald-400' };
  if (valor >= 45) return { stroke: '#22d3ee', text: 'text-cyan-400' };
  if (valor >= 20) return { stroke: '#fbbf24', text: 'text-amber-400' };
  return { stroke: '#fb7185', text: 'text-rose-400' };
};

export default function ProgressGauge({ valor = 0, size = 54, grosor = 5, etiqueta }) {
  const pct = Math.max(0, Math.min(100, Number(valor) || 0));
  const radio = (size - grosor) / 2;
  const circunferencia = 2 * Math.PI * radio;
  const offset = circunferencia * (1 - pct / 100);
  const color = colorPorProgreso(pct);

  return (
    <div className="flex items-center gap-2.5">
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radio}
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth={grosor}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radio}
            fill="none"
            stroke={color.stroke}
            strokeWidth={grosor}
            strokeLinecap="round"
            strokeDasharray={circunferencia}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 900ms ease-out' }}
          />
        </svg>
        <span
          className={`absolute inset-0 flex items-center justify-center font-mono text-[11px] font-bold tabular-nums ${color.text}`}
        >
          {pct}%
        </span>
      </div>

      {etiqueta && (
        <div className="hidden leading-tight lg:block">
          <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-gray-500">
            Progreso
          </p>
          <p className="text-xs font-semibold text-gray-200">{etiqueta}</p>
        </div>
      )}
    </div>
  );
}
