// ============================================================================
// SISTEMA GM · COBRANZAS · COLA DE GESTIÓN
// ----------------------------------------------------------------------------
// Las cuentas a trabajar en el día. Se avanza con Grabar / Llamar después /
// Omitir sin salir del módulo.
// ============================================================================

import React from 'react';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function ColaGestionPanel({
  cuentas,
  cuentaActiva,
  onSeleccionar,
  gestionadas,
  titularActivo,
  estadoActivo,
  enMora,
}) {
  return (
    <div className="flex shrink-0 items-center gap-2 overflow-x-auto border-b border-gray-800 bg-gray-950/80 px-3 py-2 md:px-4">
      <span className="mr-1 shrink-0 font-mono text-[9px] uppercase tracking-[0.25em] text-gray-600">
        Cola de gestión
      </span>

      {cuentas.map((c) => {
        const activa = c.id === cuentaActiva;
        const enMora = String(c.cuenta?.estado || '').toUpperCase().includes('MORA');
        const hecha = gestionadas.includes(c.id);

        return (
          <button
            key={c.id}
            type="button"
            onClick={() => onSeleccionar(c.id)}
            className={`flex shrink-0 items-center gap-2 rounded-md border px-2.5 py-1.5 transition-all ${
              activa
                ? 'border-cyan-500/50 bg-cyan-500/10'
                : 'border-gray-800 bg-gray-900/60 hover:border-gray-600'
            }`}
          >
            {hecha ? (
              <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
            ) : (
              <span
                className={`h-1.5 w-1.5 shrink-0 rounded-full ${enMora ? 'bg-rose-400' : 'bg-gray-600'}`}
              />
            )}

            <span
              className={`whitespace-nowrap text-[11px] font-semibold ${activa ? 'text-white' : 'text-gray-400'}`}
            >
              {c.titular.apellido}, {c.titular.nombre.charAt(0)}.
            </span>

            {enMora && <AlertTriangle className="h-3 w-3 shrink-0 text-rose-400" />}
          </button>
        );
      })}

      <span className="ml-auto flex shrink-0 items-center gap-2">
        {titularActivo && (
          <span className="hidden font-mono text-[10px] uppercase tracking-[0.15em] text-gray-500 lg:inline">
            {titularActivo}
          </span>
        )}
        {estadoActivo && (
          <span
            className={`rounded border px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-[0.15em] ${
              enMora
                ? 'border-rose-500/40 bg-rose-500/10 text-rose-400'
                : 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
            }`}
          >
            {estadoActivo}
          </span>
        )}
        <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-gray-600">
          {gestionadas.length}/{cuentas.length}
        </span>
      </span>
    </div>
  );
}
