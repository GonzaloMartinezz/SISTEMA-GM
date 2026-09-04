// ============================================================================
// SISTEMA GM · M-07 MAPA Y LOGÍSTICA · COBERTURA POR ZONA
// ----------------------------------------------------------------------------
// Esta pantalla no la pediste; la agrego porque es la pregunta que un mapa
// contesta y una lista no: qué zona estás dejando de lado.
//
// Una zona se mide por su cliente MÁS OLVIDADO, no por el promedio. Un promedio
// bajo esconde al que hace tres meses que nadie visita, que es justamente el
// que se está por perder. Y los que nunca fueron visitados cuentan como el peor
// caso posible, no como un dato faltante que se ignora.
// ============================================================================

import React, { useMemo } from 'react';
import { LayoutGrid, MapPin, TriangleAlert, Users, Wallet } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Panel from '../../../shared/gm-ui/Panel';
import Chip from '../../../shared/gm-ui/Chip';
import EstadoVacio from '../../../shared/gm-ui/EstadoVacio';
import FilaEstadisticas from '../../../shared/gm-ui/FilaEstadisticas';
import { ESTADO_COLOR } from '../../../shared/gm-ui/tokens';
import { useMapa, diasDesde } from '../context/MapaContext';
import { DIAS_ABANDONO, getEstado } from '../config/mapa.config';
import MapaGm from '../components/MapaGm';
import PinMapa from '../components/PinMapa';
import FichaCliente from '../components/FichaCliente';

const usd = (v) => `US$ ${Math.round(Number(v || 0)).toLocaleString('es-AR')}`;

