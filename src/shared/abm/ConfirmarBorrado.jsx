// ============================================================================
// SISTEMA GM · CAPA COMPARTIDA · CONFIRMACIÓN DE BORRADO
// ----------------------------------------------------------------------------
// Borrar no se hace de un clic: hay que ver qué se borra y confirmarlo.
// ============================================================================

import React, { useState } from 'react';
import { Trash2, X, Loader2, AlertTriangle } from 'lucide-react';

export default function ConfirmarBorrado({ abierto, titulo, detalle, advertencia, onCerrar, onConfirmar }) {
  const [borrando, setBorrando] = useState(false);
  const [error, setError] = useState('');

  if (!abierto) return null;

  const confirmar = async () => {
    if (borrando) return;
    setBorrando(true);
    setError('');
    try {
      await onConfirmar();
      onCerrar();
    } catch (err) {
      setError(err.message || 'No se pudo eliminar.');
    } finally {
      setBorrando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[96] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-xl border border-rose-900/60 bg-gray-950 shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-800 bg-gray-900 px-4 py-3">
          <h3 className="flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-rose-400">
            <Trash2 className="h-4 w-4" />
            Eliminar
          </h3>
          <button
            type="button"
            onClick={onCerrar}
            className="rounded p-1 text-gray-500 transition-colors hover:bg-gray-800 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-3 p-5">
          <p className="text-sm text-gray-200">{titulo}</p>
          {detalle && (
            <p className="rounded border border-gray-800 bg-black/50 px-3 py-2 font-mono text-[11px] text-gray-400">
              {detalle}
            </p>
          )}
          {advertencia && (
            <p className="flex items-start gap-2 text-[11px] leading-snug text-amber-400">
              <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              {advertencia}
            </p>
          )}
          {error && (
            <p className="rounded border border-rose-900/60 bg-rose-950/40 px-3 py-2 text-xs text-rose-300">
              {error}
            </p>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-gray-800 bg-gray-900 px-4 py-3">
          <button
            type="button"
            onClick={onCerrar}
            className="rounded border border-gray-700 px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400 transition-colors hover:text-white"
          >
            No, volver
          </button>
          <button
            type="button"
            onClick={confirmar}
            disabled={borrando}
            className="inline-flex items-center gap-2 rounded border border-rose-500/50 bg-rose-500/10 px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-rose-400 transition-colors hover:bg-rose-500/20 disabled:opacity-30"
          >
            {borrando ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3 w-3" />}
            Sí, eliminar
          </button>
        </div>
      </div>
    </div>
  );
}
