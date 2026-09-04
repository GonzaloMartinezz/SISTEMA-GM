// ============================================================================
// SISTEMA GM · M-01 CLIENTES · AGENDA DE CLIENTES
// ----------------------------------------------------------------------------
// Panel de tiempos y citas por cuenta: calendario del mes, jornada del día
// elegido, alta de visitas y llamadas, y exportación de la semana a un archivo
// .ics que entra en cualquier calendario.
// ============================================================================

import React, { useMemo, useState } from 'react';
import { CalendarDays, CalendarPlus, Download, MapPin, Phone } from 'lucide-react';
import { useClientes } from '../context/ClientesContext';
import {
  cambiarEstadoEvento, generarICS, guardarEvento,
} from '../../../shared/agenda/agendaService';
import Panel from '../../../shared/gm-ui/Panel';
import BotonGm from '../../../shared/gm-ui/BotonGm';
import TarjetaKpi from '../../../shared/gm-ui/TarjetaKpi';
import FormularioGm from '../../../shared/gm-ui/FormularioGm';
import CalendarioMes from '../components/agenda/CalendarioMes';
import ListaDelDia from '../components/agenda/ListaDelDia';
import ProximasInteracciones from '../components/seguimientos/ProximasInteracciones';

const hoyISO = () => new Date().toISOString().slice(0, 10);

const finDeSemanaISO = () => new Date(Date.now() + 6 * 86400000).toISOString().slice(0, 10);

export default function AgendaClientesView() {
  const { eventos, clientes, cargando, recargar } = useClientes();
  const [mes, setMes] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const [dia, setDia] = useState(hoyISO);
  const [alta, setAlta] = useState(false);
  const [locales, setLocales] = useState({}); // estados cambiados en esta sesión

  const conEstado = useMemo(
    () => eventos.map((e) => (locales[e.id] ? { ...e, estado: locales[e.id] } : e)),
    [eventos, locales]
  );

  const delDia = useMemo(() => conEstado.filter((e) => e.fecha === dia), [conEstado, dia]);

  const resumen = useMemo(() => {
    const hoy = hoyISO();
    const limite = finDeSemanaISO();
    const semana = conEstado.filter((e) => e.fecha >= hoy && e.fecha <= limite);
    return {
      hoy: conEstado.filter((e) => e.fecha === hoy).length,
      semana: semana.length,
      visitas: semana.filter((e) => e.tipo === 'visita').length,
      llamadas: semana.filter((e) => e.tipo === 'llamada').length,
    };
  }, [conEstado]);

  const campos = useMemo(
    () => [
      { clave: 'titulo', etiqueta: 'Título del evento', tipo: 'texto', ancho: 2, requerido: true },
      {
        clave: 'cliente',
        etiqueta: 'Cliente',
        tipo: 'select',
        requerido: true,
        opciones: clientes.map((c) => c.negocio).filter(Boolean),
      },
      {
        clave: 'tipo',
        etiqueta: 'Tipo',
        tipo: 'select',
        requerido: true,
        opciones: [
          { valor: 'visita', texto: 'Visita' },
          { valor: 'llamada', texto: 'Llamada' },
          { valor: 'reunion', texto: 'Reunión' },
        ],
      },
      { clave: 'fecha', etiqueta: 'Fecha', tipo: 'fecha', requerido: true, defecto: dia },
      { clave: 'hora', etiqueta: 'Hora', tipo: 'hora', requerido: true },
      { clave: 'duracion', etiqueta: 'Duración (minutos)', tipo: 'numero', defecto: 30 },
      {
        clave: 'prioridad',
        etiqueta: 'Prioridad',
        tipo: 'select',
        opciones: ['alta', 'media', 'baja'],
        defecto: 'media',
      },
      { clave: 'direccion', etiqueta: 'Dirección', tipo: 'texto', ancho: 2 },
      { clave: 'nota', etiqueta: 'Nota', tipo: 'area', ancho: 2 },
    ],
    [clientes, dia]
  );

  const crear = async (form) => {
    await guardarEvento({ ...form, duracion: Number(form.duracion) || 30 });
    await recargar();
  };

  const marcarRealizado = async (evento) => {
    setLocales((l) => ({ ...l, [evento.id]: 'realizado' }));
    try {
      await cambiarEstadoEvento(evento.id, 'realizado');
    } catch {
      setLocales((l) => ({ ...l, [evento.id]: evento.estado })); // se revierte si falla
    }
  };

  const exportarSemana = () => {
    const hoy = hoyISO();
    const limite = finDeSemanaISO();
    generarICS(
      conEstado.filter((e) => e.fecha >= hoy && e.fecha <= limite),
      `agenda-clientes-${hoy}.ics`
    );
  };

  const tituloDia = new Date(`${dia}T12:00:00`).toLocaleDateString('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <TarjetaKpi etiqueta="Compromisos de hoy" valor={resumen.hoy} detalle="entre visitas y llamadas" icono={CalendarDays} tono="naranja" />
        <TarjetaKpi etiqueta="Próximos 7 días" valor={resumen.semana} detalle="eventos agendados" icono={CalendarPlus} tono="azul" />
        <TarjetaKpi etiqueta="Visitas de la semana" valor={resumen.visitas} detalle="salidas a campo" icono={MapPin} tono="naranja" />
        <TarjetaKpi etiqueta="Llamadas de la semana" valor={resumen.llamadas} detalle="contactos telefónicos" icono={Phone} tono="azul" />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Panel titulo="Calendario" bajada="Elegí un día para ver y organizar su jornada.">
          <CalendarioMes
            mes={mes}
            onCambiarMes={setMes}
            eventos={conEstado}
            seleccionado={dia}
            onSeleccionar={setDia}
          />
        </Panel>

        <Panel
          className="xl:col-span-2"
          titulo={`Jornada · ${tituloDia}`}
          bajada={`${delDia.length} ${delDia.length === 1 ? 'compromiso' : 'compromisos'} para esta fecha`}
          acciones={
            <>
              <BotonGm variante="contorno" tamano="sm" icono={Download} onClick={exportarSemana}>
                Exportar semana
              </BotonGm>
              <BotonGm variante="solido" tamano="sm" icono={CalendarPlus} onClick={() => setAlta(true)}>
                Nueva cita
              </BotonGm>
            </>
          }
        >
          {cargando ? (
            <p className="py-10 text-center text-[14px] text-[var(--gm-texto-medio)]">Cargando agenda…</p>
          ) : (
            <ListaDelDia eventos={delDia} onMarcarRealizado={marcarRealizado} />
          )}
        </Panel>
      </div>

      <Panel titulo="Lo que viene" bajada="Las próximas seis citas, sin importar el día que estés mirando.">
        <ProximasInteracciones eventos={conEstado} />
      </Panel>

      <FormularioGm
        abierto={alta}
        titulo="Nueva cita"
        bajada="Queda cargada en la agenda del sistema y se puede pasar a Google Calendar desde la jornada."
        campos={campos}
        onCerrar={() => setAlta(false)}
        onGuardar={crear}
        textoBoton="Agendar"
      />
    </div>
  );
}
