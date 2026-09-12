// ============================================================================
// SISTEMA GM · M-06 · LA FICHA DEL PUNTO
// ----------------------------------------------------------------------------
// Lo que aparece al tocar un pin. Está pensada para resolver en el momento: los
// tres botones de abajo son las tres cosas que uno hace parado frente al mapa
// —llamarlo, escribirle, ir— y las dos salidas a Google Maps están arriba de
// todo lo demás porque son la razón por la que se abre esta ficha.
//
// "Ver ubicación" abre el punto en Google Maps; "Cómo llegar" abre la
// navegación desde donde estés. Son dos cosas distintas y por eso son dos
// botones: a veces querés mirar la cuadra antes de salir, y a veces ya vas.
// ============================================================================

import React from 'react';
import {
  ExternalLink, Mail, MapPin, MessageCircle, Navigation, Phone, X,
} from 'lucide-react';
import Chip from '../../../shared/gm-ui/Chip';
import {
  getEstado, linkComoLlegar, linkUbicacion, linkWhatsApp, linkTelefono,
  getTipoCompromiso,
} from '../config/mapa.config';
import { diasDesde } from '../context/MapaContext';

const usd = (v) => `US$ ${Math.round(Number(v || 0)).toLocaleString('es-AR')}`;

const fecha = (iso) =>
  iso ? new Date(`${iso}T00:00:00`).toLocaleDateString('es-AR', { day: '2-digit', month: 'short' }) : null;

