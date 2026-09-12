// ============================================================================
// SISTEMA GM · M-03 SEGUIMIENTOS · FILTROS DE PROCESO
// ----------------------------------------------------------------------------
// La pantalla del día a día. Dos formas de mirar lo mismo:
//   · Tablero: para mover cosas de lugar (arrastrando).
//   · Lista:   para barrer toda la cartera de un vistazo, con el recorrido de
//              cada venta dibujado en la fila.
// La lista existe porque a partir de unos veinte leads el tablero obliga a
// scrollear cinco columnas para responder "¿a quién le debo una respuesta?".
// ============================================================================

import React, { useMemo, useState } from 'react';
import {
  Users, Wallet, Target, Snowflake, Plus, LayoutGrid, Rows3,
} from 'lucide-react';
import Panel from '../../../shared/gm-ui/Panel';
import TarjetaKpi from '../../../shared/gm-ui/TarjetaKpi';
import Tabla from '../../../shared/gm-ui/Tabla';
import Chip from '../../../shared/gm-ui/Chip';
import BotonGm from '../../../shared/gm-ui/BotonGm';
import Avatar from '../../../shared/gm-ui/Avatar';
import FormularioGm from '../../../shared/gm-ui/FormularioGm';
import ConfirmarGm from '../../../shared/gm-ui/ConfirmarGm';
import EstadoVacio from '../../../shared/gm-ui/EstadoVacio';
import { useSeguimientos } from '../context/SeguimientosContext';
import { ETAPAS, getEtapa, getPrioridad } from '../config/pipeline.config';
import { CAMPOS_LEAD, aFormularioLead } from '../config/lead.form';
import FiltrosProceso from '../components/FiltrosProceso';
import ColumnaEtapa from '../components/ColumnaEtapa';
import PasosEtapa from '../components/PasosEtapa';
import { ChipTemperatura } from '../components/ChipEtapa';
import ModalMensaje from '../components/ModalMensaje';

const usd = (v) => `US$ ${Math.round(Number(v || 0)).toLocaleString('es-AR')}`;

const VISTAS = [
  { id: 'tablero', nombre: 'Tablero', icono: LayoutGrid },
  { id: 'lista', nombre: 'Lista', icono: Rows3 },
];

