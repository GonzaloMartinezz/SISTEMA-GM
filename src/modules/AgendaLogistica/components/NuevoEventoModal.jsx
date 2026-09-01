// ============================================================================
// SISTEMA GM · AGENDA INTELIGENTE · ALTA DE COMPROMISO
// ============================================================================

import React, { useState } from 'react';
import { X, CalendarPlus, Loader2 } from 'lucide-react';
import { BASE_OPERATIVA } from '../../../shared/agenda/agendaDemo';

const VACIO = {
  tipo: 'visita',
  titulo: '',
  cliente: '',
  fecha: '',
  hora: '09:00',
  duracion: 30,
  direccion: '',
  prioridad: 'media',
  nota: '',
};

export default function NuevoEventoModal({ abierto, diaPorDefecto, onCerrar, onGuardar }) {
  const [form, setForm] = useState({ ...VACIO, fecha: diaPorDefecto });
  const [guardando, setGuardando] = useState(false);

  if (!abierto) return null;

  const set = (campo) => (e) =>
    setForm((f) => ({
      ...f,
      [campo]: campo === 'duracion' ? Number(e.target.value) : e.target.value,
    }));

  const enviar = async (e) => {
    e.preventDefault();
    if (!form.titulo.trim() || !form.cliente.trim() || guardando) return;
    setGuardando(true);
    try {
      await onGuardar({
        ...form,
        fecha: form.fecha || diaPorDefecto,
        // Sin geocodificación todavía: se ancla a la base operativa
        lat: BASE_OPERATIVA.lat,
        lng: BASE_OPERATIVA.lng,
      });
      setForm({ ...VACIO, fecha: diaPorDefecto });
      onCerrar();
    } finally {
      setGuardando(false);
    }
  };

  const inputCls =
    'w-full rounded border border-gray-700 bg-black/60 px-2.5 py-1.5 text-xs text-gray-200 outline-none transition-colors placeholder:text-gray-700 focus:border-teal-500/60';
  const labelCls =
    'mb-1 block font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-gray-500';

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm">
      <div className="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-xl border border-gray-700 bg-gray-950 shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-800 bg-gray-900 px-4 py-3">
          <h3 className="flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-teal-400">
            <CalendarPlus className="h-4 w-4" />
            Nuevo compromiso
          </h3>
          <button
            type="button"
            onClick={onCerrar}
            className="rounded p-1 text-gray-500 transition-colors hover:bg-gray-800 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={enviar} className="space-y-3 p-5">
          <div className="flex gap-2">
            {['visita', 'llamada'].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setForm((f) => ({ ...f, tipo: t }))}
                className={`flex-1 rounded border px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.15em] transition-colors ${
                  form.tipo === t
                    ? 'border-teal-500/50 bg-teal-500/10 text-teal-400'
                    : 'border-gray-700 text-gray-500 hover:text-gray-300'
                }`}
              >
                {t === 'visita' ? 'Visita programada' : 'Llamada agendada'}
              </button>
            ))}
          </div>

          <div>
            <label className={labelCls}>Título</label>
            <input
              className={inputCls}
              value={form.titulo}
              onChange={set('titulo')}
              placeholder="Demostración de equipo…"
              autoFocus
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className={labelCls}>Cliente</label>
              <input
                className={inputCls}
                value={form.cliente}
                onChange={set('cliente')}
                placeholder="Apellido, Nombre"
              />
            </div>
            <div>
              <label className={labelCls}>Prioridad</label>
              <select className={inputCls} value={form.prioridad} onChange={set('prioridad')}>
                <option value="alta">Alta</option>
                <option value="media">Media</option>
                <option value="baja">Baja</option>
              </select>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div>
              <label className={labelCls}>Fecha</label>
              <input type="date" className={inputCls} value={form.fecha} onChange={set('fecha')} />
            </div>
            <div>
              <label className={labelCls}>Hora</label>
              <input type="time" className={inputCls} value={form.hora} onChange={set('hora')} />
            </div>
            <div>
              <label className={labelCls}>Duración (min)</label>
              <input
                type="number"
                min="5"
                step="5"
                className={inputCls}
                value={form.duracion}
                onChange={set('duracion')}
              />
            </div>
          </div>

          <div>
            <label className={labelCls}>Dirección</label>
            <input
              className={inputCls}
              value={form.direccion}
              onChange={set('direccion')}
              placeholder="Calle, número, localidad"
            />
          </div>

          <div>
            <label className={labelCls}>Nota de preparación</label>
            <input
              className={inputCls}
              value={form.nota}
              onChange={set('nota')}
              placeholder="Qué llevar o qué confirmar antes"
            />
          </div>

          <div className="flex justify-end gap-2 border-t border-gray-800 pt-3">
            <button
              type="button"
              onClick={onCerrar}
              className="rounded border border-gray-700 px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400 transition-colors hover:text-white"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!form.titulo.trim() || !form.cliente.trim() || guardando}
              className="inline-flex items-center gap-2 rounded border border-teal-500/50 bg-teal-500/10 px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-teal-400 transition-colors hover:bg-teal-500/20 disabled:opacity-30"
            >
              {guardando && <Loader2 className="h-3 w-3 animate-spin" />}
              Agendar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
