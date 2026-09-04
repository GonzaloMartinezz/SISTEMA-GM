// ============================================================================
// SISTEMA GM · M-06 NOTARIO 360 · TRAZABILIDAD
// ----------------------------------------------------------------------------
// "¿En qué quedamos?" es la pregunta más cara del negocio, porque la respuesta
// está repartida: el último mensaje en Seguimientos, la visita en la Agenda, el
// pago en Cuentas, la entrega en Logística, la nota en algún lado.
//
// Esta pantalla junta todo eso en una sola línea de tiempo. No guarda nada
// nuevo: lee lo que los otros módulos ya escriben, así que no puede quedar
// desactualizada ni hay nada que mantener.
//
// Lo que NO está acá también es una decisión: entran HECHOS con fecha, cosas
// que pasaron. Que un lead esté "en proceso" no es un hecho sino un estado; el
// hecho fue el día que pasó a proceso, y ese sí está.
// ============================================================================

import React, { useMemo, useState } from 'react';
import { Activity, CalendarDays, History, Layers, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Panel from '../../../shared/gm-ui/Panel';
import Chip from '../../../shared/gm-ui/Chip';
import FilaEstadisticas from '../../../shared/gm-ui/FilaEstadisticas';
import { useNotario } from '../context/NotarioContext';
import { CLASES, MODULOS, RANGOS, getRango, getClase, getModulo, RUTA_ENTIDAD } from '../config/notario.config';
import LineaBitacora from '../components/LineaBitacora';

const diaDe = (iso) => String(iso).slice(0, 10);

export default function TrazabilidadView() {
  const { bitacora, busqueda, cargando, resolver } = useNotario();
  const navigate = useNavigate();

  const [rangoId, setRangoId] = useState('30');
  const [modulosVisibles, setModulosVisibles] = useState([]);
  const [clasesVisibles, setClasesVisibles] = useState([]);

  const rango = getRango(rangoId);

  const filtrados = useMemo(() => {
    const corte = Date.now() - rango.dias * 86400000;
    const q = busqueda.trim().toLowerCase();
    return bitacora.filter((h) => {
      if (new Date(h.fecha).getTime() < corte) return false;
      if (modulosVisibles.length && !modulosVisibles.includes(h.modulo)) return false;
      if (clasesVisibles.length && !clasesVisibles.includes(h.clase)) return false;
      if (!q) return true;
      return [h.titulo, h.detalle, h.entidadCodigo, h.codigo]
        .filter(Boolean)
        .some((c) => String(c).toLowerCase().includes(q));
    });
  }, [bitacora, rango.dias, modulosVisibles, clasesVisibles, busqueda]);

  /** Agrupados por día, del más reciente al más viejo. */
  const grupos = useMemo(() => {
    const mapa = new Map();
    filtrados.forEach((h) => {
      const d = diaDe(h.fecha);
      if (!mapa.has(d)) mapa.set(d, []);
      mapa.get(d).push(h);
    });
    return [...mapa.entries()]
      .sort((a, b) => b[0].localeCompare(a[0]))
      .map(([dia, hechos]) => ({
        dia,
        hechos: hechos.sort((a, b) => new Date(b.fecha) - new Date(a.fecha)),
      }));
  }, [filtrados]);

  const conteoModulo = useMemo(() => {
    const c = {};
    Object.keys(MODULOS).forEach((m) => {
      c[m] = filtrados.filter((h) => h.modulo === m).length;
    });
    return c;
  }, [filtrados]);

  const conteoClase = useMemo(() => {
    const c = {};
    Object.keys(CLASES).forEach((k) => {
      c[k] = filtrados.filter((h) => h.clase === k).length;
    });
    return c;
  }, [filtrados]);

  const modulosActivos = Object.entries(conteoModulo).filter(([, n]) => n > 0);
  const diasConAlgo = grupos.length;
  const porDia = diasConAlgo ? (filtrados.length / Math.min(rango.dias, diasConAlgo || 1)) : 0;

  const estadisticas = [
    { etiqueta: 'Movimientos', valor: filtrados.length, detalle: `en ${rango.nombre.toLowerCase()}` },
    { etiqueta: 'Días con actividad', valor: diasConAlgo, detalle: 'con al menos un movimiento' },
    {
      etiqueta: 'Promedio por día',
      valor: diasConAlgo ? porDia.toFixed(1) : '—',
      detalle: 'sobre los días que tuvieron algo',
    },
    { etiqueta: 'Módulos activos', valor: modulosActivos.length, detalle: 'de 7 que registran' },
    {
      etiqueta: 'Lo más frecuente',
      valor: (() => {
        const top = Object.entries(conteoClase).sort((a, b) => b[1] - a[1])[0];
        return top && top[1] ? getClase(top[0]).nombre : '—';
      })(),
      detalle: 'la clase de hecho que más se repite',
    },
    {
      etiqueta: 'Último movimiento',
      valor: filtrados.length
        ? new Date(filtrados[0].fecha).toLocaleDateString('es-AR', { day: '2-digit', month: 'short' })
        : '—',
      detalle: filtrados.length ? getModulo(filtrados[0].modulo).nombre : 'sin registros',
    },
  ];

  const toggle = (lista, set) => (id) =>
    set(lista.includes(id) ? lista.filter((x) => x !== id) : [...lista, id]);

  const hayFiltro = modulosVisibles.length > 0 || clasesVisibles.length > 0;

  return (
    <div className="space-y-6">
      <Panel sinEncabezado cuerpoClassName="p-0">
        <FilaEstadisticas items={estadisticas} />
      </Panel>

      {/* ------------------------------- filtros ----------------------------- */}
      <Panel sinEncabezado cuerpoClassName="px-5 py-4">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="mr-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#B0A697]">
                Módulo
              </span>
              {Object.entries(MODULOS).map(([id, m]) => {
                const activo = modulosVisibles.includes(id);
                const total = conteoModulo[id] || 0;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => toggle(modulosVisibles, setModulosVisibles)(id)}
                    aria-pressed={activo}
                    className={`rounded-full border px-3 py-1.5 text-[12px] font-medium transition ${
                      activo
                        ? 'border-[#B4551A66] bg-[#FBE5C8] text-[#8A3F11]'
                        : 'border-[#E8E0D5] bg-white text-[#948A7C] hover:bg-[#FCFAF6]'
                    } ${total === 0 ? 'opacity-50' : ''}`}
                  >
                    {m.codigo} {m.nombre}{' '}
                    <span className={activo ? 'text-[#8A3F11]/70' : 'text-[#C6BCAC]'}>{total}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {hayFiltro && (
                <button
                  type="button"
                  onClick={() => {
                    setModulosVisibles([]);
                    setClasesVisibles([]);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[12px] text-[#948A7C] transition hover:bg-[#F3EDE4] hover:text-[#2A2118]"
                >
                  <RotateCcw size={13} />
                  Limpiar
                </button>
              )}
              <div className="flex overflow-hidden rounded-xl border border-[#E8E0D5]">
                {RANGOS.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRangoId(r.id)}
                    className={`px-3 py-1.5 text-[12px] font-semibold transition ${
                      rangoId === r.id
                        ? 'bg-[#FBE5C8] text-[#8A3F11]'
                        : 'bg-white text-[#948A7C] hover:bg-[#FCFAF6]'
                    }`}
                  >
                    {r.nombre}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#B0A697]">
              Qué pasó
            </span>
            {Object.entries(CLASES).map(([id, c]) => {
              const activo = clasesVisibles.includes(id);
              const total = conteoClase[id] || 0;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => toggle(clasesVisibles, setClasesVisibles)(id)}
                  aria-pressed={activo}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] font-medium transition ${
                    total === 0 ? 'opacity-50' : ''
                  }`}
                  style={
                    activo
                      ? { backgroundColor: `${c.color}1A`, borderColor: `${c.color}66`, color: '#3D3225' }
                      : { backgroundColor: '#FFFFFF', borderColor: '#E8E0D5', color: '#948A7C' }
                  }
                >
                  <c.icono size={13} style={{ color: activo ? c.color : '#C6BCAC' }} />
                  {c.nombre}
                  <span className={activo ? 'text-[#6E6559]' : 'text-[#C6BCAC]'}>{total}</span>
                </button>
              );
            })}
          </div>
        </div>
      </Panel>

      {/* ------------------------------ la línea ----------------------------- */}
      <Panel
        titulo="Todo lo que pasó"
        bajada="Sale de Notas, Seguimientos, Equipamientos, Agenda, Cobranzas, Tesorería y Logística. No se carga a mano: se lee de lo que cada módulo ya registra."
        acciones={<History size={16} className="text-[#B0A697]" />}
      >
        {cargando ? (
          <p className="py-16 text-center text-[14px] text-[#948A7C]">Juntando los movimientos…</p>
        ) : (
          <LineaBitacora
            grupos={grupos}
            resolver={resolver}
            onHecho={(h) => {
              const ruta = RUTA_ENTIDAD[h.entidad];
              if (ruta) navigate(ruta);
            }}
          />
        )}
      </Panel>
    </div>
  );
}
