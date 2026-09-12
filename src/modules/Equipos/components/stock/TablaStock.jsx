// ============================================================================
// SISTEMA GM · M-02 EQUIPAMIENTOS · TABLA DE STOCK
// ----------------------------------------------------------------------------
// La tabla operativa: cuánto hay, cuánto viene, cuánto falta y para cuántos
// meses alcanza al ritmo del último año. Los tres botones de la derecha son
// las tres cosas que pasan de verdad: vendí uno, compré uno, llegó el envío.
// ============================================================================

import React from 'react';
import { Minus, Plus, Truck } from 'lucide-react';
import Tabla from '../../../../shared/gm-ui/Tabla';
import Chip from '../../../../shared/gm-ui/Chip';
import { RUBRO_TONO } from '../../../../shared/gm-ui/tokens';

const TONO_STOCK = {
  'sin stock': 'rosa',
  'crítico': 'naranja',
  'en el mínimo': 'amarillo',
  normal: 'aqua',
};

/** Barra de ocupación contra el mínimo: se ve de un vistazo qué tan al límite está. */
function BarraStock({ equipo }) {
  const tope = Math.max(equipo.minStock * 2, equipo.stock, 1);
  const ancho = Math.min((equipo.stock / tope) * 100, 100);
  const color =
    equipo.stock === 0 ? '#A63A0C'
      : equipo.stock < equipo.minStock ? '#B4551A'
        : equipo.stock === equipo.minStock ? '#C08A1E'
          : '#2E9B76';

  return (
    <div className="w-full min-w-[110px]">
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-[14px] font-medium text-[#2A2118] dark:text-[#F9FAFB]">{equipo.stock}</span>
        <span className="text-[11px] text-[var(--gm-texto-medio)] dark:text-[#6B7280]">mín. {equipo.minStock}</span>
      </div>
      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-[var(--gm-superficie-fuerte)]">
        <div className="h-full rounded-full" style={{ width: `${ancho}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}

export default function TablaStock({ equipos, onMovimiento, orden, onOrdenar }) {
  const columnas = [
    {
      clave: 'nombre',
      titulo: 'Equipo',
      ordenable: true,
      render: (e) => (
        <div className="min-w-0">
          <p className="truncate font-medium text-[#2A2118] dark:text-[#F9FAFB]">{e.nombre}</p>
          <p className="truncate text-[12px] text-[var(--gm-texto-medio)] dark:text-[#6B7280]">{e.codigo} · {e.tipo}</p>
        </div>
      ),
    },
    {
      clave: 'rubro',
      titulo: 'Rubro',
      ordenable: true,
      render: (e) => <Chip tono={RUBRO_TONO[e.rubro] || 'gris'} punto>{e.rubro}</Chip>,
    },
    {
      clave: 'stock',
      titulo: 'En depósito',
      ordenable: true,
      render: (e) => <BarraStock equipo={e} />,
    },
    {
      clave: 'transito',
      titulo: 'En camino',
      render: (e) =>
        e.transito > 0 ? (
          <span className="inline-flex items-center gap-1.5 text-[14px] text-[#2F6DA0]">
            <Truck size={14} />
            {e.transito}
          </span>
        ) : (
          <span className="text-[var(--gm-texto-medio)] dark:text-[#6B7280]">—</span>
        ),
    },
    {
      clave: 'mesesCobertura',
      titulo: 'Cobertura',
      ordenable: true,
      render: (e) =>
        e.mesesCobertura == null ? (
          <span className="text-[var(--gm-texto-medio)] dark:text-[#6B7280]">sin ventas</span>
        ) : (
          <span className="text-[#6E6559] dark:text-[#9CA3AF]">
            {e.mesesCobertura} {e.mesesCobertura === 1 ? 'mes' : 'meses'}
          </span>
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
      ancho: 130,
      render: (e) => (
        <div className="flex items-center justify-end gap-1">
          <button
            type="button"
            title="Registrar una salida (venta, rotura)"
            disabled={e.stock === 0}
            onClick={(ev) => { ev.stopPropagation(); onMovimiento(e, 'egreso'); }}
            className="grid h-8 w-8 place-items-center rounded-lg text-[#948A7C] transition hover:bg-[#FBEAE0] hover:text-[#A63A0C] disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:bg-transparent"
          >
            <Minus size={15} />
          </button>
          <button
            type="button"
            title="Registrar un ingreso (compra, devolución)"
            onClick={(ev) => { ev.stopPropagation(); onMovimiento(e, 'ingreso'); }}
            className="grid h-8 w-8 place-items-center rounded-lg text-[#948A7C] transition hover:bg-[#DFF0E8] hover:text-[#1F6F53]"
          >
            <Plus size={15} />
          </button>
          <button
            type="button"
            title="Llegó mercadería que estaba en tránsito"
            disabled={e.transito === 0}
            onClick={(ev) => { ev.stopPropagation(); onMovimiento(e, 'transito'); }}
            className="grid h-8 w-8 place-items-center rounded-lg text-[#948A7C] transition hover:bg-[#E3EDF6] hover:text-[#23557E] disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:bg-transparent"
          >
            <Truck size={15} />
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
      orden={orden}
      onOrdenar={onOrdenar}
      alto="max-h-[calc(100vh-420px)]"
      vacioTitulo="No hay equipos para mostrar"
      vacioTexto="Cambiá el filtro o cargá equipamiento desde la Base de Datos."
    />
  );
}
