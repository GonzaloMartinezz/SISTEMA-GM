// ============================================================================
// SISTEMA GM · M-06 NOTARIO 360 · FICHA 360°
// ----------------------------------------------------------------------------
// Elegís una cosa —un cliente, un equipo, una venta, una cuenta, un gasto— y
// ves TODO lo que el sistema sabe de ella en una sola pantalla: lo que anotaste
// a mano y lo que registraron los otros módulos, en orden.
//
// Es el "360" del nombre del módulo, y es la pantalla que se abre cuando suena
// el teléfono: no hay que adivinar en qué módulo estaba la respuesta.
// ============================================================================

import React, { useMemo, useState } from 'react';
import { NotebookPen, Plus, ScanFace, History, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Panel from '../../../shared/gm-ui/Panel';
import BotonGm from '../../../shared/gm-ui/BotonGm';
import EstadoVacio from '../../../shared/gm-ui/EstadoVacio';
import ConfirmarGm from '../../../shared/gm-ui/ConfirmarGm';
import FilaEstadisticas from '../../../shared/gm-ui/FilaEstadisticas';
import { TINTE } from '../../../shared/gm-ui/tokens';
import { useNotario } from '../context/NotarioContext';
import { getEntidad, getModulo, RUTA_ENTIDAD } from '../config/notario.config';
import SelectorEntidad from '../components/SelectorEntidad';
import TarjetaNota from '../components/TarjetaNota';
import ModalNota from '../components/ModalNota';
import LineaBitacora from '../components/LineaBitacora';

const diaDe = (iso) => String(iso).slice(0, 10);

export default function FichaView() {
  const {
    entidades, notasDe, bitacoraDe, resolver, guardarNota, alternarFijada,
    borrarNota, setEtiquetaActiva, cargando,
  } = useNotario();

  const navigate = useNavigate();
  const [elegida, setElegida] = useState(null);
  const [editando, setEditando] = useState(null);
  const [borrando, setBorrando] = useState(null);

  const ficha = elegida
    ? entidades.find((e) => e.entidad === elegida.entidad && e.codigo === elegida.codigo)
    : null;

  const notas = useMemo(
    () => (elegida ? notasDe(elegida.entidad, elegida.codigo) : []),
    [elegida, notasDe]
  );

  const hechos = useMemo(
    () => (elegida ? bitacoraDe(elegida.entidad, elegida.codigo) : []),
    [elegida, bitacoraDe]
  );

  const grupos = useMemo(() => {
    const mapa = new Map();
    hechos.forEach((h) => {
      const d = diaDe(h.fecha);
      if (!mapa.has(d)) mapa.set(d, []);
      mapa.get(d).push(h);
    });
    return [...mapa.entries()]
      .sort((a, b) => b[0].localeCompare(a[0]))
      .map(([dia, lista]) => ({ dia, hechos: lista }));
  }, [hechos]);

  const clase = ficha ? getEntidad(ficha.entidad) : null;
  const tinte = clase ? TINTE[clase.tono] || TINTE.gris : null;

  const primero = hechos.length ? hechos[hechos.length - 1] : null;
  const ultimo = hechos.length ? hechos[0] : null;
  const modulosTocados = new Set(hechos.map((h) => h.modulo)).size;

  const estadisticas = ficha
    ? [
        { etiqueta: 'Notas', valor: notas.length, detalle: 'escritas a mano' },
        { etiqueta: 'Movimientos', valor: hechos.length, detalle: 'registrados por el sistema' },
        { etiqueta: 'Módulos que la tocaron', valor: modulosTocados, detalle: 'de los que registran' },
        {
          etiqueta: 'Primer registro',
          valor: primero
            ? new Date(primero.fecha).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: '2-digit' })
            : '—',
          detalle: primero ? getModulo(primero.modulo).nombre : 'sin historial',
        },
        {
          etiqueta: 'Último movimiento',
          valor: ultimo
            ? new Date(ultimo.fecha).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: '2-digit' })
            : '—',
          detalle: ultimo ? ultimo.titulo.slice(0, 34) : 'sin historial',
        },
        {
          etiqueta: 'Notas fijadas',
          valor: notas.filter((n) => n.fijada).length,
          detalle: 'lo que hay que tener presente',
        },
      ]
    : [];

  return (
    <div className="space-y-6">
      {/* ------------------------------- selector ---------------------------- */}
      <Panel
        titulo="¿De qué querés ver todo?"
        bajada="Buscá un cliente, un equipo, una venta, una cuenta, un gasto, una entrega o un compromiso."
      >
        <div className="max-w-2xl">
          <SelectorEntidad entidades={entidades} valor={elegida} onCambiar={setElegida} />
        </div>
      </Panel>

      {!elegida ? (
        <Panel sinEncabezado>
          <EstadoVacio
            icono={ScanFace}
            titulo="Elegí algo arriba"
            texto="Vas a ver junto todo lo que el sistema sabe: las notas que escribiste y lo que registraron los otros módulos, en orden de fecha."
          />
        </Panel>
      ) : cargando ? (
        <Panel sinEncabezado>
          <p className="py-16 text-center text-[14px] text-[#948A7C]">Juntando todo…</p>
        </Panel>
      ) : (
        <>
          {/* ---------------------------- encabezado ------------------------- */}
          <Panel sinEncabezado cuerpoClassName="px-6 py-5">
            <div className="flex flex-wrap items-center gap-4">
              <span
                className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl"
                style={{ backgroundColor: tinte.bg, color: tinte.fg }}
              >
                <clase.icono size={24} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#B0A697]">
                  {clase.nombre} · {clase.modulo} · {ficha?.codigo || elegida.codigo}
                </p>
                <h2 className="mt-1 text-[22px] font-semibold leading-tight text-[#2A2118]">
                  {ficha?.nombre || elegida.codigo}
                </h2>
                {ficha?.detalle && (
                  <p className="mt-0.5 text-[14px] text-[#948A7C]">{ficha.detalle}</p>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {RUTA_ENTIDAD[elegida.entidad] && (
                  <BotonGm
                    variante="contorno"
                    tamano="sm"
                    icono={ExternalLink}
                    onClick={() => navigate(RUTA_ENTIDAD[elegida.entidad])}
                  >
                    Abrir en {clase.modulo}
                  </BotonGm>
                )}
                <BotonGm
                  variante="solido"
                  tamano="sm"
                  icono={Plus}
                  onClick={() => setEditando('nueva')}
                >
                  Anotar algo acá
                </BotonGm>
              </div>
            </div>
          </Panel>

          <Panel sinEncabezado cuerpoClassName="p-0">
            <FilaEstadisticas items={estadisticas} />
          </Panel>

          {/* ------------------------ notas + historial ---------------------- */}
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <Panel
              titulo="Lo que anotaste"
              bajada="Las notas que escribiste vos sobre esto."
              acciones={<NotebookPen size={16} className="text-[#B0A697]" />}
              cuerpoClassName={notas.length ? 'space-y-4 p-6' : 'p-6'}
            >
              {notas.length === 0 ? (
                <EstadoVacio
                  icono={NotebookPen}
                  titulo="Todavía no anotaste nada"
                  texto="Lo que sepas de esto y no esté en ningún campo del sistema, va acá."
                  accion={
                    <BotonGm
                      variante="suave"
                      tamano="sm"
                      icono={Plus}
                      onClick={() => setEditando('nueva')}
                    >
                      Escribir la primera
                    </BotonGm>
                  }
                />
              ) : (
                notas
                  .slice()
                  .sort((a, b) => (a.fijada === b.fijada ? 0 : a.fijada ? -1 : 1))
                  .map((n) => (
                    <TarjetaNota
                      key={n.id}
                      nota={n}
                      resuelta={resolver(n.entidad, n.entidadCodigo)}
                      onEditar={setEditando}
                      onFijar={alternarFijada}
                      onEliminar={setBorrando}
                      onEtiqueta={setEtiquetaActiva}
                    />
                  ))
              )}
            </Panel>

            <Panel
              titulo="Lo que registró el sistema"
              bajada="Mensajes, avances, movimientos de stock, compromisos, visitas y pagos."
              acciones={<History size={16} className="text-[#B0A697]" />}
            >
              <LineaBitacora grupos={grupos} resolver={resolver} />
            </Panel>
          </div>
        </>
      )}

      <ModalNota
        nota={editando}
        entidades={entidades}
        entidadFija={editando === 'nueva' ? elegida : null}
        onCerrar={() => setEditando(null)}
        onGuardar={guardarNota}
      />

      <ConfirmarGm
        abierto={Boolean(borrando)}
        titulo="¿Eliminar esta nota?"
        detalle={borrando ? borrando.titulo || borrando.texto.slice(0, 120) : ''}
        advertencia="Una nota es memoria: si la borrás no queda registro de lo que decía en ningún otro lado."
        onCerrar={() => setBorrando(null)}
        onConfirmar={() => borrarNota(borrando.id)}
      />
    </div>
  );
}
