// ============================================================================
// SISTEMA GM · M-09 TESORERÍA · LIQUIDACIÓN MES A MES
// ----------------------------------------------------------------------------
// La misma liquidación de siempre: ventas, costo de mercadería, margen bruto,
// lo que cobrás vos (fijo + comisión) y el resultado. Las cuentas las hace
// liquidarMes() en el servicio; acá sólo se muestran.
// ============================================================================

import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import Tabla from '../../../../shared/gm-ui/Tabla';

export default function TablaMeses({ meses = [], enMoneda, onEditar, onEliminar }) {
  const columnas = [
    {
      clave: 'etiqueta',
      titulo: 'Mes',
      render: (m) => (
        <div className="min-w-0">
          <p className="font-medium capitalize text-[#2A2118] dark:text-[#F9FAFB]">{m.etiqueta}</p>
          <p className="text-[12px] text-[var(--gm-texto-medio)] dark:text-[#6B7280]">{m.mes}</p>
        </div>
      ),
    },
    {
      clave: 'ventasUsd',
      titulo: 'Ventas',
      render: (m) => <span className="text-[#2A2118] dark:text-[#F9FAFB]">{enMoneda(m.ventasUsd)}</span>,
    },
    {
      clave: 'costoMercaderiaUsd',
      titulo: 'Costo mercadería',
      render: (m) => <span className="text-[#6E6559] dark:text-[#9CA3AF]">{enMoneda(m.costoMercaderiaUsd)}</span>,
    },
    {
      clave: 'margenBrutoUsd',
      titulo: 'Margen bruto',
      render: (m) => (
        <div className="min-w-0">
          <p className="font-medium text-[#2A2118] dark:text-[#F9FAFB]">{enMoneda(m.margenBrutoUsd)}</p>
          <p className="text-[12px] text-[var(--gm-texto-medio)] dark:text-[#6B7280]">{m.margenPct.toFixed(1)}%</p>
        </div>
      ),
    },
    {
      clave: 'ingresosUsd',
      titulo: 'Tu ingreso',
      render: (m) => (
        <div className="min-w-0">
          <p className="font-medium text-[#2A2118] dark:text-[#F9FAFB]">{enMoneda(m.ingresosUsd)}</p>
          <p className="text-[12px] text-[var(--gm-texto-medio)] dark:text-[#6B7280]">
            fijo {enMoneda(m.sueldoFijoUsd)} + com. {enMoneda(m.comisionUsd)}
          </p>
        </div>
      ),
    },
    {
      clave: 'resultadoUsd',
      titulo: 'Resultado',
      render: (m) => (
        <span
          className="font-semibold"
          style={{ color: m.resultadoUsd >= 0 ? '#1F6F53' : '#A63A0C' }}
        >
          {enMoneda(m.resultadoUsd)}
        </span>
      ),
    },
    {
      clave: 'acciones',
      titulo: '',
      ancho: 90,
      render: (m) => (
        <div className="flex items-center justify-end gap-1">
          <button
            type="button"
            title="Editar mes"
            onClick={(e) => { e.stopPropagation(); onEditar(m); }}
            className="grid h-8 w-8 place-items-center rounded-lg text-[#948A7C] transition hover:bg-[#EFE7DB] hover:text-[#2A2118] dark:text-[#F9FAFB]"
          >
            <Pencil size={15} />
          </button>
          <button
            type="button"
            title="Borrar mes"
            onClick={(e) => { e.stopPropagation(); onEliminar(m); }}
            className="grid h-8 w-8 place-items-center rounded-lg text-[#948A7C] transition hover:bg-[#FBEAE0] hover:text-[#A63A0C]"
          >
            <Trash2 size={15} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <Tabla
      columnas={columnas}
      filas={meses}
      claveFila={(m) => m.mes}
      alto="max-h-[420px]"
      vacioTitulo="Todavía no hay meses cargados"
      vacioTexto="Cargá el primero con el botón de arriba, o desde la planilla INGRESOS POR MES en Drive."
    />
  );
}
