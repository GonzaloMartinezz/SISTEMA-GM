// ============================================================================
// SISTEMA GM · M-06 MAPA Y LOGÍSTICA · LA RUTA DEL DÍA
// ----------------------------------------------------------------------------
// El orden más corto para las salidas de un día, dibujado sobre el mapa.
//
// El orden se calcula por vecino más cercano: desde la base se va siempre a la
// parada más próxima que quede. No es el óptimo matemático —eso es un problema
// que no tiene solución rápida— pero con cuatro o cinco paradas queda a un par
// de kilómetros del mejor recorrido posible, y se calcula al instante.
//
// Y no se reordena la agenda sola: los horarios están acordados con cada
// cliente y sólo vos sabés cuáles se pueden mover. Se muestra cuánto ahorrarías
// y decidís vos.
// ============================================================================

import React, { useMemo, useState } from 'react';
import { Clock, ExternalLink, Navigation, Route, TriangleAlert, Fuel } from 'lucide-react';
import Panel from '../../../shared/gm-ui/Panel';
import TarjetaKpi from '../../../shared/gm-ui/TarjetaKpi';
import EstadoVacio from '../../../shared/gm-ui/EstadoVacio';
import { SERIE } from '../../../shared/gm-ui/tokens';
import { useMapa, hoyIso, sumarDias } from '../context/MapaContext';
import {
  BASE_OPERATIVA, getTipoCompromiso, linkComoLlegar, linkRutaCompleta, minutosDeViaje,
} from '../config/mapa.config';
import { distanciaKm } from '../utils/proyeccion';
import MapaGm from '../components/MapaGm';
import PinMapa from '../components/PinMapa';
import FichaCliente from '../components/FichaCliente';

/** Vecino más cercano desde la base. */
function ordenarPorCercania(base, paradas) {
  const pendientes = [...paradas];
  const orden = [];
  let actual = base;
  let acumulado = 0;

  while (pendientes.length) {
    let mejor = 0;
    let mejorDist = Infinity;
    pendientes.forEach((p, i) => {
      const d = distanciaKm(actual, p);
      if (d < mejorDist) {
        mejorDist = d;
        mejor = i;
      }
    });
    const elegida = pendientes.splice(mejor, 1)[0];
    acumulado += mejorDist;
    orden.push({ ...elegida, tramo: mejorDist, acumulado });
    actual = elegida;
  }
  return { orden, totalKm: acumulado };
}

/** El recorrido en el orden en que está agendado, para comparar. */
function ordenAgendado(base, paradas) {
  let actual = base;
  let acumulado = 0;
  const orden = paradas.map((p) => {
    const d = distanciaKm(actual, p);
    acumulado += d;
    actual = p;
    return { ...p, tramo: d, acumulado };
  });
  return { orden, totalKm: acumulado };
}

const DIAS = [
  { id: 0, nombre: 'Hoy' },
  { id: 1, nombre: 'Mañana' },
  { id: 2, nombre: 'Pasado' },
];

