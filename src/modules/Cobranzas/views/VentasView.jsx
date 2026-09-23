// ============================================================================
// SISTEMA GM · M-07 COBRANZAS · VENTAS Y COBROS
// ----------------------------------------------------------------------------
// La pantalla principal del módulo: cada venta con su anticipo, su plan de
// cuotas y cuánto falta cobrar. A la izquierda la lista, a la derecha la
// ficha de la que estés mirando.
//
// El indicador que manda es la MOROSIDAD: qué porcentaje de lo que te deben ya
// tendría que haber entrado. El total por cobrar puede crecer porque vendiste
// más, y eso es bueno; la morosidad sólo crece cuando algo se está yendo de
// las manos.
// ============================================================================

import React, { useEffect, useState } from 'react';
import { HandCoins, Plus, Users } from 'lucide-react';
import Panel from '../../../shared/gm-ui/Panel';
import Chip from '../../../shared/gm-ui/Chip';
import BotonGm from '../../../shared/gm-ui/BotonGm';
import EstadoVacio from '../../../shared/gm-ui/EstadoVacio';
import FilaEstadisticas from '../../../shared/gm-ui/FilaEstadisticas';
import ConfirmarGm from '../../../shared/gm-ui/ConfirmarGm';
import { ESTADO_COLOR } from '../../../shared/gm-ui/tokens';
import { useCobranzas } from '../context/CobranzasContext';
import FilaVenta from '../components/FilaVenta';
import FichaVenta from '../components/FichaVenta';
import ModalCobro from '../components/ModalCobro';
import ModalVenta from '../components/ModalVenta';
import { usd, plural, dias as diasTexto, fechaCorta } from '../config/cobranzas.config';

const FILTROS = [
  { id: 'todas',    nombre: 'Todas' },
  { id: 'atrasada', nombre: 'Atrasadas' },
  { id: 'al dia',   nombre: 'Al día' },
  { id: 'cobrada',  nombre: 'Cobradas' },
];

