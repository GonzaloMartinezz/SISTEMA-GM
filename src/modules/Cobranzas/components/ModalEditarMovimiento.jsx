// ============================================================================
// SISTEMA GM · M-07 · EDITAR UN MOVIMIENTO DE CAJA
// ----------------------------------------------------------------------------
// Un movimiento de la caja es, por debajo, un cobro (gm_cobros) o un gasto
// (gm_egresos). Este modal edita cualquiera de los dos con el mismo formato,
// mostrando sólo los campos que corresponden a cada tipo.
//
// Lo que NO se toca desde acá: a qué venta o cuota está vinculado el
// movimiento. Ese vínculo es identidad, no un dato para corregir; si algo
// se cobró contra la venta equivocada, se borra y se vuelve a cargar bien.
// ============================================================================

import React, { useEffect, useState } from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';
import ModalGm from '../../../shared/gm-ui/ModalGm';
import BotonGm from '../../../shared/gm-ui/BotonGm';
import { CATEGORIAS, MEDIOS, CONCEPTOS_COBRO } from '../config/cobranzas.config';

const INPUT =
  'h-11 w-full rounded-xl border border-[var(--gm-borde)] bg-white px-3.5 text-[14px] text-[#2A2118] outline-none transition placeholder:text-[var(--gm-texto-medio)] focus:border-[#2F6DA0] focus:ring-4 focus:ring-[#2F6DA0]/10';

const r2 = (n) => Math.round((Number(n) || 0) * 100) / 100;

export default function ModalEditarMovimiento({ movimiento, onCerrar, onGuardar }) {
  const [f, setF] = useState(null);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');

  const esIngreso = movimiento?.flujo === 'ingreso';

  useEffect(() => {
    if (!movimiento) return;
    setF({
      fecha: movimiento.fecha || '',
      montoUsd: String(movimiento.montoUsd ?? ''),
      medio: movimiento.medio || 'transferencia',
      comprobante: movimiento.comprobante || '',
      concepto: esIngreso ? (movimiento.concepto || 'cuota') : (movimiento.concepto || ''),
      categoria: movimiento.categoria || 'operativo',
      nota: movimiento.nota || '',
    });
    setError('');
  }, [movimiento, esIngreso]);

  if (!movimiento || !f) return null;

  const set = (k) => (e) => setF((x) => ({ ...x, [k]: e.target.value }));

  const guardar = async () => {
    if (!(r2(f.montoUsd) > 0)) {
      setError('El monto tiene que ser mayor a cero.');
      return;
    }
    if (!esIngreso && !f.concepto.trim()) {
      setError('Poné en qué se fue la plata.');
      return;
    }
    setGuardando(true);
    setError('');
    try {
      if (esIngreso) {
        await onGuardar({
          fecha: f.fecha,
          montoUsd: r2(f.montoUsd),
          medio: f.medio,
          comprobante: f.comprobante.trim() || null,
          concepto: f.concepto,
          nota: f.nota.trim() || null,
        });
      } else {
        await onGuardar({
          fecha: f.fecha,
          concepto: f.concepto.trim(),
          categoria: f.categoria,
          montoUsd: r2(f.montoUsd),
          medio: f.medio,
          comprobante: f.comprobante.trim() || null,
          nota: f.nota.trim() || null,
        });
      }
      onCerrar?.();
    } catch (e) {
      setError(e.message || 'No se pudo guardar el movimiento.');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <ModalGm
      abierto={Boolean(movimiento)}
      titulo={esIngreso ? 'Editar cobro' : 'Editar gasto'}
      bajada={
        esIngreso
          ? 'El vínculo con la venta y la cuota no cambia: sólo estos datos.'
          : 'Cambiá lo que haga falta corregir de este gasto.'
      }
      onCerrar={guardando ? undefined : onCerrar}
      ancho="max-w-lg"
      pie={
        <>
          <BotonGm variante="fantasma" onClick={onCerrar} disabled={guardando}>Cancelar</BotonGm>
          <BotonGm variante="solido" onClick={guardar} disabled={guardando}>
            {guardando ? <Loader2 size={16} className="animate-spin" /> : null}
            {guardando ? 'Guardando…' : 'Guardar cambios'}
          </BotonGm>
        </>
      }
    >
      <div className="space-y-4">
        {error && (
          <p className="flex items-start gap-2 rounded-xl border border-[#EDCBB4] bg-[#FBEAE0] px-3.5 py-2.5 text-[13px] text-[#A63A0C]">
            <AlertTriangle size={14} className="mt-0.5 shrink-0" />
            {error}
          </p>
        )}

        {!esIngreso && (
          <Campo etiqueta="En qué se fue">
            <input value={f.concepto} onChange={set('concepto')} className={INPUT} />
          </Campo>
        )}

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Campo etiqueta="Monto USD">
            <input type="number" min="0" step="0.01" value={f.montoUsd} onChange={set('montoUsd')} className={INPUT} />
          </Campo>
          <Campo etiqueta="Cuándo">
            <input type="date" value={f.fecha} onChange={set('fecha')} className={INPUT} />
          </Campo>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {esIngreso ? (
            <Campo etiqueta="Qué es este pago">
              <select value={f.concepto} onChange={set('concepto')} className={INPUT}>
                {CONCEPTOS_COBRO.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
              </select>
            </Campo>
          ) : (
            <Campo etiqueta="Categoría">
              <select value={f.categoria} onChange={set('categoria')} className={INPUT}>
                {CATEGORIAS.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
              </select>
            </Campo>
          )}
          <Campo etiqueta="Cómo se pagó">
            <select value={f.medio} onChange={set('medio')} className={INPUT}>
              {MEDIOS.map((m) => <option key={m.id} value={m.id}>{m.nombre}</option>)}
            </select>
          </Campo>
        </div>

        <Campo etiqueta="Comprobante (opcional)">
          <input value={f.comprobante} onChange={set('comprobante')} className={INPUT} />
        </Campo>

        <Campo etiqueta="Nota (opcional)">
          <input value={f.nota} onChange={set('nota')} className={INPUT} />
        </Campo>
      </div>
    </ModalGm>
  );
}

function Campo({ etiqueta, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[12px] font-medium text-[#6E6559]">{etiqueta}</span>
      {children}
    </label>
  );
}
