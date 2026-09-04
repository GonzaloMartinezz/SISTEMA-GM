// ============================================================================
// SISTEMA GM · M-05 AGENDA INTELIGENTE · PENDIENTES Y ALERTAS
// ----------------------------------------------------------------------------
// Esta es la parte que hace que la agenda sea inteligente y no un calendario.
//
// Nada de lo que se ve acá lo escribió nadie: sale de lo que los otros módulos
// ya saben. Seguimientos sabe a quién hace tres semanas que no le escribís;
// Equipamientos sabe qué se quedó sin stock; Post Venta sabe qué service vence;
// Cobranzas sabe qué llamado quedó con un próximo paso pactado.
//
// Dos reglas que se ven en la pantalla:
//   · Es una sugerencia hasta que la agendás. No ocupa tiempo del día ni entra
//     en la carga de la jornada mientras esté acá.
//   · Cuando la agendás, el compromiso se lleva anotado de dónde salió, y la
//     sugerencia desaparece sola. Si después cancelás ese compromiso, vuelve.
//
// Las alertas de arriba son distintas: no son trabajo pendiente sino cosas del
// calendario que conviene mirar antes de que pasen (mañana arrancás temprano,
// hay que preparar algo, un día quedó sobrevendido).
// ============================================================================

import React, { useMemo, useState } from 'react';
import {
  AlarmClock, CalendarPlus, CircleCheck, Clock3, Inbox, MapPin, Package,
  Route, TriangleAlert,
} from 'lucide-react';
import Panel from '../../../shared/gm-ui/Panel';
import Chip from '../../../shared/gm-ui/Chip';
import BotonGm from '../../../shared/gm-ui/BotonGm';
import EstadoVacio from '../../../shared/gm-ui/EstadoVacio';
import FilaEstadisticas from '../../../shared/gm-ui/FilaEstadisticas';
import FormularioGm from '../../../shared/gm-ui/FormularioGm';
import { useAgenda } from '../context/AgendaContext';
import { getOrigen, getTipo, URGENCIAS, TIPOS } from '../config/agenda.config';
import { ESTADO_COLOR } from '../../../shared/gm-ui/tokens';
import {
  hoyIso, sumarDias, diaLargo, diaCorto, cargaDelDia, horasYminutos, nombreRelativo,
} from '../utils/calendario';
import { rutaDelDia } from '../utils/ruta';

const CAMPOS_AGENDAR = [
  { clave: 'titulo', etiqueta: 'Qué hay que hacer', tipo: 'texto', requerido: true, ancho: 2 },
  {
    clave: 'tipo',
    etiqueta: 'Tipo',
    tipo: 'select',
    requerido: true,
    opciones: TIPOS.map((t) => ({ valor: t.id, texto: t.nombre })),
  },
  { clave: 'cliente', etiqueta: 'Con quién', tipo: 'texto' },
  { clave: 'fecha', etiqueta: 'Para cuándo', tipo: 'fecha', requerido: true },
  { clave: 'hora', etiqueta: 'A qué hora', tipo: 'hora', requerido: true },
  { clave: 'duracion', etiqueta: 'Duración (min)', tipo: 'numero', defecto: 30 },
  {
    clave: 'prioridad',
    etiqueta: 'Prioridad',
    tipo: 'select',
    opciones: [
      { valor: 'alta', texto: 'Alta' },
      { valor: 'media', texto: 'Media' },
      { valor: 'baja', texto: 'Baja' },
    ],
  },
  { clave: 'nota', etiqueta: 'Qué preparar', tipo: 'area', ancho: 2 },
];

