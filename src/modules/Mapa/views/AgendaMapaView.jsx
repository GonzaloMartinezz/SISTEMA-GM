// ============================================================================
// SISTEMA GM · M-06 MAPA Y LOGÍSTICA · LA AGENDA SOBRE EL MAPA
// ----------------------------------------------------------------------------
// La pregunta que contesta: "¿qué me toca y dónde queda?".
//
// La agenda del Módulo 5 te dice a qué hora; esta pantalla te dice además en
// qué punto del mapa. Son la misma información mirada distinto, y por eso lee
// la misma tabla: acá no se carga nada, se ve lo que ya está agendado.
//
// Cada línea está escrita como una orden —"Visitar a Torres, Marcela",
// "Llamar a Paz, Rodrigo"— y no como un sustantivo, porque es una lista de
// cosas para hacer, no un informe de lo que hay.
// ============================================================================

import React, { useMemo, useState } from 'react';
import {
  CalendarRange, MapPinOff, Navigation, Route, Users,
} from 'lucide-react';
import Panel from '../../../shared/gm-ui/Panel';
import Chip from '../../../shared/gm-ui/Chip';
import EstadoVacio from '../../../shared/gm-ui/EstadoVacio';
import FilaEstadisticas from '../../../shared/gm-ui/FilaEstadisticas';
import { ESTADO_COLOR } from '../../../shared/gm-ui/tokens';
import { useMapa, hoyIso, sumarDias } from '../context/MapaContext';
import {
  HORIZONTES, getHorizonte, getTipoCompromiso, getEstado, linkComoLlegar, linkRutaCompleta,
} from '../config/mapa.config';
import MapaGm from '../components/MapaGm';
import PinMapa from '../components/PinMapa';
import FichaCliente from '../components/FichaCliente';

const diaLargo = (iso) => {
  const hoy = hoyIso();
  if (iso === hoy) return 'Hoy';
  if (iso === sumarDias(hoy, 1)) return 'Mañana';
  const [a, m, d] = iso.split('-').map(Number);
  return new Date(a, m - 1, d).toLocaleDateString('es-AR', {
    weekday: 'long', day: 'numeric', month: 'long',
  });
};

