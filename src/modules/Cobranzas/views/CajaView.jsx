// ============================================================================
// SISTEMA GM · M-08 COBRANZAS · CAJA Y MOVIMIENTOS
// ----------------------------------------------------------------------------
// Toda la plata del negocio en un solo hilo: lo que entró por cobros y lo que
// salió por mercadería, fletes, sueldo, impuestos, gastos y retiros.
//
// Los ingresos y los egresos van en la MISMA lista y no en dos columnas. Una
// caja se lee en orden cronológico: lo que importa es que el 11 pagaste el
// equipo y el 14 te entró la cuota, no que existan dos listas paralelas que
// hay que cruzar mentalmente.
// ============================================================================

import React, { useMemo, useState } from 'react';
import { ArrowDownLeft, ArrowUpRight, Download, Plus, Wallet } from 'lucide-react';
import Panel from '../../../shared/gm-ui/Panel';
import Chip from '../../../shared/gm-ui/Chip';
import BotonGm from '../../../shared/gm-ui/BotonGm';
import EstadoVacio from '../../../shared/gm-ui/EstadoVacio';
import FilaEstadisticas from '../../../shared/gm-ui/FilaEstadisticas';
import { ESTADO_COLOR } from '../../../shared/gm-ui/tokens';
import { useCobranzas } from '../context/CobranzasContext';
import ModalEgreso from '../components/ModalEgreso';
import { resumenCaja } from '../utils/finanzas';
import {
  CATEGORIAS, getCategoria, getMedio, usd, fechaCorta, mesLargo, plural,
} from '../config/cobranzas.config';
import { desplazarMes, mesActual, claveMes } from '../utils/calendario';

const FLUJOS = [
  { id: 'todo',    nombre: 'Todo' },
  { id: 'ingreso', nombre: 'Lo que entró' },
  { id: 'egreso',  nombre: 'Lo que salió' },
];

