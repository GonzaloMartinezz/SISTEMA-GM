// ============================================================================
// SISTEMA GM · NOTARIO 360° · MODAL DE NOTA ESTRATÉGICA
// ============================================================================

import React, { useState } from 'react';
import { X, StickyNote, Loader2 } from 'lucide-react';

export default function NotaEstrategicaModal({ abierto, onCerrar, onGuardar, operador = 'G. Martínez' }) {
  const [texto, setTexto] = useState('');
  const [tipo, setTipo] = useState('Estratégica');
  const [guardando, setGuardando] = useState(false);

  if (!abierto) return null;

  const enviar = async (e) => {
    e.preventDefault();
    if (!texto.trim() || guardando) return;
    setGuardando(true);
    try {
      await onGuardar({ texto: texto.trim(), tipo, operador });
      setTexto('');
      setTipo('Estratégica');
      onCerrar();
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg overflow-hidden rounded-xl border border-gray-700 bg-gray-950 shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-800 bg-gray-900 px-4 py-3">
          <h3 className="flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-amber-400">
            <StickyNote className="h-4 w-4" />
            Nota estratégica
          </h3>
          <button
            type="button"
            onClick={onCerrar}
            className="rounded p-1 text-gray-500 transition-colors hover:bg-gray-800 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={enviar} className="space-y-4 p-5">
          <div className="flex gap-2">
            {['Estratégica', 'Operativa', 'Alerta'].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTipo(t)}
                className={`rounded-md border px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.15em] transition-colors ${
                  tipo === t
                    ? 'border-amber-500/50 bg-amber-500/10 text-amber-400'
                    : 'border-gray-700 text-gray-500 hover:text-gray-300'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <textarea
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            rows={5}
            autoFocus
            placeholder="Comentario táctico para la próxima interacción…"
            className="w-full resize-none rounded-lg border border-gray-700 bg-black/60 px-3 py-2.5 text-sm text-gray-200 outline-none transition-colors placeholder:text-gray-600 focus:border-amber-500/60"
          />

          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-gray-600">
              Operador: {operador}
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onCerrar}
                className="rounded-md border border-gray-700 px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400 transition-colors hover:text-white"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={!texto.trim() || guardando}
                className="inline-flex items-center gap-2 rounded-md border border-amber-500/50 bg-amber-500/10 px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-amber-400 transition-colors hover:bg-amber-500/20 disabled:opacity-30"
              >
                {guardando && <Loader2 className="h-3 w-3 animate-spin" />}
                Guardar nota
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
