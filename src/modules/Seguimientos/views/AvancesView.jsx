// ============================================================================
// SISTEMA GM · M-04 SEGUIMIENTOS · AVANCES
// ----------------------------------------------------------------------------
// El módulo mirado en el tiempo, no en el momento. Cuatro preguntas:
//   ¿qué se movió?         -> la fila de estadísticas del período
//   ¿cómo se movió cada una? -> la línea de tiempo
//   ¿dónde está la plata?  -> el embudo
//   ¿dónde se traba?       -> velocidad por etapa + la lista de estancados
//
// Todo sale del historial que escribe la base sola. Como el historial arranca
// el día que se prendió (no hay forma honesta de reconstruir hacia atrás), el
// panel lo dice en vez de dibujar un pasado que nadie registró.
// ============================================================================

import React, { useMemo, useState } from 'react';
import { AlarmClock, ArrowDownRight, ArrowUpRight, CircleCheck, GitBranch, Timer } from 'lucide-react';
import Panel from '../../../shared/gm-ui/Panel';
import EstadoVacio from '../../../shared/gm-ui/EstadoVacio';
import { useSeguimientos } from '../context/SeguimientosContext';
import { ESTADO_COLOR } from '../../../shared/gm-ui/tokens';
import { getEtapa } from '../config/pipeline.config';
import {
  RANGOS, getRango, lineaTiempo, embudo, velocidadPorEtapa, movimiento, estancados,
} from '../utils/avance';
import FilaEstadisticas from '../../../shared/gm-ui/FilaEstadisticas';
import LineaTiempoLeads from '../components/avances/LineaTiempoLeads';
import EmbudoEtapas from '../components/avances/EmbudoEtapas';
import VelocidadEtapas from '../components/avances/VelocidadEtapas';
import { ChipTemperatura } from '../components/ChipEtapa';

const usd = (v) => `US$ ${Math.round(Number(v || 0)).toLocaleString('es-AR')}`;
const DIAS_ESTANCADO = 21;

