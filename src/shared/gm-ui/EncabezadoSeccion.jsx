// ============================================================================
// SISTEMA GM · UI · ENCABEZADO DE SECCIÓN
// ----------------------------------------------------------------------------
// Título de la sección activa, su bajada, la fecha y el sello de "actualizado"
// cuando entró un cambio en vivo. Es la única franja fija arriba: el resto del
// alto queda para el contenido.
//
// El interruptor de tema aparece solo (sin que cada módulo tenga que pasarlo
// a mano) cuando el módulo está envuelto en <TemaProvider> — ver
// TemaProvider.jsx. Un módulo que todavía no lo adoptó no muestra nada nuevo.
// ============================================================================

import React from 'react';
import { useLocation } from 'react-router-dom';
import { RefreshCw } from 'lucide-react';
import BotonGm from './BotonGm';
import InterruptorTema from './InterruptorTema';
import { useTema, useTemaDisponible } from './TemaProvider';

const hoyLargo = () =>
  new Date().toLocaleDateString('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

export default function EncabezadoSeccion({
  modulo,
  secciones = [],
  onRecargar,
  cargando,
  ultimoCambio,
  acciones,
}) {
  const { pathname } = useLocation();
  const activa = secciones.find((s) => pathname.endsWith(`/${s.ruta}`)) || secciones[0] || {};
  const { tinte } = useTema();
  const tieneInterruptor = useTemaDisponible();

  return (
    <header className="flex flex-wrap items-end justify-between gap-4 border-b border-[var(--gm-borde)] bg-[var(--gm-superficie)] px-6 py-5 lg:px-8">
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--gm-texto-medio)]">
          Sistema GM · {modulo}
        </p>
        <h1 className="mt-1 text-[24px] font-semibold leading-tight tracking-tight text-[var(--gm-texto)]">
          {activa.nombre}
        </h1>
        {activa.bajada && (
          <p className="mt-1 text-[14px] text-[var(--gm-texto-medio)]">{activa.bajada}</p>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {acciones}

        {/* Señal de conexión viva: si entró algo desde una planilla de Drive,
            el módulo ya se refrescó solo y esto lo deja a la vista. */}
        {ultimoCambio && (
          <span
            className="hidden items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] sm:inline-flex"
            style={{ backgroundColor: tinte.exito.bg, color: tinte.exito.fg }}
          >
            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: tinte.exito.fg }} />
            Actualizado{' '}
            {ultimoCambio.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
          </span>
        )}
        <span className="hidden text-[13px] capitalize text-[var(--gm-texto-medio)] sm:inline">
          {hoyLargo()}
        </span>
        <BotonGm variante="contorno" tamano="sm" onClick={onRecargar} disabled={cargando}>
          <RefreshCw size={15} className={cargando ? 'animate-spin' : ''} />
          Actualizar
        </BotonGm>
        {tieneInterruptor && <InterruptorTema />}
      </div>
    </header>
  );
}
