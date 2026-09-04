// ============================================================================
// SISTEMA GM · M-08 · REGISTRAR UN GASTO
// ----------------------------------------------------------------------------
// Todo lo que sale del negocio se carga acá: mercadería, fletes, sueldo,
// impuestos, el depósito, y también lo que te llevás vos.
//
// Los gastos que ya están definidos como recurrentes (el contador, el
// depósito, el combustible) se cargan de un toque: se elige de la lista y
// quedan concepto, categoría y monto puestos. Un gasto que cuesta trabajo
// anotar termina no anotándose, y entonces el resultado del mes miente.
// ============================================================================

import React, { useEffect, useState } from 'react';
import { AlertTriangle, Loader2, Zap } from 'lucide-react';
import ModalGm from '../../../shared/gm-ui/ModalGm';
import BotonGm from '../../../shared/gm-ui/BotonGm';
import { CATEGORIAS, MEDIOS, getCategoria, usd, hoyIso } from '../config/cobranzas.config';

const INPUT =
  'h-11 w-full rounded-xl border border-[#E8E0D5] bg-white px-3.5 text-[14px] text-[#2A2118] outline-none transition placeholder:text-[#B0A697] focus:border-[#2F6DA0] focus:ring-4 focus:ring-[#2F6DA0]/10';

const r2 = (n) => Math.round((Number(n) || 0) * 100) / 100;

/** Los gastos recurrentes traen su categoría en el nombre viejo; se normaliza. */
const normalizarCategoria = (c) => {
  const k = String(c || '').toLowerCase();
  if (k.startsWith('log')) return 'logistica';
  if (k.startsWith('merc')) return 'mercaderia';
  if (k.startsWith('sueld')) return 'sueldo';
  if (k.startsWith('impu')) return 'impuestos';
  return 'operativo';
};

const VACIO = {
  fecha: '', concepto: '', categoria: 'operativo', montoUsd: '',
  medio: 'transferencia', proveedor: '', comprobante: '', ventaCodigo: '',
  gastoCodigo: '', nota: '',
};

