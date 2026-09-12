// ============================================================================
// SISTEMA GM · M-04 · FILTRO POR TIPO DE COMPROMISO
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
                ? { backgroundColor: `${t.color}1A`, borderColor: `${t.color}66`, color: 'var(--gm-texto)' }
                : { backgroundColor: '#FFFFFF', borderColor: 'var(--gm-borde)', color: 'var(--gm-texto-medio)' }
            }
          >
            <t.icono size={13} style={{ color: activo ? t.color : 'var(--gm-texto-suave)' }} />
            {t.plural}
            {conteo[t.id] != null && (
              <span className={activo ? 'text-[var(--gm-texto-medio)] ' : 'text-[var(--gm-texto-suave)]'}>{conteo[t.id]}</span>
            )}
          </button>
        );
      })}

      <span className="mx-1 hidden h-5 w-px bg-[var(--gm-borde)] sm:block" aria-hidden="true" />

      <button
        type="button"
        onClick={() => setOcultarCerrados(!ocultarCerrados)}
        aria-pressed={ocultarCerrados}
        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] font-medium transition ${
          ocultarCerrados
            ? 'border-[#B4551A66] bg-[var(--gm-acento-suave-bg)]  text-[var(--gm-acento-fuerte)]'
            : 'border-[var(--gm-borde)]  bg-[var(--gm-superficie)]  text-[var(--gm-texto-suave)] hover:bg-[var(--gm-superficie-suave)] '
        }`}
      >
        <EyeOff size={13} />
        Esconder lo cerrado
      </button>
    </div>
  );
}