export default function VentasView() {
  const {
    ventasFiltradas, ventas, clientes, equipos, cargando,
    ventaActiva, setVentaActiva, ventaSeleccionada, cuotasDeLaVenta,
    estadoFiltro, setEstadoFiltro, conteoPorEstado,
    resumenCartera, deudores, nuevoCobro, nuevaVenta, editarVenta, borrarVenta,
  } = useCobranzas();

  const [cobrando, setCobrando] = useState(false);
  const [creando, setCreando] = useState(false);
  const [editando, setEditando] = useState(null);
  const [borrando, setBorrando] = useState(null);

  // Si la venta abierta desaparece del filtro, se cierra la ficha en vez de
  // quedar mostrando algo que ya no está en la lista de al lado.
  useEffect(() => {
    if (ventaActiva && !ventasFiltradas.some((v) => v.codigo === ventaActiva)) {
      setVentaActiva(null);
    }
  }, [ventasFiltradas, ventaActiva, setVentaActiva]);

  const c = resumenCartera;

  const estadisticas = [
    {
      etiqueta: 'Por cobrar',
      valor: usd(c.porCobrar),
      detalle: `en ${plural(c.ventasAbiertas, 'venta abierta', 'ventas abiertas')}`,
    },
    {
      etiqueta: 'Ya vencido',
      valor: usd(c.vencido),
      detalle: c.vencido > 0 ? 'tendría que haber entrado' : 'no debe nada nadie',
      color: c.vencido > 0 ? ESTADO_COLOR.critico : undefined,
    },
    {
      etiqueta: 'Morosidad',
      valor: `${c.morosidadPct.toFixed(0)}%`,
      detalle: 'de lo que te deben está vencido',
      color: c.morosidadPct >= 25 ? ESTADO_COLOR.critico
        : c.morosidadPct >= 10 ? ESTADO_COLOR.atencion : undefined,
    },
    {
      etiqueta: 'Ventas atrasadas',
      valor: c.ventasAtrasadas,
      detalle: `de ${plural(c.ventasAbiertas, 'venta', 'ventas')} con saldo`,
      color: c.ventasAtrasadas > 0 ? ESTADO_COLOR.atencion : undefined,
    },
    {
      etiqueta: 'Clientes con saldo',
      valor: c.clientesDeudores,
      detalle: 'te deben algo hoy',
    },
    {
      etiqueta: 'El peor atraso',
      valor: c.peor?.diasAtraso != null ? diasTexto(c.peor.diasAtraso) : '—',
      detalle: c.peor ? c.peor.cliente : 'ninguno atrasado',
      color: c.peor?.diasAtraso >= 30 ? ESTADO_COLOR.critico : undefined,
    },
  ];

  return (
    <div className="space-y-6">
      <Panel sinEncabezado cuerpoClassName="p-0">
        <FilaEstadisticas items={estadisticas} />
      </Panel>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
        {/* ------------------------------ la lista ------------------------- */}
        <Panel
          titulo="Ventas"
          bajada="Tocá una para ver el plan completo y registrar un cobro."
          acciones={
            <BotonGm variante="solido" tamano="sm" icono={Plus} onClick={() => setCreando(true)}>
              Nueva venta
            </BotonGm>
          }
          cuerpoClassName="p-0"
        >
          <div className="flex flex-wrap gap-1.5 border-b border-[var(--gm-borde-fuerte)] px-5 py-3">
            {FILTROS.map((f) => {
              const activo = estadoFiltro === f.id;
              const n = conteoPorEstado[f.id] ?? 0;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setEstadoFiltro(f.id)}
                  className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[12px] font-medium transition ${
                    activo
                      ? 'border-[#B4551A] bg-[#FBE5C8] text-[#7E3C0F]'
                      : 'border-[var(--gm-borde)] bg-white text-[#6E6559] hover:bg-[#FCFAF6]'
                  }`}
                >
                  {f.nombre}
                  <span className={activo ? 'text-[#8A3F11]' : 'text-[var(--gm-texto-medio)]'}>{n}</span>
                </button>
              );
            })}
          </div>

          {cargando ? (
            <p className="py-16 text-center text-[14px] text-[#948A7C]">Cargando las ventas…</p>
          ) : ventasFiltradas.length === 0 ? (
            <EstadoVacio
              icono={HandCoins}
              titulo={ventas.length ? 'Ninguna venta con ese filtro' : 'Todavía no hay ventas'}
              texto={
                ventas.length
                  ? 'Probá con otro estado o borrá el texto del buscador.'
                  : 'Cargá la primera venta y el sistema arma solo el plan de cuotas.'
              }
              accion={
                !ventas.length ? (
                  <BotonGm variante="suave" tamano="sm" icono={Plus} onClick={() => setCreando(true)}>
                    Cargar una venta
                  </BotonGm>
                ) : null
              }
            />
          ) : (
            <ul className="divide-y divide-[var(--gm-divisor)]">
              {ventasFiltradas.map((v) => (
                <li key={v.codigo}>
                  <FilaVenta
                    venta={v}
                    activa={ventaActiva === v.codigo}
                    onClick={() => setVentaActiva(ventaActiva === v.codigo ? null : v.codigo)}
                  />
                </li>
              ))}
            </ul>
          )}
        </Panel>

        {/* ------------------------------ la ficha ------------------------- */}
        <div className="space-y-6">
          {ventaSeleccionada ? (
            <div className="max-h-[720px]">
              <FichaVenta
                venta={ventaSeleccionada}
                cuotas={cuotasDeLaVenta}
                onCerrar={() => setVentaActiva(null)}
                onCobrar={() => setCobrando(true)}
                onEditar={setEditando}
                onEliminar={setBorrando}
              />
            </div>
          ) : (
            <Panel
              titulo="A quién hay que apurar"
              bajada="Agrupado por cliente, no por venta: al cliente lo llamás una vez, no una por venta."
              acciones={<Users size={16} className="text-[var(--gm-texto-medio)]" />}
              cuerpoClassName={deudores.length ? 'p-0' : 'p-6'}
            >
              {deudores.length === 0 ? (
                <EstadoVacio
                  icono={Users}
                  titulo="Nadie te debe nada"
                  texto="Todas las ventas están saldadas. Disfrutalo."
                />
              ) : (
                <ul className="divide-y divide-[var(--gm-divisor)]">
                  {deudores.slice(0, 8).map((d) => (
                    <li
                      key={d.clave}
                      className="flex items-center gap-3 px-5 py-3.5"
                    >
                      <span className="min-w-0 flex-1">
                        <span className="flex flex-wrap items-baseline gap-x-2">
                          <span className="text-[13px] font-medium text-[#2A2118]">{d.cliente}</span>
                          {d.vencido > 0 && (
                            <Chip tono="rosa">{usd(d.vencido)} vencido</Chip>
                          )}
                        </span>
                        <span className="mt-0.5 block text-[11px] text-[var(--gm-texto-medio)]">
                          {d.localidad || 'Sin zona'}
                          {d.ventas > 1 && ` · ${plural(d.ventas, 'venta', 'ventas')}`}
                          {d.proximoVencimiento && ` · próxima ${fechaCorta(d.proximoVencimiento)}`}
                        </span>
                      </span>
                      <span className="shrink-0 text-right">
                        <span className="block text-[13px] tabular-nums text-[#2A2118]">
                          {usd(d.saldo)}
                        </span>
                        {d.diasAtraso != null && d.diasAtraso > 0 && (
                          <span className="block text-[11px] text-[#B4551A]">
                            {diasTexto(d.diasAtraso)} de atraso
                          </span>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </Panel>
          )}
        </div>
      </div>

      <ModalCobro
        abierto={cobrando}
        venta={ventaSeleccionada}
        cuotas={cuotasDeLaVenta}
        onCerrar={() => setCobrando(false)}
        onGuardar={nuevoCobro}
      />

      <ModalVenta
        abierto={creando}
        clientes={clientes}
        equipos={equipos}
        onCerrar={() => setCreando(false)}
        onGuardar={nuevaVenta}
      />

      <ModalVenta
        abierto={Boolean(editando)}
        venta={editando}
        clientes={clientes}
        equipos={equipos}
        onCerrar={() => setEditando(null)}
        onGuardar={(datos) => editarVenta(editando.codigo, datos)}
      />

      <ConfirmarGm
        abierto={Boolean(borrando)}
        titulo="¿Eliminar esta venta?"
        detalle={borrando ? `${borrando.cliente} · ${borrando.codigo} · ${borrando.detalle}` : ''}
        advertencia="Se borran también todas sus cuotas y todos los cobros que se le imputaron: el historial de esta venta deja de existir. Los gastos que se habían vinculado a ella (flete, instalación) no se borran, sólo quedan sin vincular. No se puede deshacer."
        textoBoton="Eliminar venta"
        onCerrar={() => setBorrando(null)}
        onConfirmar={() => borrarVenta(borrando.codigo)}
      />
    </div>
  );
}
