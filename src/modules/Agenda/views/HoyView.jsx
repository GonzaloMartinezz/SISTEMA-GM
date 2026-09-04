// ============================================================================
// SISTEMA GM · M-05 AGENDA INTELIGENTE · LA JORNADA
// ----------------------------------------------------------------------------
// La pantalla que se mira todo el día. A la izquierda el día hora por hora; a
// la derecha lo que se necesita mientras se lo vive: qué sigue ahora, la ruta
// de las visitas y lo que quedó sin cerrar.
//
// El encabezado no dice sólo cuántos compromisos hay: dice cuánto ocupan. Un
// día de 3 compromisos de dos horas cada uno y uno de 8 llamadas de 10 minutos
// se cuentan igual y no son lo mismo.
// ============================================================================

import React, { useMemo, useState } from 'react';
import {
  CalendarCheck, Clock, Download, Navigation, Plus, ListTodo, ArrowRight,
} from 'lucide-react';
import Panel from '../../../shared/gm-ui/Panel';
import TarjetaKpi from '../../../shared/gm-ui/TarjetaKpi';
import BotonGm from '../../../shared/gm-ui/BotonGm';
import FormularioGm from '../../../shared/gm-ui/FormularioGm';
import ConfirmarGm from '../../../shared/gm-ui/ConfirmarGm';
import EstadoVacio from '../../../shared/gm-ui/EstadoVacio';
import { useAgenda } from '../context/AgendaContext';
import { TIPOS, getTipo } from '../config/agenda.config';
import { CAMPOS_EVENTO, aFormularioEvento } from '../config/evento.form';
import {
  nombreRelativo, diaLargo, horasYminutos, aMinutos, horaFin, esHoy,
} from '../utils/calendario';
import { rutaDelDia } from '../utils/ruta';
import { generarICS } from '../services/agendaService';
import JornadaHoras from '../components/JornadaHoras';
import RutaDelDia from '../components/RutaDelDia';
import FiltroTipos from '../components/FiltroTipos';
import BarraCarga from '../components/BarraCarga';
import ModalEvento from '../components/ModalEvento';

