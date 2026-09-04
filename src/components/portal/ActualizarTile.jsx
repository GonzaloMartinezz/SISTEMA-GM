// ============================================================================
// SISTEMA GM · TILE DE ACTUALIZACIÓN DEL PORTAL
// ----------------------------------------------------------------------------
// Ocupa el lugar que antes tenía "Salir". Es el botón que se toca al entrar:
// fuerza el envío de las planillas del Drive, vuelve a leer todo de la base y
// avisa a los módulos.
//
// Mientras trabaja dice en qué paso va, y al terminar deja la marca de cuándo
// fue. Un botón que no muestra estado obliga a tocarlo dos veces por las
// dudas, y eso es peor que no tenerlo.
// ============================================================================

import React from 'react';
import { AlertTriangle, Check, RefreshCw } from 'lucide-react';
import { haceCuanto } from '../../services/sincronizacion';

export default function ActualizarTile({
  estado = 'listo',   // listo | trabajando | ok | atencion
  paso = '',
  ultima = null,
  resumen = null,
  motivo = null,      // por qué quedó en atención, si se sabe
  onActualizar,
}) {
  const trabajando = estado === 'trabajando';
  const atencion = estado === 'atencion';
  const listoOk = estado === 'ok';

  const acento = atencion
    ? {
        borde: 'hover:border-amber-500/50',
        sombra: 'hover:shadow-[0_0_40px_-8px_rgba(245,158,11,0.4)]',
        anillo: 'focus-visible:ring-amber-400/60',
        texto: 'group-hover:text-amber-400',
        icono: 'text-amber-400',
      }
    : {
        borde: 'hover:border-emerald-500/50',
        sombra: 'hover:shadow-[0_0_40px_-8px_rgba(16,185,129,0.4)]',
        anillo: 'focus-visible:ring-emerald-400/60',
        texto: 'group-hover:text-emerald-400',
        icono: listoOk ? 'text-emerald-400' : 'text-white/40',
      };

  const Icono = atencion ? AlertTriangle : listoOk ? Check : RefreshCw;

  return (
    <button
      type="button"
      onClick={onActualizar}
      disabled={trabajando}
      title="Traer de Drive y Supabase todo lo cargado desde afuera del sistema"
      aria-label="Actualizar todos los datos del sistema"
      className={`group relative flex h-full min-h-0 flex-col items-center justify-center gap-[clamp(0.35rem,1.1vh,0.7rem)] overflow-hidden rounded-lg border border-white/[0.09] bg-gradient-to-b from-white/[0.03] to-transparent p-[clamp(0.4rem,1.3vh,0.9rem)] transition-all duration-300 focus:outline-none focus-visible:ring-2 disabled:cursor-wait ${acento.borde} ${acento.sombra} ${acento.anillo} ${
        trabajando ? '' : 'hover:-translate-y-0.5'
      }`}
    >
      <span className="absolute left-2 top-1.5 font-mono text-[9px] tracking-[0.18em] text-white/20">
        SYNC
      </span>

      {/* Barra de progreso indeterminada mientras trabaja. */}
      {trabajando && (
        <span className="absolute inset-x-0 top-0 h-[2px] overflow-hidden bg-white/[0.06]">
          <span className="gm-barra-sync block h-full w-1/3 bg-emerald-400/70" />
        </span>
      )}

      <span
        className={`flex items-center justify-center rounded-md border border-white/[0.07] bg-black/30 p-[clamp(0.35rem,1.1vh,0.7rem)] transition-transform duration-300 ${
          trabajando ? '' : 'group-hover:scale-105'
        }`}
      >
        <Icono
          className={`h-[clamp(1.15rem,3.2vh,1.9rem)] w-[clamp(1.15rem,3.2vh,1.9rem)] transition-colors ${acento.icono} ${acento.texto} ${
            trabajando ? 'animate-spin text-emerald-400' : ''
          }`}
          strokeWidth={1.5}
        />
      </span>

      <span
        className={`border-b border-transparent pb-0.5 text-center text-[clamp(0.6rem,1.5vh,0.78rem)] font-bold uppercase leading-tight tracking-[0.13em] transition-colors ${
          trabajando ? 'text-emerald-400/90' : 'text-white/45 group-hover:border-current'
        } ${acento.texto}`}
      >
        {trabajando ? 'Actualizando' : 'Actualizar'}
      </span>

      <span className="gm-card-desc hidden max-w-[26ch] sm:block text-center text-[clamp(0.53rem,1.15vh,0.65rem)] leading-snug text-white/25">
        {trabajando
          ? paso || 'Trayendo los datos…'
          : atencion
            ? motivo === 'sin-supabase'
              ? 'No se pudo conectar a la base. Tocá para ver.'
              : 'Hubo planillas con problemas. Tocá para ver.'
            : ultima
              ? `Actualizado ${haceCuanto(ultima)}`
              : 'Traer todo lo cargado en Drive y Supabase'}
      </span>

      {/* Al terminar bien, el conteo concreto: es la prueba de que entró. */}
      {!trabajando && listoOk && resumen && (
        <span className="hidden font-mono text-[clamp(0.48rem,1.05vh,0.58rem)] uppercase tracking-[0.14em] text-emerald-400/50 sm:block">
          {resumen.clientes} clientes · {resumen.ventas} ventas · {resumen.planillas} planillas
        </span>
      )}
    </button>
  );
}