export default function AvancesView() {
  const { leads, historial, cargando, metricas } = useSeguimientos();
  const [rangoId, setRangoId] = useState('90');
  const rango = getRango(rangoId);

  const linea = useMemo(
    () => lineaTiempo(historial, leads, rango.dias),
    [historial, leads, rango.dias]
  );
  const emb = useMemo(() => embudo(leads), [leads]);
  const velocidad = useMemo(() => velocidadPorEtapa(historial), [historial]);
  const mov = useMemo(() => movimiento(historial, rango.dias), [historial, rango.dias]);
  const quietos = useMemo(
    () => estancados(historial, leads, DIAS_ESTANCADO),
    [historial, leads]
  );

  const conPromedio = velocidad.filter((v) => v.promedio != null);
  const cicloTotal = conPromedio.reduce((a, v) => a + v.promedio, 0);

  const estadisticas = [
    {
      etiqueta: 'Avanzaron',
      valor: mov.avanzaron,
      detalle: `pasos hacia adelante en ${rango.nombre.toLowerCase()}`,
      color: mov.avanzaron > 0 ? ESTADO_COLOR.bien : undefined,
    },
    {
      etiqueta: 'Retrocedieron',
      valor: mov.retrocedieron,
      detalle: 'volvieron a una etapa anterior',
      color: mov.retrocedieron > 0 ? ESTADO_COLOR.riesgo : undefined,
    },
    {
      etiqueta: 'Cerradas',
      valor: mov.cerraron,
      detalle: `${usd(metricas.valorCerrado)} en cartera cerrada`,
    },
    {
      etiqueta: 'Estancadas',
      valor: quietos.length,
      detalle: `+${DIAS_ESTANCADO} días en la misma etapa`,
      color: quietos.length > 0 ? ESTADO_COLOR.atencion : undefined,
    },
    {
      etiqueta: 'Ciclo completo',
      valor: conPromedio.length ? `${Math.round(cicloTotal)} d` : '—',
      detalle: conPromedio.length
        ? `suma de ${conPromedio.length} de 5 etapas medidas`
        : 'todavía no salió nadie de ninguna etapa',
    },
    {
      etiqueta: 'Sin contacto',
      valor: metricas.frios,
      detalle: 'más de 7 días sin escribirles',
      color: metricas.frios > 0 ? ESTADO_COLOR.critico : undefined,
    },
  ];

  if (cargando) {
    return (
      <Panel sinEncabezado>
        <p className="py-16 text-center text-[14px] text-[var(--gm-texto-suave)]">Reconstruyendo el historial…</p>
      </Panel>
    );
  }

  return (
    <div className="space-y-6">
      {/* -------------------------- rango de tiempo -------------------------- */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-[13px] text-[var(--gm-texto-suave)]">
          Mostrando el movimiento de los últimos{' '}
          <span className="text-[var(--gm-texto-medio)]">{rango.nombre.toLowerCase()}</span>.
        </p>
        <div className="flex overflow-hidden rounded-xl border border-[var(--gm-borde)]">
          {RANGOS.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => setRangoId(r.id)}
              className={`px-3 py-1.5 text-[12px] font-semibold transition ${
                rangoId === r.id
                  ? 'bg-[var(--gm-acento-suave-bg)]  text-[var(--gm-acento-fuerte)]'
                  : 'bg-[var(--gm-superficie)]  text-[var(--gm-texto-suave)] hover:bg-[var(--gm-superficie-suave)] '
              }`}
            >
              {r.nombre}
            </button>
          ))}
        </div>
      </div>

      {/* ------------------------- fila de estadísticas ---------------------- */}
      <Panel sinEncabezado cuerpoClassName="p-0">
        <FilaEstadisticas items={estadisticas} />
      </Panel>

      {/* --------------------------- línea de tiempo ------------------------- */}
      <Panel
        titulo="Línea de tiempo de las ventas"
        bajada="Cada fila es una oportunidad; cada bloque, el tiempo que pasó en esa etapa. Un bloque largo es una venta que se quedó quieta."
        acciones={<GitBranch size={16} className="text-[var(--gm-texto-tenue)]" />}
      >
        <LineaTiempoLeads datos={linea} />
      </Panel>

      {/* -------------------- embudo + velocidad por etapa ------------------- */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Panel
          titulo="Embudo por monto"
          bajada="Cuánta plata hay parada en cada etapa, y cuánta es razonable esperar que entre."
        >
          <EmbudoEtapas etapas={emb} />
        </Panel>

        <Panel
          titulo="Cuánto tarda cada etapa"
          bajada="Promedio de días sobre las ventas que ya salieron de esa etapa. Las que siguen adentro no cuentan: todavía no sabemos cuánto van a tardar."
          acciones={<Timer size={16} className="text-[var(--gm-texto-tenue)]" />}
        >
          <VelocidadEtapas etapas={velocidad} />
        </Panel>
      </div>

      {/* ---------------------------- estancados ----------------------------- */}
      <Panel
        titulo="Ventas frenadas"
        bajada={`Llevan más de ${DIAS_ESTANCADO} días en la misma etapa sin moverse. Son las que hay que destrabar o dar de baja.`}
        acciones={<AlarmClock size={16} className="text-[var(--gm-texto-tenue)]" />}
        cuerpoClassName={quietos.length ? 'p-0' : 'p-6'}
      >
        {quietos.length === 0 ? (
          <EstadoVacio
            icono={CircleCheck}
            titulo="Ninguna venta frenada"
            texto={`Todas las oportunidades abiertas se movieron en los últimos ${DIAS_ESTANCADO} días.`}
          />
        ) : (
          <ul className="divide-y divide-[#F4EFE7]">
            {quietos.map((q) => (
              <li key={q.codigo} className="flex flex-wrap items-center gap-x-4 gap-y-2 px-6 py-3.5">
                <span
                  className="h-8 w-1 shrink-0 rounded-full"
                  style={{ backgroundColor: getEtapa(q.etapa).color }}
                />
                <div className="min-w-[180px] flex-1">
                  <p className="truncate text-[14px] font-medium text-[var(--gm-texto)]">
                    {q.lead.apellido}, {q.lead.nombre}
                  </p>
                  <p className="truncate text-[12px] text-[var(--gm-texto-suave)]">
                    {q.lead.clinica} · {q.lead.equipo || 'sin equipo'}
                  </p>
                </div>
                <span className="text-[13px] text-[var(--gm-texto-medio)]">{getEtapa(q.etapa).nombre}</span>
                <span className="text-[13px] font-semibold text-[var(--gm-acento)]">{q.dias} días acá</span>
                <span className="text-[13px] font-semibold text-[var(--gm-texto)]">
                  {usd(q.lead.montoUsd)}
                </span>
                <ChipTemperatura dias={q.lead.diasSinContacto} />
              </li>
            ))}
          </ul>
        )}
      </Panel>

      {/* -------------------------- nota del historial ----------------------- */}
      <p className="flex items-start gap-2 px-1 text-[12px] leading-relaxed text-[var(--gm-texto-tenue)]">
        <ArrowUpRight size={14} className="mt-0.5 shrink-0" />
        El historial de etapas lo escribe la base sola cada vez que una venta cambia de lugar. Los
        tramos anteriores a la puesta en marcha no existen: no se inventaron para llenar el gráfico.
        A medida que uses el tablero, esta pantalla se va llenando sola.
        {mov.retrocedieron > 0 && (
          <span className="inline-flex items-center gap-1 text-[var(--gm-acento)]">
            <ArrowDownRight size={13} />
            Los retrocesos también quedan: mover una tarjeta para atrás se registra igual.
          </span>
        )}
      </p>
    </div>
  );
}
