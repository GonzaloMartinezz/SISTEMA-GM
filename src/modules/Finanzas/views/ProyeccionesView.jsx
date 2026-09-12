// ============================================================================
// SISTEMA GM · M-09 TESORERÍA · PROYECCIONES
// ----------------------------------------------------------------------------
// A dónde llega el negocio si sigue este ritmo, y el simulador para decidir
// operación por operación. Son las dos herramientas que se usan al cotizar.
// ============================================================================

import React from 'react';
import { CalendarClock, Gauge, TrendingUp } from 'lucide-react';
import { useFinanzas } from '../context/FinanzasContext';
import Panel from '../../../shared/gm-ui/Panel';
import TarjetaKpi from '../../../shared/gm-ui/TarjetaKpi';
import TablaProyecciones from '../components/proyecciones/TablaProyecciones';
import GraficoProyeccion from '../components/proyecciones/GraficoProyeccion';
import Simulador from '../components/proyecciones/Simulador';

export default function ProyeccionesView() {
  const { datos, cargando, enMoneda, enMonedaCorta } = useFinanzas();

  if (cargando || !datos) {
    return (
      <Panel sinEncabezado>
        <p className="py-16 text-center text-[14px] text-[#948A7C]">Proyectando…</p>
      </Panel>
    );
  }

  const { proyecciones, crecimientoMensual, meses, params, resultadoAcumulado } = datos;
  const aDoceMeses = proyecciones.find((p) => p.meses === 12);
  const aCincoAnios = proyecciones.find((p) => p.meses === 60);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <TarjetaKpi
          etiqueta="Ritmo medido"
          valor={`${(crecimientoMensual * 100).toFixed(1)}%`}
          detalle={`mensual, sobre ${meses.length} meses cargados`}
          icono={Gauge}
          tono="naranja"
          tendencia={crecimientoMensual >= 0 ? 'sube' : 'baja'}
        />
        <TarjetaKpi
          etiqueta="Acumulado a 12 meses"
          valor={enMoneda(aDoceMeses?.resultadoAcumuladoUsd || 0)}
          detalle="resultado sumado del período"
          icono={CalendarClock}
          tono="azul"
        />
        <TarjetaKpi
          etiqueta="Acumulado a 5 años"
          valor={enMoneda(aCincoAnios?.resultadoAcumuladoUsd || 0)}
          detalle="con la tasa amortiguada"
          icono={TrendingUp}
          tono="naranja"
        />
      </div>

      <Panel
        titulo="Ventas reales y proyección"
        bajada="La línea punteada es proyección, no dato. El corte marca dónde termina lo que pasó."
      >
        <GraficoProyeccion
          meses={meses}
          proyecciones={proyecciones}
          enMoneda={enMoneda}
          enMonedaCorta={enMonedaCorta}
        />
      </Panel>

      <Panel
        titulo="Escenarios"
        bajada="El mismo cálculo a distintos plazos, con la tasa que usa cada uno."
        cuerpoClassName="p-0 pb-4"
      >
        <TablaProyecciones
          proyecciones={proyecciones}
          crecimientoMensual={crecimientoMensual}
          enMoneda={enMoneda}
        />
      </Panel>

      <Panel
        titulo="Simulador de rentabilidad"
        bajada="Si le hacés un descuento, ¿te sigue conviniendo? Acá se ve antes de prometerlo."
      >
        <Simulador comisionPct={params.comisionPct} enMoneda={enMoneda} />
      </Panel>

      <p className="text-[12px] text-[var(--gm-texto-medio)] dark:text-[#6B7280]">
        Resultado acumulado real hasta hoy: {enMoneda(resultadoAcumulado)}. Es la base del ROI que
        aparece en el Resumen.
      </p>
    </div>
  );
}