export default function HoyView() {
  const {
    fecha, delDia, visibles, carga, cargando, pendientes,
    guardarEvento, marcarEstado, moverEvento, borrarEvento,
  } = useAgenda();

  const [abierto, setAbierto] = useState(null);   // evento en la ficha
  const [editando, setEditando] = useState(null); // 'nuevo' | evento
  const [borrando, setBorrando] = useState(null);

  const conteo = useMemo(() => {
    const c = {};
    TIPOS.forEach((t) => {
      c[t.id] = visibles.filter((e) => e.fecha === fecha && e.tipo === t.id).length;
    });
    return c;
  }, [visibles, fecha]);

  const ruta = useMemo(() => rutaDelDia(delDia), [delDia]);
  const sinCerrar = delDia.filter((e) => e.estado === 'pendiente');
  const cumplidos = delDia.filter((e) => e.estado === 'cumplido').length;

  // Lo que sigue: el primer compromiso abierto que todavía no terminó. Si ya
  // pasaron todos y quedan abiertos, se muestra igual el primero y se avisa que
  // se pasó la hora — a las ocho de la noche lo que uno quiere ver es
  // justamente lo que no hizo, no un cartel que dice "todo cerrado".
  const ahora = new Date().getHours() * 60 + new Date().getMinutes();
  const { siguiente, atrasado } = useMemo(() => {
    const abiertos = delDia.filter((e) => e.estado === 'pendiente');
    if (!abiertos.length) return { siguiente: null, atrasado: false };
    if (!esHoy(fecha)) return { siguiente: abiertos[0], atrasado: false };
    const proximo = abiertos.find((e) => (aMinutos(e.hora) ?? 0) + (e.duracion || 30) >= ahora);
    return proximo
      ? { siguiente: proximo, atrasado: false }
      : { siguiente: abiertos[0], atrasado: true };
  }, [delDia, fecha, ahora]);

  const enCalle = delDia.filter((e) => getTipo(e.tipo).enCalle && e.estado !== 'cancelado').length;

  return (
    <div className="space-y-6">
      {/* ----------------------------- indicadores --------------------------- */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <TarjetaKpi
          etiqueta={nombreRelativo(fecha)}
          valor={delDia.length}
          detalle={delDia.length === 1 ? 'compromiso agendado' : 'compromisos agendados'}
          icono={CalendarCheck}
          tono="azul"
        />
        <TarjetaKpi
          etiqueta="Jornada ocupada"
          valor={horasYminutos(carga.minutos)}
          detalle={`${Math.round(carga.pct)}% de las 12 h de trabajo`}
          icono={Clock}
          tono="naranja"
        />
        <TarjetaKpi
          etiqueta="En la calle"
          valor={enCalle}
          detalle={
            ruta.ruteables.length
              ? `${ruta.totalKm.toFixed(1)} km · ${ruta.minutos} min de manejo`
              : 'sin visitas para rutear'
          }
          icono={Navigation}
          tono="crema"
        />
        <TarjetaKpi
          etiqueta="Cerrados"
          valor={`${cumplidos}/${delDia.length}`}
          detalle={
            sinCerrar.length
              ? `${sinCerrar.length} sin cerrar todavía`
              : delDia.length
                ? 'día cerrado completo'
                : 'nada agendado'
          }
          icono={ListTodo}
          tono="verde"
        />
      </div>

      {/* --------------------------- barra de filtros ------------------------ */}
      <Panel sinEncabezado cuerpoClassName="px-5 py-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <FiltroTipos conteo={conteo} />
          <div className="flex items-center gap-2">
            <BotonGm
              variante="contorno"
              tamano="sm"
              icono={Download}
              disabled={!delDia.length}
              onClick={() => generarICS(delDia, `agenda-${fecha}.ics`)}
            >
              Exportar .ics
            </BotonGm>
            <BotonGm variante="solido" tamano="sm" icono={Plus} onClick={() => setEditando('nuevo')}>
              Nuevo compromiso
            </BotonGm>
          </div>
        </div>
      </Panel>

      {/* ------------------------------ contenido ---------------------------- */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.9fr)_minmax(0,1fr)]">
        <Panel
          titulo={diaLargo(fecha)}
          bajada="Tocá un bloque para ver el compromiso, cerrarlo o moverlo de día."
          acciones={
            <div className="w-32">
              <BarraCarga carga={carga} compacto />
            </div>
          }
        >
          {cargando ? (
            <p className="py-16 text-center text-[14px] text-[#948A7C]">Cargando la jornada…</p>
          ) : (
            <JornadaHoras
              fecha={fecha}
              eventos={delDia}
              onEvento={setAbierto}
              onCerrar={(e) =>
                marcarEstado(e.id, e.estado === 'pendiente' ? 'cumplido' : 'pendiente')
              }
              onCancelar={(e) => marcarEstado(e.id, 'cancelado')}
            />
          )}
        </Panel>

        <div className="space-y-6">
          {/* ----------------------------- qué sigue ------------------------- */}
          <Panel
            titulo={atrasado ? 'Se te pasó la hora' : esHoy(fecha) ? 'Lo que sigue' : 'Arranca el día'}
            bajada={
              atrasado
                ? `Ya pasaron todos los horarios y quedan ${sinCerrar.length} sin cerrar.`
                : esHoy(fecha)
                  ? 'El próximo compromiso abierto de la jornada.'
                  : undefined
            }
          >
            {siguiente ? (
              <button
                type="button"
                onClick={() => setAbierto(siguiente)}
                className="w-full rounded-xl border border-[#E8E0D5] dark:border-[#333333] bg-[#FCFAF6] dark:bg-[#2D2D2D] p-4 text-left transition hover:border-[#D5CABA] hover:bg-white dark:hover:bg-[#1E1E1E]"
              >
                <div className="flex items-center gap-2">
                  {React.createElement(getTipo(siguiente.tipo).icono, {
                    size: 14,
                    style: { color: getTipo(siguiente.tipo).color },
                  })}
                  <span className="text-[12px] tabular-nums text-[#6E6559] dark:text-[#9CA3AF]">
                    {siguiente.hora}–{horaFin(siguiente)}
                  </span>
                  <ArrowRight size={13} className="ml-auto text-[#B0A697] dark:text-[#6B7280]" />
                </div>
                <p className="mt-2 text-[15px] font-semibold text-[#2A2118] dark:text-[#F9FAFB]">{siguiente.titulo}</p>
                {siguiente.cliente && (
                  <p className="mt-0.5 text-[13px] text-[#948A7C]">{siguiente.cliente}</p>
                )}
                {siguiente.nota && (
                  <p className="mt-2 rounded-lg bg-white dark:bg-[#1E1E1E] px-3 py-2 text-[12px] leading-relaxed text-[#6E6559] dark:text-[#9CA3AF]">
                    {siguiente.nota}
                  </p>
                )}
              </button>
            ) : (
              <EstadoVacio
                titulo={delDia.length ? 'Todo cerrado' : 'Nada agendado'}
                texto={
                  delDia.length
                    ? 'No queda nada abierto para este día.'
                    : 'Agendá algo, o mirá la bandeja de pendientes.'
                }
              />
            )}
          </Panel>

          {/* ------------------------------- ruta ---------------------------- */}
          <Panel
            titulo="Ruta de las visitas"
            bajada="Ordenada por cercanía desde la base, con la vuelta incluida."
          >
            <RutaDelDia ruta={ruta} />
          </Panel>

          {/* --------------------------- bandeja corta ----------------------- */}
          {pendientes.length > 0 && (
            <Panel
              titulo="Te está esperando"
              bajada="Lo que los otros módulos saben que falta hacer y todavía no agendaste."
              cuerpoClassName="p-0"
            >
              <ul className="divide-y divide-[#F4EFE7]">
                {pendientes.slice(0, 4).map((p) => (
                  <li key={p.clave} className="px-5 py-3">
                    <p className="truncate text-[13px] font-medium text-[#2A2118] dark:text-[#F9FAFB]">{p.titular}</p>
                    <p className="truncate text-[12px] text-[#948A7C]">{p.motivo}</p>
                  </li>
                ))}
              </ul>
              <div className="border-t border-[#F0EAE1] dark:border-[#333333] px-5 py-3">
                <p className="text-[12px] text-[#948A7C]">
                  {pendientes.length} pendientes en total · están todos en la sección{' '}
                  <span className="text-[#6E6559] dark:text-[#9CA3AF]">Pendientes y Alertas</span>.
                </p>
              </div>
            </Panel>
          )}
        </div>
      </div>

      {/* ------------------------------- modales ----------------------------- */}
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
        bajada={
          editando && editando !== 'nuevo'
            ? `${editando.id} · ${editando.cliente || 'sin cliente'}`
            : 'Módulo 5 · Agenda Inteligente'
        }
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
          guardarEvento(
            editando === 'nuevo' ? v : { ...v, id: editando.id },
            editando === 'nuevo'
          )
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