export default function ModalEgreso({
  abierto, gastos = [], ventas = [], onCerrar, onGuardar,
}) {
  const [f, setF] = useState(VACIO);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!abierto) return;
    setF({ ...VACIO, fecha: hoyIso() });
    setError('');
  }, [abierto]);

  const set = (k) => (e) => setF((x) => ({ ...x, [k]: e.target.value }));

  const usarGasto = (g) =>
    setF((x) => ({
      ...x,
      concepto: g.concepto,
      categoria: normalizarCategoria(g.categoria),
      montoUsd: String(g.montoUsd),
      gastoCodigo: g.codigo,
    }));

  const cat = getCategoria(f.categoria);

  const guardar = async () => {
    if (!f.concepto.trim()) {
      setError('Poné en qué se fue la plata.');
      return;
    }
    if (!(r2(f.montoUsd) > 0)) {
      setError('El monto tiene que ser mayor a cero.');
      return;
    }
    setGuardando(true);
    setError('');
    try {
      await onGuardar({
        fecha: f.fecha,
        concepto: f.concepto.trim(),
        categoria: f.categoria,
        montoUsd: r2(f.montoUsd),
        medio: f.medio,
        proveedor: f.proveedor.trim() || null,
        comprobante: f.comprobante.trim() || null,
        ventaCodigo: f.ventaCodigo || null,
        gastoCodigo: f.gastoCodigo || null,
        nota: f.nota.trim() || null,
      });
      onCerrar?.();
    } catch (e) {
      setError(e.message || 'No se pudo guardar el gasto.');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <ModalGm
      abierto={abierto}
      titulo="Registrar un gasto"
      bajada="Todo lo que sale del negocio, para que el resultado del mes sea real."
      onCerrar={guardando ? undefined : onCerrar}
      ancho="max-w-2xl"
      pie={
        <>
          <BotonGm variante="fantasma" onClick={onCerrar} disabled={guardando}>Cancelar</BotonGm>
          <BotonGm variante="solido" onClick={guardar} disabled={guardando}>
            {guardando ? <Loader2 size={16} className="animate-spin" /> : null}
            {guardando ? 'Guardando…' : 'Guardar gasto'}
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

        {gastos.length > 0 && (
          <section>
            <p className="mb-1.5 flex items-center gap-1.5 text-[12px] font-medium text-[#6E6559]">
              <Zap size={13} className="text-[#B4551A]" />
              De los que se repiten todos los meses
            </p>
            <div className="flex flex-wrap gap-1.5">
              {gastos.map((g) => (
                <button
                  key={g.codigo}
                  type="button"
                  onClick={() => usarGasto(g)}
                  className={`rounded-lg border px-2.5 py-1.5 text-[12px] transition ${
                    f.gastoCodigo === g.codigo
                      ? 'border-[#B4551A] bg-[#FBE5C8] text-[#7E3C0F]'
                      : 'border-[#E8E0D5] bg-white text-[#6E6559] hover:border-[#D5CABA] hover:bg-[#FCFAF6]'
                  }`}
                >
                  {g.concepto} · {usd(g.montoUsd)}
                </button>
              ))}
            </div>
          </section>
        )}

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto_auto]">
          <Campo etiqueta="En qué se fue">
            <input
              value={f.concepto}
              onChange={set('concepto')}
              placeholder="Compra de autoclave, flete a Concepción…"
              className={INPUT}
              autoFocus
            />
          </Campo>
          <Campo etiqueta="Monto USD">
            <input type="number" min="0" step="0.01" value={f.montoUsd} onChange={set('montoUsd')} placeholder="0.00" className={`${INPUT} sm:w-36`} />
          </Campo>
          <Campo etiqueta="Cuándo">
            <input type="date" value={f.fecha} onChange={set('fecha')} className={`${INPUT} sm:w-44`} />
          </Campo>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Campo etiqueta="Categoría">
            <select value={f.categoria} onChange={set('categoria')} className={INPUT}>
              {CATEGORIAS.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
            </select>
          </Campo>
          <Campo etiqueta="Cómo lo pagaste">
            <select value={f.medio} onChange={set('medio')} className={INPUT}>
              {MEDIOS.map((m) => <option key={m.id} value={m.id}>{m.nombre}</option>)}
            </select>
          </Campo>
        </div>

        {cat.ayuda && <p className="text-[11px] leading-relaxed text-[#948A7C]">{cat.ayuda}</p>}

        {f.categoria === 'retiro' && (
          <p className="rounded-xl bg-[#FBE5C8]/60 px-3.5 py-2.5 text-[12px] leading-relaxed text-[#7E3C0F]">
            El retiro sale de la caja pero no se cuenta como costo del negocio: es plata que ya
            ganaste y estás sacando. Por eso figura aparte en el resultado.
          </p>
        )}

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Campo etiqueta="A quién le pagaste (opcional)">
            <input value={f.proveedor} onChange={set('proveedor')} placeholder="DentalTech SA" className={INPUT} />
          </Campo>
          <Campo etiqueta="Comprobante (opcional)">
            <input value={f.comprobante} onChange={set('comprobante')} placeholder="FC-A-1244" className={INPUT} />
          </Campo>
        </div>

        {(f.categoria === 'mercaderia' || f.categoria === 'logistica') && ventas.length > 0 && (
          <Campo etiqueta="¿Es de alguna venta en particular? (opcional)">
            <select value={f.ventaCodigo} onChange={set('ventaCodigo')} className={INPUT}>
              <option value="">— No, es un gasto general —</option>
              {ventas.map((v) => (
                <option key={v.codigo} value={v.codigo}>
                  {v.codigo} · {v.cliente} · {v.detalle}
                </option>
              ))}
            </select>
          </Campo>
        )}

        <Campo etiqueta="Nota (opcional)">
          <input value={f.nota} onChange={set('nota')} placeholder="Lo que convenga recordar" className={INPUT} />
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
