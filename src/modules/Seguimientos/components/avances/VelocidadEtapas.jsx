// ============================================================================
// SISTEMA GM · M-04 · CUÁNTO TARDA CADA ETAPA
// ----------------------------------------------------------------------------
// El promedio se calcula sólo con tramos terminados. Una etapa que todavía no
// vio salir a nadie no muestra un cero (que se leería como "es instantánea"):
// muestra "sin datos todavía" y dice cuántas ventas están adentro esperando.
//
// Al lado de cada barra va la cantidad de casos sobre la que está hecho el
// promedio. Un promedio sobre dos ventas y uno sobre cuarenta se ven igual en
// un gráfico y valen cosas muy distintas.
// ============================================================================

import React from 'react';
import { AlertTriangle } from 'lucide-react';

export default function VelocidadEtapas({ etapas }) {
  const conDato = etapas.filter((e) => e.promedio != null);
  const maximo = Math.max(...conDato.map((e) => e.promedio), 1);

  return (
    <ul className="space-y-4">
      {etapas.map((e) => (
        <li key={e.id}>
          <div className="flex items-baseline justify-between gap-3">
            <span className="flex items-center gap-2 text-[13px] font-medium text-[#2A2118] dark:text-[#F9FAFB]">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: e.color }} />
              {e.nombre}
            </span>
            {e.promedio == null ? (
              <span className="text-[12px] text-[#B0A697] dark:text-[#6B7280]">sin datos todavía</span>
            ) : (
              <span className="whitespace-nowrap text-[13px] font-semibold text-[#2A2118] dark:text-[#F9FAFB]">
                {e.promedio.toFixed(1)} días
              </span>
            )}
          </div>

          <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-[#F3EDE4] dark:bg-[#121212]">
            {e.promedio != null && (
              <span
                className="block h-full rounded-full"
                style={{ width: `${(e.promedio / maximo) * 100}%`, backgroundColor: e.color }}
              />
            )}
          </div>

          <p className="mt-1 flex flex-wrap items-center gap-x-2 text-[11px] text-[#B0A697] dark:text-[#6B7280]">
            {e.promedio == null ? (
              <span>
                {e.enCurso} {e.enCurso === 1 ? 'venta adentro' : 'ventas adentro'}, ninguna salió
                todavía.
              </span>
            ) : (
              <>
                <span>
                  sobre {e.muestras} {e.muestras === 1 ? 'venta que ya pasó' : 'ventas que ya pasaron'}
                </span>
                <span>·</span>
                <span>{e.enCurso} adentro hoy</span>
                {e.demorados > 0 && (
                  <span className="inline-flex items-center gap-1 text-[#B4551A]">
                    <AlertTriangle size={11} />
                    {e.demorados} {e.demorados === 1 ? 'pasada' : 'pasadas'} de tiempo
                  </span>
                )}
              </>
            )}
          </p>
        </li>
      ))}
    </ul>
  );
}
