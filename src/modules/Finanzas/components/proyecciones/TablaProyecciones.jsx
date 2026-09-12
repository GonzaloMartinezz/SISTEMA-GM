// ============================================================================
// SISTEMA GM · M-09 TESORERÍA · PROYECCIONES
// ----------------------------------------------------------------------------
// A 1, 3, 6, 12 y 60 meses. La tasa que se usa NO es la misma en todos los
// plazos: más allá del año se amortigua a un techo conservador, porque el ritmo
// de los últimos meses no se sostiene cinco años. Cuando eso pasa, la fila lo
// dice: una proyección que no explica su supuesto no sirve para decidir.
// ============================================================================

import React from 'react';
import { Info } from 'lucide-react';
import Tabla from '../../../../shared/gm-ui/Tabla';
import Chip from '../../../../shared/gm-ui/Chip';

const pct = (v, dec = 1) => `${(Number(v || 0) * 100).toFixed(dec)}%`;

export default function TablaProyecciones({ proyecciones = [], crecimientoMensual = 0, enMoneda }) {
  const columnas = [
    {
      clave: 'etiqueta',
      titulo: 'Plazo',
      render: (p) => <span className="font-medium text-[#2A2118] dark:text-[#F9FAFB]">{p.etiqueta}</span>,
    },
    {
      clave: 'tasaUsada',
      titulo: 'Tasa mensual',
      render: (p) => (
        <div className="flex items-center gap-2">
          <span className="text-[#6E6559] dark:text-[#9CA3AF]">{pct(p.tasaUsada)}</span>
          {p.amortiguada && <Chip tono="amarillo">amortiguada</Chip>}
        </div>
      ),
    },
    {
      clave: 'ventasUsd',
      titulo: 'Ventas del mes',
      render: (p) => <span className="text-[#2A2118] dark:text-[#F9FAFB]">{enMoneda(p.ventasUsd)}</span>,
    },
    {
      clave: 'resultadoMensualUsd',
      titulo: 'Resultado mensual',
      render: (p) => <span className="text-[#2A2118] dark:text-[#F9FAFB]">{enMoneda(p.resultadoMensualUsd)}</span>,
    },
    {
      clave: 'resultadoAcumuladoUsd',
      titulo: 'Acumulado del período',
      render: (p) => (
        <span className="font-semibold text-[#2A2118] dark:text-[#F9FAFB]">{enMoneda(p.resultadoAcumuladoUsd)}</span>
      ),
    },
  ];

  return (
    <>
      <Tabla
        columnas={columnas}
        filas={proyecciones}
        claveFila={(p) => p.meses}
        alto="max-h-[320px]"
        vacioTitulo="Sin datos para proyectar"
        vacioTexto="Hacen falta al menos dos meses cargados para calcular un ritmo de crecimiento."
      />

      <p className="mt-4 flex items-start gap-2 px-6 pb-1 text-[12px] leading-relaxed text-[#948A7C]">
        <Info size={13} className="mt-0.5 shrink-0" />
        <span>
          El ritmo medido en los meses cargados es de <b>{pct(crecimientoMensual)}</b> mensual. Más
          allá de los 12 meses se usa el menor entre ese ritmo y 1,5% mensual: proyectar cinco años
          al ritmo de una racha buena da un número lindo y falso.
        </span>
      </p>
    </>
  );
}
