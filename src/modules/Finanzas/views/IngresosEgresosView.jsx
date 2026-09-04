// ============================================================================
// SISTEMA GM · M-03 TESORERÍA · INGRESOS Y EGRESOS
// ----------------------------------------------------------------------------
// Las dos caras del negocio en una sola pantalla: la liquidación mes a mes y
// los gastos fijos. Las dos con alta, edición y baja.
// ============================================================================

import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useFinanzas } from '../context/FinanzasContext';
import { CAMPOS_MES, CAMPOS_GASTO } from '../config/formularios';
import Panel from '../../../shared/gm-ui/Panel';
import BotonGm from '../../../shared/gm-ui/BotonGm';
import TarjetaKpi from '../../../shared/gm-ui/TarjetaKpi';
import FormularioGm from '../../../shared/gm-ui/FormularioGm';
import ConfirmarGm from '../../../shared/gm-ui/ConfirmarGm';
import { ArrowDownRight, ArrowUpRight, CalendarRange, Receipt } from 'lucide-react';
import TablaMeses from '../components/ingresos/TablaMeses';
import TablaGastos from '../components/egresos/TablaGastos';
import DonaCategorias from '../components/egresos/DonaCategorias';

export default function IngresosEgresosView() {
  const {
    datos, cargando, enMoneda,
    guardarUnMes, borrarUnMes, guardarUnGasto, borrarUnGasto,
  } = useFinanzas();

  const [mesEditando, setMesEditando] = useState(null);
  const [mesBorrando, setMesBorrando] = useState(null);
  const [gastoEditando, setGastoEditando] = useState(null);
  const [gastoBorrando, setGastoBorrando] = useState(null);

  if (cargando || !datos) {
    return (
      <Panel sinEncabezado>
        <p className="py-16 text-center text-[14px] text-[#948A7C]">Cargando…</p>
      </Panel>
    );
  }

  const { meses, ultimo, gastos, gastoSemanal, gastoMensual, egresoMensualTotal } = datos;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <TarjetaKpi
          etiqueta="Ventas del último mes"
          valor={enMoneda(ultimo.ventasUsd)}
          detalle={`${meses.length} meses cargados`}
          icono={ArrowUpRight}
          tono="naranja"
        />
        <TarjetaKpi
          etiqueta="Costo de mercadería"
          valor={enMoneda(ultimo.costoMercaderiaUsd)}
          detalle={`margen bruto ${ultimo.margenPct.toFixed(1)}%`}
          icono={ArrowDownRight}
          tono="azul"
        />
        <TarjetaKpi
          etiqueta="Gastos fijos al mes"
          valor={enMoneda(egresoMensualTotal)}
          detalle={`${enMoneda(gastoMensual)} mensuales + ${enMoneda(gastoSemanal)} semanales`}
          icono={Receipt}
          tono="naranja"
        />
        <TarjetaKpi
          etiqueta="Resultado del último mes"
          valor={enMoneda(ultimo.resultadoUsd)}
          detalle="después de mercadería, gastos y sueldo"
          icono={CalendarRange}
          tono="azul"
          tendencia={ultimo.resultadoUsd >= 0 ? 'sube' : 'baja'}
        />
      </div>

      <Panel
        titulo="Liquidación mes a mes"
        bajada="Lo que se vendió, lo que costó y lo que quedó."
        cuerpoClassName="p-0"
        acciones={
          <BotonGm variante="solido" tamano="sm" icono={Plus} onClick={() => setMesEditando({})}>
            Cargar mes
          </BotonGm>
        }
      >
        <TablaMeses
          meses={[...meses].reverse()}
          enMoneda={enMoneda}
          onEditar={setMesEditando}
          onEliminar={setMesBorrando}
        />
      </Panel>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Panel
          className="xl:col-span-2"
          titulo="Gastos fijos"
          bajada="Todo lo que se paga sí o sí, con y sin mensualizar."
          cuerpoClassName="p-0"
          acciones={
            <BotonGm variante="solido" tamano="sm" icono={Plus} onClick={() => setGastoEditando({})}>
              Nuevo gasto
            </BotonGm>
          }
        >
          <TablaGastos
            gastos={gastos}
            enMoneda={enMoneda}
            onEditar={setGastoEditando}
            onEliminar={setGastoBorrando}
          />
        </Panel>

        <Panel titulo="En qué se va" bajada="Reparto del egreso mensual por categoría.">
          <DonaCategorias gastos={gastos} enMoneda={enMoneda} />
        </Panel>
      </div>

      {/* --------------------------------- Meses -------------------------------- */}
      <FormularioGm
        abierto={!!mesEditando}
        titulo={mesEditando?.mes ? `Editar ${mesEditando.etiqueta}` : 'Cargar un mes'}
        bajada="Al guardar se vuelve a liquidar todo el módulo con estos números."
        campos={CAMPOS_MES}
        valores={
          mesEditando?.mes
            ? {
                mes: mesEditando.mes,
                etiqueta: mesEditando.etiqueta,
                ventasUsd: mesEditando.ventasUsd,
                costoMercaderiaUsd: mesEditando.costoMercaderiaUsd,
                gastosLogisticaUsd: mesEditando.gastosLogisticaUsd,
                gastosOperativosUsd: mesEditando.gastosOperativosUsd,
              }
            : undefined
        }
        onCerrar={() => setMesEditando(null)}
        onGuardar={(form) =>
          guardarUnMes({
            mes: form.mes,
            etiqueta: form.etiqueta,
            ventasUsd: Number(form.ventasUsd) || 0,
            costoMercaderiaUsd: Number(form.costoMercaderiaUsd) || 0,
            gastosLogisticaUsd: Number(form.gastosLogisticaUsd) || 0,
            gastosOperativosUsd: Number(form.gastosOperativosUsd) || 0,
          })
        }
        textoBoton={mesEditando?.mes ? 'Guardar cambios' : 'Cargar mes'}
      />

      <ConfirmarGm
        abierto={!!mesBorrando}
        detalle={mesBorrando ? `Se borra la liquidación de ${mesBorrando.etiqueta}.` : ''}
        advertencia="El ROI, el crecimiento y las proyecciones se recalculan sin ese mes."
        textoBoton="Borrar mes"
        onCerrar={() => setMesBorrando(null)}
        onConfirmar={() => borrarUnMes(mesBorrando.mes)}
      />

      {/* -------------------------------- Gastos -------------------------------- */}
      <FormularioGm
        abierto={!!gastoEditando}
        titulo={gastoEditando?.id ? 'Editar gasto' : 'Nuevo gasto fijo'}
        bajada="Entra en el egreso mensualizado y baja el resultado de todos los meses."
        campos={CAMPOS_GASTO}
        valores={
          gastoEditando?.id
            ? {
                concepto: gastoEditando.concepto,
                categoria: gastoEditando.categoria,
                periodicidad: gastoEditando.periodicidad,
                montoUsd: gastoEditando.montoUsd,
              }
            : undefined
        }
        onCerrar={() => setGastoEditando(null)}
        onGuardar={(form) =>
          guardarUnGasto({
            id: gastoEditando?.id,
            concepto: form.concepto,
            categoria: form.categoria,
            periodicidad: form.periodicidad,
            montoUsd: Number(form.montoUsd) || 0,
          })
        }
        textoBoton={gastoEditando?.id ? 'Guardar cambios' : 'Agregar gasto'}
      />

      <ConfirmarGm
        abierto={!!gastoBorrando}
        detalle={gastoBorrando ? `Se borra "${gastoBorrando.concepto}".` : ''}
        advertencia="El egreso mensual baja y el resultado sube: revisá que el gasto realmente ya no exista."
        textoBoton="Borrar gasto"
        onCerrar={() => setGastoBorrando(null)}
        onConfirmar={() => borrarUnGasto(gastoBorrando.id)}
      />
    </div>
  );
}
