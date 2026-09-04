// ============================================================================
// SISTEMA GM · M-03 TESORERÍA · IMPUESTOS Y CAPITAL
// ----------------------------------------------------------------------------
// Lo que hay que apartar, lo que queda y los parámetros con los que se calcula
// todo el módulo. Los parámetros están acá y no escondidos en un menú porque
// cambiar la comisión o el IVA cambia cada número de las otras tres pantallas:
// conviene que se vea de dónde salen.
// ============================================================================

import React, { useState } from 'react';
import { Landmark, Percent, Settings2, Wallet } from 'lucide-react';
import { useFinanzas } from '../context/FinanzasContext';
import { CAMPOS_PARAMETROS } from '../config/formularios';
import Panel from '../../../shared/gm-ui/Panel';
import BotonGm from '../../../shared/gm-ui/BotonGm';
import TarjetaKpi from '../../../shared/gm-ui/TarjetaKpi';
import FormularioGm from '../../../shared/gm-ui/FormularioGm';
import DesgloseImpuestos from '../components/fiscal/DesgloseImpuestos';
import PanelCapital from '../components/fiscal/PanelCapital';

export default function FiscalView() {
  const { datos, cargando, enMoneda, guardarParams } = useFinanzas();
  const [editando, setEditando] = useState(false);

  if (cargando || !datos) {
    return (
      <Panel sinEncabezado>
        <p className="py-16 text-center text-[14px] text-[#948A7C]">Cargando…</p>
      </Panel>
    );
  }

  const { impuestos, ultimo, params, capital, resultadoAcumulado, roiPct } = datos;
  const carga = ultimo.ventasUsd > 0 ? (impuestos.totalUsd / ultimo.ventasUsd) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <TarjetaKpi
          etiqueta="Impuestos del mes"
          valor={enMoneda(impuestos.totalUsd)}
          detalle={`${carga.toFixed(1)}% de las ventas`}
          icono={Landmark}
          tono="naranja"
        />
        <TarjetaKpi
          etiqueta="Neto después de impuestos"
          valor={enMoneda(impuestos.netoUsd)}
          detalle="sobre las ventas del último mes"
          icono={Wallet}
          tono="azul"
        />
        <TarjetaKpi
          etiqueta="Capital disponible"
          valor={enMoneda(capital.liquidezUsd + capital.ahorroUsd)}
          detalle={`${enMoneda(capital.reservaImpuestosUsd)} apartados aparte`}
          icono={Wallet}
          tono="naranja"
        />
        <TarjetaKpi
          etiqueta="ROI acumulado"
          valor={`${roiPct.toFixed(1)}%`}
          detalle={`sobre ${enMoneda(capital.inversionInicialUsd)}`}
          icono={Percent}
          tono="azul"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Panel titulo="Impuestos" bajada="Estimación de lo que hay que reservar del último mes.">
          <DesgloseImpuestos
            impuestos={impuestos}
            ventasUsd={ultimo.ventasUsd}
            params={params}
            enMoneda={enMoneda}
          />
        </Panel>

        <Panel titulo="Capital" bajada="Cuánta plata hay y cuánta es realmente tuya.">
          <PanelCapital
            capital={capital}
            resultadoAcumulado={resultadoAcumulado}
            roiPct={roiPct}
            enMoneda={enMoneda}
          />
        </Panel>
      </div>

      <Panel
        titulo="Parámetros del negocio"
        bajada="Con estos números se calcula todo el módulo. Cambiarlos recalcula las cuatro pantallas."
        acciones={
          <BotonGm variante="solido" tamano="sm" icono={Settings2} onClick={() => setEditando(true)}>
            Editar
          </BotonGm>
        }
      >
        <dl className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3 lg:grid-cols-5">
          {[
            ['Sueldo fijo', enMoneda(params.sueldoFijoUsd)],
            ['Comisión', `${params.comisionPct}%`],
            ['Tipo de cambio', `$ ${params.tipoCambio.toLocaleString('es-AR')}`],
            ['IVA', `${params.ivaPct}%`],
            ['Ingresos brutos', `${params.ingresosBrutosPct}%`],
            ['Retenciones', `${params.retencionesPct}%`],
            ['Inversión inicial', enMoneda(capital.inversionInicialUsd)],
            ['Ahorro', enMoneda(capital.ahorroUsd)],
            ['Liquidez', enMoneda(capital.liquidezUsd)],
            ['Reserva impuestos', enMoneda(capital.reservaImpuestosUsd)],
          ].map(([k, v]) => (
            <div key={k}>
              <dt className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#B0A697] dark:text-[#6B7280]">
                {k}
              </dt>
              <dd className="mt-1 text-[15px] text-[#2A2118] dark:text-[#F9FAFB]">{v}</dd>
            </div>
          ))}
        </dl>
      </Panel>

      <FormularioGm
        abierto={editando}
        titulo="Parámetros del negocio"
        bajada="Al guardar se vuelve a liquidar todo: ingresos, resultado, ROI, impuestos y proyecciones."
        campos={CAMPOS_PARAMETROS}
        valores={{
          sueldoFijoUsd: params.sueldoFijoUsd,
          comisionPct: params.comisionPct,
          tipoCambio: params.tipoCambio,
          ivaPct: params.ivaPct,
          ingresosBrutosPct: params.ingresosBrutosPct,
          retencionesPct: params.retencionesPct,
          inversionInicialUsd: capital.inversionInicialUsd,
          ahorroUsd: capital.ahorroUsd,
          liquidezUsd: capital.liquidezUsd,
          reservaImpuestosUsd: capital.reservaImpuestosUsd,
        }}
        onCerrar={() => setEditando(false)}
        onGuardar={(form) =>
          guardarParams(
            Object.fromEntries(Object.entries(form).map(([k, v]) => [k, Number(v) || 0]))
          )
        }
        textoBoton="Guardar parámetros"
      />
    </div>
  );
}
