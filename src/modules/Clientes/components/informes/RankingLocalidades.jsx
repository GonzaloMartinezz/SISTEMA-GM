// ============================================================================
// SISTEMA GM · M-01 CLIENTES · RANKING DE LOCALIDADES
// ----------------------------------------------------------------------------
// Dónde está concentrada la cartera. Barra proporcional al máximo, con la
// cantidad y el porcentaje escritos: sirve para decidir a qué zona conviene
// salir a hacer campo.
// ============================================================================

import React, { useMemo } from 'react';
import { MapPin } from 'lucide-react';
import { SERIE } from '../../../../shared/gm-ui/tokens';
import EstadoVacio from '../../../../shared/gm-ui/EstadoVacio';

export default function RankingLocalidades({ clientes = [], limite = 8 }) {
  const filas = useMemo(() => {
    const mapa = new Map();
    clientes.forEach((c) => {
      const k = c.localidad || 'Sin localidad';
      mapa.set(k, (mapa.get(k) || 0) + 1);
    });
    return [...mapa.entries()]
      .map(([localidad, cantidad]) => ({ localidad, cantidad }))
      .sort((a, b) => b.cantidad - a.cantidad)
      .slice(0, limite);
  }, [clientes, limite]);

  if (!filas.length) {
    return <EstadoVacio icono={MapPin} titulo="Sin localidades cargadas" texto="Completá la ubicación de las cuentas para ver este ranking." />;
  }

  const tope = filas[0].cantidad;
  const total = clientes.length || 1;

  return (
    <ol className="space-y-4">
      {filas.map((f, i) => (
        <li key={f.localidad}>
          <div className="mb-1.5 flex items-baseline justify-between gap-3">
            <span className="flex min-w-0 items-baseline gap-2">
              <span className="w-4 shrink-0 text-[12px] font-semibold text-[var(--gm-texto-medio)] dark:text-[#6B7280]">{i + 1}</span>
              <span className="truncate text-[14px] text-[#2A2118] dark:text-[#F9FAFB]">{f.localidad}</span>
            </span>
            <span className="shrink-0 text-[13px]">
              <span className="font-semibold text-[#2A2118] dark:text-[#F9FAFB]">{f.cantidad}</span>
              <span className="ml-1.5 text-[var(--gm-texto-medio)] dark:text-[#6B7280]">{Math.round((f.cantidad / total) * 100)}%</span>
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-[#F3EDE4] dark:bg-[#121212]">
            <div
              className="h-full rounded-full"
              style={{ width: `${(f.cantidad / tope) * 100}%`, backgroundColor: SERIE.azul }}
            />
          </div>
        </li>
      ))}
    </ol>
  );
}