export default function CajaView() {
  const {
    movimientos, cargando, mesVisible, setMesVisible, gastos, ventas, nuevoEgreso,
  } = useCobranzas();

  const [flujo, setFlujo] = useState('todo');
  const [categoria, setCategoria] = useState('todas');
  const [cargandoGasto, setCargandoGasto] = useState(false);

  const delMes = useMemo(
    () => movimientos.filter((m) => claveMes(m.fecha) === mesVisible),
    [movimientos, mesVisible]
  );

  const filtrados = useMemo(
    () =>
      delMes.filter((m) => {
        if (flujo !== 'todo' && m.flujo !== flujo) return false;
        if (categoria !== 'todas' && m.categoria !== categoria) return false;
        return true;
      }),
    [delMes, flujo, categoria]
  );

  const r = useMemo(() => resumenCaja(delMes), [delMes]);

  /** Las categorías que realmente aparecen este mes. Filtrar por una vacía es
   *  una forma segura de creer que se rompió algo. */
  const categoriasDelMes = useMemo(() => {
    const usadas = new Set(delMes.filter((m) => m.flujo === 'egreso').map((m) => m.categoria));
    return CATEGORIAS.filter((c) => usadas.has(c.id));
  }, [delMes]);

  const porCategoriaDelMes = useMemo(() => {
    const mapa = new Map();
    delMes.filter((m) => m.flujo === 'egreso').forEach((m) => {
      mapa.set(m.categoria, (mapa.get(m.categoria) || 0) + m.montoUsd);
    });
    const total = [...mapa.values()].reduce((a, x) => a + x, 0);
    return [...mapa.entries()]
      .map(([id, monto]) => ({ ...getCategoria(id), monto, pct: total ? (monto / total) * 100 : 0 }))
      .sort((a, b) => b.monto - a.monto);
  }, [delMes]);

  const estadisticas = [
    {
      etiqueta: 'Entró',
      valor: usd(r.entro),
      detalle: plural(r.cobros, 'cobro', 'cobros'),
      color: r.entro > 0 ? ESTADO_COLOR.bien : undefined,
    },
    {
      etiqueta: 'Salió',
      valor: usd(r.salio),
      detalle: plural(r.pagos, 'pago', 'pagos'),
      color: r.salio > 0 ? ESTADO_COLOR.riesgo : undefined,
    },
    {
      etiqueta: 'Quedó en el mes',
      valor: usd(r.neto),
      detalle: r.neto >= 0 ? 'la caja cerró en positivo' : 'se puso plata de afuera',
      color: r.neto >= 0 ? ESTADO_COLOR.bien : ESTADO_COLOR.critico,
    },
    {
      etiqueta: 'Gasto operativo',
      valor: usd(r.operativo),
      detalle: 'sin contar tus retiros',
    },
    {
      etiqueta: 'Retirado',
      valor: usd(r.retiros),
      detalle: r.retiros > 0 ? 'plata que sacaste vos' : 'no sacaste nada',
    },
    {
      etiqueta: 'El gasto más grande',
      valor: r.mayorEgreso ? usd(r.mayorEgreso.montoUsd) : '—',
      detalle: r.mayorEgreso ? r.mayorEgreso.concepto : 'sin gastos este mes',
    },
  ];

  return (
    <div className="space-y-6">
      <Panel sinEncabezado cuerpoClassName="p-0">
        <FilaEstadisticas items={estadisticas} />
      </Panel>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        {/* --------------------------- movimientos -------------------------- */}
        <Panel
          titulo={`Movimientos de ${mesLargo(mesVisible)}`}
          bajada="Todo lo que se movió, en orden, del más nuevo al más viejo."
          acciones={
            <div className="flex flex-wrap items-center gap-1.5">
              <BotonGm
                variante="fantasma"
                tamano="sm"
                onClick={() => setMesVisible(desplazarMes(mesVisible, -1))}
              >
                Anterior
              </BotonGm>
              {mesVisible !== mesActual() && (
                <BotonGm variante="contorno" tamano="sm" onClick={() => setMesVisible(mesActual())}>
                  Este mes
                </BotonGm>
              )}
              <BotonGm
                variante="fantasma"
                tamano="sm"
                onClick={() => setMesVisible(desplazarMes(mesVisible, 1))}
              >
                Siguiente
              </BotonGm>
              <BotonGm
                variante="solido"
                tamano="sm"
                icono={Plus}
                onClick={() => setCargandoGasto(true)}
              >
                Cargar gasto
              </BotonGm>
            </div>
          }
          cuerpoClassName="p-0"
        >
          <div className="flex flex-wrap items-center gap-1.5 border-b border-[#F0EAE1] px-5 py-3">
            {FLUJOS.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFlujo(f.id)}
                className={`rounded-lg border px-2.5 py-1.5 text-[12px] font-medium transition ${
                  flujo === f.id
                    ? 'border-[#B4551A] bg-[#FBE5C8] text-[#7E3C0F]'
                    : 'border-[#E8E0D5] bg-white text-[#6E6559] hover:bg-[#FCFAF6]'
                }`}
              >
                {f.nombre}
              </button>
            ))}

            {categoriasDelMes.length > 0 && (
              <select
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                className="ml-auto h-8 rounded-lg border border-[#E8E0D5] bg-white px-2 text-[12px] text-[#6E6559] outline-none focus:border-[#2F6DA0]"
              >
                <option value="todas">Todas las categorías</option>
                {categoriasDelMes.map((c) => (
                  <option key={c.id} value={c.id}>{c.nombre}</option>
                ))}
              </select>
            )}
          </div>

          {cargando ? (
            <p className="py-16 text-center text-[14px] text-[#948A7C]">Cargando la caja…</p>
          ) : filtrados.length === 0 ? (
            <EstadoVacio
              icono={Wallet}
              titulo={delMes.length ? 'Nada con ese filtro' : 'Sin movimientos este mes'}
              texto={
                delMes.length
                  ? 'Probá con otro flujo o categoría.'
                  : 'Ni entró ni salió plata en este mes. Cambiá de mes o cargá un gasto.'
              }
            />
          ) : (
            <ul className="max-h-[560px] divide-y divide-[#F4EFE7] overflow-y-auto">
              {filtrados.map((m) => {
                const esIngreso = m.flujo === 'ingreso';
                const cat = getCategoria(m.categoria);
                const Icono = esIngreso ? ArrowDownLeft : ArrowUpRight;
                return (
                  <li key={`${m.flujo}-${m.codigo}`} className="flex items-center gap-3 px-5 py-3">
                    <span
                      className="grid h-8 w-8 shrink-0 place-items-center rounded-xl"
                      style={{
                        backgroundColor: esIngreso ? '#DFF0E8' : '#F3EDE4',
                        color: esIngreso ? '#1F6F53' : cat.color,
                      }}
                    >
                      <Icono size={14} />
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-baseline gap-x-2">
                        <span className="text-[13px] text-[#2A2118]">{m.concepto}</span>
                        {!esIngreso && <Chip tono="gris">{cat.nombre}</Chip>}
                      </span>
                      <span className="mt-0.5 block truncate text-[11px] text-[#B0A697]">
                        {fechaCorta(m.fecha)} · {m.contraparte} · {getMedio(m.medio).nombre}
                        {m.comprobante && ` · ${m.comprobante}`}
                        {m.referencia && ` · ${m.referencia}`}
                      </span>
                    </span>

                    <span
                      className="shrink-0 text-[14px] tabular-nums"
                      style={{ color: esIngreso ? ESTADO_COLOR.bien : '#2A2118' }}
                    >
                      {esIngreso ? '+' : '−'} {usd(m.montoUsd)}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </Panel>

        {/* ------------------------ por dónde se va ------------------------- */}
        <Panel
          titulo="Por dónde se te va"
          bajada={`Los egresos de ${mesLargo(mesVisible)}, ordenados por peso.`}
          acciones={<Download size={16} className="text-[#B0A697]" />}
        >
          {porCategoriaDelMes.length === 0 ? (
            <EstadoVacio
              titulo="Sin egresos este mes"
              texto="Cuando cargues gastos van a aparecer acá, agrupados por categoría."
            />
          ) : (
            <>
              <ul className="space-y-3.5">
                {porCategoriaDelMes.map((c) => {
                  const Icono = c.icono;
                  return (
                    <li key={c.id}>
                      <div className="flex items-baseline justify-between gap-3">
                        <span className="flex items-center gap-2 text-[13px] text-[#2A2118]">
                          <Icono size={13} style={{ color: c.color }} />
                          {c.nombre}
                        </span>
                        <span className="shrink-0 text-[13px] tabular-nums text-[#6E6559]">
                          {usd(c.monto)}
                          <span className="ml-1.5 text-[11px] text-[#B0A697]">
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
                    </li>
                  );
                })}
              </ul>

              <p className="mt-4 border-t border-[#F0EAE1] pt-3 text-[11px] leading-relaxed text-[#948A7C]">
                El retiro figura como categoría pero no es un costo del negocio: es plata que ya
                ganaste y estás sacando. En la pantalla de Resultado se descuenta aparte, para que
                el margen no te castigue por pagarte.
              </p>
            </>
          )}
        </Panel>
      </div>

      <ModalEgreso
        abierto={cargandoGasto}
        gastos={gastos}
        ventas={ventas}
        onCerrar={() => setCargandoGasto(false)}
        onGuardar={nuevoEgreso}
      />
    </div>
  );
}
