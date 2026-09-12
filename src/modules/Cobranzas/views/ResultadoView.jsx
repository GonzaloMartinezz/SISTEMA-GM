// ============================================================================
// SISTEMA GM · M-07 COBRANZAS · RESULTADO DEL NEGOCIO
// ----------------------------------------------------------------------------
// "Ganancia, pérdida": esta es esa pantalla. Y está construida alrededor de
// una distinción que casi nadie hace y que decide si el negocio se entiende o
// no se entiende:
//
//   CAJA   = la plata que se movió. Contesta "¿llego a fin de mes?".
//   MARGEN = lo vendido menos lo que costó. Contesta "¿el negocio funciona?".
//
// Un mes puede tener margen enorme y caja negativa: vendiste un rayos X a 18
// cuotas y lo pagaste al contado. Ese mes ganaste plata y te quedaste sin
// plata, las dos cosas a la vez, y las dos son ciertas. Por eso los dos
// números están uno al lado del otro y con el nombre bien puesto.
// ============================================================================

import React, { useMemo, useState } from 'react';
import { Layers, PieChart, TrendingDown, TrendingUp } from 'lucide-react';
import Panel from '../../../shared/gm-ui/Panel';
import Chip from '../../../shared/gm-ui/Chip';
import EstadoVacio from '../../../shared/gm-ui/EstadoVacio';
import FilaEstadisticas from '../../../shared/gm-ui/FilaEstadisticas';
import { ESTADO_COLOR } from '../../../shared/gm-ui/tokens';
import { useCobranzas } from '../context/CobranzasContext';
import BarrasResultado from '../components/BarrasResultado';
import CascadaResultado from '../components/CascadaResultado';
import { acumulado, cascada, porCategoria, totales } from '../utils/finanzas';
import { usd, mesLargo, plural } from '../config/cobranzas.config';

const PERIODOS = [
  { id: 3,  nombre: '3 meses' },
  { id: 6,  nombre: '6 meses' },
  { id: 12, nombre: '12 meses' },
];

