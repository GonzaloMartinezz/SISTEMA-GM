// ============================================================================
// SISTEMA GM · CAPA COMPARTIDA · FORMULARIO DE ALTA Y EDICIÓN
// ----------------------------------------------------------------------------
// Un único formulario para todos los módulos: se arma solo a partir de un
// esquema de campos. Así el alta de un equipo y el alta de un lead se ven,
// se validan y se comportan igual.
//
// Esquema de un campo:
//   { name, label, tipo, opciones, requerido, ancho, placeholder, ayuda, min, max, paso }
//   tipo: texto | numero | moneda | select | fecha | hora | area | checkbox
//   ancho: 1 (media fila) | 2 (fila completa)
// ============================================================================

import React, { useEffect, useMemo, useState } from 'react';
import { X, Loader2, AlertTriangle } from 'lucide-react';

const vacio = (campos) =>
  campos.reduce((acc, c) => {
    acc[c.name] = c.tipo === 'checkbox' ? false : c.defecto ?? '';
    return acc;
  }, {});

export default function RegistroModal({
  abierto,
  titulo,
  subtitulo,
  campos,
  valores,
  onCerrar,
  onGuardar,
  acento = 'cyan',
  textoBoton = 'Guardar',
}) {
  const [form, setForm] = useState(() => vacio(campos));
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!abierto) return;
    setForm(valores ? { ...vacio(campos), ...valores } : vacio(campos));
    setError('');
  }, [abierto, valores, campos]);

  const acentos = useMemo(
    () => ({
      cyan: { texto: 'text-cyan-400', borde: 'border-cyan-500/50', fondo: 'bg-cyan-500/10', foco: 'focus:border-cyan-500/60' },
      violeta: { texto: 'text-violet-400', borde: 'border-violet-500/50', fondo: 'bg-violet-500/10', foco: 'focus:border-violet-500/60' },
      verde: { texto: 'text-emerald-400', borde: 'border-emerald-500/50', fondo: 'bg-emerald-500/10', foco: 'focus:border-emerald-500/60' },
      ambar: { texto: 'text-amber-400', borde: 'border-amber-500/50', fondo: 'bg-amber-500/10', foco: 'focus:border-amber-500/60' },
    }),
    []
  );
  const a = acentos[acento] || acentos.cyan;

  if (!abierto) return null;

  const set = (campo, tipo) => (e) => {
    const v =
      tipo === 'checkbox'
        ? e.target.checked
        : tipo === 'numero' || tipo === 'moneda'
          ? e.target.value === '' ? '' : Number(e.target.value)
          : e.target.value;
    setForm((f) => ({ ...f, [campo]: v }));
  };

  const enviar = async (e) => {
    e.preventDefault();
    if (guardando) return;

    const faltan = campos.filter(
      (c) => c.requerido && (form[c.name] === '' || form[c.name] === null || form[c.name] === undefined)
    );
    if (faltan.length) {
      setError(`Falta completar: ${faltan.map((c) => c.label).join(', ')}`);
      return;
    }

    setGuardando(true);
    setError('');
    try {
      await onGuardar(form);
      onCerrar();
    } catch (err) {
      setError(err.message || 'No se pudo guardar.');
    } finally {
      setGuardando(false);
    }
  };

  const inputCls = `w-full rounded border border-gray-700 bg-black/60 px-2.5 py-1.5 text-xs text-gray-200 outline-none transition-colors placeholder:text-gray-700 ${a.foco}`;
  const labelCls = 'mb-1 block font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-gray-500';

  return (
    <div className="fixed inset-0 z-[95] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm">
      <div className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-gray-700 bg-gray-950 shadow-2xl">
        <div className="flex shrink-0 items-start justify-between gap-3 border-b border-gray-800 bg-gray-900 px-4 py-3">
          <div className="min-w-0">
            <h3 className={`truncate font-mono text-[11px] font-bold uppercase tracking-[0.2em] ${a.texto}`}>
              {titulo}
            </h3>
            {subtitulo && (
              <p className="mt-0.5 truncate font-mono text-[10px] text-gray-600">{subtitulo}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onCerrar}
            className="shrink-0 rounded p-1 text-gray-500 transition-colors hover:bg-gray-800 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={enviar} className="flex min-h-0 flex-1 flex-col">
          <div className="grid min-h-0 flex-1 grid-cols-1 gap-3 overflow-y-auto p-4 sm:grid-cols-2">
            {campos.map((c) => (
              <div key={c.name} className={c.ancho === 2 ? 'sm:col-span-2' : ''}>
                <label className={labelCls}>
                  {c.label}
                  {c.requerido && <span className="ml-1 text-rose-400">*</span>}
                </label>

                {c.tipo === 'select' ? (
                  <select className={inputCls} value={form[c.name] ?? ''} onChange={set(c.name)}>
                    <option value="">— elegir —</option>
                    {(c.opciones || []).map((o) => (
                      <option key={o.valor ?? o} value={o.valor ?? o}>
                        {o.label ?? o}
                      </option>
                    ))}
                  </select>
                ) : c.tipo === 'area' ? (
                  <textarea
                    rows={c.filas || 3}
                    className={`${inputCls} resize-none`}
                    value={form[c.name] ?? ''}
                    onChange={set(c.name)}
                    placeholder={c.placeholder}
                  />
                ) : c.tipo === 'checkbox' ? (
                  <label className="flex items-center gap-2 py-1.5 text-xs text-gray-300">
                    <input
                      type="checkbox"
                      checked={Boolean(form[c.name])}
                      onChange={set(c.name, 'checkbox')}
                      className="h-3.5 w-3.5 accent-cyan-500"
                    />
                    {c.placeholder || 'Sí'}
                  </label>
                ) : (
                  <input
                    type={
                      c.tipo === 'numero' || c.tipo === 'moneda'
                        ? 'number'
                        : c.tipo === 'fecha'
                          ? 'date'
                          : c.tipo === 'hora'
                            ? 'time'
                            : 'text'
                    }
                    step={c.paso ?? (c.tipo === 'moneda' ? '0.01' : undefined)}
                    min={c.min}
                    max={c.max}
                    className={`${inputCls} ${c.tipo === 'numero' || c.tipo === 'moneda' ? 'text-right' : ''}`}
                    value={form[c.name] ?? ''}
                    onChange={set(c.name, c.tipo)}
                    placeholder={c.placeholder}
                  />
                )}

                {c.ayuda && (
                  <p className="mt-1 font-mono text-[9px] leading-snug text-gray-700">{c.ayuda}</p>
                )}
              </div>
            ))}
          </div>

          {error && (
            <div className="mx-4 mb-3 flex shrink-0 items-center gap-2 rounded border border-rose-900/60 bg-rose-950/40 px-3 py-2 text-xs text-rose-300">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex shrink-0 items-center justify-end gap-2 border-t border-gray-800 bg-gray-900 px-4 py-3">
            <button
              type="button"
              onClick={onCerrar}
              className="rounded border border-gray-700 px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400 transition-colors hover:text-white"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={guardando}
              className={`inline-flex items-center gap-2 rounded border px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.15em] transition-colors disabled:opacity-30 ${a.borde} ${a.fondo} ${a.texto}`}
            >
              {guardando && <Loader2 className="h-3 w-3 animate-spin" />}
              {textoBoton}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
