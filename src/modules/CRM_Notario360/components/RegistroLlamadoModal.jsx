// ============================================================================
// SISTEMA GM · NOTARIO 360° · REGISTRO OPERATIVO DE LLAMADO
// ----------------------------------------------------------------------------
// Formulario de gestión: quién atiende, qué contacto se hizo, qué respondió
// y cuál es el próximo evento coordinado.
// ============================================================================

import React, { useState } from 'react';
import { X, PhoneCall, Loader2 } from 'lucide-react';

const CONTACTOS = ['Celular', 'Fijo particular', 'Fijo laboral', 'WhatsApp', 'Email', 'Presencial'];

export default function RegistroLlamadoModal({
  abierto,
  onCerrar,
  onGuardar,
  operador = 'G. Martínez',
}) {
  const [form, setForm] = useState({
    quienAtiende: '',
    contacto: 'Celular',
    respuesta: '',
    proximoEvento: '',
  });
  const [guardando, setGuardando] = useState(false);

  if (!abierto) return null;

  const set = (campo) => (e) => setForm((f) => ({ ...f, [campo]: e.target.value }));

  const enviar = async (e) => {
    e.preventDefault();
    if (!form.respuesta.trim() || guardando) return;
    setGuardando(true);
    try {
      await onGuardar({ ...form, operador });
      setForm({ quienAtiende: '', contacto: 'Celular', respuesta: '', proximoEvento: '' });
      onCerrar();
    } finally {
      setGuardando(false);
    }
  };

  const inputCls =
    'w-full rounded-lg border border-gray-700 bg-black/60 px-3 py-2 text-sm text-gray-200 outline-none transition-colors placeholder:text-gray-600 focus:border-cyan-500/60';
  const labelCls =
    'mb-1 block font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-gray-500';

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-xl border border-gray-700 bg-gray-950 shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-800 bg-gray-900 px-4 py-3">
          <h3 className="flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-cyan-400">
            <PhoneCall className="h-4 w-4" />
            Grabar respuesta del llamado
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
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls}>Quién atiende</label>
              <input
                className={inputCls}
                value={form.quienAtiende}
                onChange={set('quienAtiende')}
                placeholder="Titular, recepción, familiar…"
                autoFocus
              />
            </div>
            <div>
              <label className={labelCls}>Contacto realizado</label>
              <select className={inputCls} value={form.contacto} onChange={set('contacto')}>
                {CONTACTOS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className={labelCls}>Respuesta obtenida</label>
            <textarea
              rows={4}
              className={`${inputCls} resize-none`}
              value={form.respuesta}
              onChange={set('respuesta')}
              placeholder="Qué contestó el titular…"
            />
          </div>

          <div>
            <label className={labelCls}>Próximo evento u observación</label>
            <input
              className={inputCls}
              value={form.proximoEvento}
              onChange={set('proximoEvento')}
              placeholder="12/09/2026 · Llamado de control"
            />
          </div>

          <div className="flex items-center justify-between border-t border-gray-800 pt-4">
            <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-gray-600">
              Operador: {operador}
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onCerrar}
                className="rounded-md border border-gray-700 px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400 transition-colors hover:text-white"
              >
                Omitir
              </button>
              <button
                type="submit"
                disabled={!form.respuesta.trim() || guardando}
                className="inline-flex items-center gap-2 rounded-md border border-cyan-500/50 bg-cyan-500/10 px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-cyan-400 transition-colors hover:bg-cyan-500/20 disabled:opacity-30"
              >
                {guardando && <Loader2 className="h-3 w-3 animate-spin" />}
                Grabar respuesta
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
