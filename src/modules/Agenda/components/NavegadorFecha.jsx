// ============================================================================
// SISTEMA GM · M-05 · NAVEGADOR DE FECHA
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
        className="h-9 rounded-xl border border-[#E8E0D5] dark:border-[#333333] bg-white dark:bg-[#1E1E1E] px-3 text-[13px] font-medium text-[#6E6559] dark:text-[#9CA3AF] transition hover:bg-[#FCFAF6] dark:hover:bg-[#2D2D2D] disabled:opacity-40"
      >
        Hoy
      </button>

      <div className="flex items-center overflow-hidden rounded-xl border border-[#E8E0D5] dark:border-[#333333] bg-white dark:bg-[#1E1E1E]">
        <button
          type="button"
          onClick={() => mover(-1)}
          aria-label={`${etiquetaPaso} anterior`}
          title={`${etiquetaPaso} anterior`}
          className="grid h-9 w-8 place-items-center text-[#948A7C] transition hover:bg-[#FCFAF6] dark:hover:bg-[#2D2D2D] hover:text-[#2A2118] dark:text-[#F9FAFB]"
        >
          <ChevronLeft size={16} />
        </button>
        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value || hoyIso())}
          aria-label="Ir a una fecha"
          className="h-9 border-x border-[#E8E0D5] dark:border-[#333333] bg-white dark:bg-[#1E1E1E] px-2.5 text-[13px] text-[#2A2118] dark:text-[#F9FAFB] outline-none"
        />
        <button
          type="button"
          onClick={() => mover(1)}
          aria-label={`${etiquetaPaso} siguiente`}
          title={`${etiquetaPaso} siguiente`}
          className="grid h-9 w-8 place-items-center text-[#948A7C] transition hover:bg-[#FCFAF6] dark:hover:bg-[#2D2D2D] hover:text-[#2A2118] dark:text-[#F9FAFB]"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
