// ============================================================================
// SISTEMA GM · M-05 AGENDA INTELIGENTE · EL MES
// ----------------------------------------------------------------------------
// La vista de planificación. Al costado, el detalle del día que se toca: el
// calendario sirve para elegir dónde meter algo, y el panel para ver qué hay
// realmente ahí sin cambiar de sección.
// ============================================================================

import React, { useMemo, useState } from 'react';
import { Plus, CalendarDays } from 'lucide-react';
import Panel from '../../../shared/gm-ui/Panel';
import BotonGm from '../../../shared/gm-ui/BotonGm';
import FormularioGm from '../../../shared/gm-ui/FormularioGm';
import ConfirmarGm from '../../../shared/gm-ui/ConfirmarGm';
import EstadoVacio from '../../../shared/gm-ui/EstadoVacio';
import FilaEstadisticas from '../../../shared/gm-ui/FilaEstadisticas';
import { useAgenda } from '../context/AgendaContext';
import { TIPOS, getTipo } from '../config/agenda.config';
import { CAMPOS_EVENTO, aFormularioEvento } from '../config/evento.form';
import {
  mesDe, mesLargo, diaLargo, cargaDelDia, horasYminutos, horaFin, aFecha,
} from '../utils/calendario';
import CalendarioMes from '../components/CalendarioMes';
import FiltroTipos from '../components/FiltroTipos';
import ModalEvento from '../components/ModalEvento';

