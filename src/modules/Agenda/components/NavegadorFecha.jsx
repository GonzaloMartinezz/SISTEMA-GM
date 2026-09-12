// ============================================================================
// SISTEMA GM · M-04 · NAVEGADOR DE FECHA
// ----------------------------------------------------------------------------
// Flechas, botón "Hoy" y un selector de fecha real. El paso de las flechas
// cambia con la sección: en Hoy avanzás un día, en Semana siete, en Mes un mes.
// Si las flechas movieran siempre un día, en la vista de mes habría que hacer
// treinta clics para pasar de mes.
// ============================================================================

import React from 'react';
import { useLocation } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useAgenda } from '../context/AgendaContext';
import { sumarDias, sumarMeses, hoyIso, esHoy } from '../utils/calendario';

export default function NavegadorFecha() {
  const { fecha, setFecha, irHoy } = useAgenda();
  const { pathname } = useLocation();

  const paso = pathname.endsWith('/mes') ? 'mes' : pathname.endsWith('/semana') ? 'semana' : 'dia';
  const etiquetaPaso = { dia: 'día', semana: 'semana', mes: 'mes' }[paso];

  const mover = (dir) => {
    if (paso === 'mes') setFecha(sumarMeses(fecha, dir));
    else setFecha(sumarDias(fecha, dir * (paso === 'semana' ? 7 : 1)));
  };

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={irHoy}
        disabled={esHoy(fecha)}
        className="h-9 rounded-xl border border-[var(--gm-borde)] bg-[var(--gm-superficie)] px-3 text-[13px] font-medium text-[var(--gm-texto-medio)] transition hover:bg-[var(--gm-superficie-suave)] disabled:opacity-40"
      >
        Hoy
      </button>

      <div className="flex items-center overflow-hidden rounded-xl border border-[var(--gm-borde)] bg-[var(--gm-superficie)]">
        <button
          type="button"
          onClick={() => mover(-1)}
          aria-label={`${etiquetaPaso} anterior`}
          title={`${etiquetaPaso} anterior`}
          className="grid h-9 w-8 place-items-center text-[var(--gm-texto-suave)] transition hover:bg-[var(--gm-superficie-suave)] hover:text-[var(--gm-texto)]"
        >
          <ChevronLeft size={16} />
        </button>
        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value || hoyIso())}
          aria-label="Ir a una fecha"
          className="h-9 border-x border-[var(--gm-borde)] bg-[var(--gm-superficie)] px-2.5 text-[13px] text-[var(--gm-texto)] outline-none"
        />
        <button
          type="button"
          onClick={() => mover(1)}
          aria-label={`${etiquetaPaso} siguiente`}
          title={`${etiquetaPaso} siguiente`}
          className="grid h-9 w-8 place-items-center text-[var(--gm-texto-suave)] transition hover:bg-[var(--gm-superficie-suave)] hover:text-[var(--gm-texto)]"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
