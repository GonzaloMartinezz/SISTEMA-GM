// ============================================================================
// SISTEMA GM · M-08 COBRANZAS · CALENDARIO DE COBROS
// ----------------------------------------------------------------------------
// "Fechas de cobros por mes para mantenerme al tanto de los pagos": esta es
// esa pantalla. El mes con la plata que entra cada día, y al costado las tres
// listas que uno mira antes de arrancar: lo vencido, lo de esta semana y lo
// que viene después.
//
// Abajo va la proyección de los próximos seis meses. No es un pronóstico
// inventado: son cuotas ya pactadas con fecha y monto. Es lo más parecido a
// saber lo que vas a cobrar que puede darte un sistema honesto.
// ============================================================================

import React, { useMemo, useState } from 'react';
import {
  AlertTriangle, CalendarCheck, CalendarClock, ChevronLeft, ChevronRight, TrendingUp,
} from 'lucide-react';
import Panel from '../../../shared/gm-ui/Panel';
import Chip from '../../../shared/gm-ui/Chip';
import BotonGm from '../../../shared/gm-ui/BotonGm';
import EstadoVacio from '../../../shared/gm-ui/EstadoVacio';
import FilaEstadisticas from '../../../shared/gm-ui/FilaEstadisticas';
import { ESTADO_COLOR } from '../../../shared/gm-ui/tokens';
import { useCobranzas } from '../context/CobranzasContext';
import CalendarioCobros from '../components/CalendarioCobros';
import ModalCobro from '../components/ModalCobro';
import {
  grillaDelMes, resumenDelMes, agruparPorUrgencia, proyeccion,
  desplazarMes, mesActual, claveMes,
} from '../utils/calendario';
import {
  usd, usdCorto, mesLargo, fechaCorta, fechaLarga, dias as diasTexto,
  plural, getEstadoCuota,
} from '../config/cobranzas.config';

