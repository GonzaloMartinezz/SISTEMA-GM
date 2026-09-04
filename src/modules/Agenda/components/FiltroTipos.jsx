// ============================================================================
// SISTEMA GM · M-05 · FILTRO POR TIPO DE COMPROMISO
// ----------------------------------------------------------------------------
// Un chip por tipo, con el color que ese tipo tiene en todo el módulo, más el
// interruptor para esconder lo ya cerrado. Cada chip muestra cuántos hay en el
// rango cargado: apagar un filtro vacío no sirve de nada y conviene que se vea.
// ============================================================================

import React from 'react';
import { EyeOff } from 'lucide-react';
import { TIPOS } from '../config/agenda.config';
import { useAgenda } from '../context/AgendaContext';

export default function FiltroTipos({ conteo = {} }) {
  const { tiposVisibles, toggleTipo, ocultarCerrados, setOcultarCerrados } = useAgenda();

  return (
    <div className="flex flex-wrap items-center gap-2">
      {TIPOS.map((t) => {
        const activo = tiposVisibles.includes(t.id);
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => toggleTipo(t.id)}
            aria-pressed={activo}
            className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] font-medium transition"
            style={
              activo
                ? { backgroundColor: `${t.color}1A`, borderColor: `${t.color}66`, color: '#3D3225' }
                : { backgroundColor: '#FFFFFF', borderColor: '#E8E0D5', color: '#B0A697' }
            }
          >
            <t.icono size={13} style={{ color: activo ? t.color : '#C6BCAC' }} />
            {t.plural}
            {conteo[t.id] != null && (
              <span className={activo ? 'text-[#6E6559] dark:text-[#9CA3AF]' : 'text-[#C6BCAC]'}>{conteo[t.id]}</span>
            )}
          </button>
        );
      })}

      <span className="mx-1 hidden h-5 w-px bg-[#E8E0D5] sm:block" aria-hidden="true" />

      <button
        type="button"
        onClick={() => setOcultarCerrados(!ocultarCerrados)}
        aria-pressed={ocultarCerrados}
        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] font-medium transition ${
          ocultarCerrados
            ? 'border-[#B4551A66] bg-[#FBE5C8] dark:bg-[#2A1608] text-[#8A3F11]'
            : 'border-[#E8E0D5] dark:border-[#333333] bg-white dark:bg-[#1E1E1E] text-[#948A7C] hover:bg-[#FCFAF6] dark:hover:bg-[#2D2D2D]'
        }`}
      >
        <EyeOff size={13} />
        Esconder lo cerrado
      </button>
    </div>
  );
}
