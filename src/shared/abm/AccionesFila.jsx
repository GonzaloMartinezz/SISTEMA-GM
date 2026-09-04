// ============================================================================
// SISTEMA GM · CAPA COMPARTIDA · ACCIONES DE FILA Y BOTÓN DE ALTA
// ============================================================================

import React from 'react';
import { Pencil, Trash2, Plus } from 'lucide-react';

export function AccionesFila({ onEditar, onEliminar, compacto = false }) {
  const cls =
    'inline-flex items-center justify-center rounded border border-gray-700 transition-colors ' +
    (compacto ? 'p-1' : 'px-2 py-1');

  return (
    <div className="flex items-center justify-center gap-1" onClick={(e) => e.stopPropagation()}>
      {onEditar && (
        <button
          type="button"
          onClick={onEditar}
          title="Editar"
          className={`${cls} text-gray-400 hover:border-cyan-500/50 hover:text-cyan-400`}
        >
          <Pencil className="h-3 w-3" />
        </button>
      )}
      {onEliminar && (
        <button
          type="button"
          onClick={onEliminar}
          title="Eliminar"
          className={`${cls} text-gray-500 hover:border-rose-500/50 hover:text-rose-400`}
        >
          <Trash2 className="h-3 w-3" />
        </button>
      )}
    </div>
  );
}

export function BotonNuevo({ onClick, label = 'Nuevo', acento = 'text-cyan-400' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1 font-mono text-[9px] uppercase tracking-[0.15em] text-gray-500 transition-colors hover:${acento.replace('text-', 'text-')}`}
    >
      <Plus className="h-3 w-3" />
      {label}
    </button>
  );
}

export default AccionesFila;