export default function AgendaMapaView() {
  const { compromisos, porCodigo, cargando, seleccionado, setSeleccionado } = useMapa();
  const [horizonteId, setHorizonteId] = useState('manana');
  const horizonte = getHorizonte(horizonteId);

  const { desde, hasta } = useMemo(() => {
    const hoy = hoyIso();
    if (horizonteId === 'hoy') return { desde: hoy, hasta: hoy };
    if (horizonteId === 'manana') {
      const m = sumarDias(hoy, 1);
      return { desde: m, hasta: m };
    }
    return { desde: hoy, hasta: sumarDias(hoy, horizonte.dias) };
  }, [horizonteId, horizonte.dias]);

  const delRango = useMemo(
    () => compromisos.filter((c) => c.fecha >= desde && c.fecha <= hasta),
    [compromisos, desde, hasta]
  );

  /** Agrupados por día, cada día ordenado por hora. */
  const dias = useMemo(() => {
    const mapa = new Map();
    delRango.forEach((c) => {
      if (!mapa.has(c.fecha)) mapa.set(c.fecha, []);
      mapa.get(c.fecha).push(c);
    });
    return [...mapa.entries()]
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([fecha, lista]) => ({
        fecha,
        lista: lista.sort((x, y) => String(x.hora).localeCompare(String(y.hora))),
      }));
  }, [delRango]);

  const ubicables = delRango.filter((c) => c.ubicable);
  const sinUbicar = delRango.filter((c) => !c.ubicable);
  const visitas = delRango.filter((c) => getTipoCompromiso(c.tipo).enCalle);
  const clientesDistintos = new Set(delRango.map((c) => c.clienteCodigo).filter(Boolean)).size;

  /** Un punto por compromiso ubicable, numerado en el orden del día. */
  const puntos = useMemo(
    () =>
      ubicables.map((c, i) => ({
        ...c,
        // El mapa identifica por `codigo`: dos compromisos del mismo cliente
        // son dos puntos distintos, y tienen que poder seleccionarse aparte.
        codigo: c.codigo,
        nombre: c.cliente || c.titulo,
        orden: i + 1,
      })),
    [ubicables]
  );

  const linkRuta = linkRutaCompleta(visitas.filter((c) => c.ubicable));

  const estadisticas = [
    { etiqueta: 'Para hacer', valor: delRango.length, detalle: horizonte.nombre.toLowerCase() },
    { etiqueta: 'Salidas', valor: visitas.length, detalle: 'te obligan a moverte' },
    {
      etiqueta: 'De escritorio',
      valor: delRango.length - visitas.length,
      detalle: 'llamadas, mensajes y mails',
    },
    { etiqueta: 'Clientes', valor: clientesDistintos, detalle: 'distintos en el período' },
    { etiqueta: 'Días con algo', valor: dias.length, detalle: 'del rango elegido' },
    {
      etiqueta: 'Sin ubicar',
      valor: sinUbicar.length,
      detalle: sinUbicar.length ? 'no se pueden poner en el mapa' : 'todos ubicados',
      color: sinUbicar.length ? ESTADO_COLOR.atencion : undefined,
    },
  ];

  return (
    <div className="space-y-6">
      <Panel sinEncabezado cuerpoClassName="p-0">
        <FilaEstadisticas items={estadisticas} />
      </Panel>

      {/* ------------------------------ horizonte ---------------------------- */}
      <Panel sinEncabezado cuerpoClassName="px-5 py-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex overflow-hidden rounded-xl border border-[var(--gm-borde)]">
            {HORIZONTES.map((h) => (
              <button
                key={h.id}
                type="button"
                onClick={() => setHorizonteId(h.id)}
                className={`px-4 py-2 text-[13px] font-semibold transition ${
                  horizonteId === h.id
                    ? 'bg-[#FBE5C8] text-[#8A3F11]'
                    : 'bg-white text-[#948A7C] hover:bg-[#FCFAF6]'
                }`}
              >
                {h.nombre}
              </button>
            ))}
          </div>

          {linkRuta && (
            <a
              href={linkRuta}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-[#B4551A] px-3.5 text-[13px] font-medium text-white transition hover:bg-[#8A3F11]"
            >
              <Route size={14} />
              Abrir las {visitas.length} salidas en Google Maps
            </a>
          )}
        </div>
      </Panel>

      {/* --------------------------- lista + mapa ---------------------------- */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
        <Panel
          titulo={`Qué te toca · ${horizonte.nombre.toLowerCase()}`}
          bajada="Sale de la Agenda del Módulo 5. Acá no se carga nada: se ve dónde queda cada cosa."
          acciones={<CalendarRange size={16} className="text-[var(--gm-texto-medio)]" />}
          cuerpoClassName="p-0"
        >
          {cargando ? (
            <p className="py-16 text-center text-[14px] text-[#948A7C]">Buscando lo agendado…</p>
          ) : dias.length === 0 ? (
            <EstadoVacio
              icono={CalendarRange}
              titulo={`Nada agendado ${horizonte.nombre.toLowerCase()}`}
              texto="Agendá los compromisos desde el Módulo 5 y van a aparecer acá con su punto en el mapa."
            />
          ) : (
            <div className="max-h-[560px] overflow-y-auto">
              {dias.map(({ fecha, lista }) => (
                <section key={fecha}>
                  <header className="sticky top-0 z-10 flex items-baseline gap-2 border-b border-[var(--gm-borde-fuerte)] bg-[#FCFAF6] px-5 py-2">
                    <h3 className="text-[12px] font-semibold capitalize text-[#2A2118]">
                      {diaLargo(fecha)}
                    </h3>
                    <span className="text-[11px] text-[var(--gm-texto-medio)]">
                      {lista.length} {lista.length === 1 ? 'cosa' : 'cosas'}
                    </span>
                  </header>

                  <ul className="divide-y divide-[var(--gm-divisor)]">
                    {lista.map((c) => {
                      const tipo = getTipoCompromiso(c.tipo);
                      const activo = seleccionado?.codigo === c.codigo;
                      const numero = puntos.find((p) => p.codigo === c.codigo)?.orden;
                      const cli = c.clienteCodigo ? porCodigo.get(c.clienteCodigo) : null;

                      return (
                        <li key={c.codigo}>
                          <button
                            type="button"
                            onClick={() => setSeleccionado(activo ? null : (cli || c))}
                            className={`flex w-full items-start gap-3 px-5 py-3 text-left transition ${
                              activo ? 'bg-[#FBE5C8]' : 'hover:bg-[#FCFAF6]'
                            }`}
                          >
                            <span
                              className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-xl"
                              style={{ backgroundColor: `${tipo.color}1A`, color: tipo.color }}
                            >
                              <tipo.icono size={15} />
                            </span>

                            <span className="min-w-0 flex-1">
                              <span className="block text-[14px] font-medium text-[#2A2118]">
                                {tipo.nombre} a {c.cliente || 'sin cliente'}
                              </span>
                              <span className="block truncate text-[12px] text-[#948A7C]">
                                {c.titulo}
                              </span>
                              <span className="mt-1 flex flex-wrap items-center gap-1.5">
                                <span className="text-[11px] tabular-nums text-[var(--gm-texto-medio)]">
                                  {c.hora}
                                </span>
                                {c.localidad && (
                                  <span className="text-[11px] text-[var(--gm-texto-medio)]">· {c.localidad}</span>
                                )}
                                {!c.ubicable && (
                                  <Chip tono="amarillo">sin ubicación</Chip>
                                )}
                                {c.heredada && (
                                  <span
                                    className="text-[11px] text-[var(--gm-texto-medio)]"
                                    title="El compromiso no tenía coordenadas: se usa la del cliente"
                                  >
                                    · ubicado por el cliente
                                  </span>
                                )}
                              </span>
                            </span>

                            <span className="flex shrink-0 flex-col items-end gap-1.5">
                              {numero != null && (
                                <span
                                  className="grid h-5 w-5 place-items-center rounded-full text-[10px] font-bold text-white"
                                  style={{ backgroundColor: tipo.color }}
                                >
                                  {numero}
                                </span>
                              )}
                              {c.ubicable && tipo.enCalle && (
                                <a
                                  href={linkComoLlegar(c)}
                                  target="_blank"
                                  rel="noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  title="Cómo llegar"
                                  className="grid h-7 w-7 place-items-center rounded-lg border border-[var(--gm-borde)] text-[#6E6559] transition hover:bg-white hover:text-[#B4551A]"
                                >
                                  <Navigation size={13} />
                                </a>
                              )}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              ))}
            </div>
          )}
        </Panel>

        <div className="space-y-4">
          <MapaGm
            puntos={puntos}
            seleccionado={seleccionado}
            onSeleccionar={setSeleccionado}
            alto="h-[560px]"
            renderPin={(p, activo) => {
              const tipo = getTipoCompromiso(p.tipo);
              return (
                <PinMapa
                  color={tipo.color}
                  activo={activo}
                  numero={p.orden}
                  enCalle={tipo.enCalle}
                  etiqueta={`${tipo.nombre} · ${p.nombre}`}
                />
              );
            }}
            renderFicha={(sel) => {
              // `sel` puede ser un cliente (vino de la lista) o un compromiso
              // (se tocó un pin). En los dos casos la ficha útil es la del
              // cliente; si el compromiso no tiene cliente en el mapa, se arma
              // con lo que el propio compromiso sabe, sin campos de relleno.
              const cli =
                porCodigo.get(sel.codigo) ||
                (sel.clienteCodigo ? porCodigo.get(sel.clienteCodigo) : null) ||
                (Number.isFinite(sel.lat)
                  ? {
                      codigo: sel.codigo,
                      nombre: sel.cliente || sel.titulo,
                      titular: null,
                      rubro: null,
                      estado: 'lead',
                      localidad: sel.localidad || 'Sin zona',
                      direccion: sel.direccion,
                      lat: sel.lat,
                      lng: sel.lng,
                      montoEnJuego: 0,
                      ultimaVisita: null,
                      proximoTipo: sel.tipo,
                      proximaFecha: sel.fecha,
                      proximoTitulo: sel.titulo,
                      telefono: null,
                      celular: null,
                      email: null,
                    }
                  : null);
              return cli ? <FichaCliente cliente={cli} onCerrar={() => setSeleccionado(null)} /> : null;
            }}
          />

          {sinUbicar.length > 0 && (
            <p className="flex items-start gap-2 rounded-xl border border-[#EDE0CB] bg-[#FCF6EC] px-4 py-3 text-[13px] leading-relaxed text-[#7A5600]">
              <MapPinOff size={15} className="mt-0.5 shrink-0" />
              {sinUbicar.length === 1
                ? 'Hay 1 compromiso que no se puede ubicar'
                : `Hay ${sinUbicar.length} compromisos que no se pueden ubicar`}{' '}
              porque ni ellos ni su cliente tienen coordenadas. Están en la lista, pero no en el mapa.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
