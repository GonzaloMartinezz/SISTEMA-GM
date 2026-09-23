// ============================================================================
// SISTEMA GM · M-07 · NUEVA VENTA
// ----------------------------------------------------------------------------
// Cargar una venta es cargar un compromiso a futuro, así que el formulario
// muestra el plan de cuotas ANTES de guardar: cuánto queda cada cuota y qué
// día cae cada una. Es la diferencia entre "acepto 18 cuotas" y ver que la
// última vence en diciembre del año que viene.
//
// Elegir un equipo del catálogo completa precio y costo solos, pero los dos
// campos quedan editables: el precio de lista casi nunca es el precio final.
// ============================================================================

import React, { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';
import ModalGm from '../../../shared/gm-ui/ModalGm';
import BotonGm from '../../../shared/gm-ui/BotonGm';
import { MEDIOS, usd, usdExacto, fechaCorta, hoyIso, plural } from '../config/cobranzas.config';

const INPUT =
  'h-11 w-full rounded-xl border border-[var(--gm-borde)] bg-white px-3.5 text-[14px] text-[#2A2118] outline-none transition placeholder:text-[var(--gm-texto-medio)] focus:border-[#2F6DA0] focus:ring-4 focus:ring-[#2F6DA0]/10';

const r2 = (n) => Math.round((Number(n) || 0) * 100) / 100;

/** Suma meses respetando los meses cortos: el 31 + 1 mes cae a fin de febrero. */
const masMeses = (iso, n) => {
  const [a, m, d] = String(iso).split('-').map(Number);
  const base = new Date(a, m - 1 + n, 1);
  const ultimo = new Date(base.getFullYear(), base.getMonth() + 1, 0).getDate();
  const f = new Date(base.getFullYear(), base.getMonth(), Math.min(d, ultimo));
  return `${f.getFullYear()}-${String(f.getMonth() + 1).padStart(2, '0')}-${String(f.getDate()).padStart(2, '0')}`;
};

const VACIO = {
  clienteCodigo: '', equipoCodigo: '', detalle: '', fecha: '',
  totalUsd: '', costoUsd: '', anticipoUsd: '', cuotas: '',
  primerVencimiento: '', interesPct: '0', nota: '', vendedor: '',
  anticipoCobrado: true, medioAnticipo: 'transferencia', comprobanteAnticipo: '',
};

export default function ModalVenta({ abierto, venta, clientes = [], equipos = [], onCerrar, onGuardar }) {
  const [f, setF] = useState(VACIO);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');
  const editando = Boolean(venta);

  useEffect(() => {
    if (!abierto) return;
    if (venta) {
      setF({
        ...VACIO,
        clienteCodigo: venta.clienteCodigo || '',
        equipoCodigo: venta.equipoCodigo || '',
        detalle: venta.detalle || '',
        fecha: venta.fecha || hoyIso(),
        totalUsd: String(venta.totalUsd ?? ''),
        costoUsd: String(venta.costoUsd ?? ''),
        anticipoUsd: String(venta.anticipoUsd ?? ''),
        cuotas: String(venta.cuotasPactadas || venta.cuotasTotal || ''),
        primerVencimiento: venta.primerVencimiento || '',
        interesPct: String(venta.interesPct ?? '0'),
        nota: venta.nota || '',
        vendedor: venta.vendedor || '',
      });
    } else {
      const hoy = hoyIso();
      setF({ ...VACIO, fecha: hoy, primerVencimiento: masMeses(hoy, 1) });
    }
    setError('');
  }, [abierto, venta]);

  const set = (k) => (e) =>
    setF((x) => ({ ...x, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  /** Elegir del catálogo completa precio, costo y detalle. Todo sigue editable. */
  const elegirEquipo = (e) => {
    const cod = e.target.value;
    const eq = equipos.find((x) => x.codigo === cod);
    setF((x) => ({
      ...x,
      equipoCodigo: cod,
      detalle: eq ? eq.nombre : x.detalle,
      totalUsd: eq && !x.totalUsd ? String(eq.precioUsd) : x.totalUsd,
      costoUsd: eq && !x.costoUsd ? String(eq.costoUsd) : x.costoUsd,
    }));
  };

  // ------------------------- el plan, en vivo -------------------------------
  const plan = useMemo(() => {
    const total = r2(f.totalUsd);
    const anticipo = r2(f.anticipoUsd);
    const n = Math.max(parseInt(f.cuotas, 10) || 0, 0);
    const interes = r2(f.interesPct);
    const financiado = r2((total - anticipo) * (1 + interes / 100));

    if (n < 1 || financiado <= 0) {
      return { cuotas: [], financiado, valida: total > 0 && anticipo <= total };
    }

    const base = r2(financiado / n);
    let acum = 0;
    const cuotas = [];
    for (let i = 1; i <= n; i += 1) {
      const monto = i === n ? r2(financiado - acum) : base;
      if (i < n) acum = r2(acum + base);
      cuotas.push({
        numero: i,
        monto,
        vencimiento: masMeses(f.primerVencimiento || masMeses(f.fecha || hoyIso(), 1), i - 1),
      });
    }
    return { cuotas, financiado, valida: total > 0 && anticipo <= total };
  }, [f.totalUsd, f.anticipoUsd, f.cuotas, f.interesPct, f.primerVencimiento, f.fecha]);

  const margen = r2(r2(f.totalUsd) - r2(f.costoUsd));
  const margenPct = r2(f.totalUsd) > 0 ? (margen / r2(f.totalUsd)) * 100 : 0;

  const guardar = async () => {
    if (!f.clienteCodigo) {
      setError('Elegí un cliente.');
      return;
    }
    if (!f.detalle.trim() && !f.equipoCodigo) {
      setError('Poné qué vendiste.');
      return;
    }
    if (!(r2(f.totalUsd) > 0)) {
      setError('El total de la venta tiene que ser mayor a cero.');
      return;
    }
    if (r2(f.anticipoUsd) > r2(f.totalUsd)) {
      setError('El anticipo no puede ser mayor que el total.');
      return;
    }
    setGuardando(true);
    setError('');
    try {
      const datos = {
        clienteCodigo: f.clienteCodigo || null,
        equipoCodigo: f.equipoCodigo || null,
        detalle: f.detalle.trim() || null,
        fecha: f.fecha,
        totalUsd: r2(f.totalUsd),
        costoUsd: r2(f.costoUsd),
        anticipoUsd: r2(f.anticipoUsd),
        cuotas: parseInt(f.cuotas, 10) || 0,
        primerVencimiento: f.primerVencimiento || null,
        interesPct: r2(f.interesPct),
        nota: f.nota.trim() || null,
        vendedor: f.vendedor.trim() || null,
      };
      if (!editando) {
        datos.anticipoCobrado = f.anticipoCobrado;
        datos.medioAnticipo = f.medioAnticipo;
        datos.comprobanteAnticipo = f.comprobanteAnticipo.trim() || null;
      }
      await onGuardar(datos);
      onCerrar?.();
    } catch (e) {
      setError(e.message || 'No se pudo guardar la venta.');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <ModalGm
      abierto={abierto}
      titulo={editando ? 'Editar venta' : 'Nueva venta'}
      bajada={
        editando
          ? 'Si cambiás el total, el anticipo, las cuotas o la primera fecha, el plan se rehace solo, respetando lo que ya esté cobrado.'
          : 'El plan de cuotas se arma solo con lo que cargues acá abajo.'
      }
      onCerrar={guardando ? undefined : onCerrar}
      ancho="max-w-3xl"
      pie={
        <>
          <BotonGm variante="fantasma" onClick={onCerrar} disabled={guardando}>Cancelar</BotonGm>
          <BotonGm variante="solido" onClick={guardar} disabled={guardando}>
            {guardando ? <Loader2 size={16} className="animate-spin" /> : null}
            {guardando ? 'Guardando…' : editando ? 'Guardar cambios' : 'Guardar venta'}
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
          <Campo etiqueta="Cliente">
            <select value={f.clienteCodigo} onChange={set('clienteCodigo')} className={INPUT}>
              <option value="">— Elegí un cliente —</option>
              {clientes.map((c) => (
                <option key={c.codigo} value={c.codigo}>
                  {c.nombre}{c.localidad ? ` · ${c.localidad}` : ''}
                </option>
              ))}
            </select>
          </Campo>

          <Campo etiqueta="Equipo del catálogo (opcional)">
            <select value={f.equipoCodigo} onChange={elegirEquipo} className={INPUT}>
              <option value="">— Sin equipo del catálogo —</option>
              {equipos.map((e) => (
                <option key={e.codigo} value={e.codigo}>
                  {e.nombre} · {usd(e.precioUsd)}
                </option>
              ))}
            </select>
          </Campo>
        </div>

        <Campo etiqueta="Qué vendiste">
          <input
            value={f.detalle}
            onChange={set('detalle')}
            placeholder="Sillón odontológico completo + instalación"
            className={INPUT}
          />
        </Campo>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
          <Campo etiqueta="Fecha">
            <input type="date" value={f.fecha} onChange={set('fecha')} className={INPUT} />
          </Campo>
          <Campo etiqueta="Total USD">
            <input type="number" min="0" step="0.01" value={f.totalUsd} onChange={set('totalUsd')} placeholder="0.00" className={INPUT} />
          </Campo>
          <Campo etiqueta="Te costó USD">
            <input type="number" min="0" step="0.01" value={f.costoUsd} onChange={set('costoUsd')} placeholder="0.00" className={INPUT} />
          </Campo>
          <Campo etiqueta="Anticipo USD">
            <input type="number" min="0" step="0.01" value={f.anticipoUsd} onChange={set('anticipoUsd')} placeholder="0.00" className={INPUT} />
          </Campo>
        </div>

        {r2(f.totalUsd) > 0 && r2(f.costoUsd) > 0 && (
          <p className="text-[12px] text-[#6E6559]">
            Margen de esta venta: <strong className="text-[#2A2118]">{usd(margen)}</strong>
            <span className="text-[#948A7C]"> ({margenPct.toFixed(1)}% sobre el total)</span>
          </p>
        )}

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Campo etiqueta="En cuántas cuotas">
            <input type="number" min="0" max="60" step="1" value={f.cuotas} onChange={set('cuotas')} placeholder="0 = contado" className={INPUT} />
          </Campo>
          <Campo etiqueta="Primera vence el">
            <input type="date" value={f.primerVencimiento} onChange={set('primerVencimiento')} className={INPUT} />
          </Campo>
          <Campo etiqueta="Interés %">
            <input type="number" min="0" step="0.1" value={f.interesPct} onChange={set('interesPct')} className={INPUT} />
          </Campo>
        </div>

        <Campo etiqueta="Vendedor (opcional)">
          <input value={f.vendedor} onChange={set('vendedor')} placeholder="Quién la cerró" className={INPUT} />
        </Campo>

        {/* --------------------- el anticipo, si ya entró -------------------- */}
        {!editando && r2(f.anticipoUsd) > 0 && (
          <section className="rounded-xl border border-[var(--gm-borde)] bg-[#FCFAF6] px-4 py-3.5">
            <label className="flex items-center gap-2.5">
              <input
                type="checkbox"
                checked={f.anticipoCobrado}
                onChange={set('anticipoCobrado')}
                className="h-4 w-4 rounded border-[#D5CABA] text-[#B4551A] focus:ring-[#B4551A]/30"
              />
              <span className="text-[13px] text-[#2A2118]">
                El anticipo de {usd(f.anticipoUsd)} ya lo tengo cobrado
              </span>
            </label>
            <p className="mt-1.5 pl-7 text-[11px] leading-relaxed text-[#948A7C]">
              Si lo destildás, el anticipo queda pactado pero sin entrar. El sistema va a mostrar
              la venta con ese saldo pendiente, que es la verdad.
            </p>

            {f.anticipoCobrado && (
              <div className="mt-3 grid grid-cols-1 gap-3 pl-7 sm:grid-cols-2">
                <Campo etiqueta="Cómo lo pagó">
                  <select value={f.medioAnticipo} onChange={set('medioAnticipo')} className={INPUT}>
                    {MEDIOS.map((m) => <option key={m.id} value={m.id}>{m.nombre}</option>)}
                  </select>
                </Campo>
                <Campo etiqueta="Comprobante (opcional)">
                  <input value={f.comprobanteAnticipo} onChange={set('comprobanteAnticipo')} placeholder="TR-9401" className={INPUT} />
                </Campo>
              </div>
            )}
          </section>
        )}

        <Campo etiqueta="Nota (opcional)">
          <input value={f.nota} onChange={set('nota')} placeholder="Lo que convenga recordar de esta venta" className={INPUT} />
        </Campo>

        {/* ----------------------- vista previa del plan --------------------- */}
        {plan.cuotas.length > 0 && (
          <section className="rounded-xl border border-[var(--gm-borde)] bg-[#FCFAF6] px-4 py-3.5">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--gm-texto-medio)]">
                Así queda el plan
              </p>
              <p className="text-[12px] text-[#6E6559]">
                {plural(plan.cuotas.length, 'cuota', 'cuotas')} · {usdExacto(plan.financiado)} financiados
              </p>
            </div>

            <div className="mt-2.5 max-h-[168px] overflow-y-auto">
              <ul className="grid grid-cols-2 gap-x-4 gap-y-1 sm:grid-cols-3">
                {plan.cuotas.map((c) => (
                  <li key={c.numero} className="flex items-baseline justify-between gap-2 text-[12px]">
                    <span className="text-[#948A7C]">
                      {c.numero}. {fechaCorta(c.vencimiento)}
                    </span>
                    <span className="tabular-nums text-[#2A2118]">{usdExacto(c.monto)}</span>
                  </li>
                ))}
              </ul>
            </div>

            <p className="mt-2.5 border-t border-[#EFE7DB] pt-2.5 text-[11px] leading-relaxed text-[#948A7C]">
              La última cuota absorbe el redondeo, así la suma de las cuotas da exactamente lo
              financiado y la venta puede cerrarse al centavo. Termina de pagarse el{' '}
              {fechaCorta(plan.cuotas[plan.cuotas.length - 1].vencimiento)}.
            </p>
          </section>
        )}

        {r2(f.anticipoUsd) > r2(f.totalUsd) && (
          <p className="text-[12px] text-[#A63A0C]">
            El anticipo es mayor que el total de la venta. Revisá los números.
          </p>
        )}
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