export default function ResultadoView() {
  const { meses, cargando, resumenCartera } = useCobranzas();
  const [periodo, setPeriodo] = useState(12);

  /** Se toman los últimos N meses cerrados, sin los futuros: un mes que
   *  todavía no pasó siempre tiene caja cero y arruina cualquier promedio. */
  const ventana = useMemo(() => {
    const cerrados = meses.filter((m) => !m.esFuturo);
    return cerrados.slice(Math.max(cerrados.length - periodo, 0));
  }, [meses, periodo]);

  const t = useMemo(() => totales(ventana), [ventana]);
  const pasos = useMemo(() => cascada(ventana), [ventana]);
  const categorias = useMemo(() => porCategoria(ventana), [ventana]);
  const serie = useMemo(() => acumulado(ventana), [ventana]);

  const ganancia = pasos[pasos.length - 1]?.valor ?? 0;
  const gana = ganancia >= 0;
  const mejorMes = [...ventana].sort((a, b) => b.cajaUsd - a.cajaUsd)[0];
  const peorMes = [...ventana].sort((a, b) => a.cajaUsd - b.cajaUsd)[0];
  const promedioMes = ventana.length ? t.caja / ventana.length : 0;

  const estadisticas = [
    {
      etiqueta: gana ? 'Ganancia' : 'Pérdida',
      valor: usd(Math.abs(ganancia)),
      detalle: `en ${plural(ventana.length, 'mes', 'meses')}`,
      color: gana ? ESTADO_COLOR.bien : ESTADO_COLOR.critico,
    },
    {
      etiqueta: 'Entró',
      valor: usd(t.cobrado),
      detalle: 'cobrado de verdad',
    },
    {
      etiqueta: 'Salió',
      valor: usd(t.egresos),
      detalle: `${usd(t.retiros)} fueron retiros tuyos`,
    },
    {
      etiqueta: 'Margen de ventas',
      valor: usd(t.margen),
      detalle: `${plural(t.ventas, 'venta', 'ventas')} por ${usd(t.vendido)}`,
    },
    {
      etiqueta: 'Caja por mes',
      valor: usd(promedioMes),
      detalle: promedioMes >= 0 ? 'promedio, en positivo' : 'promedio, en negativo',
      color: promedioMes >= 0 ? undefined : ESTADO_COLOR.atencion,
    },
    {
      etiqueta: 'Falta cobrar',
      valor: usd(resumenCartera.porCobrar),
      detalle: 'todavía no entró a la caja',
    },
  ];

  return (
    <div className="space-y-6">
      <Panel sinEncabezado cuerpoClassName="p-0">
        <FilaEstadisticas items={estadisticas} />
      </Panel>

      {/* ------------------------- caja vs margen -------------------------- */}
      <Panel
        titulo="Las dos preguntas que no son la misma"
        bajada="Un mes puede ganar plata y quedarse sin plata al mismo tiempo. Las dos cosas son ciertas."
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Tarjeta
            titulo="¿Llego a fin de mes?"
            subtitulo="CAJA · la plata que se movió"
            valor={t.caja}
            pie={`Entró ${usd(t.cobrado)} y salió ${usd(t.egresos)}, retiros incluidos.`}
            icono={t.caja >= 0 ? TrendingUp : TrendingDown}
          />
          <Tarjeta
            titulo="¿El negocio funciona?"
            subtitulo="MARGEN · lo vendido menos lo que costó"
            valor={t.margen}
            pie={`De ${usd(t.vendido)} vendidos, ${usd(t.costoVendido)} se fueron en mercadería.`}
            icono={t.margen >= 0 ? TrendingUp : TrendingDown}
          />
        </div>

        <p className="mt-4 rounded-xl bg-[#FBE5C8]/50 px-4 py-3 text-[12px] leading-relaxed text-[#7E3C0F]">
          La diferencia entre los dos números es, casi siempre, lo que todavía no cobraste
          ({usd(resumenCartera.porCobrar)} hoy) más lo que pagaste por adelantado en mercadería.
          Cuanto más financiás, más se separan.
        </p>
      </Panel>

      {/* --------------------------- mes a mes ---------------------------- */}
      <Panel
        titulo="Mes a mes"
        bajada="Las barras son cada mes por separado. La línea azul es la caja acumulada: esa es la que tiene que subir."
        acciones={
          <div className="flex gap-1">
            {PERIODOS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPeriodo(p.id)}
                className={`rounded-lg border px-2.5 py-1.5 text-[12px] font-medium transition ${
                  periodo === p.id
                    ? 'border-[#B4551A] bg-[#FBE5C8] text-[#7E3C0F]'
                    : 'border-[var(--gm-borde)] bg-white text-[#6E6559] hover:bg-[#FCFAF6]'
                }`}
              >
                {p.nombre}
              </button>
            ))}
          </div>
        }
      >
        {cargando ? (
          <p className="py-16 text-center text-[14px] text-[#948A7C]">Calculando el resultado…</p>
        ) : serie.length === 0 ? (
          <EstadoVacio titulo="Sin datos todavía" texto="Cargá ventas y gastos para ver el resultado." />
        ) : (
          <>
            <BarrasResultado meses={serie} />
            {mejorMes && peorMes && mejorMes.mes !== peorMes.mes && (
              <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-[#948A7C]">
                <span>
                  Mejor mes: <strong className="text-[#2A2118]">{mesLargo(mejorMes.mes)}</strong>{' '}
                  ({usd(mejorMes.cajaUsd)})
                </span>
                <span>
                  Peor mes: <strong className="text-[#2A2118]">{mesLargo(peorMes.mes)}</strong>{' '}
                  ({usd(peorMes.cajaUsd)})
                </span>
              </p>
            )}
          </>
        )}
      </Panel>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* ---------------------------- cascada --------------------------- */}
        <Panel
          titulo="De lo que vendiste a lo que te quedó"
          bajada={`Últimos ${plural(ventana.length, 'mes', 'meses')}, escalón por escalón.`}
          acciones={<Layers size={16} className="text-[var(--gm-texto-medio)]" />}
        >
          <CascadaResultado pasos={pasos} />

          <p className="mt-4 border-t border-[var(--gm-borde-fuerte)] pt-3 text-[11px] leading-relaxed text-[#948A7C]">
            Los retiros no están en esta cuenta a propósito: son plata tuya que sacaste, no un
            costo de operar. Si los descontaras, un mes en que te pagaste bien parecería un mes
            en que el negocio anduvo mal.
            {t.retiros > 0 && ` En el período retiraste ${usd(t.retiros)}.`}
          </p>
        </Panel>

        {/* -------------------------- categorías -------------------------- */}
        <Panel
          titulo="En qué se fue la plata"
          bajada="Todos los egresos del período, por categoría."
          acciones={<PieChart size={16} className="text-[var(--gm-texto-medio)]" />}
        >
          {categorias.length === 0 ? (
            <EstadoVacio titulo="Sin egresos" texto="No hay gastos cargados en este período." />
          ) : (
            <ul className="space-y-3.5">
              {categorias.map((c) => {
                const Icono = c.icono;
                return (
                  <li key={c.id}>
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="flex items-center gap-2 text-[13px] text-[#2A2118]">
                        <Icono size={13} style={{ color: c.color }} />
                        {c.nombre}
                        {c.id === 'retiro' && <Chip tono="gris">no es costo</Chip>}
                      </span>
                      <span className="shrink-0 text-[13px] tabular-nums text-[#6E6559]">
                        {usd(c.monto)}
                        <span className="ml-1.5 text-[11px] text-[var(--gm-texto-medio)]">
                          {c.pct.toFixed(0)}%
                        </span>
                      </span>
                    </div>
                    <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-[#F3EDE4]">
                      <span
                        className="block h-full rounded-full"
                        style={{ width: `${c.pct}%`, backgroundColor: c.color }}
                      />
                    </div>
                    {c.ayuda && (
                      <p className="mt-1 text-[11px] text-[var(--gm-texto-medio)]">{c.ayuda}</p>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </Panel>
      </div>
    </div>
  );
}

function Tarjeta({ titulo, subtitulo, valor, pie, icono: Icono }) {
  const positivo = valor >= 0;
  const color = positivo ? ESTADO_COLOR.bien : ESTADO_COLOR.critico;

  return (
    <section className="rounded-2xl border border-[var(--gm-borde)] bg-[#FCFAF6] px-5 py-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[14px] font-semibold text-[#2A2118]">{titulo}</p>
          <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--gm-texto-medio)]">
            {subtitulo}
          </p>
        </div>
        <span
          className="grid h-9 w-9 shrink-0 place-items-center rounded-xl"
          style={{ backgroundColor: `${color}1A`, color }}
        >
          <Icono size={17} />
        </span>
      </div>

      <p className="mt-3 text-[30px] leading-none tabular-nums" style={{ color }}>
        {positivo ? '' : '− '}{usd(Math.abs(valor))}
      </p>
      <p className="mt-2 text-[12px] leading-relaxed text-[#948A7C]">{pie}</p>
    </section>
  );
}
