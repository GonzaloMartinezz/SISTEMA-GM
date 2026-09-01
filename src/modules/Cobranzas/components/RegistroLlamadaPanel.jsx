// ============================================================================
// SISTEMA GM · COBRANZAS · REGISTRO OPERATIVO DE LLAMADOS
// ----------------------------------------------------------------------------
// Quién atiende · contacto realizado · respuesta obtenida · próximo evento.
// Acciones: Grabar respuesta · Llamar después · Omitir el llamado.
// ============================================================================

import React, { useEffect, useState } from 'react';
import { Save, Clock, SkipForward, Loader2 } from 'lucide-react';
import PanelTerminal from '../../../shared/ui/PanelTerminal';

const CONTACTOS = ['Celular', 'Fijo particular', 'Fijo laboral', 'WhatsApp', 'Email', 'Presencial'];

const RESPUESTAS_TIPO = [
  'Promete pagar',
  'Pide refinanciar',
  'No atiende',
  'Número equivocado',
  'Desconoce la deuda',
  'Ya pagó',
];

const FORM_VACIO = {
  quienAtiende: '',
  contacto: 'Celular',
  respuesta: '',
  proximoEvento: '',
  nota: '',
};

export default function RegistroLlamadaPanel({ cuenta, onGrabar, onLlamarDespues, onOmitir, operador = 'G. Martínez' }) {
  const [form, setForm] = useState(FORM_VACIO);
  const [guardando, setGuardando] = useState(false);

  // Al cambiar de cuenta, el formulario arranca limpio
  useEffect(() => {
    setForm(FORM_VACIO);
  }, [cuenta?.id]);

  const set = (campo) => (e) => setForm((f) => ({ ...f, [campo]: e.target.value }));

  const grabar = async () => {
    if (!form.respuesta.trim() || guardando) return;
    setGuardando(true);
    try {
      await onGrabar({ ...form, operador });
      setForm(FORM_VACIO);
    } finally {
      setGuardando(false);
    }
  };

  const llamarDespues = async () => {
    if (guardando) return;
    setGuardando(true);
    try {
      await onLlamarDespues({
        ...form,
        respuesta: form.respuesta.trim() || 'Sin respuesta · rellamar',
        proximoEvento: form.proximoEvento.trim() || 'Rellamar en el próximo turno',
        operador,
      });
      setForm(FORM_VACIO);
    } finally {
      setGuardando(false);
    }
  };

  const inputCls =
    'w-full rounded border border-gray-700 bg-black/60 px-2.5 py-1.5 text-xs text-gray-200 outline-none transition-colors placeholder:text-gray-700 focus:border-cyan-500/60';
  const labelCls =
    'mb-1 block font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-gray-500';

  return (
    <PanelTerminal titulo="Registro operativo del llamado" acento="cyan">
      <div className="space-y-3 p-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className={labelCls}>Quién atiende</label>
            <input
              className={inputCls}
              value={form.quienAtiende}
              onChange={set('quienAtiende')}
              placeholder="Titular, familiar, recepción…"
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
          <div className="mb-1.5 flex flex-wrap gap-1">
            {RESPUESTAS_TIPO.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setForm((f) => ({ ...f, respuesta: r }))}
                className="rounded border border-gray-800 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-gray-500 transition-colors hover:border-cyan-500/40 hover:text-cyan-400"
              >
                {r}
              </button>
            ))}
          </div>
          <textarea
            rows={3}
            className={`${inputCls} resize-none`}
            value={form.respuesta}
            onChange={set('respuesta')}
            placeholder="Qué contestó el titular…"
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className={labelCls}>Próximo evento</label>
            <input
              className={inputCls}
              value={form.proximoEvento}
              onChange={set('proximoEvento')}
              placeholder="12/09/2026 · Llamado de control"
            />
          </div>
          <div>
            <label className={labelCls}>Observación (nota)</label>
            <input
              className={inputCls}
              value={form.nota}
              onChange={set('nota')}
              placeholder="Dato útil para la próxima gestión"
            />
          </div>
        </div>

        {/* Botonera de acción rápida */}
        <div className="flex flex-wrap items-center gap-2 border-t border-gray-800 pt-3">
          <button
            type="button"
            onClick={grabar}
            disabled={!form.respuesta.trim() || guardando}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded border border-emerald-500/50 bg-emerald-500/10 px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-emerald-400 transition-colors hover:bg-emerald-500/20 disabled:opacity-30"
          >
            {guardando ? <Loader2 className="h-3 w-3 animate-spin" /> : <Save className="h-3 w-3" />}
            Grabar respuesta
          </button>

          <button
            type="button"
            onClick={llamarDespues}
            disabled={guardando}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded border border-amber-500/50 bg-amber-500/10 px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-amber-400 transition-colors hover:bg-amber-500/20 disabled:opacity-30"
          >
            <Clock className="h-3 w-3" />
            Llamar después
          </button>

          <button
            type="button"
            onClick={onOmitir}
            disabled={guardando}
            className="inline-flex items-center justify-center gap-2 rounded border border-gray-700 px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400 transition-colors hover:border-gray-500 hover:text-white disabled:opacity-30"
          >
            <SkipForward className="h-3 w-3" />
            Omitir
          </button>
        </div>

        <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-gray-700">
          Operador: {operador} · La gestión queda registrada en la auditoría
        </p>
      </div>
    </PanelTerminal>
  );
}
