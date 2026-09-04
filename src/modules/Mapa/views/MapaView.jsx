// ============================================================================
// SISTEMA GM · M-07 MAPA Y LOGÍSTICA · EL MAPA
// ----------------------------------------------------------------------------
// La pantalla principal: la lista a la izquierda, el mapa a la derecha, y los
// dos apuntando al mismo cliente. Tocás en la lista y el mapa lo va a buscar;
// tocás un pin y la lista lo marca.
//
// La lista existe además del mapa porque un mapa no sirve para barrer: para
// "¿a quién de Yerba Buena hace más de un mes que no visito?" hace falta una
// lista ordenada, y para "¿me queda de paso?" hace falta el mapa. Las dos cosas
// son la misma pregunta mirada distinto.
// ============================================================================

import React, { useMemo } from 'react';
import { MapPinOff, Users, Navigation, TriangleAlert, Wallet } from 'lucide-react';
import Panel from '../../../shared/gm-ui/Panel';
import TarjetaKpi from '../../../shared/gm-ui/TarjetaKpi';
import EstadoVacio from '../../../shared/gm-ui/EstadoVacio';
import { useMapa, diasDesde } from '../context/MapaContext';
import { ESTADOS, getEstado, DIAS_ABANDONO } from '../config/mapa.config';
import MapaGm from '../components/MapaGm';
import PinMapa from '../components/PinMapa';
import FichaCliente from '../components/FichaCliente';
import FiltrosMapa from '../components/FiltrosMapa';

const usd = (v) => `US$ ${Math.round(Number(v || 0)).toLocaleString('es-AR')}`;

export default function MapaView() {
  const {
    clientes, clientesFiltrados, sinCoordenadas, cargando,
    seleccionado, setSeleccionado, hayFiltro,
  } = useMapa();

  const conteoEstado = useMemo(() => {
    const c = {};
    Object.keys(ESTADOS).forEach((k) => {
      c[k] = clientes.filter((x) => x.estado === k).length;
    });
    return c;
  }, [clientes]);

  const conteoRubro = useMemo(() => {
    const c = {};
    clientes.forEach((x) => {
      c[x.rubro] = (c[x.rubro] || 0) + 1;
    });
    return c;
  }, [clientes]);

  const olvidados = clientes.filter((c) => {
    const d = diasDesde(c.ultimaVisita);
    return d == null || d >= DIAS_ABANDONO;
  });
  const enJuego = clientes.reduce((a, c) => a + c.montoEnJuego, 0);
  const zonas = new Set(clientes.map((c) => c.localidad)).size;

  return (
    <div className="space-y-6">
      {/* ----------------------------- indicadores --------------------------- */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <TarjetaKpi
          etiqueta="Clientes en el mapa"
          valor={clientes.length}
          detalle={
            sinCoordenadas
              ? `${sinCoordenadas} sin coordenadas, no se pueden ubicar`
              : 'todos tienen su ubicación cargada'
          }
          icono={Users}
          tono="azul"
        />
        <TarjetaKpi
          etiqueta="Zonas cubiertas"
          valor={zonas}
          detalle="localidades con al menos un cliente"
          icono={Navigation}
          tono="naranja"
        />
        <TarjetaKpi
          etiqueta="En juego"
          valor={usd(enJuego)}
          detalle="ventas abiertas de estos clientes"
          icono={Wallet}
          tono="verde"
        />
        <TarjetaKpi
          etiqueta="Sin visitar"
          valor={olvidados.length}
          detalle={`nunca, o hace más de ${DIAS_ABANDONO} días`}
          icono={TriangleAlert}
          tono="crema"
        />
      </div>

      {/* ------------------------------- filtros ----------------------------- */}
      <Panel sinEncabezado cuerpoClassName="px-5 py-4">
        <FiltrosMapa conteoEstado={conteoEstado} conteoRubro={conteoRubro} />
      </Panel>

      {sinCoordenadas > 0 && (
        <p className="flex items-start gap-2 rounded-xl border border-[#EDE0CB] bg-[#FCF6EC] px-4 py-3 text-[13px] leading-relaxed text-[#7A5600]">
          <MapPinOff size={15} className="mt-0.5 shrink-0" />
          {sinCoordenadas === 1
            ? 'Hay 1 cliente activo sin latitud y longitud, así que no aparece en el mapa.'
            : `Hay ${sinCoordenadas} clientes activos sin latitud y longitud, así que no aparecen en el mapa.`}{' '}
          Se cargan desde la ficha del cliente en el Módulo 1, o desde la planilla CLIENTES del Drive.
        </p>
      )}

      {/* ---------------------------- lista + mapa --------------------------- */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
        <Panel
          titulo={hayFiltro ? `${clientesFiltrados.length} de ${clientes.length} clientes` : 'Todos los clientes'}
          bajada="Ordenados por lo que hace más tiempo que no visitás."
          cuerpoClassName="p-0"
        >
          {cargando ? (
            <p className="py-16 text-center text-[14px] text-[#948A7C]">Ubicando a los clientes…</p>
          ) : clientesFiltrados.length === 0 ? (
            <EstadoVacio
              titulo="Ningún cliente con esos filtros"
              texto="Probá limpiando los filtros o buscando otra cosa."
            />
          ) : (
            <ul className="max-h-[520px] divide-y divide-[#F4EFE7] overflow-y-auto">
              {clientesFiltrados
                .slice()
                .sort((a, b) => (diasDesde(b.ultimaVisita) ?? 9999) - (diasDesde(a.ultimaVisita) ?? 9999))
                .map((c) => {
                  const estado = getEstado(c.estado);
                  const dias = diasDesde(c.ultimaVisita);
                  const activo = seleccionado?.codigo === c.codigo;
                  return (
                    <li key={c.codigo}>
                      <button
                        type="button"
                        onClick={() => setSeleccionado(activo ? null : c)}
                        className={`flex w-full items-start gap-3 px-5 py-3 text-left transition ${
                          activo ? 'bg-[#FBE5C8] dark:bg-orange-900/40' : 'hover:bg-[#FCFAF6] dark:hover:bg-white/5'
                        }`}
                      >
                        <span
                          className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full"
                          style={{ backgroundColor: estado.color }}
                        />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[14px] font-medium text-[#2A2118] dark:text-[#F9FAFB]">
                            {c.nombre}
                          </span>
                          <span className="block truncate text-[12px] text-[#948A7C]">
                            {c.localidad} · {c.rubro}
                          </span>
                        </span>
                        <span className="shrink-0 text-right">
                          <span
                            className={`block text-[12px] ${
                              dias == null || dias >= DIAS_ABANDONO ? 'text-[#B4551A]' : 'text-[#6E6559] dark:text-[#9CA3AF]'
                            }`}
                          >
                            {dias == null ? 'nunca' : dias === 0 ? 'hoy' : `${dias}d`}
                          </span>
                          {c.montoEnJuego > 0 && (
                            <span className="block text-[11px] text-[#B0A697] dark:text-[#6B7280]">{usd(c.montoEnJuego)}</span>
                          )}
                        </span>
                      </button>
                    </li>
                  );
                })}
            </ul>
          )}
        </Panel>

        <MapaGm
          puntos={clientesFiltrados}
          seleccionado={seleccionado}
          onSeleccionar={setSeleccionado}
          alto="h-[604px]"
          renderPin={(p, activo) => (
            <PinMapa color={getEstado(p.estado).color} activo={activo} etiqueta={p.nombre} />
          )}
          renderFicha={(c) => <FichaCliente cliente={c} onCerrar={() => setSeleccionado(null)} />}
        />
      </div>
    </div>
  );
}