export default function MesView() {
  const {
    fecha, setFecha, eventosDe, visibles, cargando,
    guardarEvento, marcarEstado, moverEvento, borrarEvento,
  } = useAgenda();

  const [abierto, setAbierto] = useState(null);
  const [editando, setEditando] = useState(null);
  const [borrando, setBorrando] = useState(null);

  const celdas = useMemo(() => mesDe(fecha), [fecha]);
  const delMes = useMemo(
    () => celdas.filter((c) => c.delMes).flatMap((c) => eventosDe(c.iso)),
    [celdas, eventosDe]
  );

  const conteo = useMemo(() => {
    const mes = aFecha(fecha).getMonth();
    const c = {};
    TIPOS.forEach((t) => {
      c[t.id] = visibles.filter((e) => aFecha(e.fecha).getMonth() === mes && e.tipo === t.id).length;
    });
    return c;
  }, [visibles, fecha]);

  const carga = cargaDelDia(delMes);
  const diasConAlgo = new Set(delMes.map((e) => e.fecha)).size;
  const diasDelMes = celdas.filter((c) => c.delMes).length;
  const enCalle = delMes.filter((e) => getTipo(e.tipo).enCalle && e.estado !== 'cancelado').length;
  const cumplidos = delMes.filter((e) => e.estado === 'cumplido').length;
  const cancelados = delMes.filter((e) => e.estado === 'cancelado').length;

  const estadisticas = [
    { etiqueta: 'Compromisos', valor: delMes.length, detalle: 'en el mes' },
    { etiqueta: 'Tiempo comprometido', valor: horasYminutos(carga.minutos), detalle: 'sin contar lo cerrado' },
    { etiqueta: 'Salidas', valor: enCalle, detalle: 'visitas y entregas' },
    { etiqueta: 'Días con actividad', valor: `${diasConAlgo}/${diasDelMes}`, detalle: 'del mes' },
    { etiqueta: 'Cerrados', valor: cumplidos, detalle: 'marcados cumplidos' },
    { etiqueta: 'Cancelados', valor: cancelados, detalle: cancelados ? 'no ocupan tiempo' : 'ninguno' },
  ];

  const delDiaElegido = eventosDe(fecha);

  return (
    <div className="space-y-6">
      <Panel sinEncabezado cuerpoClassName="p-0">
        <FilaEstadisticas items={estadisticas} />
      </Panel>

      <Panel sinEncabezado cuerpoClassName="px-5 py-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <FiltroTipos conteo={conteo} />
          <BotonGm variante="solido" tamano="sm" icono={Plus} onClick={() => setEditando('nuevo')}>
            Nuevo compromiso
          </BotonGm>
        </div>
      </Panel>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,2.3fr)_minmax(0,1fr)]">
        <Panel
          titulo={<span className="capitalize">{mesLargo(fecha)}</span>}
          bajada="Tocá un día para verlo al costado. Arrastrá un compromiso a otro día para moverlo."
          acciones={<CalendarDays size={16} className="text-[#B0A697] dark:text-[#6B7280]" />}
        >
          {cargando ? (
            <p className="py-16 text-center text-[14px] text-[#948A7C]">Cargando el mes…</p>
          ) : (
            <CalendarioMes
              celdas={celdas}
              eventosDe={eventosDe}
              seleccion={fecha}
              onDia={setFecha}
              onEvento={setAbierto}
              onMover={moverEvento}
            />
          )}
        </Panel>

        <Panel
          titulo={<span className="capitalize">{diaLargo(fecha)}</span>}
          bajada={
            delDiaElegido.length
              ? `${horasYminutos(cargaDelDia(delDiaElegido).minutos)} comprometidas`
              : undefined
          }
          cuerpoClassName={delDiaElegido.length ? 'p-0' : 'p-6'}
        >
          {delDiaElegido.length === 0 ? (
            <EstadoVacio
              titulo="Día libre"
              texto="No hay nada agendado para este día."
              accion={
                <BotonGm
                  variante="suave"
                  tamano="sm"
                  icono={Plus}
                  onClick={() => setEditando('nuevo')}
                >
                  Agendar acá
                </BotonGm>
              }
            />
          ) : (
            <ul className="divide-y divide-[#F4EFE7]">
              {delDiaElegido.map((ev) => {
                const tipo = getTipo(ev.tipo);
                const cerrado = ev.estado !== 'pendiente';
                return (
                  <li key={ev.id}>
                    <button
                      type="button"
                      onClick={() => setAbierto(ev)}
                      className={`flex w-full items-start gap-3 px-5 py-3 text-left transition hover:bg-[#FCFAF6] dark:hover:bg-[#2D2D2D] ${
                        cerrado ? 'opacity-60' : ''
                      }`}
                    >
                      <span
                        className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg"
                        style={{ backgroundColor: `${tipo.color}1A`, color: tipo.color }}
                      >
                        <tipo.icono size={14} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] tabular-nums text-[#948A7C]">
                          {ev.hora}–{horaFin(ev)}
                        </p>
                        <p
                          className={`truncate text-[13px] font-medium text-[#2A2118] dark:text-[#F9FAFB] ${
                            cerrado ? 'line-through' : ''
                          }`}
                        >
                          {ev.titulo}
                        </p>
                        {ev.cliente && (
                          <p className="truncate text-[12px] text-[#948A7C]">{ev.cliente}</p>
                        )}
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </Panel>
      </div>

      {abierto && (
        <ModalEvento
          evento={abierto}
          onCerrarModal={() => setAbierto(null)}
          onEstado={(id, estado, resultado) => {
            marcarEstado(id, estado, resultado);
            setAbierto(null);
          }}
          onMover={(id, nueva) => {
            moverEvento(id, nueva);
            setAbierto(null);
          }}
          onEditar={(e) => {
            setAbierto(null);
            setEditando(e);
          }}
          onEliminar={(e) => {
            setAbierto(null);
            setBorrando(e);
          }}
        />
      )}

      <FormularioGm
        abierto={Boolean(editando)}
        titulo={editando === 'nuevo' ? 'Nuevo compromiso' : 'Editar compromiso'}
        bajada="Módulo 5 · Agenda Inteligente"
        campos={CAMPOS_EVENTO}
        valores={
          editando === 'nuevo'
            ? aFormularioEvento({ fecha })
            : editando
              ? aFormularioEvento(editando)
              : null
        }
        textoBoton={editando === 'nuevo' ? 'Agendar' : 'Guardar cambios'}
        onCerrar={() => setEditando(null)}
        onGuardar={(v) =>
          guardarEvento(editando === 'nuevo' ? v : { ...v, id: editando.id }, editando === 'nuevo')
        }
      />

      <ConfirmarGm
        abierto={Boolean(borrando)}
        titulo="¿Eliminar este compromiso?"
        detalle={borrando ? `${borrando.hora} · ${borrando.titulo}` : ''}
        advertencia="Si ya lo pasaste a Google Calendar, ahí queda: esto sólo lo saca del sistema."
        onCerrar={() => setBorrando(null)}
        onConfirmar={() => borrarEvento(borrando.id)}
      />
    </div>
  );
}