export default function FichaCliente({ cliente, onCerrar, compacta = false }) {
  if (!cliente) return null;

  const estado = getEstado(cliente.estado);
  const dias = diasDesde(cliente.ultimaVisita);
  const wa = linkWhatsApp(cliente.celular || cliente.telefono);
  const tel = linkTelefono(cliente.telefono || cliente.celular);
  const proximo = cliente.proximoTipo ? getTipoCompromiso(cliente.proximoTipo) : null;

  return (
    <article className="overflow-hidden rounded-2xl border border-[var(--gm-borde)] dark:border-[#333333] bg-white dark:bg-[#1E1E1E] shadow-[0_16px_40px_-16px_rgba(26,26,24,0.35)]">
      {/* -------------------------------- cabecera ------------------------- */}
      <header className="flex items-start gap-2 border-b border-[var(--gm-borde-fuerte)] dark:border-[#333333] px-4 py-3">
        <span
          className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full"
          style={{ backgroundColor: estado.color }}
          aria-hidden="true"
        />
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-[14px] font-semibold leading-snug text-[#2A2118] dark:text-[#F9FAFB]">
            {cliente.nombre}
          </h3>
          <p className="truncate text-[12px] text-[#948A7C]">
            {cliente.titular || cliente.rubro || cliente.localidad}
          </p>
        </div>
        {onCerrar && (
          <button
            type="button"
            onClick={onCerrar}
            aria-label="Cerrar"
            className="grid h-7 w-7 shrink-0 place-items-center rounded-lg text-[var(--gm-texto-medio)] dark:text-[#6B7280] transition hover:bg-[#F3EDE4] dark:hover:bg-[#121212] hover:text-[#2A2118] dark:text-[#F9FAFB]"
          >
            <X size={14} />
          </button>
        )}
      </header>

      <div className="space-y-3 px-4 py-3">
        <div className="flex flex-wrap gap-1.5">
          <Chip tono={estado.tono} punto>{estado.nombre}</Chip>
          {cliente.rubro && <Chip tono="gris">{cliente.rubro}</Chip>}
          {cliente.montoEnJuego > 0 && (
            <Chip tono="naranja">{usd(cliente.montoEnJuego)} en juego</Chip>
          )}
        </div>

        {/* ------------------------------ ubicación ------------------------ */}
        <div className="flex items-start gap-2">
          <MapPin size={13} className="mt-0.5 shrink-0 text-[var(--gm-texto-medio)] dark:text-[#6B7280]" />
          <div className="min-w-0 text-[12px] leading-relaxed">
            <p className="text-[#2A2118] dark:text-[#F9FAFB]">{cliente.direccion || 'Sin dirección cargada'}</p>
            <p className="text-[#948A7C]">{cliente.localidad}</p>
            <p className="mt-0.5 font-mono text-[10px] tabular-nums text-[var(--gm-texto-medio)] dark:text-[#6B7280]">
              {cliente.lat.toFixed(5)}, {cliente.lng.toFixed(5)}
            </p>
          </div>
        </div>

        {/* --------------------------- cómo viene la cosa ------------------ */}
        <dl className="grid grid-cols-2 gap-x-3 gap-y-2 rounded-xl bg-[#FCFAF6] dark:bg-[#2D2D2D] px-3 py-2.5">
          <Dato
            titulo="Última visita"
            valor={
              dias == null
                ? 'Nunca'
                : dias === 0
                  ? 'Hoy'
                  : `hace ${dias} ${dias === 1 ? 'día' : 'días'}`
            }
            alerta={dias == null || dias > 60}
          />
          <Dato
            titulo="Próximo"
            valor={
              proximo
                ? `${proximo.nombre} · ${fecha(cliente.proximaFecha)}`
                : 'Nada agendado'
            }
            alerta={!proximo}
          />
        </dl>

        {cliente.proximoTitulo && (
          <p className="rounded-lg bg-[#FBE5C8] dark:bg-[#2A1608]/60 px-3 py-2 text-[12px] leading-relaxed text-[#7E3C0F]">
            {cliente.proximoTitulo}
          </p>
        )}

        {/* ------------------------- salidas a Google Maps ------------------ */}
        <div className="grid grid-cols-2 gap-2">
          <a
            href={linkUbicacion(cliente)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl border border-[var(--gm-borde)] dark:border-[#333333] bg-white dark:bg-[#1E1E1E] text-[12px] font-medium text-[#6E6559] dark:text-[#9CA3AF] transition hover:bg-[#FCFAF6] dark:hover:bg-[#2D2D2D] hover:text-[#2A2118] dark:text-[#F9FAFB]"
          >
            <ExternalLink size={13} />
            Ver ubicación
          </a>
          <a
            href={linkComoLlegar(cliente)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl bg-[#B4551A] text-[12px] font-medium text-white transition hover:bg-[#8A3F11]"
          >
            <Navigation size={13} />
            Cómo llegar
          </a>
        </div>

        {/* ------------------------------ contacto ------------------------- */}
        {!compacta && (
          <div className="flex items-center gap-2 border-t border-[var(--gm-divisor)] pt-3">
            <Accion href={tel} icono={Phone} etiqueta="Llamar" />
            <Accion href={wa} icono={MessageCircle} etiqueta="WhatsApp" externo />
            <Accion
              href={cliente.email ? `mailto:${cliente.email}` : null}
              icono={Mail}
              etiqueta="Mail"
            />
            <span className="ml-auto text-[10px] text-[var(--gm-texto-medio)] dark:text-[#6B7280]">{cliente.codigo}</span>
          </div>
        )}
      </div>
    </article>
  );
}

function Dato({ titulo, valor, alerta }) {
  return (
    <div>
      <dt className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--gm-texto-medio)] dark:text-[#6B7280]">
        {titulo}
      </dt>
      <dd className={`mt-0.5 text-[12px] ${alerta ? 'text-[#B4551A]' : 'text-[#2A2118] dark:text-[#F9FAFB]'}`}>
        {valor}
      </dd>
    </div>
  );
}

function Accion({ href, icono: Icono, etiqueta, externo }) {
  const clase =
    'inline-flex h-8 flex-1 items-center justify-center gap-1.5 rounded-lg border border-[var(--gm-borde)] dark:border-[#333333] text-[11px] font-medium transition';
  if (!href) {
    return (
      <span
        className={`${clase} cursor-not-allowed bg-[#FCFAF6] dark:bg-[#2D2D2D] text-[var(--gm-texto-suave)]`}
        title={`Sin ${etiqueta.toLowerCase()} cargado`}
      >
        <Icono size={12} />
        {etiqueta}
      </span>
    );
  }
  return (
    <a
      href={href}
      target={externo ? '_blank' : undefined}
      rel={externo ? 'noreferrer' : undefined}
      className={`${clase} bg-white dark:bg-[#1E1E1E] text-[#6E6559] dark:text-[#9CA3AF] hover:bg-[#FCFAF6] dark:hover:bg-[#2D2D2D] hover:text-[#2A2118] dark:text-[#F9FAFB]`}
    >
      <Icono size={12} />
      {etiqueta}
    </a>
  );
}