export default function CalendarioView() {
  const {
    cuotas, cargando, mesVisible, setMesVisible,
    ventas, cuotasPorVenta, nuevoCobro, setVentaActiva,
  } = useCobranzas();

  const [diaActivo, setDiaActivo] = useState(null);
  const [cobrandoVenta, setCobrandoVenta] = useState(null);

  const semanas = useMemo(() => grillaDelMes(mesVisible, cuotas), [mesVisible, cuotas]);
  const resumen = useMemo(() => resumenDelMes(mesVisible, cuotas), [mesVisible, cuotas]);
  const grupos = useMemo(() => agruparPorUrgencia(cuotas), [cuotas]);
  const futuro = useMemo(() => proyeccion(cuotas, 6), [cuotas]);

  const delDia = useMemo(
    () => (diaActivo ? cuotas.filter((c) => c.vencimiento === diaActivo) : []),
    [diaActivo, cuotas]
  );

  const abrirCobro = (cuota) => {
    const v = ventas.find((x) => x.codigo === cuota.ventaCodigo);
    if (v) {
      setVentaActiva(v.codigo);
      setCobrandoVenta(v);
    }
  };

  const topeProyeccion = Math.max(...futuro.map((f) => f.monto), 1);

  const estadisticas = [
    {
      etiqueta: 'Este mes entra',
      valor: usd(resumen.aCobrar),
      detalle: `${plural(resumen.pendientes, 'cuota pendiente', 'cuotas pendientes')}`,
    },
    {
      etiqueta: 'Ya cobrado',
      valor: usd(resumen.yaCobrado),
      detalle: `de ${usd(resumen.comprometido)} comprometidos`,
      color: resumen.yaCobrado > 0 ? ESTADO_COLOR.bien : undefined,
    },
    {
      etiqueta: 'Vencidas sin cobrar',
      valor: grupos.vencidas.length,
      detalle: grupos.vencidas.length
        ? `${usd(grupos.vencidas.reduce((a, c) => a + c.saldoUsd, 0))} en total`
        : 'ninguna, todo al día',
      color: grupos.vencidas.length ? ESTADO_COLOR.critico : undefined,
    },
    {
      etiqueta: 'Esta semana',
      valor: usd(grupos.estaSemana.reduce((a, c) => a + c.saldoUsd, 0)),
      detalle: `${plural(grupos.estaSemana.length, 'cobro', 'cobros')} hasta el domingo`,
      color: grupos.estaSemana.length ? ESTADO_COLOR.atencion : undefined,
    },
    {
      etiqueta: 'Clientes del mes',
      valor: resumen.clientes,
      detalle: 'con algo que vence',
    },
    {
      etiqueta: 'Próximos 6 meses',
      valor: usd(futuro.reduce((a, f) => a + f.monto, 0)),
      detalle: 'ya pactados en cuotas',
    },
  ];

  return (
    <div className="space-y-6">
      <Panel sinEncabezado cuerpoClassName="p-0">
        <FilaEstadisticas items={estadisticas} />
      </Panel>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
        {/* ---------------------------- el mes ----------------------------- */}
        <Panel
          titulo={mesLargo(mesVisible)}
          bajada="Cada casillero muestra lo que falta cobrar ese día. Tocá uno para ver quién es."
          acciones={
            <div className="flex items-center gap-1">
              <BotonGm
                variante="fantasma"
                tamano="sm"
                onClick={() => { setMesVisible(desplazarMes(mesVisible, -1)); setDiaActivo(null); }}
                aria-label="Mes anterior"
              >
                <ChevronLeft size={15} />
              </BotonGm>
              {mesVisible !== mesActual() && (
                <BotonGm
                  variante="contorno"
                  tamano="sm"
                  onClick={() => { setMesVisible(mesActual()); setDiaActivo(null); }}
                >
                  Hoy
                </BotonGm>
              )}
              <BotonGm
                variante="fantasma"
                tamano="sm"
                onClick={() => { setMesVisible(desplazarMes(mesVisible, 1)); setDiaActivo(null); }}
                aria-label="Mes siguiente"
              >
                <ChevronRight size={15} />
              </BotonGm>
            </div>
          }
          cuerpoClassName="px-5 py-4"
        >
          {cargando ? (
            <p className="py-16 text-center text-[14px] text-[#948A7C]">Armando el calendario…</p>
          ) : (
            <CalendarioCobros
              semanas={semanas}
              diaActivo={diaActivo}
              onDia={(d) => setDiaActivo(diaActivo === d.iso ? null : d.iso)}
            />
          )}

          {diaActivo && delDia.length > 0 && (
            <section className="mt-4 rounded-xl border border-[#E8E0D5] bg-[#FCFAF6] px-4 py-3">
              <p className="text-[12px] font-semibold text-[#2A2118]">{fechaLarga(diaActivo)}</p>
              <ul className="mt-2 space-y-1.5">
                {delDia.map((c) => {
                  const e = getEstadoCuota(c.estado);
                  return (
                    <li key={c.codigo} className="flex flex-wrap items-baseline gap-x-2 text-[12px]">
                      <span
                        className="h-2 w-2 shrink-0 rounded-full"
                        style={{ backgroundColor: e.color }}
                      />
                      <span className="text-[#2A2118]">{c.cliente}</span>
                      <span className="text-[#948A7C]">cuota {c.numero} · {c.ventaDetalle}</span>
                      <span className="ml-auto tabular-nums text-[#6E6559]">
                        {c.estado === 'pagada' ? 'cobrada' : usd(c.saldoUsd)}
                      </span>
                      {c.estado !== 'pagada' && (
                        <button
                          type="button"
                          onClick={() => abrirCobro(c)}
                          className="rounded-md border border-[#E8E0D5] bg-white px-2 py-0.5 text-[11px] text-[#B4551A] transition hover:bg-[#FBE5C8]"
                        >
                          Cobrar
                        </button>
                      )}
                    </li>
                  );
                })}
              </ul>
            </section>
          )}
        </Panel>

        {/* ------------------------- las tres listas ------------------------ */}
        <div className="space-y-6">
          <Panel
            titulo="Lo que hay que resolver"
            bajada="De lo más urgente a lo que puede esperar."
            acciones={<CalendarClock size={16} className="text-[#B0A697]" />}
            cuerpoClassName="p-0"
          >
            <Grupo
              titulo="Vencidas"
              icono={AlertTriangle}
              color={ESTADO_COLOR.critico}
              cuotas={grupos.vencidas}
              onCobrar={abrirCobro}
              vacio="Nada vencido. Andá tranquilo."
            />
            <Grupo
              titulo="Esta semana"
              icono={CalendarClock}
              color={ESTADO_COLOR.atencion}
              cuotas={grupos.estaSemana}
              onCobrar={abrirCobro}
              vacio="No vence nada hasta el domingo."
            />
            <Grupo
              titulo="Resto del mes"
              icono={CalendarCheck}
              color={ESTADO_COLOR.neutro}
              cuotas={grupos.restoDelMes}
              onCobrar={abrirCobro}
              vacio="No queda nada más este mes."
              ultimo
            />
          </Panel>

          <Panel
            titulo="Lo que se viene"
            bajada="Los próximos seis meses, con cuotas ya pactadas. No es un pronóstico: está firmado."
            acciones={<TrendingUp size={16} className="text-[#B0A697]" />}
          >
            {futuro.every((f) => f.monto === 0) ? (
              <EstadoVacio
                titulo="Sin cobros por delante"
                texto="No hay cuotas pendientes en los próximos seis meses."
              />
            ) : (
              <ul className="space-y-3">
                {futuro.map((f) => (
                  <li key={f.mes}>
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="text-[13px] text-[#2A2118]">{mesLargo(f.mes)}</span>
                      <span className="shrink-0 text-[13px] tabular-nums text-[#6E6559]">
                        {f.monto > 0 ? usd(f.monto) : '—'}
                      </span>
                    </div>
                    <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-[#F3EDE4]">
                      <span
                        className="block h-full rounded-full"
                        style={{
                          width: `${(f.monto / topeProyeccion) * 100}%`,
                          backgroundColor: f.mes === claveMes(mesActual())
                            ? ESTADO_COLOR.riesgo
                            : '#CE8A55',
                        }}
                      />
                    </div>
                    <p className="mt-1 text-[11px] text-[#B0A697]">
                      {f.cuotas > 0
                        ? `${plural(f.cuotas, 'cuota', 'cuotas')} de ${plural(f.clientes, 'cliente', 'clientes')}`
                        : 'sin vencimientos'}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>
      </div>

      <ModalCobro
        abierto={!!cobrandoVenta}
        venta={cobrandoVenta}
        cuotas={cobrandoVenta ? cuotasPorVenta.get(cobrandoVenta.codigo) || [] : []}
        onCerrar={() => setCobrandoVenta(null)}
        onGuardar={nuevoCobro}
      />
    </div>
  );
}

function Grupo({ titulo, icono: Icono, color, cuotas, onCobrar, vacio, ultimo }) {
  const total = cuotas.reduce((a, c) => a + c.saldoUsd, 0);

  return (
    <section className={ultimo ? '' : 'border-b border-[#F0EAE1]'}>
      <div className="flex items-center gap-2 bg-[#FCFAF6] px-5 py-2.5">
        <Icono size={13} style={{ color }} />
        <span className="text-[12px] font-semibold text-[#2A2118]">{titulo}</span>
        <span className="text-[11px] text-[#B0A697]">
          {cuotas.length > 0 ? `${cuotas.length} · ${usdCorto(total)}` : '—'}
        </span>
      </div>

      {cuotas.length === 0 ? (
        <p className="px-5 py-3 text-[12px] text-[#948A7C]">{vacio}</p>
      ) : (
        <ul className="divide-y divide-[#F4EFE7]">
          {cuotas.slice(0, 6).map((c) => (
            <li key={c.codigo} className="flex items-center gap-3 px-5 py-2.5">
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[13px] text-[#2A2118]">{c.cliente}</span>
                <span className="block truncate text-[11px] text-[#B0A697]">
                  cuota {c.numero} · vence {fechaCorta(c.vencimiento)}
                  {c.dias < 0 && ` · hace ${diasTexto(Math.abs(c.dias))}`}
                  {c.cobradoUsd > 0 && ` · entraron ${usd(c.cobradoUsd)}`}
                </span>
              </span>
              <span className="shrink-0 text-[12px] tabular-nums text-[#6E6559]">
                {usd(c.saldoUsd)}
              </span>
              <button
                type="button"
                onClick={() => onCobrar(c)}
                className="shrink-0 rounded-lg border border-[#E8E0D5] bg-white px-2 py-1 text-[11px] font-medium text-[#B4551A] transition hover:bg-[#FBE5C8]"
              >
                Cobrar
              </button>
            </li>
          ))}
          {cuotas.length > 6 && (
            <li className="px-5 py-2 text-[11px] text-[#B0A697]">
              y {plural(cuotas.length - 6, 'cobro más', 'cobros más')} en este grupo.
            </li>
          )}
        </ul>
      )}
    </section>
  );
}
