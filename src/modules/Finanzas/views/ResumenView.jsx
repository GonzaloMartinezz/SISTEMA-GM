// ============================================================================
// SISTEMA GM · M-03 TESORERÍA · RESUMEN
// ----------------------------------------------------------------------------
// La foto del negocio a la distancia que elijas arriba: semana, mes, 12 meses
// o 5 años. Los cuatro indicadores y el gráfico principal responden al mismo
// horizonte; la salud financiera y la composición del último mes no, porque son
// una foto del hoy y cambiarlas con el período no querría decir nada.
// ============================================================================

import React from 'react';
import { Coins, HeartPulse, PieChart, Target, TrendingUp, Wallet } from 'lucide-react';
import { useFinanzas } from '../context/FinanzasContext';
import { PERIODOS } from '../utils/horizonte';
import Panel from '../../../shared/gm-ui/Panel';
import TarjetaKpiSerie from '../../../shared/gm-ui/TarjetaKpiSerie';
import GraficoHorizonte from '../components/resumen/GraficoHorizonte';
import MedidorSalud from '../components/resumen/MedidorSalud';
import ComposicionEgresos from '../components/resumen/ComposicionEgresos';
import GraficoFlujo from '../components/resumen/GraficoFlujo';

const pct = (v, dec = 1) => `${Number(v || 0).toFixed(dec)}%`;

export default function ResumenView() {
  const {
    datos, cargando, enMoneda, enMonedaCorta, periodo, serie, resumenPeriodo, salud,
  } = useFinanzas();

  if (cargando || !datos) {
    return (
      <Panel sinEncabezado>
        <p className="py-16 text-center text-[14px] text-[#948A7C]">Liquidando el período…</p>
      </Panel>
    );
  }

  const { ultimo, meses, roiPct, capital } = datos;
  const anterior = meses[meses.length - 2];
  const variacion = anterior && anterior.ingresosUsd
    ? ((ultimo.ingresosUsd - anterior.ingresosUsd) / anterior.ingresosUsd) * 100
    : null;

  const nombrePeriodo = PERIODOS.find((p) => p.id === periodo)?.nombre || '';
  const puntos = serie.puntos || [];

  // Con proyección, la tarjeta muestra lo real y aclara abajo lo estimado.
  const hayProy = resumenPeriodo.puntosProyectados > 0;
  const detalleCon = (campo, base) =>
    hayProy
      ? `real · + ${enMoneda(resumenPeriodo.proyectado[campo])} proyectados`
      : base;

  // Las minicurvas de las tarjetas salen de la misma serie del horizonte.
  const curva = (campo) => puntos.map((p) => p[campo]);

  return (
    <div className="space-y-6">
      {/* ----------------------------- Indicadores ---------------------------- */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <TarjetaKpiSerie
          etiqueta={`Ingresos · ${nombrePeriodo}`}
          valor={enMoneda(resumenPeriodo.ingresos)}
          detalle={detalleCon('ingresos', `${resumenPeriodo.puntosReales} períodos con dato real`)}
          icono={Wallet}
          tono="naranja"
          serie={curva('ingresos')}
        />
        <TarjetaKpiSerie
          etiqueta={`Egresos · ${nombrePeriodo}`}
          valor={enMoneda(resumenPeriodo.egresos)}
          detalle={detalleCon('egresos', 'mercadería, gastos y sueldo')}
          icono={Coins}
          tono="azul"
          serie={curva('egresos')}
        />
        <TarjetaKpiSerie
          etiqueta={`Resultado · ${nombrePeriodo}`}
          valor={enMoneda(resumenPeriodo.neto)}
          detalle={detalleCon('neto', `margen ${pct(resumenPeriodo.margenPct)}`)}
          variacion={variacion == null ? null : pct(Math.abs(variacion))}
          tendencia={resumenPeriodo.neto >= 0 ? 'sube' : 'baja'}
          icono={TrendingUp}
          tono="verde"
          serie={curva('neto')}
        />
        <TarjetaKpiSerie
          etiqueta="ROI acumulado"
          valor={pct(roiPct)}
          detalle={`sobre ${enMoneda(capital.inversionInicialUsd)}`}
          icono={Target}
          tono="crema"
        />
      </div>

      {/* --------------------------- Gráfico principal ------------------------ */}
      <Panel
        titulo={`Ingresos, egresos y resultado · ${nombrePeriodo}`}
        bajada="Las áreas son lo que entra y lo que sale; la línea, lo que queda."
      >
        <GraficoHorizonte serie={serie} enMoneda={enMoneda} enMonedaCorta={enMonedaCorta} />
      </Panel>

      {/* ------------------- Salud + composición del mes ---------------------- */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Panel
          titulo="Salud financiera"
          bajada="Margen, cobertura de gastos y crecimiento en una sola nota."
          acciones={<HeartPulse size={16} className="text-[#B0A697] dark:text-[#6B7280]" />}
        >
          <MedidorSalud salud={salud} />
        </Panel>

        <Panel
          titulo={`En qué se fue la venta · ${ultimo.etiqueta}`}
          bajada="Del último mes liquidado. No cambia con el período de arriba: es una foto del hoy."
          acciones={<PieChart size={16} className="text-[#B0A697] dark:text-[#6B7280]" />}
        >
          <ComposicionEgresos mes={ultimo} enMoneda={enMoneda} />
        </Panel>
      </div>

      {/* ------------------------- Flujo semanal ------------------------------ */}
      {periodo !== 'semana' && (
        <Panel
          titulo="Flujo de caja semanal"
          bajada="El detalle corto, para ver si la plata entra antes o después de salir."
        >
          <GraficoFlujo flujo={datos.flujo} enMoneda={enMoneda} enMonedaCorta={enMonedaCorta} />
        </Panel>
      )}
    </div>
  );
}
