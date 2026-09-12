// ============================================================================
// SISTEMA GM · M-09 TESORERÍA · GASTOS FIJOS
// ----------------------------------------------------------------------------
// Los gastos que están sí o sí todos los meses. Los semanales se muestran
// también mensualizados (× 4,33), que es como entran al cálculo del egreso
// total: si no, un gasto semanal parece cinco veces más chico de lo que es.
// ============================================================================

import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import Tabla from '../../../../shared/gm-ui/Tabla';
import Chip from '../../../../shared/gm-ui/Chip';

const TONO_CATEGORIA = {
  Operativo: 'azul',
  'Logística': 'naranja',
  Comercial: 'aqua',
  Impuestos: 'rosa',
  Personal: 'amarillo',
  Financiero: 'gris',
};

export default function TablaGastos({ gastos = [], enMoneda, onEditar, onEliminar }) {
  const columnas = [
    {
      clave: 'concepto',
      titulo: 'Concepto',
      render: (g) => (
        <div className="min-w-0">
          <p className="truncate font-medium text-[#2A2118] dark:text-[#F9FAFB]">{g.concepto}</p>
          <p className="truncate text-[12px] text-[var(--gm-texto-medio)] dark:text-[#6B7280]">{g.id}</p>
        </div>
      ),
    },
    {
      clave: 'categoria',
      titulo: 'Categoría',
      render: (g) => <Chip tono={TONO_CATEGORIA[g.categoria] || 'gris'}>{g.categoria}</Chip>,
    },
    {
      clave: 'periodicidad',
      titulo: 'Periodicidad',
      render: (g) => <span className="capitalize text-[#6E6559] dark:text-[#9CA3AF]">{g.periodicidad}</span>,
    },
    {
      clave: 'montoUsd',
      titulo: 'Monto',
      render: (g) => <span className="font-medium text-[#2A2118] dark:text-[#F9FAFB]">{enMoneda(g.montoUsd)}</span>,
    },
    {
      clave: 'mensualizado',
      titulo: 'Al mes',
      render: (g) => (
        <span className="text-[#6E6559] dark:text-[#9CA3AF]">
          {enMoneda(g.periodicidad === 'semanal' ? g.montoUsd * 4.33 : g.montoUsd)}
        </span>
      ),
    },
    {
      clave: 'acciones',
      titulo: '',
      ancho: 90,
      render: (g) => (
        <div className="flex items-center justify-end gap-1">
          <button
            type="button"
            title="Editar gasto"
            onClick={(e) => { e.stopPropagation(); onEditar(g); }}
            className="grid h-8 w-8 place-items-center rounded-lg text-[#948A7C] transition hover:bg-[#EFE7DB] hover:text-[#2A2118] dark:text-[#F9FAFB]"
          >
            <Pencil size={15} />
          </button>
          <button
            type="button"
            title="Borrar gasto"
            onClick={(e) => { e.stopPropagation(); onEliminar(g); }}
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
      filas={gastos}
      claveFila={(g) => g.id}
      alto="max-h-[420px]"
      vacioTitulo="Sin gastos fijos cargados"
      vacioTexto="Cargá el alquiler, el contador, los fletes: todo lo que se paga sí o sí."
    />
  );
}
