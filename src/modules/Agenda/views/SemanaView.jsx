// ============================================================================
// SISTEMA GM · M-05 AGENDA INTELIGENTE · LA SEMANA
// ----------------------------------------------------------------------------
// Los siete días con su carga, para acomodar. La franja de arriba resume la
// semana completa; abajo, arrastrando, se mueve lo que no entra.
// ============================================================================

import React, { useMemo, useState } from 'react';
import { Plus, Download, TriangleAlert } from 'lucide-react';
import Panel from '../../../shared/gm-ui/Panel';
import BotonGm from '../../../shared/gm-ui/BotonGm';
import FormularioGm from '../../../shared/gm-ui/FormularioGm';
import ConfirmarGm from '../../../shared/gm-ui/ConfirmarGm';
import { useAgenda } from '../context/AgendaContext';
import { TIPOS, getTipo } from '../config/agenda.config';
import { CAMPOS_EVENTO, aFormularioEvento } from '../config/evento.form';
import {
  semanaDe, cargaDelDia, horasYminutos, diaCorto, aFecha,
} from '../utils/calendario';
import { generarICS } from '../services/agendaService';
import RejillaSemana from '../components/RejillaSemana';
import FiltroTipos from '../components/FiltroTipos';
import ModalEvento from '../components/ModalEvento';
import FilaEstadisticas from '../../../shared/gm-ui/FilaEstadisticas';

export default function SemanaView() {
  const {
    fecha, setFecha, eventosDe, visibles, cargando,
    guardarEvento, marcarEstado, moverEvento, borrarEvento,
  } = useAgenda();

  const [abierto, setAbierto] = useState(null);
  const [editando, setEditando] = useState(null);
  const [borrando, setBorrando] = useState(null);

  const dias = useMemo(() => semanaDe(fecha), [fecha]);
  const deLaSemana = useMemo(() => dias.flatMap(eventosDe), [dias, eventosDe]);

  const conteo = useMemo(() => {
    const c = {};
    TIPOS.forEach((t) => {
      c[t.id] = visibles.filter((e) => dias.includes(e.fecha) && e.tipo === t.id).length;
    });
    return c;
  }, [visibles, dias]);

  const carga = cargaDelDia(deLaSemana);
  const cargasPorDia = dias.map((d) => ({ dia: d, carga: cargaDelDia(eventosDe(d)) }));
  const librcs = cargasPorDia.filter((c) => c.carga.minutos === 0);
  const saturados = cargasPorDia.filter((c) => c.carga.excedido);
  const enCalle = deLaSemana.filter((e) => getTipo(e.tipo).enCalle && e.estado !== 'cancelado');
  const cumplidos = deLaSemana.filter((e) => e.estado === 'cumplido').length;

  const masCargado = cargasPorDia.reduce(
    (a, c) => (c.carga.minutos > a.carga.minutos ? c : a),
    cargasPorDia[0] || { dia: fecha, carga: { minutos: 0 } }
  );

  const estadisticas = [
    { etiqueta: 'Compromisos', valor: deLaSemana.length, detalle: 'en los siete días' },
    {
      etiqueta: 'Tiempo comprometido',
      valor: horasYminutos(carga.minutos),
      detalle: `${Math.round(carga.minutos / 60 / 7 * 10) / 10} h por día en promedio`,
    },
    { etiqueta: 'Salidas', valor: enCalle.length, detalle: 'visitas y entregas' },
    { etiqueta: 'Cerrados', valor: `${cumplidos}/${deLaSemana.length}`, detalle: 'ya resueltos' },
    {
      etiqueta: 'Día más cargado',
      valor: masCargado.carga.minutos ? diaCorto(masCargado.dia) : '—',
      detalle: masCargado.carga.minutos ? horasYminutos(masCargado.carga.minutos) : 'semana vacía',
    },
    {
      etiqueta: 'Días libres',
      valor: librcs.length,
      detalle: librcs.length ? librcs.map((c) => diaCorto(c.dia).slice(0, 3)).join(', ') : 'ninguno',
    },
  ];

  const rango = `${aFecha(dias[0]).toLocaleDateString('es-AR', { day: 'numeric', month: 'long' })} al ${aFecha(dias[6]).toLocaleDateString('es-AR', { day: 'numeric', month: 'long' })}`;

  return (
    <div className="space-y-6">
      <Panel sinEncabezado cuerpoClassName="p-0">
        <FilaEstadisticas items={estadisticas} />
      </Panel>

      <Panel sinEncabezado cuerpoClassName="px-5 py-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <FiltroTipos conteo={conteo} />
          <div className="flex items-center gap-2">
            <BotonGm
              variante="contorno"
              tamano="sm"
              icono={Download}
              disabled={!deLaSemana.length}
              onClick={() => generarICS(deLaSemana, `agenda-semana-${dias[0]}.ics`)}
            >
              Exportar la semana
            </BotonGm>
            <BotonGm variante="solido" tamano="sm" icono={Plus} onClick={() => setEditando('nuevo')}>
              Nuevo compromiso
            </BotonGm>
          </div>
        </div>
      </Panel>

      {saturados.length > 0 && (
        <p className="flex items-start gap-2 rounded-xl border border-[#EDCBB4] bg-[var(--gm-acento-suave-bg)] px-4 py-3 text-[13px] leading-relaxed text-[var(--gm-acento)]">
          <TriangleAlert size={15} className="mt-0.5 shrink-0" />
          {saturados.length === 1
            ? `El ${diaCorto(saturados[0].dia)} no entra: ${horasYminutos(saturados[0].carga.minutos)} comprometidas en una jornada de 12 h.`
            : `${saturados.length} días de esta semana no entran en una jornada de 12 h.`}{' '}
          Arrastrá lo que se pueda mover a un día libre.
        </p>
      )}

      <Panel
        titulo={`Semana del ${rango}`}
        bajada="Arrastrá un compromiso de una columna a otra para cambiarlo de día."
      >
        {cargando ? (
          <p className="py-16 text-center text-[14px] text-[var(--gm-texto-suave)]">Cargando la semana…</p>
        ) : (
          <RejillaSemana
            dias={dias}
            eventosDe={eventosDe}
            onEvento={setAbierto}
            onMover={moverEvento}
            onNuevo={(dia) => {
              setFecha(dia);
              setEditando('nuevo');
            }}
          />
        )}
      </Panel>

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
