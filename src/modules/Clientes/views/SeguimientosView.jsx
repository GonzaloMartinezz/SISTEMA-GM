// ============================================================================
// SISTEMA GM · M-01 CLIENTES · SEGUIMIENTOS
// ----------------------------------------------------------------------------
// Registro de las interacciones recientes, con todo el tablero pedido:
//   · tarjetas de resumen del pipeline
//   · embudo por etapa con monto y probabilidad de cierre
//   · próximas visitas y llamadas agendadas
//   · dona de origen de las oportunidades
//   · tabla de interacciones recientes con semáforo de contacto
// Al hacer clic en una fila se abre la ficha de la oportunidad con pestañas.
// ============================================================================

import React, { useMemo, useState } from 'react';
import { Activity, DollarSign, Percent, Plus, Timer } from 'lucide-react';
import { useClientes } from '../context/ClientesContext';
import { getEtapa } from '../../Seguimientos/config/pipeline.config';
import { crearLead, actualizarLead, eliminarLead } from '../../Seguimientos/services/leadsService';
import { CAMPOS_LEAD, aFormularioLead } from '../../Seguimientos/config/lead.form';
import Panel from '../../../shared/gm-ui/Panel';
import TarjetaKpi from '../../../shared/gm-ui/TarjetaKpi';
import BotonGm from '../../../shared/gm-ui/BotonGm';
import FormularioGm from '../../../shared/gm-ui/FormularioGm';
import ConfirmarGm from '../../../shared/gm-ui/ConfirmarGm';
import { usd } from '../../../shared/gm-ui/graficos';
import EmbudoPipeline from '../components/seguimientos/EmbudoPipeline';
import ProximasInteracciones from '../components/seguimientos/ProximasInteracciones';
import DonaOrigen from '../components/seguimientos/DonaOrigen';
import InteraccionesRecientes from '../components/seguimientos/InteraccionesRecientes';
import FichaLeadPanel from '../components/seguimientos/FichaLeadPanel';

export default function SeguimientosView() {
  const { leads, eventos, cargando, recargar } = useClientes();
  const [lead, setLead] = useState(null);
  const [editando, setEditando] = useState(null); // null | {} (alta) | lead (edición)
  const [borrando, setBorrando] = useState(null);

  const guardarLead = async (form) => {
    if (editando?.id) await actualizarLead(editando.id, form);
    else await crearLead(form);
    await recargar();
  };

  const eliminarLeadActual = async () => {
    await eliminarLead(borrando.id);
    await recargar();
  };

  const resumen = useMemo(() => {
    const abiertos = leads.filter((l) => l.etapa !== 'cerrado');
    const cerrados = leads.filter((l) => l.etapa === 'cerrado');
    const enJuego = abiertos.reduce((s, l) => s + Number(l.montoUsd || 0), 0);
    const ponderado = abiertos.reduce(
      (s, l) => s + Number(l.montoUsd || 0) * (getEtapa(l.etapa).probabilidad / 100),
      0
    );
    const interacciones = leads.reduce((s, l) => s + (l.interacciones || 0), 0);
    const frios = leads.filter((l) => (l.diasSinContacto || 0) > 7).length;

    return {
      abiertos: abiertos.length,
      enJuego,
      ponderado,
      conversion: leads.length ? Math.round((cerrados.length / leads.length) * 100) : 0,
      interacciones,
      frios,
    };
  }, [leads]);

  return (
    <div className="space-y-6">
      {/* ------------------------------ Resumen ------------------------------ */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <TarjetaKpi
          etiqueta="Oportunidades abiertas"
          valor={resumen.abiertos}
          detalle={`${resumen.interacciones} interacciones acumuladas`}
          icono={Activity}
          tono="naranja"
        />
        <TarjetaKpi
          etiqueta="Monto en juego"
          valor={usd(resumen.enJuego)}
          detalle={`${usd(resumen.ponderado)} ponderado por etapa`}
          icono={DollarSign}
          tono="azul"
        />
        <TarjetaKpi
          etiqueta="Tasa de cierre"
          valor={`${resumen.conversion}%`}
          detalle="sobre el total de oportunidades cargadas"
          icono={Percent}
          tono="naranja"
        />
        <TarjetaKpi
          etiqueta="Sin contacto hace +7 días"
          valor={resumen.frios}
          detalle="requieren seguimiento urgente"
          icono={Timer}
          tono="azul"
          tendencia={resumen.frios > 0 ? 'baja' : 'igual'}
        />
      </div>

      {/* --------------------- Embudo + próximas acciones -------------------- */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Panel
          className="xl:col-span-2"
          titulo="Embudo del pipeline"
          bajada="Dónde está parada cada oportunidad y cuánto dinero hay en cada etapa."
        >
          {cargando ? (
            <p className="py-10 text-center text-[14px] text-[var(--gm-texto-medio)]">Cargando pipeline…</p>
          ) : (
            <EmbudoPipeline leads={leads} />
          )}
        </Panel>

        <Panel
          titulo="Próximas interacciones"
          bajada="Visitas y llamadas agendadas de hoy en adelante."
        >
          <ProximasInteracciones eventos={eventos} />
        </Panel>
      </div>

      {/* ------------------- Origen + interacciones recientes ---------------- */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Panel titulo="Origen de las oportunidades" bajada="Composición del pipeline por rubro.">
          <DonaOrigen leads={leads} />
        </Panel>

        <Panel
          className="xl:col-span-2"
          titulo="Interacciones recientes"
          bajada="Ordenadas por cuánto hace que no se toca la cuenta. Hacé clic en una fila para ver la ficha."
          cuerpoClassName="p-0"
          acciones={
            <BotonGm variante="solido" tamano="sm" icono={Plus} onClick={() => setEditando({})}>
              Nueva oportunidad
            </BotonGm>
          }
        >
          <InteraccionesRecientes
            leads={leads}
            onVerLead={setLead}
            onEditar={setEditando}
            onEliminar={setBorrando}
          />
        </Panel>
      </div>

      {lead && <FichaLeadPanel lead={lead} onCerrar={() => setLead(null)} />}

      <FormularioGm
        abierto={!!editando}
        titulo={editando?.id ? 'Editar oportunidad' : 'Nueva oportunidad'}
        bajada={
          editando?.id
            ? 'Los cambios impactan en el tablero de Seguimientos y en la ficha del cliente.'
            : 'Cargá los datos de la oportunidad para sumarla al pipeline.'
        }
        campos={CAMPOS_LEAD}
        valores={editando?.id ? aFormularioLead(editando) : undefined}
        onCerrar={() => setEditando(null)}
        onGuardar={guardarLead}
        textoBoton={editando?.id ? 'Guardar cambios' : 'Crear oportunidad'}
      />

      <ConfirmarGm
        abierto={!!borrando}
        detalle={borrando ? `Se va a eliminar la oportunidad "${borrando.clinica}".` : ''}
        advertencia="Se borra del pipeline junto con su historial de etapas. Esta acción no se puede deshacer."
        textoBoton="Eliminar"
        onCerrar={() => setBorrando(null)}
        onConfirmar={eliminarLeadActual}
      />
    </div>
  );
}
