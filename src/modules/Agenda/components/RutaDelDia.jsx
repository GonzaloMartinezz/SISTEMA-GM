// ============================================================================
// SISTEMA GM · M-05 · RUTA DEL DÍA
// ----------------------------------------------------------------------------
// Las visitas del día ordenadas por cercanía desde la base, con los kilómetros
// que salen y el tiempo de manejo. Incluye la vuelta a la base: el día no
// termina en la última visita, y no contarla subestimaba el manejo bastante.
//
// Si reordenar ahorra camino, se dice cuánto, pero NO se reordena la agenda
// sola: las visitas tienen horario acordado con el cliente y el sistema no
// sabe cuáles se pueden mover. Se informa y decidís vos.
// ============================================================================

import React from 'react';
import { ExternalLink, MapPin, Navigation, TriangleAlert } from 'lucide-react';
import EstadoVacio from '../../../shared/gm-ui/EstadoVacio';
import { SERIE } from '../../../shared/gm-ui/tokens';

export default function RutaDelDia({ ruta }) {
  const { optimizada, ruteables, sinCoordenadas, totalKm, minutos, ahorroKm, link, base, vueltaKm } = ruta;

  if (!ruteables.length && !sinCoordenadas.length) {
    return (
      <EstadoVacio
        icono={Navigation}
        titulo="Sin visitas hoy"
        texto="Un día de escritorio. La ruta aparece cuando haya visitas agendadas."
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* ------------------------------ resumen ---------------------------- */}
      {/* En celular se apila en una columna con líneas horizontales; desde sm
          vuelve a las tres columnas lado a lado con líneas verticales. */}
      <div className="grid grid-cols-1 divide-y divide-[#F0EAE1] rounded-xl bg-[var(--gm-superficie-suave)] py-1 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:py-3">
        <Cifra titulo="Paradas" valor={ruteables.length} />
        <Cifra titulo="Distancia" valor={`${totalKm.toFixed(1)} km`} detalle={`vuelta incluida (${vueltaKm.toFixed(1)} km)`} />
        <Cifra titulo="Manejo" valor={`${minutos} min`} detalle="a 28 km/h de promedio" />
      </div>

      {ahorroKm > 0.3 && (
        <p className="rounded-xl border border-[#CFE0EF] bg-[#F0F6FB] px-3.5 py-2.5 text-[12px] leading-relaxed text-[#23557E]">
          Yendo en este orden en vez del horario ahorrás{' '}
          <strong className="font-semibold">{ahorroKm.toFixed(1)} km</strong>. No se reordenó la
          agenda: los horarios están acordados con cada cliente y sólo vos sabés cuáles se pueden
          mover.
        </p>
      )}

      {/* ------------------------------- paradas --------------------------- */}
      <ol className="space-y-0">
        <li className="flex items-center gap-3 py-2">
          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[var(--gm-superficie-fuerte)] text-[11px] font-semibold text-[var(--gm-texto-medio)]">
            <MapPin size={13} />
          </span>
          <span className="text-[13px] text-[var(--gm-texto-medio)]">{base.nombre}</span>
        </li>

        {optimizada.orden.map((p, i) => (
          <li key={p.id} className="relative flex items-start gap-3 py-2">
            <span className="absolute left-[13px] -top-2 h-3 w-px bg-[#E8E0D5]" aria-hidden="true" />
            <span
              className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-[11px] font-semibold text-white"
              style={{ backgroundColor: SERIE.terracota }}
            >
              {i + 1}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-medium text-[var(--gm-texto)]">
                {p.cliente || p.titulo}
              </p>
              <p className="truncate text-[11px] text-[var(--gm-texto-suave)]">{p.direccion || 'Sin dirección'}</p>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-[12px] tabular-nums text-[var(--gm-texto-medio)]">{p.distancia.toFixed(1)} km</p>
              <p className="text-[11px] tabular-nums text-[var(--gm-texto-tenue)]">{p.hora}</p>
            </div>
          </li>
        ))}
      </ol>

      {sinCoordenadas.length > 0 && (
        <p className="flex items-start gap-2 rounded-xl border border-[#EDE0CB] bg-[#FCF6EC] px-3.5 py-2.5 text-[12px] leading-relaxed text-[#7A5600]">
          <TriangleAlert size={14} className="mt-0.5 shrink-0" />
          {sinCoordenadas.length === 1
            ? 'Hay 1 visita sin coordenadas cargadas, así que no está en estos kilómetros.'
            : `Hay ${sinCoordenadas.length} visitas sin coordenadas cargadas, así que no están en estos kilómetros.`}{' '}
          Se prefiere una ruta que avisa que le falta una parada, a un total que miente.
        </p>
      )}

      {link && (
        <a
          href={link}
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-[#B4551A] text-[13px] font-medium text-white transition hover:bg-[#8A3F11]"
        >
          <ExternalLink size={15} />
          Abrir la ruta en Google Maps
        </a>
      )}
    </div>
  );
}

function Cifra({ titulo, valor, detalle }) {
  return (
    <div className="px-3 py-2 text-center sm:py-0">
      <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--gm-texto-tenue)]">{titulo}</p>
      <p className="mt-1 text-[18px] leading-none text-[var(--gm-texto)]">{valor}</p>
      {detalle && <p className="mt-1 text-[10px] leading-tight text-[var(--gm-texto-tenue)]">{detalle}</p>}
    </div>
  );
}
