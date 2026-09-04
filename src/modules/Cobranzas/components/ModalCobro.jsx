// ============================================================================
// SISTEMA GM · M-08 · REGISTRAR UN COBRO
// ----------------------------------------------------------------------------
// El cliente no paga cuotas, paga plata. Trae 500 y eso puede terminar de
// cubrir la cuota 3, pagar entera la 4 y dejar algo a cuenta de la 5.
//
// El reparto lo hace la base (gm_registrar_cobro), siempre de la cuota más
// vieja hacia adelante. Lo que hace esta pantalla es MOSTRARLO ANTES de
// confirmar, con las mismas reglas, para que nadie tenga que confiar a ciegas
// en lo que va a pasar. Si la vista previa dice una cosa y el resultado da
// otra, es un bug y se ve al instante.
// ============================================================================

import React, { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';
import ModalGm from '../../../shared/gm-ui/ModalGm';
import BotonGm from '../../../shared/gm-ui/BotonGm';
import {
  MEDIOS, CONCEPTOS_COBRO, usd, usdExacto, fechaCorta, hoyIso, plural,
} from '../config/cobranzas.config';

const INPUT =
  'h-11 w-full rounded-xl border border-[#E8E0D5] bg-white px-3.5 text-[14px] text-[#2A2118] outline-none transition placeholder:text-[#B0A697] focus:border-[#2F6DA0] focus:ring-4 focus:ring-[#2F6DA0]/10';

const r2 = (n) => Math.round((Number(n) || 0) * 100) / 100;

export default function ModalCobro({ abierto, venta, cuotas = [], onCerrar, onGuardar }) {
  const [monto, setMonto] = useState('');
  const [fecha, setFecha] = useState(hoyIso);
  const [medio, setMedio] = useState('transferencia');
  const [concepto, setConcepto] = useState('cuota');
  const [comprobante, setComprobante] = useState('');
  const [nota, setNota] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!abierto) return;
    setMonto('');
    setFecha(hoyIso());
    setMedio('transferencia');
    setConcepto('cuota');
    setComprobante('');
    setNota('');
    setError('');
  }, [abierto]);

  /** Las cuotas que están esperando plata, de la más vieja a la más nueva. */
  const abiertas = useMemo(
    () =>
      cuotas
        .filter((c) => ['vencida', 'parcial', 'pendiente'].includes(c.estado))
        .sort((a, b) => (a.vencimiento < b.vencimiento ? -1 : a.vencimiento > b.vencimiento ? 1 : a.numero - b.numero)),
    [cuotas]
  );

  /** La misma repartición que hace la base, calculada acá para mostrarla. */
  const reparto = useMemo(() => {
    const total = r2(monto);
    if (!(total > 0) || concepto !== 'cuota') return { tramos: [], sobra: total > 0 ? total : 0 };
    let resto = total;
    const tramos = [];
    for (const c of abiertas) {
      if (resto <= 0.004) break;
      const imputa = Math.min(resto, c.saldoUsd);
      if (imputa > 0) {
        tramos.push({ cuota: c, imputa: r2(imputa), completa: imputa >= c.saldoUsd - 0.004 });
        resto = r2(resto - imputa);
      }
    }
    return { tramos, sobra: Math.max(resto, 0) };
  }, [monto, concepto, abiertas]);

  const saldoDespues = venta ? Math.max(r2(venta.saldoUsd - r2(monto)), 0) : 0;

  const atajos = useMemo(() => {
    if (!venta) return [];
    const lista = [];
    const primera = abiertas[0];
    if (primera) lista.push({ etiqueta: `Cuota ${primera.numero}`, valor: primera.saldoUsd });
    const vencido = r2(abiertas.filter((c) => c.estado === 'vencida').reduce((a, c) => a + c.saldoUsd, 0));
    if (vencido > 0 && !lista.some((x) => x.valor === vencido)) {
      lista.push({ etiqueta: 'Todo lo vencido', valor: vencido });
    }
    if (venta.saldoUsd > 0 && !lista.some((x) => x.valor === r2(venta.saldoUsd))) {
      lista.push({ etiqueta: 'Saldo total', valor: r2(venta.saldoUsd) });
    }
    return lista;
  }, [venta, abiertas]);

  if (!venta) return null;

  const guardar = async () => {
    const total = r2(monto);
    if (!(total > 0)) {
      setError('Poné cuánto entró.');
      return;
    }
    setGuardando(true);
    setError('');
    try {
      await onGuardar({
        ventaCodigo: venta.codigo,
        montoUsd: total,
        fecha,
        medio,
        concepto,
        comprobante: comprobante.trim() || null,
        nota: nota.trim() || null,
      });
      onCerrar?.();
    } catch (e) {
      setError(e.message || 'No se pudo registrar el cobro.');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <ModalGm
      abierto={abierto}
      titulo="Registrar un cobro"
      bajada={`${venta.cliente} · ${venta.codigo} · falta cobrar ${usdExacto(venta.saldoUsd)}`}
      onCerrar={guardando ? undefined : onCerrar}
      ancho="max-w-xl"
      pie={
        <>
          <BotonGm variante="fantasma" onClick={onCerrar} disabled={guardando}>
            Cancelar
          </BotonGm>
          <BotonGm variante="solido" onClick={guardar} disabled={guardando}>
            {guardando ? <Loader2 size={16} className="animate-spin" /> : null}
            {guardando ? 'Registrando…' : 'Registrar'}
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

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Campo etiqueta="Cuánto entró (USD)" ancho="sm:col-span-1">
            <input
              type="number"
              min="0"
              step="0.01"
              inputMode="decimal"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
              placeholder="0.00"
              className={INPUT}
              autoFocus
            />
          </Campo>

          <Campo etiqueta="Cuándo">
            <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} className={INPUT} />
          </Campo>
        </div>

        {atajos.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] text-[#B0A697]">Rápido:</span>
            {atajos.map((a) => (
              <button
                key={a.etiqueta}
                type="button"
                onClick={() => setMonto(String(a.valor))}
                className="rounded-lg border border-[#E8E0D5] bg-white px-2.5 py-1 text-[12px] text-[#6E6559] transition hover:border-[#D5CABA] hover:bg-[#FCFAF6] hover:text-[#2A2118]"
              >
                {a.etiqueta} · {usd(a.valor)}
              </button>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Campo etiqueta="Cómo pagó">
            <select value={medio} onChange={(e) => setMedio(e.target.value)} className={INPUT}>
              {MEDIOS.map((m) => (
                <option key={m.id} value={m.id}>{m.nombre}</option>
              ))}
            </select>
          </Campo>

          <Campo etiqueta="Qué es este pago">
            <select value={concepto} onChange={(e) => setConcepto(e.target.value)} className={INPUT}>
              {CONCEPTOS_COBRO.map((c) => (
                <option key={c.id} value={c.id}>{c.nombre}</option>
              ))}
            </select>
          </Campo>
        </div>

        <p className="text-[11px] leading-relaxed text-[#948A7C]">
          {CONCEPTOS_COBRO.find((c) => c.id === concepto)?.ayuda}
        </p>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Campo etiqueta="Comprobante (opcional)">
            <input
              value={comprobante}
              onChange={(e) => setComprobante(e.target.value)}
              placeholder="TR-9401, recibo 0512…"
              className={INPUT}
            />
          </Campo>
          <Campo etiqueta="Nota (opcional)">
            <input
              value={nota}
              onChange={(e) => setNota(e.target.value)}
              placeholder="Lo que convenga recordar"
              className={INPUT}
            />
          </Campo>
        </div>

        {/* ------------------------ la vista previa ------------------------ */}
        {r2(monto) > 0 && (
          <section className="rounded-xl border border-[#E8E0D5] bg-[#FCFAF6] px-4 py-3.5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#B0A697]">
              Qué va a pasar con esta plata
            </p>

            {concepto !== 'cuota' ? (
              <p className="mt-2 text-[13px] leading-relaxed text-[#6E6559]">
                Se registra como {concepto} de la venta, sin tocar ninguna cuota. El saldo baja a{' '}
                <strong className="text-[#2A2118]">{usdExacto(saldoDespues)}</strong>.
              </p>
            ) : reparto.tramos.length === 0 ? (
              <p className="mt-2 text-[13px] leading-relaxed text-[#6E6559]">
                No quedan cuotas pendientes, así que entra como adelanto a cuenta de la venta.
              </p>
            ) : (
              <>
                <ul className="mt-2 space-y-1.5">
                  {reparto.tramos.map((t) => (
                    <li key={t.cuota.codigo} className="flex items-baseline gap-2 text-[13px]">
                      <span
                        className="h-1.5 w-1.5 shrink-0 rounded-full"
                        style={{ backgroundColor: t.completa ? '#2E9B76' : '#C08A1E' }}
                      />
                      <span className="text-[#2A2118]">
                        Cuota {t.cuota.numero}
                        <span className="text-[#948A7C]"> (vence {fechaCorta(t.cuota.vencimiento)})</span>
                      </span>
                      <span className="ml-auto tabular-nums text-[#6E6559]">
                        {usdExacto(t.imputa)}
                        <span className="ml-1.5 text-[11px] text-[#B0A697]">
                          {t.completa ? 'queda saldada' : 'queda a medias'}
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="mt-2.5 border-t border-[#EFE7DB] pt-2.5 text-[12px] text-[#6E6559]">
                  {plural(reparto.tramos.filter((t) => t.completa).length, 'cuota queda saldada', 'cuotas quedan saldadas')}
                  {reparto.sobra > 0.004 && (
                    <> y sobran <strong>{usdExacto(reparto.sobra)}</strong>, que quedan a cuenta.</>
                  )}
                  {reparto.sobra <= 0.004 && '.'}
                  {' '}Después de esto falta cobrar{' '}
                  <strong className="text-[#2A2118]">{usdExacto(saldoDespues)}</strong>.
                </p>
              </>
            )}
          </section>
        )}
      </div>
    </ModalGm>
  );
}

function Campo({ etiqueta, children, ancho = '' }) {
  return (
    <label className={`block ${ancho}`}>
      <span className="mb-1.5 block text-[12px] font-medium text-[#6E6559]">{etiqueta}</span>
      {children}
    </label>
  );
}