export default function RutaView() {
  const { compromisos, porCodigo, cargando, seleccionado, setSeleccionado } = useMapa();
  const [dia, setDia] = useState(1);
  const [modo, setModo] = useState('cercania'); // cercania | agenda

  const fecha = sumarDias(hoyIso(), dia);

  const salidas = useMemo(
    () =>
      compromisos
        .filter((c) => c.fecha === fecha && c.ubicable && getTipoCompromiso(c.tipo).enCalle)
        .sort((a, b) => String(a.hora).localeCompare(String(b.hora))),
    [compromisos, fecha]
  );

  const porCercania = useMemo(() => ordenarPorCercania(BASE_OPERATIVA, salidas), [salidas]);
  const porAgenda = useMemo(() => ordenAgendado(BASE_OPERATIVA, salidas), [salidas]);
  const elegida = modo === 'cercania' ? porCercania : porAgenda;

  // La vuelta a la base también son kilómetros: el día no termina en la última
  // visita, termina cuando volvés.
  const vuelta = elegida.orden.length
    ? distanciaKm(elegida.orden[elegida.orden.length - 1], BASE_OPERATIVA)
    : 0;
  const totalKm = elegida.totalKm + vuelta;
  const ahorro = porAgenda.totalKm - porCercania.totalKm;

  const puntos = useMemo(
    () => [
      { ...BASE_OPERATIVA, esBase: true },
      ...elegida.orden.map((p, i) => ({ ...p, nombre: p.cliente || p.titulo, orden: i + 1 })),
    ],
    [elegida.orden]
  );

  const link = linkRutaCompleta(elegida.orden);
  const minutosEnCalle = elegida.orden.reduce((a, p) => a + (Number(p.duracion) || 45), 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <TarjetaKpi
          etiqueta="Salidas del día"
          valor={salidas.length}
          detalle={salidas.length ? 'visitas y entregas ubicadas' : 'día de escritorio'}
          icono={Route}
          tono="naranja"
        />
        <TarjetaKpi
          etiqueta="Kilómetros"
          valor={`${totalKm.toFixed(1)} km`}
          detalle={`ida y vuelta a la base (${vuelta.toFixed(1)} km de regreso)`}
          icono={Navigation}
          tono="azul"
        />
        <TarjetaKpi
          etiqueta="Tiempo de manejo"
          valor={`${minutosDeViaje(totalKm)} min`}
          detalle="a 28 km/h de promedio con tráfico"
          icono={Clock}
          tono="crema"
        />
        <TarjetaKpi
          etiqueta="Con las visitas"
          valor={`${Math.round((minutosDeViaje(totalKm) + minutosEnCalle) / 6) / 10} h`}
          detalle="manejo más el tiempo de cada visita"
          icono={Fuel}
          tono="verde"
        />
      </div>

      {/* ------------------------------ controles ---------------------------- */}
      <Panel sinEncabezado cuerpoClassName="px-5 py-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex overflow-hidden rounded-xl border border-[var(--gm-borde)]">
              {DIAS.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => setDia(d.id)}
                  className={`px-3.5 py-2 text-[13px] font-semibold transition ${
                    dia === d.id ? 'bg-[#FBE5C8] text-[#8A3F11]' : 'bg-white text-[#948A7C] hover:bg-[#FCFAF6]'
                  }`}
                >
                  {d.nombre}
                </button>
              ))}
            </div>

            <div className="flex overflow-hidden rounded-xl border border-[var(--gm-borde)]">
              <button
                type="button"
                onClick={() => setModo('cercania')}
                className={`px-3.5 py-2 text-[12px] font-semibold transition ${
                  modo === 'cercania' ? 'bg-[#FBE5C8] text-[#8A3F11]' : 'bg-white text-[#948A7C] hover:bg-[#FCFAF6]'
                }`}
              >
                Por cercanía
              </button>
              <button
                type="button"
                onClick={() => setModo('agenda')}
                className={`px-3.5 py-2 text-[12px] font-semibold transition ${
                  modo === 'agenda' ? 'bg-[#FBE5C8] text-[#8A3F11]' : 'bg-white text-[#948A7C] hover:bg-[#FCFAF6]'
                }`}
              >
                Por horario
              </button>
            </div>
          </div>

          {link && (
            <a
              href={link}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-[#B4551A] px-3.5 text-[13px] font-medium text-white transition hover:bg-[#8A3F11]"
            >
              <ExternalLink size={14} />
              Abrir la ruta completa en Google Maps
            </a>
          )}
        </div>
      </Panel>

      {ahorro > 0.3 && modo === 'agenda' && (
        <p className="rounded-xl border border-[#CFE0EF] bg-[#F0F6FB] px-4 py-3 text-[13px] leading-relaxed text-[#23557E]">
          Yendo por cercanía en vez de por horario ahorrás{' '}
          <strong className="font-semibold">{ahorro.toFixed(1)} km</strong> y unos{' '}
          {minutosDeViaje(ahorro)} minutos. La agenda no se reordena sola: los horarios están
          acordados con cada cliente y sólo vos sabés cuáles se pueden mover.
        </p>
      )}

      {/* ---------------------------- paradas + mapa ------------------------- */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
        <Panel
          titulo={modo === 'cercania' ? 'Orden más corto' : 'Orden agendado'}
          bajada={
            modo === 'cercania'
              ? 'Desde la base, siempre a la parada más cercana que queda.'
              : 'En el orden en que están los horarios en la agenda.'
          }
          cuerpoClassName={elegida.orden.length ? 'p-0' : 'p-6'}
        >
          {cargando ? (
            <p className="py-16 text-center text-[14px] text-[#948A7C]">Calculando la ruta…</p>
          ) : elegida.orden.length === 0 ? (
            <EstadoVacio
              icono={Route}
              titulo="Sin salidas este día"
              texto="No hay visitas ni entregas agendadas con ubicación. Un día de escritorio."
            />
          ) : (
            <ol className="divide-y divide-[var(--gm-divisor)]">
              <li className="flex items-center gap-3 px-5 py-3">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#F3EDE4] text-[#6E6559]">
                  <Navigation size={14} />
                </span>
                <span className="text-[13px] text-[#6E6559]">
                  Salís de {BASE_OPERATIVA.nombre}
                </span>
              </li>

              {elegida.orden.map((p, i) => {
                const tipo = getTipoCompromiso(p.tipo);
                const cli = p.clienteCodigo ? porCodigo.get(p.clienteCodigo) : null;
                const activo = seleccionado?.codigo === p.codigo || seleccionado?.codigo === cli?.codigo;
                return (
                  <li key={p.codigo}>
                    <button
                      type="button"
                      onClick={() => setSeleccionado(activo ? null : (cli || p))}
                      className={`flex w-full items-start gap-3 px-5 py-3 text-left transition ${
                        activo ? 'bg-[#FBE5C8]' : 'hover:bg-[#FCFAF6]'
                      }`}
                    >
                      <span
                        className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full text-[12px] font-bold text-white"
                        style={{ backgroundColor: tipo.color }}
                      >
                        {i + 1}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[14px] font-medium text-[#2A2118]">
                          {p.cliente || p.titulo}
                        </span>
                        <span className="block truncate text-[12px] text-[#948A7C]">{p.titulo}</span>
                        <span className="text-[11px] text-[var(--gm-texto-medio)]">
                          {p.hora} · {p.localidad || p.direccion || 'sin zona'}
                        </span>
                      </span>
                      <span className="shrink-0 text-right">
                        <span className="block text-[12px] tabular-nums text-[#6E6559]">
                          {p.tramo.toFixed(1)} km
                        </span>
                        <span className="block text-[11px] tabular-nums text-[var(--gm-texto-medio)]">
                          {p.acumulado.toFixed(1)} acum.
                        </span>
                      </span>
                      <a
                        href={linkComoLlegar(p)}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        title="Cómo llegar a esta parada"
                        className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg border border-[var(--gm-borde)] text-[#6E6559] transition hover:bg-white hover:text-[#B4551A]"
                      >
                        <Navigation size={13} />
                      </a>
                    </button>
                  </li>
                );
              })}

              <li className="flex items-center gap-3 px-5 py-3">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#F3EDE4] text-[#6E6559]">
                  <Navigation size={14} className="rotate-180" />
                </span>
                <span className="flex-1 text-[13px] text-[#6E6559]">Volvés a la base</span>
                <span className="text-[12px] tabular-nums text-[#6E6559]">{vuelta.toFixed(1)} km</span>
              </li>
            </ol>
          )}
        </Panel>

        <MapaGm
          puntos={puntos}
          seleccionado={seleccionado}
          onSeleccionar={(p) => setSeleccionado(p.esBase ? null : p)}
          alto="h-[560px]"
          renderPin={(p, activo) =>
            p.esBase ? (
              <span className="grid h-7 w-7 -translate-y-1/2 place-items-center rounded-lg border-2 border-white bg-[#2A2118] text-white shadow-[0_2px_6px_rgba(26,26,24,0.4)]">
                <Navigation size={13} />
              </span>
            ) : (
              <PinMapa
                color={getTipoCompromiso(p.tipo).color}
                activo={activo}
                numero={p.orden}
                etiqueta={p.nombre}
              />
            )
          }
          renderFicha={(sel) => {
            // Igual que en la Agenda: el seleccionado puede venir de la lista
            // (ya es un cliente) o del mapa (es una parada).
            const cli =
              porCodigo.get(sel.codigo) ||
              (sel.clienteCodigo ? porCodigo.get(sel.clienteCodigo) : null);
            return cli ? <FichaCliente cliente={cli} onCerrar={() => setSeleccionado(null)} /> : null;
          }}
        />
      </div>

      {salidas.length > 6 && (
        <p className="flex items-start gap-2 px-1 text-[12px] leading-relaxed text-[var(--gm-texto-medio)]">
          <TriangleAlert size={14} className="mt-0.5 shrink-0" />
          Con más de seis paradas el orden por cercanía deja de ser confiable: se va a la más
          próxima cada vez, sin mirar el recorrido completo. Con esta cantidad conviene revisarlo a
          ojo sobre el mapa antes de salir.
        </p>
      )}
    </div>
  );
}