export default function PendientesView() {
  const { pendientes, eventosDe, agendarPendiente, cargando, fecha } = useAgenda();
  const [agendando, setAgendando] = useState(null);

  const hoy = hoyIso();
  const manana = sumarDias(hoy, 1);
  const deManana = eventosDe(manana);
  const deHoy = eventosDe(hoy);

  // ------------------------------------------------------------- alertas ----
  const alertas = useMemo(() => {
    const lista = [];
    const visitasManana = deManana.filter((e) => e.tipo === 'visita' && e.estado !== 'cancelado');

    if (visitasManana.length) {
      const ruta = rutaDelDia(deManana);
      lista.push({
        id: 'ruta',
        icono: Route,
        color: ESTADO_COLOR.riesgo,
        titulo: `${visitasManana.length} ${visitasManana.length === 1 ? 'visita' : 'visitas'} mañana`,
        detalle: ruta.ruteables.length
          ? `${ruta.totalKm.toFixed(1)} km y unos ${ruta.minutos} min de manejo, vuelta incluida. Cargá combustible hoy.`
          : 'Ninguna tiene coordenadas cargadas, así que no se puede estimar el recorrido.',
      });
    }

    const primero = deManana.find((e) => e.estado === 'pendiente');
    if (primero) {
      lista.push({
        id: 'primera',
        icono: Clock3,
        color: ESTADO_COLOR.neutro,
        titulo: `Mañana arrancás ${primero.hora}`,
        detalle: `${primero.titulo}${primero.cliente ? ` · ${primero.cliente}` : ''}`,
      });
    }

    deManana
      .filter((e) => e.nota && e.estado === 'pendiente')
      .forEach((e) => {
        lista.push({
          id: `prep-${e.id}`,
          icono: Package,
          color: ESTADO_COLOR.atencion,
          titulo: `Preparar para ${e.cliente || e.titulo}`,
          detalle: e.nota,
        });
      });

    // La carga de mañana, para poder mover algo hoy y no llegar al día reventado.
    const cargaManana = cargaDelDia(deManana);
    if (cargaManana.excedido) {
      lista.push({
        id: 'carga',
        icono: TriangleAlert,
        color: ESTADO_COLOR.critico,
        titulo: 'Mañana no entra',
        detalle: `${horasYminutos(cargaManana.minutos)} comprometidas en una jornada de 12 h. Conviene mover algo ahora.`,
      });
    }

    const sinCerrarHoy = deHoy.filter((e) => e.estado === 'pendiente');
    if (sinCerrarHoy.length) {
      lista.push({
        id: 'pendientes-hoy',
        icono: AlarmClock,
        color: ESTADO_COLOR.critico,
        titulo: `${sinCerrarHoy.length} ${sinCerrarHoy.length === 1 ? 'compromiso' : 'compromisos'} sin cerrar hoy`,
        detalle: 'Marcalos cumplidos o pasalos de día antes de terminar la jornada.',
      });
    }

    return lista;
  }, [deManana, deHoy]);

  // ---------------------------------------------------------- estadísticas --
  const porUrgencia = (u) => pendientes.filter((p) => p.urgencia === u).length;
  const porModulo = useMemo(() => {
    const m = {};
    pendientes.forEach((p) => {
      m[p.modulo] = (m[p.modulo] || 0) + 1;
    });
    return m;
  }, [pendientes]);

  const estadisticas = [
    {
      etiqueta: 'Pendientes',
      valor: pendientes.length,
      detalle: 'sugeridos por los otros módulos',
    },
    {
      etiqueta: 'Atrasados',
      valor: porUrgencia(1),
      detalle: 'ya deberían estar hechos',
      color: porUrgencia(1) > 0 ? ESTADO_COLOR.critico : undefined,
    },
    {
      etiqueta: 'Esta semana',
      valor: porUrgencia(2),
      detalle: 'conviene meterlos ya',
      color: porUrgencia(2) > 0 ? ESTADO_COLOR.atencion : undefined,
    },
    {
      etiqueta: 'De Seguimientos',
      valor: porModulo.seguimientos || 0,
      detalle: 'leads sin contacto o frenados',
    },
    {
      etiqueta: 'De Equipamientos',
      valor: porModulo.equipamientos || 0,
      detalle: 'stock para reponer',
    },
    {
      etiqueta: 'Alertas del calendario',
      valor: alertas.length,
      detalle: alertas.length ? 'para mirar antes de mañana' : 'nada urgente',
    },
  ];

  // ------------------------------------------------------------- agendar ----
  const abrirAgendar = (p) => {
    const tipo = getTipo(p.tipoSugerido);
    setAgendando({
      pendiente: p,
      valores: {
        titulo: `${tipo.nombre}: ${p.titular}`,
        tipo: p.tipoSugerido,
        cliente: p.titular,
        fecha: p.fechaObjetivo || hoy,
        hora: '09:00',
        duracion: tipo.enCalle ? 45 : 15,
        prioridad: p.prioridad || 'media',
        nota: p.motivo,
      },
    });
  };

  const guardar = (valores) =>
    agendarPendiente({
      ...valores,
      origenModulo: agendando.pendiente.modulo,
      origenCodigo: agendando.pendiente.origenCodigo,
      leadCodigo:
        agendando.pendiente.modulo === 'seguimientos' ? agendando.pendiente.origenCodigo : null,
    });

  return (
    <div className="space-y-6">
      <Panel sinEncabezado cuerpoClassName="p-0">
        <FilaEstadisticas items={estadisticas} />
      </Panel>

      {/* ------------------------------- alertas ---------------------------- */}
      <Panel
        titulo="Antes de que pase"
        bajada="Cosas del calendario que conviene mirar hoy porque mañana ya es tarde."
        cuerpoClassName={alertas.length ? 'p-0' : 'p-6'}
      >
        {alertas.length === 0 ? (
          <EstadoVacio
            icono={CircleCheck}
            titulo="Nada urgente para preparar"
            texto="Hoy está cerrado y mañana no tiene sorpresas."
          />
        ) : (
          <ul className="divide-y divide-[#F4EFE7]">
            {alertas.map((a) => (
              <li key={a.id} className="flex items-start gap-3 px-6 py-3.5">
                <span
                  className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-xl"
                  style={{ backgroundColor: `${a.color}1A`, color: a.color }}
                >
                  <a.icono size={16} />
                </span>
                <div className="min-w-0">
                  <p className="text-[14px] font-medium text-[#2A2118] dark:text-[#F9FAFB]">{a.titulo}</p>
                  <p className="mt-0.5 text-[13px] leading-relaxed text-[#948A7C]">{a.detalle}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Panel>

      {/* ------------------------------ la bandeja -------------------------- */}
      <Panel
        titulo="Te está esperando"
        bajada="Sale de Seguimientos, Equipamientos, Logística, Cobranzas y Post Venta. Agendá lo que vas a hacer y desaparece de acá."
        acciones={<Inbox size={16} className="text-[#B0A697] dark:text-[#6B7280]" />}
        cuerpoClassName={pendientes.length ? 'p-0' : 'p-6'}
      >
        {cargando ? (
          <p className="py-16 text-center text-[14px] text-[#948A7C]">Consultando los módulos…</p>
        ) : pendientes.length === 0 ? (
          <EstadoVacio
            icono={CircleCheck}
            titulo="No hay nada pendiente"
            texto="Ningún módulo tiene trabajo sin agendar. Cuando un lead se enfríe, un equipo se quede sin stock o venza un service, va a aparecer acá solo."
          />
        ) : (
          <ul className="divide-y divide-[#F4EFE7]">
            {pendientes.map((p) => {
              const origen = getOrigen(p.modulo);
              const tipo = getTipo(p.tipoSugerido);
              const urgencia = URGENCIAS[p.urgencia] || URGENCIAS[3];

              return (
                <li key={p.clave} className="flex flex-wrap items-center gap-x-4 gap-y-2 px-6 py-4">
                  <span
                    className="h-9 w-1 shrink-0 rounded-full"
                    style={{ backgroundColor: urgencia.color }}
                    title={urgencia.nombre}
                  />
                  <span
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-xl"
                    style={{ backgroundColor: `${tipo.color}1A`, color: tipo.color }}
                  >
                    <tipo.icono size={16} />
                  </span>

                  <div className="min-w-[200px] flex-1">
                    <p className="truncate text-[14px] font-medium text-[#2A2118] dark:text-[#F9FAFB]">{p.titular}</p>
                    <p className="truncate text-[13px] text-[#948A7C]">
                      {p.motivo}
                      {p.referencia ? ` · ${p.referencia}` : ''}
                    </p>
                  </div>

                  <Chip tono={origen.tono}>
                    {origen.modulo} {origen.nombre}
                  </Chip>

                  <span className="text-[12px]" style={{ color: urgencia.color }}>
                    {p.fechaObjetivo ? nombreRelativo(p.fechaObjetivo) : urgencia.nombre}
                  </span>

                  {p.montoUsd > 0 && (
                    <span className="text-[13px] font-semibold text-[#2A2118] dark:text-[#F9FAFB]">
                      US$ {Math.round(p.montoUsd).toLocaleString('es-AR')}
                    </span>
                  )}

                  <BotonGm
                    variante="suave"
                    tamano="sm"
                    icono={CalendarPlus}
                    onClick={() => abrirAgendar(p)}
                  >
                    Agendar
                  </BotonGm>
                </li>
              );
            })}
          </ul>
        )}
      </Panel>

      <p className="flex items-start gap-2 px-1 text-[12px] leading-relaxed text-[#B0A697] dark:text-[#6B7280]">
        <MapPin size={14} className="mt-0.5 shrink-0" />
        Nada de esta lista ocupa tiempo de la jornada hasta que lo agendes. Cuando lo agendás, el
        compromiso se lleva anotado de qué módulo salió y la sugerencia se apaga sola; si después
        lo cancelás, vuelve a aparecer acá.
      </p>

      <FormularioGm
        abierto={Boolean(agendando)}
        titulo="Agendar este pendiente"
        bajada={
          agendando
            ? `${getOrigen(agendando.pendiente.modulo).nombre} · ${agendando.pendiente.origenCodigo}`
            : ''
        }
        campos={CAMPOS_AGENDAR}
        valores={agendando?.valores || null}
        textoBoton="Poner en la agenda"
        onCerrar={() => setAgendando(null)}
        onGuardar={guardar}
      />
    </div>
  );
}
