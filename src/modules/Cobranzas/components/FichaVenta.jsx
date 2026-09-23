// ============================================================================
// SISTEMA GM · M-07 · FICHA DE LA VENTA
// ----------------------------------------------------------------------------
// El detalle de una venta con su plan completo, cuota por cuota. Es la
// pantalla que se abre cuando el cliente llama y hay que contestarle "te
// quedan tres cuotas y la de agosto está a medias".
//
// Arriba de todo van las dos cosas que se hacen desde acá: registrar un cobro
// y llamar al cliente. Todo lo demás es información para esa conversación.
// ============================================================================

import React from 'react';
import {
  Banknote, CalendarClock, Mail, MessageCircle, Pencil, Phone, Receipt, Trash2, X,
} from 'lucide-react';
import Chip from '../../../shared/gm-ui/Chip';
import BotonGm from '../../../shared/gm-ui/BotonGm';
import BarraAvance from './BarraAvance';
import {
  getEstadoVenta, getEstadoCuota, getAtraso, usd, usdExacto,
  fechaCorta, fechaLarga, dias as diasTexto, plural,
} from '../config/cobranzas.config';
import { ESTADO_COLOR } from '../../../shared/gm-ui/tokens';

const soloDigitos = (t) => String(t || '').replace(/[^\d]/g, '');

const linkWhatsApp = (tel) => {
  const d = soloDigitos(tel);
  if (d.length < 8) return null;
  const con54 = d.startsWith('54') ? d : `54${d.replace(/^0/, '')}`;
  return `https://wa.me/${con54}`;
};