export default function PipelineView() {
  const {
    leads, cargando, metricas, etapasVisibles, plantillas,
    marcarContacto, guardarLead, borrarLead,
  } = useSeguimientos();

  const [vista, setVista] = useState('tablero');
  const [editando, setEditando] = useState(null); // 'nuevo' | lead
  const [borrando, setBorrando] = useState(null);
  const [mensaje, setMensaje] = useState(null); // { lead, canal }

  const porEtapa = useMemo(() => {
    const mapa = Object.fromEntries(ETAPAS.map((e) => [e.id, []]));
    leads.forEach((l) => {
      if (mapa[l.etapa]) mapa[l.etapa].push(l);
    });
    return mapa;
  }, [leads]);

  const conteo = useMemo(
    () => Object.fromEntries(ETAPAS.map((e) => [e.id, porEtapa[e.id].length])),
    [porEtapa]
  );

  const columnas = ETAPAS.filter((e) => etapasVisibles.includes(e.id));

  // Ordenada por urgencia: primero lo que hace más días que no se toca.
  const filasLista = useMemo(
    () =>
      leads
        .filter((l) => etapasVisibles.includes(l.etapa))
        .slice()
        .sort((a, b) => (b.diasSinContacto || 0) - (a.diasSinContacto || 0)),
    [leads, etapasVisibles]
  );

  const COLUMNAS_TABLA = [
    {
      clave: 'lead',
      titulo: 'Lead',
      ancho: '25%',
      render: (l) => (
        <div className="flex items-center gap-3">
          <Avatar nombre={`${l.nombre} ${l.apellido}`} tamano="sm" />
          <div className="min-w-0">
            <p className="truncate font-medium text-[var(--gm-texto)]">
              {l.apellido}, {l.nombre}
            </p>
            <p className="truncate text-[12px] text-[var(--gm-texto-suave)]">
              {l.id} · {l.clinica}
            </p>
          </div>
        </div>
      ),
    },
    {
      clave: 'recorrido',
      titulo: 'Recorrido de la venta',
      ancho: '23%',
      render: (l) => (
        <div className="flex items-center gap-3">
          <PasosEtapa etapa={l.etapa} tamano="sm" />
          <span className="whitespace-nowrap text-[12px] text-[var(--gm-texto-medio)]">
            {getEtapa(l.etapa).nombre}
          </span>
        </div>
      ),
    },
    {
      clave: 'equipo',
      titulo: 'Equipo',
      ancho: '18%',
      render: (l) => (
        <span className="block truncate text-[13px] text-[var(--gm-texto-medio)]">{l.equipo || '—'}</span>
      ),
    },
    {
      clave: 'montoUsd',
      titulo: 'Monto',
      ancho: '11%',
      render: (l) => <span className="font-semibold">{usd(l.montoUsd)}</span>,
    },
    {
      clave: 'temperatura',
      titulo: 'Contacto',
      ancho: '12%',
      render: (l) => <ChipTemperatura dias={l.diasSinContacto} />,
    },
    {
      clave: 'prioridad',
      titulo: 'Prioridad',
      ancho: '11%',
      render: (l) => <Chip tono={getPrioridad(l.prioridad).tono}>{getPrioridad(l.prioridad).nombre}</Chip>,
    },
  ];

  return (
    <div className="space-y-6">
      {/* ----------------------------- indicadores --------------------------- */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <TarjetaKpi
          etiqueta="Oportunidades"
          valor={metricas.total}
          detalle={`${metricas.abiertos} ${metricas.abiertos === 1 ? 'abierta' : 'abiertas'} · ${metricas.cerrados} ${metricas.cerrados === 1 ? 'cerrada' : 'cerradas'}`}
          icono={Users}
          tono="azul"
        />
        <TarjetaKpi
          etiqueta="Valor de cartera"
          valor={usd(metricas.valor)}
          detalle="suma de todo lo que está en juego"
          icono={Wallet}
          tono="naranja"
        />
        <TarjetaKpi
          etiqueta="Ponderado"
          valor={usd(metricas.ponderado)}
          detalle="cada monto por la probabilidad de su etapa"
          icono={Target}
          tono="verde"
        />
        <TarjetaKpi
          etiqueta="Enfriándose"
          valor={metricas.frios}
          detalle="más de 7 días sin contacto"
          icono={Snowflake}
          tono="crema"
        />
      </div>

      {/* ------------------------- filtros y vista --------------------------- */}
      <Panel sinEncabezado cuerpoClassName="px-5 py-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <FiltrosProceso conteo={conteo} />

          <div className="flex items-center gap-2">
            <div className="flex overflow-hidden rounded-xl border border-[var(--gm-borde)]">
              {VISTAS.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setVista(v.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-2 text-[12px] font-semibold transition ${
                    vista === v.id
                      ? 'bg-[var(--gm-acento-suave-bg)] text-[var(--gm-acento-fuerte)]'
                      : 'bg-[var(--gm-superficie)] text-[var(--gm-texto-suave)] hover:bg-[var(--gm-superficie-suave)]'
                  }`}
                >
                  <v.icono size={14} />
                  {v.nombre}
                </button>
              ))}
            </div>
            <BotonGm variante="solido" tamano="sm" icono={Plus} onClick={() => setEditando('nuevo')}>
              Nuevo lead
            </BotonGm>
          </div>
        </div>
      </Panel>

      {/* ------------------------------ contenido ---------------------------- */}
      {cargando ? (
        <Panel sinEncabezado>
          <p className="py-16 text-center text-[14px] text-[var(--gm-texto-suave)]">Cargando el pipeline…</p>
        </Panel>
      ) : columnas.length === 0 ? (
        <Panel sinEncabezado>
          <EstadoVacio
            titulo="No hay etapas seleccionadas"
            texto="Prendé al menos una etapa arriba para ver la cartera."
          />
        </Panel>
      ) : vista === 'tablero' ? (
        // En celular las columnas se apilan verticalmente (una etapa = una sección
        // de ancho completo); desde sm: vuelve el tablero horizontal con scroll lateral.
        <div className="flex flex-col gap-4 pb-3 sm:flex-row sm:overflow-x-auto">
          {columnas.map((e) => (
            <ColumnaEtapa
              key={e.id}
              etapa={e}
              leads={porEtapa[e.id]}
              onMensaje={(lead, canal) => setMensaje({ lead, canal })}
              onEditar={setEditando}
              onEliminar={setBorrando}
            />
          ))}
        </div>
      ) : (
        <Panel
          titulo="Toda la cartera"
          bajada="Ordenada por lo que hace más días que no se toca: lo de arriba es lo que está esperando una respuesta."
          cuerpoClassName="p-0"
        >
          <Tabla
            columnas={COLUMNAS_TABLA}
            filas={filasLista}
            claveFila={(l) => l.id}
            onFilaClick={setEditando}
            alto="max-h-[620px]"
            vacioTitulo="Sin leads con estos filtros"
            vacioTexto="Probá limpiando la búsqueda o prendiendo más etapas."
          />
        </Panel>
      )}

      {/* ------------------------------- modales ----------------------------- */}
      <FormularioGm
        abierto={Boolean(editando)}
        titulo={editando === 'nuevo' ? 'Nuevo lead' : 'Editar lead'}
        bajada={
          editando && editando !== 'nuevo'
            ? `${editando.id} · ${editando.apellido}, ${editando.nombre}`
            : 'Módulo 4 · Seguimientos'
        }
        campos={CAMPOS_LEAD}
        valores={editando && editando !== 'nuevo' ? aFormularioLead(editando) : null}
        textoBoton={editando === 'nuevo' ? 'Crear lead' : 'Guardar cambios'}
        onCerrar={() => setEditando(null)}
        onGuardar={(v) => guardarLead(v, editando === 'nuevo')}
      />

      <ConfirmarGm
        abierto={Boolean(borrando)}
        titulo="¿Eliminar esta oportunidad?"
        detalle={
          borrando
            ? `${borrando.id} · ${borrando.apellido}, ${borrando.nombre} — ${borrando.clinica}`
            : ''
        }
        advertencia="Se borra la oportunidad de venta y su historial de etapas. La ficha del cliente, si tiene cuenta, no se toca."
        onCerrar={() => setBorrando(null)}
        onConfirmar={() => borrarLead(borrando.id)}
      />

      {mensaje && (
        <ModalMensaje
          lead={mensaje.lead}
          canalInicial={mensaje.canal}
          plantillas={plantillas}
          onCerrar={() => setMensaje(null)}
          onEnviado={marcarContacto}
        />
      )}
    </div>
  );
}
