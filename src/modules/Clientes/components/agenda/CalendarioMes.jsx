// ============================================================================
// SISTEMA GM · M-01 CLIENTES · CALENDARIO MENSUAL
// ----------------------------------------------------------------------------
// Vista de mes con la carga real de cada día: un punto por evento (hasta tres)
// y el resto contado. El día seleccionado manda sobre la lista de la derecha.
// La semana arranca en lunes, como se trabaja acá.
// ============================================================================

import React, { useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const DIAS = ['lu', 'ma', 'mi', 'ju', 'vi', 'sá', 'do'];
const COLOR_TIPO = { visita: '#2F6DA0', llamada: '#C08A1E', reunion: '#2F6DA0' };

const iso = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

export default function CalendarioMes({ mes, onCambiarMes, eventos = [], seleccionado, onSeleccionar }) {
  const { celdas, titulo } = useMemo(() => {
    const primero = new Date(mes.getFullYear(), mes.getMonth(), 1);
    const offset = (primero.getDay() + 6) % 7; // lunes = 0
    const dias = new Date(mes.getFullYear(), mes.getMonth() + 1, 0).getDate();

    const lista = [];
    for (let i = 0; i < offset; i += 1) lista.push(null);
    for (let d = 1; d <= dias; d += 1) lista.push(new Date(mes.getFullYear(), mes.getMonth(), d));

    return {
      celdas: lista,
      titulo: mes.toLocaleDateString('es-AR', { month: 'long', year: 'numeric' }),
    };
  }, [mes]);

  const porDia = useMemo(() => {
    const mapa = new Map();
    eventos.forEach((e) => {
      if (!mapa.has(e.fecha)) mapa.set(e.fecha, []);
      mapa.get(e.fecha).push(e);
    });
    return mapa;
  }, [eventos]);

  const hoy = iso(new Date());

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-[15px] font-semibold capitalize text-[#2A2118] dark:text-[#F9FAFB]">{titulo}</h3>
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="Mes anterior"
            onClick={() => onCambiarMes(new Date(mes.getFullYear(), mes.getMonth() - 1, 1))}
            className="grid h-9 w-9 place-items-center rounded-xl text-[#948A7C] transition hover:bg-[#F3EDE4] dark:hover:bg-[#121212] hover:text-[#2A2118] dark:text-[#F9FAFB]"
          >
            <ChevronLeft size={17} />
          </button>
          <button
            type="button"
            aria-label="Mes siguiente"
            onClick={() => onCambiarMes(new Date(mes.getFullYear(), mes.getMonth() + 1, 1))}
            className="grid h-9 w-9 place-items-center rounded-xl text-[#948A7C] transition hover:bg-[#F3EDE4] dark:hover:bg-[#121212] hover:text-[#2A2118] dark:text-[#F9FAFB]"
          >
            <ChevronRight size={17} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {DIAS.map((d) => (
          <div
            key={d}
            className="pb-2 text-center text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--gm-texto-medio)] dark:text-[#6B7280]"
          >
            {d}
          </div>
        ))}

        {celdas.map((d, i) => {
          if (!d) return <div key={`v-${i}`} />;
          const clave = iso(d);
          const delDia = porDia.get(clave) || [];
          const activo = clave === seleccionado;
          const esHoy = clave === hoy;

          return (
            <button
              key={clave}
              type="button"
              onClick={() => onSeleccionar(clave)}
              className={`flex aspect-square flex-col items-center justify-center gap-1 rounded-xl border text-[14px] transition ${
                activo
                  ? 'border-[#2F6DA0] bg-[#FBE5C8] dark:bg-[#2A1608] font-semibold text-[#2F6DA0]'
                  : esHoy
                    ? 'border-[#D5CABA] bg-[var(--gm-superficie)] dark:bg-[#1E1E1E] font-semibold text-[#2A2118] dark:text-[#F9FAFB]'
                    : 'border-transparent text-[#6E6559] dark:text-[#9CA3AF] hover:bg-[#F6F1E9] dark:hover:bg-[#2D2D2D]'
              }`}
            >
              <span>{d.getDate()}</span>
              <span className="flex h-1.5 items-center gap-0.5">
                {delDia.slice(0, 3).map((e) => (
                  <span
                    key={e.id}
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: COLOR_TIPO[e.tipo] || '#948A7C' }}
                  />
                ))}
                {delDia.length > 3 && (
                  <span className="text-[9px] font-semibold text-[var(--gm-texto-medio)] dark:text-[#6B7280]">+{delDia.length - 3}</span>
                )}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-4 border-t border-[var(--gm-borde-fuerte)] dark:border-[#333333] pt-4 text-[12px] text-[#948A7C]">
        {Object.entries(COLOR_TIPO).map(([tipo, color]) => (
          <span key={tipo} className="inline-flex items-center gap-1.5 capitalize">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
            {tipo}
          </span>
        ))}
      </div>
    </div>
  );
}