export default function FichaVenta({ venta: v, cuotas = [], onCerrar, onCobrar, onEditar, onEliminar }) {
  if (!v) return null;

  const estado = getEstadoVenta(v.estadoCobro);
  const atraso = v.cuotasVencidas > 0 && v.diasAtraso != null ? getAtraso(v.diasAtraso) : null;
  const wa = linkWhatsApp(v.celular || v.telefono);
  const tel = soloDigitos(v.telefono || v.celular);

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--gm-borde)] bg-white">
      {/* ------------------------------ cabecera ------------------------------ */}
      <header className="flex items-start gap-3 border-b border-[var(--gm-borde-fuerte)] px-5 py-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-[16px] font-semibold leading-tight text-[#2A2118]">{v.cliente}</h3>
            <Chip tono={estado.tono} punto>{estado.nombre}</Chip>
          </div>
          <p className="mt-1 text-[13px] text-[#6E6559]">{v.detalle}</p>
          <p className="mt-0.5 text-[11px] text-[var(--gm-texto-medio)]">
            {v.codigo} · vendida el {fechaLarga(v.fecha)}
            {v.titular ? ` · ${v.titular}` : ''}
          </p>
        </div>
        {onCerrar && (
          <button
            type="button"
            onClick={onCerrar}
            aria-label="Cerrar ficha"
            className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-[var(--gm-texto-medio)] transition hover:bg-[#F3EDE4] hover:text-[#2A2118]"
          >
            <X size={15} />
          </button>
        )}
      </header>

      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-5 py-4">
        {/* --------------------------- acciones ---------------------------- */}
        <div className="flex flex-wrap items-center gap-2">
          {v.saldoUsd > 0.01 && (
            <BotonGm variante="solido" tamano="sm" icono={Banknote} onClick={() => onCobrar?.(v)}>
              Registrar un cobro
            </BotonGm>
          )}
          <Enlace href={tel ? `tel:${tel}` : null} icono={Phone} etiqueta="Llamar" />
          <Enlace href={wa} icono={MessageCircle} etiqueta="WhatsApp" externo />
          <Enlace href={v.email ? `mailto:${v.email}` : null} icono={Mail} etiqueta="Mail" />
          {onEditar && (
            <BotonGm variante="contorno" tamano="sm" icono={Pencil} onClick={() => onEditar(v)}>
              Editar
            </BotonGm>
          )}
          {onEliminar && (
            <BotonGm variante="fantasma" tamano="sm" icono={Trash2} onClick={() => onEliminar(v)}>
              Eliminar
            </BotonGm>
          )}
        </div>

        {/* ---------------------------- el saldo --------------------------- */}
        <section className="rounded-xl bg-[#FCFAF6] px-4 py-3.5">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--gm-texto-medio)]">
                Falta cobrar
              </p>
              <p
                className="mt-1 text-[26px] leading-none tabular-nums"
                style={{ color: v.saldoUsd > 0.01 ? '#2A2118' : ESTADO_COLOR.bien }}
              >
                {v.saldoUsd > 0.01 ? usdExacto(v.saldoUsd) : 'Todo cobrado'}
              </p>
            </div>
            <p className="text-[12px] text-[#948A7C]">
              {usd(v.cobradoUsd)} cobrado de {usd(v.totalUsd)}
            </p>
          </div>

          <div className="mt-3">
            <BarraAvance
              total={v.totalUsd}
              cobrado={v.cobradoUsd}
              vencido={v.vencidoUsd}
              alto="h-2.5"
              mostrarPct
            />
          </div>

          {v.vencidoUsd > 0 && (
            <p className="mt-2.5 rounded-lg bg-[#F5DDCC] px-3 py-2 text-[12px] leading-relaxed text-[#A63A0C]">
              {usd(v.vencidoUsd)} ya deberían haber entrado
              {atraso ? `. La más vieja lleva ${diasTexto(v.diasAtraso)} de atraso.` : '.'}
            </p>
          )}
        </section>

        {/* ---------------------------- números ---------------------------- */}
        <dl className="grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-4">
          <Dato titulo="Total" valor={usd(v.totalUsd)} />
          <Dato
            titulo="Anticipo"
            valor={usd(v.anticipoUsd)}
            pie={
              v.anticipoUsd > 0 && v.anticipoCobradoUsd < v.anticipoUsd
                ? `sólo entró ${usd(v.anticipoCobradoUsd)}`
                : v.anticipoUsd > 0 ? 'cobrado' : 'sin anticipo'
            }
            alerta={v.anticipoUsd > 0 && v.anticipoCobradoUsd < v.anticipoUsd}
          />
          <Dato
            titulo="Financiado"
            valor={usd(v.financiadoUsd)}
            pie={v.interesPct > 0 ? `con ${v.interesPct}% de interés` : 'sin interés'}
          />
          <Dato
            titulo="Margen"
            valor={usd(v.margenUsd)}
            pie={`${v.margenPct}% sobre la venta`}
          />
        </dl>

        {/* ------------------------- plan de cuotas ------------------------ */}
        <section>
          <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
            <h4 className="text-[13px] font-semibold text-[#2A2118]">Plan de pago</h4>
            <p className="text-[11px] text-[var(--gm-texto-medio)]">
              {v.cuotasTotal > 0
                ? `${v.cuotasPagadas} de ${plural(v.cuotasTotal, 'cuota pagada', 'cuotas pagadas')}`
                : 'Venta de contado'}
            </p>
          </div>

          {cuotas.length === 0 ? (
            <p className="rounded-xl border border-dashed border-[var(--gm-borde)] px-4 py-6 text-center text-[13px] text-[#948A7C]">
              {v.cuotasPactadas > 0
                ? 'Se pactaron cuotas pero el plan todavía no está armado.'
                : 'Se pagó todo junto, no hay cuotas que seguir.'}
            </p>
          ) : (
            <ul className="divide-y divide-[var(--gm-divisor)] overflow-hidden rounded-xl border border-[#EFE7DB]">
              {cuotas.map((c) => {
                const e = getEstadoCuota(c.estado);
                return (
                  <li
                    key={c.codigo}
                    className={`flex items-center gap-3 px-3.5 py-2.5 ${
                      c.estado === 'vencida' ? 'bg-[#FBEAE0]' : ''
                    }`}
                  >
                    <span
                      className="grid h-7 w-7 shrink-0 place-items-center rounded-lg text-[11px] font-semibold tabular-nums"
                      style={{
                        backgroundColor: c.estado === 'pagada' ? e.color : `${e.color}1F`,
                        color: c.estado === 'pagada' ? '#FFFFFF' : e.color,
                      }}
                    >
                      {c.numero}
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-baseline gap-x-2">
                        <span className="text-[13px] tabular-nums text-[#2A2118]">
                          {usdExacto(c.montoUsd)}
                        </span>
                        <Chip tono={e.tono}>{e.nombre}</Chip>
                      </span>
                      <span className="mt-0.5 block text-[11px] text-[var(--gm-texto-medio)]">
                        vence {fechaCorta(c.vencimiento)}
                        {c.estado === 'vencida' && ` · hace ${diasTexto(Math.abs(c.dias))}`}
                        {c.estado === 'pendiente' && c.dias >= 0 && ` · en ${diasTexto(c.dias)}`}
                        {c.cobradoUsd > 0 && c.estado !== 'pagada' &&
                          ` · entraron ${usd(c.cobradoUsd)}`}
                      </span>
                    </span>

                    <span className="shrink-0 text-right text-[12px] tabular-nums">
                      {c.saldoUsd > 0.01 ? (
                        <span className="text-[#6E6559]">{usd(c.saldoUsd)}</span>
                      ) : (
                        <span className="text-[#2E9B76]">saldada</span>
                      )}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        {/* ----------------------------- notas ----------------------------- */}
        {v.nota && (
          <section className="flex items-start gap-2 rounded-xl bg-[#FBE5C8]/50 px-3.5 py-3">
            <Receipt size={14} className="mt-0.5 shrink-0 text-[#B4551A]" />
            <p className="text-[12px] leading-relaxed text-[#7E3C0F]">{v.nota}</p>
          </section>
        )}

        <p className="flex items-center gap-1.5 text-[11px] text-[var(--gm-texto-medio)]">
          <CalendarClock size={12} />
          {v.ultimoCobro
            ? `Último movimiento el ${fechaCorta(v.ultimoCobro)}.`
            : 'Todavía no entró ningún pago de esta venta.'}
          {v.ultimoVencimiento && ` Termina de pagarse el ${fechaCorta(v.ultimoVencimiento)}.`}
        </p>
      </div>
    </article>
  );
}

function Dato({ titulo, valor, pie, alerta }) {
  return (
    <div>
      <dt className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--gm-texto-medio)]">
        {titulo}
      </dt>
      <dd className="mt-1 text-[15px] tabular-nums text-[#2A2118]">{valor}</dd>
      {pie && (
        <p className={`mt-0.5 text-[11px] ${alerta ? 'text-[#B4551A]' : 'text-[var(--gm-texto-medio)]'}`}>{pie}</p>
      )}
    </div>
  );
}

function Enlace({ href, icono: Icono, etiqueta, externo }) {
  const base =
    'inline-flex h-9 items-center gap-1.5 rounded-xl border px-3 text-[13px] font-medium transition';
  if (!href) {
    return (
      <span
        className={`${base} cursor-not-allowed border-[var(--gm-borde)] bg-[#FCFAF6] text-[var(--gm-texto-suave)]`}
        title={`Sin ${etiqueta.toLowerCase()} cargado`}
      >
        <Icono size={14} />
        {etiqueta}
      </span>
    );
  }
  return (
    <a
      href={href}
      target={externo ? '_blank' : undefined}
      rel={externo ? 'noreferrer' : undefined}
      className={`${base} border-[var(--gm-borde)] bg-white text-[#6E6559] hover:bg-[#FCFAF6] hover:text-[#2A2118]`}
    >
      <Icono size={14} />
      {etiqueta}
    </a>
  );
}
