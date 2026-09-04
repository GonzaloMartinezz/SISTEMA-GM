// ============================================================================
// SISTEMA GM · M-04 · CHIP DE ETAPA Y DE TEMPERATURA
// ----------------------------------------------------------------------------
// Las etapas usan la rampa ordinal, que no entra en los tintes fijos del kit
// compartido, así que el chip se arma acá con el color de la etapa en baja
// opacidad. Siempre lleva el nombre escrito: el tono es un refuerzo, no el dato.
// ============================================================================

import React from 'react';
import { getEtapa, getTemperatura } from '../config/pipeline.config';

export function ChipEtapa({ etapa, className = '' }) {
  const e = getEtapa(etapa);
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-[12px] font-medium leading-none ${className}`}
      style={{ backgroundColor: `${e.color}1F`, color: '#4A3520', borderColor: `${e.color}66` }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: e.color }} />
      {e.nombre}
    </span>
  );
}

export function ChipTemperatura({ dias = 0, className = '' }) {
  const t = getTemperatura(dias);
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap text-[12px] ${className}`}
      style={{ color: t.color }}
      title={`${dias === 99 ? 'Nunca' : `Hace ${dias} días`} sin contacto`}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: t.color }} />
      {dias === 99 ? 'Sin contacto' : `${dias}d · ${t.nombre}`}
    </span>
  );
}

export default ChipEtapa;
