// ============================================================================
// SISTEMA GM · M-06 NOTARIO 360 · NOTAS
// ----------------------------------------------------------------------------
// El cuaderno del sistema. Una nota puede hablar de un cliente, de un equipo,
// de una venta en curso, de una cuenta, de un gasto fijo, de una entrega o de
// un compromiso de la agenda — o de nada, y queda suelta.
//
// Lo importante del diseño: escribir tiene que costar poco. El único campo
// obligatorio es el texto. Todo lo demás (el tipo, de qué habla, las etiquetas)
// sirve para encontrarla dentro de seis meses, no para poder guardarla.
// ============================================================================

import React, { useMemo, useState } from 'react';
import { NotebookPen, Pin, Plus, Tag, Link2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Panel from '../../../shared/gm-ui/Panel';
import TarjetaKpi from '../../../shared/gm-ui/TarjetaKpi';
import BotonGm from '../../../shared/gm-ui/BotonGm';
import EstadoVacio from '../../../shared/gm-ui/EstadoVacio';
import ConfirmarGm from '../../../shared/gm-ui/ConfirmarGm';
import { useNotario } from '../context/NotarioContext';
import { TIPOS_NOTA, ENTIDADES, RUTA_ENTIDAD } from '../config/notario.config';
import TarjetaNota from '../components/TarjetaNota';
import FiltrosNotas from '../components/FiltrosNotas';
import ModalNota from '../components/ModalNota';

export default function NotasView() {
  const {
    notas, notasFiltradas, entidades, etiquetas, cargando, hayFiltro,
    resolver, setEtiquetaActiva, guardarNota, alternarFijada, borrarNota,
  } = useNotario();

  const navigate = useNavigate();
  const [editando, setEditando] = useState(null); // 'nueva' | nota
  const [borrando, setBorrando] = useState(null);

  const conteoTipo = useMemo(() => {
    const c = {};
    TIPOS_NOTA.forEach((t) => {
      c[t.id] = notas.filter((n) => n.tipo === t.id).length;
    });
    return c;
  }, [notas]);

  const conteoEntidad = useMemo(() => {
    const c = { general: notas.filter((n) => !n.entidad).length };
    ENTIDADES.forEach((e) => {
      c[e.id] = notas.filter((n) => n.entidad === e.id).length;
    });
    return c;
  }, [notas]);

  const fijadas = notas.filter((n) => n.fijada).length;
  const pegadas = notas.filter((n) => n.entidad).length;

  const irA = (nota) => {
    const ruta = RUTA_ENTIDAD[nota.entidad];
    if (ruta) navigate(ruta);
  };

  return (
    <div className="space-y-6">
      {/* ----------------------------- indicadores --------------------------- */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <TarjetaKpi
          etiqueta="Notas guardadas"
          valor={notas.length}
          detalle={hayFiltro ? `${notasFiltradas.length} con los filtros puestos` : 'en todo el sistema'}
          icono={NotebookPen}
          tono="azul"
        />
        <TarjetaKpi
          etiqueta="Fijadas"
          valor={fijadas}
          detalle="siempre arriba, sin importar la fecha"
          icono={Pin}
          tono="naranja"
        />
        <TarjetaKpi
          etiqueta="Pegadas a algo"
          valor={`${pegadas}/${notas.length}`}
          detalle="el resto son notas sueltas"
          icono={Link2}
          tono="verde"
        />
        <TarjetaKpi
          etiqueta="Etiquetas"
          valor={etiquetas.length}
          detalle={
            etiquetas.length
              ? `la más usada: #${etiquetas[0].nombre}`
              : 'todavía no usaste ninguna'
          }
          icono={Tag}
          tono="crema"
        />
      </div>

      {/* ------------------------------- filtros ----------------------------- */}
      <Panel sinEncabezado cuerpoClassName="px-5 py-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <FiltrosNotas conteoTipo={conteoTipo} conteoEntidad={conteoEntidad} />
          <BotonGm variante="solido" tamano="sm" icono={Plus} onClick={() => setEditando('nueva')}>
            Nueva nota
          </BotonGm>
        </div>
      </Panel>

      {/* ------------------------------ etiquetas ---------------------------- */}
      {etiquetas.length > 0 && (
        <Panel
          titulo="Etiquetas"
          bajada="Tocá una para ver sólo esas notas."
          cuerpoClassName="px-5 py-4"
        >
          <div className="flex flex-wrap gap-2">
            {etiquetas.map((e) => (
              <button
                key={e.nombre}
                type="button"
                onClick={() => setEtiquetaActiva(e.nombre)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-[#E8E0D5] dark:border-[#333333] bg-[#FCFAF6] dark:bg-[#2D2D2D] px-2.5 py-1.5 text-[12px] text-[#6E6559] dark:text-[#9CA3AF] transition hover:border-[#B4551A] hover:bg-[#FBE5C8] dark:hover:bg-[#2A1608] hover:text-[#8A3F11]"
              >
                #{e.nombre}
                <span className="text-[11px] text-[#B0A697] dark:text-[#6B7280]">{e.total}</span>
              </button>
            ))}
          </div>
        </Panel>
      )}

      {/* -------------------------------- notas ------------------------------ */}
      {cargando ? (
        <Panel sinEncabezado>
          <p className="py-16 text-center text-[14px] text-[#948A7C]">Abriendo el cuaderno…</p>
        </Panel>
      ) : notasFiltradas.length === 0 ? (
        <Panel sinEncabezado>
          <EstadoVacio
            icono={NotebookPen}
            titulo={notas.length ? 'Ninguna nota con esos filtros' : 'El cuaderno está vacío'}
            texto={
              notas.length
                ? 'Probá limpiando los filtros o buscando otra cosa.'
                : 'Anotá lo que no querés olvidarte: que un cliente cobra los días 10, que un equipo viene con un cable que no sirve, qué precio le prometiste a quién.'
            }
            accion={
              <BotonGm variante="suave" tamano="sm" icono={Plus} onClick={() => setEditando('nueva')}>
                Escribir la primera
              </BotonGm>
            }
          />
        </Panel>
      ) : (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          {notasFiltradas.map((n) => (
            <TarjetaNota
              key={n.id}
              nota={n}
              resuelta={resolver(n.entidad, n.entidadCodigo)}
              onEditar={setEditando}
              onFijar={alternarFijada}
              onEliminar={setBorrando}
              onEtiqueta={setEtiquetaActiva}
              onEntidad={irA}
            />
          ))}
        </div>
      )}

      {/* ------------------------------- modales ----------------------------- */}
      <ModalNota
        nota={editando}
        entidades={entidades}
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