export default function CoberturaView() {
  const {
    zonas, clientes, cargando, seleccionado, setSeleccionado, zonaActiva, setZonaActiva,
  } = useMapa();

  const navigate = useNavigate();

  const abandonadas = zonas.filter((z) => z.abandonada);
  const enRiesgo = abandonadas.reduce((a, z) => a + z.monto, 0);
  const nuncaVisitados = clientes.filter((c) => !c.ultimaVisita).length;
  const maxMonto = Math.max(...zonas.map((z) => z.monto), 1);

  const puntos = useMemo(
    () => (zonaActiva ? clientes.filter((c) => c.localidad === zonaActiva) : clientes),
    [clientes, zonaActiva]
  );

  const estadisticas = [
    { etiqueta: 'Zonas', valor: zonas.length, detalle: 'localidades con clientes' },
    { etiqueta: 'Clientes ubicados', valor: clientes.length, detalle: 'en todas las zonas' },
    {
      etiqueta: 'Zonas descuidadas',
      valor: abandonadas.length,
      detalle: `alguien sin visitar hace +${DIAS_ABANDONO} días`,
      color: abandonadas.length ? ESTADO_COLOR.atencion : undefined,
    },
    {
      etiqueta: 'Nunca visitados',
      valor: nuncaVisitados,
      detalle: 'sin una sola visita registrada',
      color: nuncaVisitados ? ESTADO_COLOR.critico : undefined,
    },
    {
      etiqueta: 'En juego ahí',
      valor: usd(enRiesgo),
      detalle: 'ventas abiertas en zonas descuidadas',
      color: enRiesgo > 0 ? ESTADO_COLOR.riesgo : undefined,
    },
    {
      etiqueta: 'Zona más fuerte',
      valor: zonas[0]?.zona?.split(' ')[0] || '—',
      detalle: zonas[0] ? `${usd(zonas[0].monto)} en juego` : 'sin datos',
    },
  ];

  return (
    <div className="space-y-6">
      <Panel sinEncabezado cuerpoClassName="p-0">
        <FilaEstadisticas items={estadisticas} />
      </Panel>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
        <Panel
          titulo="Zonas"
          bajada="Ordenadas por la plata que hay en juego. Tocá una para verla sola en el mapa."
          acciones={<LayoutGrid size={16} className="text-[#B0A697] dark:text-[#6B7280]" />}
          cuerpoClassName={zonas.length ? 'p-0' : 'p-6'}
        >
          {cargando ? (
            <p className="py-16 text-center text-[14px] text-[#948A7C]">Agrupando por zona…</p>
          ) : zonas.length === 0 ? (
            <EstadoVacio
              titulo="Sin clientes ubicados"
              texto="Cargá latitud y longitud en las fichas de clientes para ver la cobertura."
            />
          ) : (
            <ul className="divide-y divide-[#F4EFE7]">
              {zonas.map((z) => {
                const activa = zonaActiva === z.zona;
                return (
                  <li key={z.zona}>
                    <button
                      type="button"
                      onClick={() => setZonaActiva(activa ? null : z.zona)}
                      className={`w-full px-5 py-4 text-left transition ${
                        activa ? 'bg-[#FBE5C8] dark:bg-[#2A1608]' : 'hover:bg-[#FCFAF6] dark:hover:bg-[#2D2D2D]'
                      }`}
                    >
                      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                        <span className="text-[14px] font-semibold text-[#2A2118] dark:text-[#F9FAFB]">{z.zona}</span>
                        <span className="text-[12px] text-[#948A7C]">
                          {z.total} {z.total === 1 ? 'cliente' : 'clientes'}
                        </span>
                        {z.enMora > 0 && <Chip tono="rosa">{z.enMora} en mora</Chip>}
                        {z.abandonada && (
                          <Chip tono="amarillo">
                            {z.nuncaVisitados > 0
                              ? `${z.nuncaVisitados} sin visitar nunca`
                              : `${z.masOlvidado} días sin pasar`}
                          </Chip>
                        )}
                        <span className="ml-auto text-[14px] font-semibold text-[#2A2118] dark:text-[#F9FAFB]">
                          {usd(z.monto)}
                        </span>
                      </div>

                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#F3EDE4] dark:bg-[#121212]">
                        <span
                          className="block h-full rounded-full"
                          style={{
                            width: `${(z.monto / maxMonto) * 100}%`,
                            backgroundColor: z.abandonada ? ESTADO_COLOR.atencion : ESTADO_COLOR.bien,
                          }}
                        />
                      </div>

                      <p className="mt-1.5 flex flex-wrap items-center gap-x-3 text-[11px] text-[#B0A697] dark:text-[#6B7280]">
                        <span>{z.conVenta} con venta abierta</span>
                        <span>·</span>
                        <span>
                          {z.compromisos} {z.compromisos === 1 ? 'agendado' : 'agendados'}
                        </span>
                        <span>·</span>
                        <span>
                          {z.masOlvidado == null
                            ? 'nunca visitada'
                            : `el más olvidado hace ${z.masOlvidado} días`}
                        </span>
                      </p>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </Panel>

        <div className="space-y-4">
          <MapaGm
            puntos={puntos}
            seleccionado={seleccionado}
            onSeleccionar={setSeleccionado}
            alto="h-[480px]"
            renderPin={(p, activo) => {
              const d = diasDesde(p.ultimaVisita);
              const olvidado = d == null || d >= DIAS_ABANDONO;
              return (
                <PinMapa
                  color={olvidado ? ESTADO_COLOR.atencion : getEstado(p.estado).color}
                  activo={activo}
                  etiqueta={p.nombre}
                />
              );
            }}
            renderFicha={(c) => <FichaCliente cliente={c} onCerrar={() => setSeleccionado(null)} />}
          />

          <Panel
            titulo="Los más olvidados"
            bajada={`Sin visitar nunca, o hace más de ${DIAS_ABANDONO} días.`}
            acciones={<TriangleAlert size={16} className="text-[#B0A697] dark:text-[#6B7280]" />}
            cuerpoClassName="p-0"
          >
            {(() => {
              const lista = clientes
                .map((c) => ({ c, d: diasDesde(c.ultimaVisita) }))
                .filter((x) => x.d == null || x.d >= DIAS_ABANDONO)
                .sort((a, b) => (b.d ?? 99999) - (a.d ?? 99999))
                .slice(0, 6);

              return lista.length === 0 ? (
                <EstadoVacio
                  icono={Users}
                  titulo="Ninguno olvidado"
                  texto={`Todos los clientes tuvieron una visita en los últimos ${DIAS_ABANDONO} días.`}
                />
              ) : (
                <ul className="divide-y divide-[#F4EFE7]">
                  {lista.map(({ c, d }) => (
                    <li key={c.codigo}>
                      <button
                        type="button"
                        onClick={() => setSeleccionado(c)}
                        className="flex w-full items-center gap-3 px-5 py-3 text-left transition hover:bg-[#FCFAF6] dark:hover:bg-[#2D2D2D]"
                      >
                        <MapPin size={14} className="shrink-0 text-[#B0A697] dark:text-[#6B7280]" />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[13px] font-medium text-[#2A2118] dark:text-[#F9FAFB]">
                            {c.nombre}
                          </span>
                          <span className="block truncate text-[11px] text-[#948A7C]">
                            {c.localidad}
                          </span>
                        </span>
                        <span className="shrink-0 text-right">
                          <span className="block text-[12px] text-[#B4551A]">
                            {d == null ? 'nunca' : `${d} días`}
                          </span>
                          {c.montoEnJuego > 0 && (
                            <span className="block text-[11px] text-[#B0A697] dark:text-[#6B7280]">
                              {usd(c.montoEnJuego)}
                            </span>
                          )}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              );
            })()}
          </Panel>
        </div>
      </div>

      <p className="flex items-start gap-2 px-1 text-[12px] leading-relaxed text-[#B0A697] dark:text-[#6B7280]">
        <Wallet size={14} className="mt-0.5 shrink-0" />
        La última visita sale de los compromisos de tipo visita marcados cumplidos en la Agenda. Si
        vas a ver a alguien y no lo cerrás ahí, para el sistema esa visita no ocurrió y la zona va a
        aparecer más descuidada de lo que está.
        <button
          type="button"
          onClick={() => navigate('/agenda-logistica/hoy')}
          className="font-medium text-[#B4551A] underline-offset-2 hover:underline"
        >
          Ir a la Agenda
        </button>
      </p>
    </div>
  );
}
