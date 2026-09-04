// ============================================================================
// SISTEMA GM · M-08 · LÍNEA DE CUOTAS
// ----------------------------------------------------------------------------
// El plan de pago de una venta, de un vistazo: un casillero por cuota, en
// orden, con el anticipo adelante porque cronológicamente va primero.
//
// El estado no viaja sólo en el color. Cada casillero tiene además una forma:
// la pagada va llena, la vencida lleva un borde grueso, la pendiente va vacía.
// Alguien que no distingue verde de rojo tiene que poder leer esto igual.
// ============================================================================

import React from 'react';
import { getEstadoCuota, usd, fechaCorta } from '../config/cobranzas.config';
import { ESTADO_COLOR } from '../../../shared/gm-ui/tokens';

export default function LineaCuotas({
  cuotas = [],
  anticipo = 0,
  anticipoCobrado = 0,
  onCuota,
  compacta = false,
}) {
  if (!cuotas.length && anticipo <= 0) {
    return (
      <p className="text-[13px] text-[#948A7C]">
        Esta venta no tiene plan de cuotas cargado.
      </p>
    );
  }

  const lado = compacta ? 'h-7 min-w-[28px]' : 'h-9 min-w-[38px]';

  return (
    <div className="flex flex-wrap items-start gap-1.5">
      {anticipo > 0 && (
        <Casillero
          etiqueta="Ant."
          titulo={`Anticipo · ${usd(anticipo)}${
            anticipoCobrado >= anticipo ? ' · cobrado' : ' · sin cobrar'
          }`}
          lado={lado}
          color={anticipoCobrado >= anticipo ? ESTADO_COLOR.bien : ESTADO_COLOR.atencion}
          lleno={anticipoCobrado >= anticipo}
          borde={anticipoCobrado < anticipo}
        />
      )}

      {cuotas.map((c) => {
        const e = getEstadoCuota(c.estado);
        return (
          <Casillero
            key={c.codigo}
            etiqueta={c.numero}
            titulo={`Cuota ${c.numero} · ${usd(c.montoUsd)} · vence ${fechaCorta(c.vencimiento)} · ${e.nombre}`}
            lado={lado}
            color={e.color}
            lleno={c.estado === 'pagada'}
            borde={c.estado === 'vencida'}
            mitad={c.estado === 'parcial'}
            onClick={onCuota ? () => onCuota(c) : undefined}
          />
        );
      })}
    </div>
  );
}

function Casillero({ etiqueta, titulo, lado, color, lleno, borde, mitad, onClick }) {
  const Etiqueta = onClick ? 'button' : 'span';
  return (
    <Etiqueta
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      title={titulo}
      aria-label={titulo}
      className={`relative grid ${lado} shrink-0 place-items-center overflow-hidden rounded-lg px-1.5 text-[11px] font-semibold tabular-nums transition ${
        onClick ? 'cursor-pointer hover:scale-[1.06]' : ''
      }`}
      style={{
        backgroundColor: lleno ? color : '#FFFFFF',
        color: lleno ? '#FFFFFF' : color,
        border: `${borde ? 2 : 1}px solid ${lleno ? color : `${color}66`}`,
      }}
    >
      {/* La cuota pagada a medias se dibuja medio llena, literalmente. */}
      {mitad && (
        <span
          className="absolute inset-y-0 left-0 w-1/2"
          style={{ backgroundColor: `${color}33` }}
          aria-hidden="true"
        />
      )}
      <span className="relative">{etiqueta}</span>
    </Etiqueta>
  );
}
