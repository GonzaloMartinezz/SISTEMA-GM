// ============================================================================
// SISTEMA GM · M-04 · RECORRIDO DE LA VENTA (stepper)
// ----------------------------------------------------------------------------
// Cinco nodos, uno por etapa. Lo recorrido se pinta con la rampa; lo que falta
// queda hueco. De un vistazo se ve no sólo dónde está la venta sino cuánto
// camino hizo, que es la diferencia entre un cartelito de estado y un recorrido.
//
// El color nunca va solo: cada nodo lleva su etapa en el title, el nodo actual
// tiene un anillo que lo distingue por forma, y la tabla muestra además el
// nombre de la etapa al lado. Si el usuario no distingue los tonos de la rampa,
// no se pierde nada.
// ============================================================================

import React from 'react';
import { Check } from 'lucide-react';
import { ETAPAS, indiceEtapa } from '../config/pipeline.config';

export default function PasosEtapa({ etapa, tamano = 'md', className = '' }) {
  const actual = indiceEtapa(etapa);
  const chico = tamano === 'sm';
  const nodo = chico ? 'h-[18px] w-[18px]' : 'h-[22px] w-[22px]';

  return (
    <div className={`flex items-center ${className}`} role="img" aria-label={`Etapa: ${ETAPAS[actual]?.nombre || '—'}`}>
      {ETAPAS.map((e, i) => {
        const hecho = i < actual;
        const esActual = i === actual;
        const color = ETAPAS[Math.min(actual, ETAPAS.length - 1)].color;

        return (
          <React.Fragment key={e.id}>
            {i > 0 && (
              <span
                aria-hidden="true"
                className={`h-[2px] ${chico ? 'w-4' : 'w-6'} rounded-full`}
                style={{ backgroundColor: i <= actual ? color : '#EFE7DB' }}
              />
            )}
            <span
              title={`${i + 1}. ${e.nombre} · ${e.bajada}`}
              className={`grid ${nodo} shrink-0 place-items-center rounded-full border-[1.5px] transition`}
              style={{
                backgroundColor: hecho || esActual ? color : '#FFFFFF',
                borderColor: hecho || esActual ? color : '#DDD3C4',
                boxShadow: esActual ? `0 0 0 3px ${color}33` : 'none',
              }}
            >
              {hecho && <Check size={chico ? 10 : 12} strokeWidth={3} color="#FFFFFF" />}
              {esActual && (
                <span
                  className="rounded-full bg-white dark:bg-[#1E1E1E]"
                  style={{ height: chico ? 5 : 6, width: chico ? 5 : 6 }}
                />
              )}
            </span>
          </React.Fragment>
        );
      })}
    </div>
  );
}
