// ============================================================================
// SISTEMA GM · M-07 · EL PIN
// ----------------------------------------------------------------------------
// Gota clásica, con el color del estado de la relación. El seleccionado crece y
// le aparece un halo: se distingue por forma y por tamaño, no sólo por color,
// así que se sigue viendo cuál está elegido aunque los tonos no se distingan.
//
// El pin sin coordenadas no existe: no hay un "pin gris en el centro". Si no se
// sabe dónde está, no se dibuja, y la lista lo dice aparte.
// ============================================================================

import React from 'react';

export default function PinMapa({ color, activo, etiqueta, numero, enCalle = true }) {
  const alto = activo ? 34 : 26;
  const ancho = alto * 0.72;

  return (
    <span className="relative block" style={{ width: ancho, height: alto }}>
      {activo && (
        <span
          className="absolute left-1/2 top-full h-3 w-3 -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full"
          style={{ backgroundColor: color, opacity: 0.35 }}
          aria-hidden="true"
        />
      )}

      <svg viewBox="0 0 24 32" width={ancho} height={alto} className="drop-shadow-[0_2px_3px_rgba(26,26,24,0.35)]">
        {enCalle ? (
          <path
            d="M12 0C5.4 0 0 5.4 0 12c0 8.4 12 20 12 20s12-11.6 12-20C24 5.4 18.6 0 12 0z"
            fill={color}
            stroke="#FFFFFF"
            strokeWidth="2"
          />
        ) : (
          // Lo que no obliga a salir (llamadas, mensajes, mails) se dibuja
          // cuadrado: se distingue del pin de visita sin depender del color.
          <rect x="1" y="1" width="22" height="22" rx="6" fill={color} stroke="#FFFFFF" strokeWidth="2" />
        )}
        {numero != null && (
          <text
            x="12" y={enCalle ? 16 : 13}
            textAnchor="middle" dominantBaseline="middle"
            fill="#FFFFFF" fontSize="11" fontWeight="700"
          >
            {numero}
          </text>
        )}
      </svg>

      {activo && etiqueta && (
        <span className="absolute left-1/2 top-full mt-1.5 -translate-x-1/2 whitespace-nowrap rounded-md bg-white dark:bg-[#1E1E1E]/95 px-1.5 py-0.5 text-[10px] font-medium text-[#2A2118] dark:text-[#F9FAFB] shadow-[0_2px_8px_-2px_rgba(26,26,24,0.3)]">
          {etiqueta}
        </span>
      )}
    </span>
  );
}
