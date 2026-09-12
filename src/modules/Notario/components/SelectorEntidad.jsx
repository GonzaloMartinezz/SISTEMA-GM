// ============================================================================
// SISTEMA GM · M-05 · ELEGIR DE QUÉ HABLA LA NOTA
// ----------------------------------------------------------------------------
// Un solo campo para buscar en TODO el sistema: clientes, ventas, equipos,
// cuentas, gastos, entregas y compromisos, sin tener que elegir primero la
// categoría. Escribís "autoclave" y aparece el equipo; escribís "torres" y
// aparecen la clienta, su venta y su cuenta.
//
// Es lo que evita el error clásico de estos formularios: dos desplegables en
// cascada donde primero hay que acertar en qué módulo vive la cosa que buscás.
// ============================================================================

import React, { useMemo, useRef, useState } from 'react';
import { Search, X } from 'lucide-react';
import { getEntidad } from '../config/notario.config';
import { TINTE } from '../../../shared/gm-ui/tokens';

const MAX = 8;

export default function SelectorEntidad({ entidades, valor, onCambiar }) {
  const [texto, setTexto] = useState('');
  const [abierto, setAbierto] = useState(false);
  const cierre = useRef(null);

  const elegida = valor?.codigo
    ? entidades.find((e) => e.entidad === valor.entidad && e.codigo === valor.codigo) || {
        entidad: valor.entidad,
        codigo: valor.codigo,
        nombre: valor.codigo,
        detalle: 'no está en el índice',
      }
    : null;

  const resultados = useMemo(() => {
    const q = texto.trim().toLowerCase();
    if (!q) return entidades.slice(0, MAX);
    return entidades.filter((e) => (e.busqueda || '').includes(q)).slice(0, MAX);
  }, [entidades, texto]);

  if (elegida) {
    const e = getEntidad(elegida.entidad);
    const t = TINTE[e.tono] || TINTE.gris;
    return (
      <div className="flex items-center gap-2 rounded-xl border border-[var(--gm-borde)] bg-[var(--gm-superficie-suave)] px-3 py-2.5">
        <span
          className="grid h-8 w-8 shrink-0 place-items-center rounded-lg"
          style={{ backgroundColor: t.bg, color: t.fg }}
        >
          <e.icono size={15} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] font-medium text-[var(--gm-texto)]">{elegida.nombre}</p>
          <p className="truncate text-[11px] text-[var(--gm-texto-suave)]">
            {e.nombre} {elegida.codigo}
            {elegida.detalle ? ` · ${elegida.detalle}` : ''}
          </p>
        </div>
        <button
          type="button"
          aria-label="Quitar"
          onClick={() => {
            onCambiar(null);
            setTexto('');
          }}
          className="grid h-7 w-7 shrink-0 place-items-center rounded-lg text-[var(--gm-texto-tenue)] transition hover:bg-[var(--gm-superficie-fuerte)] hover:text-[var(--gm-texto)]"
        >
          <X size={14} />
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <Search
        size={15}
        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--gm-texto-tenue)]"
      />
      <input
        type="text"
        value={texto}
        onChange={(e) => {
          setTexto(e.target.value);
          setAbierto(true);
        }}
        onFocus={() => setAbierto(true)}
        // El blur se demora: sin esto, el clic sobre un resultado cierra la
        // lista antes de que el clic llegue a registrarse.
        onBlur={() => {
          cierre.current = setTimeout(() => setAbierto(false), 150);
        }}
        placeholder="Buscar un cliente, equipo, venta, cuenta, gasto…"
        className="h-11 w-full rounded-xl border border-[var(--gm-borde)] bg-[var(--gm-superficie)] pl-10 pr-3.5 text-[14px] text-[var(--gm-texto)] outline-none transition placeholder:text-[var(--gm-texto-tenue)] focus:border-[#2F6DA0] focus:ring-4 focus:ring-[#2F6DA0]/10"
      />

      {abierto && (
        <ul className="absolute z-30 mt-1.5 max-h-[260px] w-full overflow-y-auto rounded-xl border border-[var(--gm-borde)] bg-[var(--gm-superficie)] py-1 shadow-[0_16px_40px_-16px_rgba(16,24,40,0.28)]">
          {resultados.length === 0 ? (
            <li className="px-3.5 py-3 text-[13px] text-[var(--gm-texto-tenue)]">
              Nada con ese nombre. Dejala suelta y listo: una nota no necesita colgar de algo.
            </li>
          ) : (
            resultados.map((r) => {
              const e = getEntidad(r.entidad);
              const t = TINTE[e.tono] || TINTE.gris;
              return (
                <li key={`${r.entidad}:${r.codigo}`}>
                  <button
                    type="button"
                    onMouseDown={() => {
                      clearTimeout(cierre.current);
                      onCambiar({ entidad: r.entidad, codigo: r.codigo });
                      setAbierto(false);
                    }}
                    className="flex w-full items-center gap-2.5 px-3 py-2 text-left transition hover:bg-[var(--gm-superficie-suave)]"
                  >
                    <span
                      className="grid h-7 w-7 shrink-0 place-items-center rounded-lg"
                      style={{ backgroundColor: t.bg, color: t.fg }}
                    >
                      <e.icono size={13} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13px] text-[var(--gm-texto)]">{r.nombre}</span>
                      <span className="block truncate text-[11px] text-[var(--gm-texto-suave)]">
                        {e.nombre} {r.codigo}
                        {r.detalle ? ` · ${r.detalle}` : ''}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })
          )}
        </ul>
      )}
    </div>
  );
}
