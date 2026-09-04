// ============================================================================
// SISTEMA GM · UI · TABLA
// ----------------------------------------------------------------------------
// Tabla de lectura cómoda: filas altas, encabezado pegajoso, cero líneas
// verticales. Las columnas se declaran con {clave, titulo, ancho, render}.
// Nada de scroll horizontal invisible: el contenedor lo hace explícito.
//
// En celular la tabla no entra ni con scroll horizontal cómodo, así que por
// debajo de `sm` se reemplaza por una tarjeta por fila (mismo patrón que ya
// se usa en el resto del sistema para listas): la primera columna queda como
// encabezado de la tarjeta y el resto se apila como par etiqueta/valor.
// ============================================================================

import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import EstadoVacio from './EstadoVacio';

export default function Tabla({
  columnas = [],
  filas = [],
  claveFila = (f, i) => f.id ?? i,
  onFilaClick,
  filaActiva,
  orden,
  onOrdenar,
  vacioTitulo = 'Sin resultados',
  vacioTexto = 'Probá cambiando los filtros o el texto de búsqueda.',
  vacioIcono,
  alto = 'max-h-[560px]',
}) {
  if (!filas.length) {
    return <EstadoVacio titulo={vacioTitulo} texto={vacioTexto} icono={vacioIcono} />;
  }

  const [primeraCol, ...resto] = columnas;
  // Una columna sin título (típicamente los íconos de acción al final de la
  // fila) no tiene sentido como par etiqueta/valor en la tarjeta: se separa y
  // se muestra como una fila de acciones a todo lo ancho, sin etiqueta.
  const restoCols = resto.filter((c) => c.titulo);
  const accionesCols = resto.filter((c) => !c.titulo);

  return (
    <>
      {/* Celular: una tarjeta por fila — la primera columna es el encabezado,
          el resto se apila como etiqueta/valor. */}
      <div className={`space-y-2.5 overflow-auto sm:hidden ${alto}`}>
        {filas.map((f, i) => {
          const k = claveFila(f, i);
          const activa = filaActiva != null && filaActiva === k;
          return (
            <div
              key={k}
              onClick={onFilaClick ? () => onFilaClick(f) : undefined}
              className={`rounded-2xl border p-4 transition-colors ${onFilaClick ? 'cursor-pointer' : ''} ${
                activa
                  ? 'border-[var(--gm-acento)] bg-[var(--gm-acento-suave-bg)]'
                  : 'border-[var(--gm-divisor)] bg-[var(--gm-superficie)]'
              }`}
            >
              {primeraCol && (
                <div className="text-[14px] text-[var(--gm-texto)]">
                  {primeraCol.render ? primeraCol.render(f) : f[primeraCol.clave] ?? '—'}
                </div>
              )}
              {restoCols.length > 0 && (
                <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2.5 border-t border-[var(--gm-divisor)] pt-3">
                  {restoCols.map((c) => (
                    <div key={c.clave} className="min-w-0">
                      <dt className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--gm-texto-medio)]">
                        {c.titulo}
                      </dt>
                      <dd className="mt-0.5 truncate text-[13px] text-[var(--gm-texto)]">
                        {c.render ? c.render(f) : f[c.clave] ?? '—'}
                      </dd>
                    </div>
                  ))}
                </dl>
              )}
              {accionesCols.length > 0 && (
                <div
                  className={`flex items-center justify-end gap-1 ${
                    restoCols.length > 0 ? 'mt-2' : 'mt-3 border-t border-[var(--gm-divisor)] pt-3'
                  }`}
                >
                  {accionesCols.map((c) => (
                    <React.Fragment key={c.clave}>
                      {c.render ? c.render(f) : f[c.clave] ?? '—'}
                    </React.Fragment>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Tablet y escritorio: tabla clásica. */}
      <div className={`hidden overflow-auto sm:block ${alto}`}>
        <table className="w-full min-w-[720px] border-collapse text-left">
          <thead className="sticky top-0 z-10 bg-[var(--gm-superficie-suave)]">
            <tr>
              {columnas.map((c) => {
                const ordenable = !!c.ordenable && !!onOrdenar;
                const activo = orden?.clave === c.clave;
                return (
                  <th
                    key={c.clave}
                    style={c.ancho ? { width: c.ancho } : undefined}
                    className="border-b border-[var(--gm-divisor)] px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--gm-texto-medio)]"
                  >
                    {ordenable ? (
                      <button
                        type="button"
                        onClick={() => onOrdenar(c.clave)}
                        className="inline-flex items-center gap-1 uppercase tracking-[0.1em] transition hover:text-[var(--gm-texto-medio)]"
                      >
                        {c.titulo}
                        {activo &&
                          (orden.dir === 'asc' ? <ChevronUp size={13} /> : <ChevronDown size={13} />)}
                      </button>
                    ) : (
                      c.titulo
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {filas.map((f, i) => {
              const k = claveFila(f, i);
              const activa = filaActiva != null && filaActiva === k;
              return (
                <tr
                  key={k}
                  onClick={onFilaClick ? () => onFilaClick(f) : undefined}
                  className={`border-b border-[var(--gm-divisor)] transition-colors last:border-0 ${
                    onFilaClick ? 'cursor-pointer' : ''
                  } ${activa ? 'bg-[var(--gm-acento-suave-bg)]' : 'hover:bg-[var(--gm-superficie-suave)]'}`}
                >
                  {columnas.map((c) => (
                    <td
                      key={c.clave}
                      className="px-4 py-3.5 align-middle text-[14px] text-[var(--gm-texto)]"
                    >
                      {c.render ? c.render(f) : f[c.clave] ?? '—'}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
