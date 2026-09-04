// ============================================================================
// SISTEMA GM · M-02 EQUIPAMIENTOS · TABLA DEL CATÁLOGO
// ----------------------------------------------------------------------------
// El catálogo completo con lo que se mira al vender: qué es, de qué rubro,
// a cuánto se vende, cuánto deja y cuánto hay. El estado de stock viene
// calculado por la base (gm_v_stock), no se recalcula acá.
// ============================================================================

import React from 'react';
import { FileText, Pencil, Trash2 } from 'lucide-react';
import Tabla from '../../../../shared/gm-ui/Tabla';
import Chip from '../../../../shared/gm-ui/Chip';
import { RUBRO_TONO } from '../../../../shared/gm-ui/tokens';
import { usd } from '../../../../shared/gm-ui/graficos';

const TONO_STOCK = {
  'sin stock': 'rosa',
  'crítico': 'naranja',
  'en el mínimo': 'amarillo',
  normal: 'aqua',
};

export default function TablaEquipos({ equipos, onVerFicha, onEditar, onEliminar, orden, onOrdenar }) {
  const columnas = [
    {
      clave: 'nombre',
      titulo: 'Equipo',
      ordenable: true,
      render: (e) => (
        <div className="min-w-0">
          <p className="truncate font-medium text-[#2A2118] dark:text-[#F9FAFB]">{e.nombre}</p>
          <p className="truncate text-[12px] text-[#B0A697] dark:text-[#6B7280]">
            {e.codigo}
            {e.marca ? ` · ${e.marca}` : ''}
            {e.modelo ? ` ${e.modelo}` : ''}
          </p>
        </div>
      ),
    },
    {
      clave: 'rubro',
      titulo: 'Rubro',
      ordenable: true,
      render: (e) => (
        <Chip tono={RUBRO_TONO[e.rubro] || 'gris'} punto>
          {e.rubro || 'Sin rubro'}
        </Chip>
      ),
    },
    {
      clave: 'tipo',
      titulo: 'Tipo',
      render: (e) => <span className="text-[#6E6559] dark:text-[#9CA3AF]">{e.tipo}</span>,
    },
    {
      clave: 'precioUsd',
      titulo: 'Precio',
      ordenable: true,
      render: (e) => (
        <div className="min-w-0">
          <p className="font-medium text-[#2A2118] dark:text-[#F9FAFB]">{usd(e.precioUsd)}</p>
          <p className="text-[12px] text-[#B0A697] dark:text-[#6B7280]">deja {usd(e.margenUsd)} · {e.margenPct}%</p>
        </div>
      ),
    },
    {
      clave: 'stock',
      titulo: 'Stock',
      ordenable: true,
      render: (e) => (
        <div className="min-w-0">
          <p className="font-medium text-[#2A2118] dark:text-[#F9FAFB]">
            {e.stock} {e.stock === 1 ? 'unidad' : 'unidades'}
          </p>
          {e.transito > 0 && (
            <p className="text-[12px] text-[#B0A697] dark:text-[#6B7280]">+{e.transito} en camino</p>
          )}
        </div>
      ),
    },
    {
      clave: 'estadoStock',
      titulo: 'Estado',
      render: (e) => <Chip tono={TONO_STOCK[e.estadoStock] || 'gris'}>{e.estadoStock}</Chip>,
    },
    {
      clave: 'acciones',
      titulo: '',
      ancho: 120,
      render: (e) => (
        <div className="flex items-center justify-end gap-1">
          <button
            type="button"
            title="Ver ficha técnica"
            onClick={(ev) => { ev.stopPropagation(); onVerFicha(e); }}
            className="grid h-8 w-8 place-items-center rounded-lg text-[#948A7C] transition hover:bg-[#FBE5C8] dark:hover:bg-[#2A1608] hover:text-[#8A3F11]"
          >
            <FileText size={15} />
          </button>
          <button
            type="button"
            title="Editar"
            onClick={(ev) => { ev.stopPropagation(); onEditar(e); }}
            className="grid h-8 w-8 place-items-center rounded-lg text-[#948A7C] transition hover:bg-[#EFE7DB] hover:text-[#2A2118] dark:text-[#F9FAFB]"
          >
            <Pencil size={15} />
          </button>
          <button
            type="button"
            title="Dar de baja"
            onClick={(ev) => { ev.stopPropagation(); onEliminar(e); }}
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
      filas={equipos}
      claveFila={(e) => e.id}
      onFilaClick={onVerFicha}
      orden={orden}
      onOrdenar={onOrdenar}
      alto="max-h-[calc(100vh-380px)]"
      vacioTitulo="No hay equipos que coincidan"
      vacioTexto="Cambiá el rubro o el texto de búsqueda, o cargá un equipo nuevo con el botón de arriba."
    />
  );
}
