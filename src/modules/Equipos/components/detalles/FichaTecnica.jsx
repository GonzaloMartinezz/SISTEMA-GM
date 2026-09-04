// ============================================================================
// SISTEMA GM · M-02 EQUIPAMIENTOS · FICHA TÉCNICA
// ----------------------------------------------------------------------------
// Todo lo que hay que saber de un equipo, editable en el momento: si en una
// visita te preguntan algo que no está cargado, lo agregás desde acá y queda
// para la próxima.
// ============================================================================

import React, { useState } from 'react';
import { GripVertical, Pencil, Plus, Trash2 } from 'lucide-react';
import Chip from '../../../../shared/gm-ui/Chip';
import BotonGm from '../../../../shared/gm-ui/BotonGm';
import EstadoVacio from '../../../../shared/gm-ui/EstadoVacio';
import FormularioGm from '../../../../shared/gm-ui/FormularioGm';
import ConfirmarGm from '../../../../shared/gm-ui/ConfirmarGm';
import { RUBRO_TONO } from '../../../../shared/gm-ui/tokens';
import { usd } from '../../../../shared/gm-ui/graficos';
import { CAMPOS_SPEC } from '../../config/equipo.form';

const TONO_STOCK = {
  'sin stock': 'rosa',
  'crítico': 'naranja',
  'en el mínimo': 'amarillo',
  normal: 'aqua',
};

function Dato({ etiqueta, valor }) {
  if (!valor && valor !== 0) return null;
  return (
    <div className="min-w-0">
      <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#B0A697]">{etiqueta}</p>
      <p className="mt-1 break-words text-[14px] text-[#2A2118]">{valor}</p>
    </div>
  );
}

export default function FichaTecnica({ equipo, specs = [], onGuardarSpec, onBorrarSpec }) {
  const [editando, setEditando] = useState(null);
  const [borrando, setBorrando] = useState(null);

  if (!equipo) return null;

  const guardar = async (form) => {
    await onGuardarSpec({
      id: editando?.id,
      equipoId: equipo.id,
      label: form.label,
      valor: form.valor,
      orden: form.orden === '' ? specs.length + 1 : Number(form.orden),
    });
  };

  return (
    <div className="space-y-6">
      {/* ----------------------------- Identidad ----------------------------- */}
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-[20px] font-semibold leading-tight text-[#2A2118]">{equipo.nombre}</h3>
          <Chip tono={RUBRO_TONO[equipo.rubro] || 'gris'} punto>{equipo.rubro}</Chip>
          <Chip tono={TONO_STOCK[equipo.estadoStock] || 'gris'}>{equipo.estadoStock}</Chip>
        </div>
        <p className="mt-1 text-[14px] text-[#6E6559]">
          {[equipo.marca, equipo.modelo].filter(Boolean).join(' ') || 'Sin marca cargada'}
        </p>
        <p className="mt-0.5 text-[12px] text-[#B0A697]">{equipo.codigo} · {equipo.tipo}</p>
      </div>

      {/* ------------------------- Datos comerciales ------------------------- */}
      <div className="grid grid-cols-2 gap-5 rounded-xl bg-[#FCFAF6] p-4 sm:grid-cols-4">
        <Dato etiqueta="Precio de venta" valor={usd(equipo.precioUsd)} />
        <Dato etiqueta="Margen" valor={`${usd(equipo.margenUsd)} · ${equipo.margenPct}%`} />
        <Dato etiqueta="Stock" valor={`${equipo.stock} ${equipo.transito ? `(+${equipo.transito} en camino)` : ''}`} />
        <Dato etiqueta="Vendidos 12 meses" valor={equipo.vendidos12m} />
      </div>

      {/* --------------------------- Ficha técnica --------------------------- */}
      <div>
        <div className="mb-3 flex items-center justify-between gap-3">
          <h4 className="text-[15px] font-semibold text-[#2A2118]">Características</h4>
          <BotonGm variante="suave" tamano="sm" icono={Plus} onClick={() => setEditando({})}>
            Agregar
          </BotonGm>
        </div>

        {specs.length ? (
          <ul className="divide-y divide-[#F4EFE7] rounded-xl border border-[#E8E0D5]">
            {specs.map((s) => (
              <li key={s.id} className="group flex items-center gap-3 px-4 py-3">
                <GripVertical size={14} className="shrink-0 text-[#D5CABA]" />
                <span className="w-[40%] shrink-0 text-[13px] font-medium text-[#6E6559]">{s.label}</span>
                <span className="min-w-0 flex-1 text-[14px] text-[#2A2118]">{s.valor}</span>
                <span className="flex shrink-0 items-center gap-1 opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100">
                  <button
                    type="button"
                    title="Editar"
                    onClick={() => setEditando(s)}
                    className="grid h-8 w-8 place-items-center rounded-lg text-[#948A7C] transition hover:bg-[#EFE7DB] hover:text-[#2A2118]"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    type="button"
                    title="Borrar"
                    onClick={() => setBorrando(s)}
                    className="grid h-8 w-8 place-items-center rounded-lg text-[#948A7C] transition hover:bg-[#FBEAE0] hover:text-[#A63A0C]"
                  >
                    <Trash2 size={14} />
                  </button>
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <EstadoVacio
            titulo="Sin características cargadas"
            texto="Agregá lo que te preguntan seguido: capacidad, certificación, qué incluye, si la instalación va aparte."
          />
        )}
      </div>

      {/* ---------------------------- Datos físicos --------------------------- */}
      {(equipo.dimensiones || equipo.consumo || equipo.garantiaMeses) && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <Dato etiqueta="Dimensiones" valor={equipo.dimensiones} />
          <Dato etiqueta="Alimentación" valor={equipo.consumo} />
          <Dato
            etiqueta="Garantía"
            valor={equipo.garantiaMeses ? `${equipo.garantiaMeses} meses` : null}
          />
        </div>
      )}

      <FormularioGm
        abierto={!!editando}
        titulo={editando?.id ? 'Editar característica' : 'Nueva característica'}
        bajada="Va a aparecer en la ficha y en el texto que se le manda al cliente."
        campos={CAMPOS_SPEC}
        valores={
          editando?.id
            ? { label: editando.label, valor: editando.valor, orden: editando.orden }
            : undefined
        }
        onCerrar={() => setEditando(null)}
        onGuardar={guardar}
        textoBoton={editando?.id ? 'Guardar' : 'Agregar'}
      />

      <ConfirmarGm
        abierto={!!borrando}
        detalle={borrando ? `Se borra "${borrando.label}" de la ficha de ${equipo.nombre}.` : ''}
        textoBoton="Borrar"
        onCerrar={() => setBorrando(null)}
        onConfirmar={() => onBorrarSpec(borrando.id)}
      />
    </div>
  );
}
