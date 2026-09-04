// ============================================================================
// SISTEMA GM · UI · FORMULARIO POR ESQUEMA
// ----------------------------------------------------------------------------
// Un solo formulario para todas las altas y ediciones del sistema. Se arma
// a partir de un esquema de campos, así el alta de un cliente y el alta de un
// evento se ven y se validan igual.
//
// Campo: { clave, etiqueta, tipo, opciones, requerido, ancho, ayuda, placeholder }
// tipo:  texto | numero | moneda | select | fecha | hora | area | checkbox
// ancho: 1 (media fila) | 2 (fila completa)
// ============================================================================

import React, { useEffect, useState } from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';
import ModalGm from './ModalGm';
import BotonGm from './BotonGm';
import { useTema } from './TemaProvider';

const BASE_INPUT =
  'h-11 w-full rounded-xl border border-[var(--gm-borde)] bg-[var(--gm-superficie)] px-3.5 text-[14px] text-[var(--gm-texto)] outline-none transition placeholder:text-[var(--gm-texto-medio)] focus:border-[var(--gm-acento)] focus:ring-4 focus:ring-[var(--gm-acento)]/15';

const vacio = (campos) =>
  campos.reduce((acc, c) => {
    acc[c.clave] = c.tipo === 'checkbox' ? false : c.defecto ?? '';
    return acc;
  }, {});

export default function FormularioGm({
  abierto,
  titulo,
  bajada,
  campos = [],
  valores,
  onCerrar,
  onGuardar,
  textoBoton = 'Guardar',
}) {
  const { tinte } = useTema();
  const [form, setForm] = useState(() => vacio(campos));
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!abierto) return;
    setForm(valores ? { ...vacio(campos), ...valores } : vacio(campos));
    setError('');
  }, [abierto, valores, campos]);

  const set = (clave, tipo) => (e) => {
    const v = tipo === 'checkbox' ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [clave]: v }));
  };

  const guardar = async () => {
    const faltan = campos.filter(
      (c) => c.requerido && (form[c.clave] === '' || form[c.clave] == null)
    );
    if (faltan.length) {
      setError(`Falta completar: ${faltan.map((c) => c.etiqueta).join(', ')}`);
      return;
    }

    setGuardando(true);
    setError('');
    try {
      await onGuardar(form);
      onCerrar?.();
    } catch (err) {
      setError(err.message || 'No se pudo guardar.');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <ModalGm
      abierto={abierto}
      titulo={titulo}
      bajada={bajada}
      onCerrar={guardando ? undefined : onCerrar}
      pie={
        <>
          <BotonGm variante="fantasma" onClick={onCerrar} disabled={guardando}>
            Cancelar
          </BotonGm>
          <BotonGm variante="solido" onClick={guardar} disabled={guardando}>
            {guardando && <Loader2 size={15} className="animate-spin" />}
            {guardando ? 'Guardando…' : textoBoton}
          </BotonGm>
        </>
      }
    >
      {error && (
        <div
          className="mb-4 flex items-start gap-2 rounded-xl border px-3.5 py-3 text-[13px]"
          style={{ backgroundColor: tinte.peligro.bg, borderColor: tinte.peligro.borde, color: tinte.peligro.fg }}
        >
          <AlertTriangle size={15} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {campos.map((c) => (
          <label
            key={c.clave}
            className={`flex flex-col gap-1.5 ${c.ancho === 2 ? 'sm:col-span-2' : ''}`}
          >
            <span className="text-[12px] font-medium text-[var(--gm-texto-medio)]">
              {c.etiqueta}
              {c.requerido && <span className="ml-1 text-[var(--gm-acento)]">*</span>}
            </span>

            {c.tipo === 'select' ? (
              <select value={form[c.clave] ?? ''} onChange={set(c.clave)} className={BASE_INPUT}>
                <option value="">Seleccionar…</option>
                {(c.opciones || []).map((o) => {
                  const val = typeof o === 'string' ? o : o.valor;
                  const txt = typeof o === 'string' ? o : o.texto;
                  return (
                    <option key={val} value={val}>
                      {txt}
                    </option>
                  );
                })}
              </select>
            ) : c.tipo === 'area' ? (
              <textarea
                rows={3}
                value={form[c.clave] ?? ''}
                onChange={set(c.clave)}
                placeholder={c.placeholder}
                className={`${BASE_INPUT} h-auto py-2.5 leading-relaxed`}
              />
            ) : c.tipo === 'checkbox' ? (
              <span className="flex h-11 items-center gap-2 rounded-xl border border-[var(--gm-borde)] px-3.5">
                <input
                  type="checkbox"
                  checked={!!form[c.clave]}
                  onChange={set(c.clave, 'checkbox')}
                  className="h-4 w-4 accent-[var(--gm-acento)]"
                />
                <span className="text-[13px] text-[var(--gm-texto-medio)]">{c.ayuda || 'Sí'}</span>
              </span>
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
                value={form[c.clave] ?? ''}
                onChange={set(c.clave)}
                placeholder={c.placeholder}
                className={BASE_INPUT}
              />
            )}

            {c.ayuda && c.tipo !== 'checkbox' && (
              <span className="text-[11px] text-[var(--gm-texto-medio)]">{c.ayuda}</span>
            )}
          </label>
        ))}
      </div>
    </ModalGm>
  );
}
