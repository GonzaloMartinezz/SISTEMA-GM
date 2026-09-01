// ============================================================================
// SISTEMA GM · EQUIPAMIENTOS · FICHA TÉCNICA
// ----------------------------------------------------------------------------
// La información que se comparte con el cliente en el momento: especificaciones
// listas para copiar o mandar por WhatsApp.
// ============================================================================

import React, { useState } from 'react';
import { X, Copy, Check, MessageCircle, Ruler, Zap, ShieldCheck } from 'lucide-react';
import { usd, pct } from '../../../shared/ui/viz';
import { getEstadoStock } from '../config/inventario.config';

const textoFicha = (e) =>
  [
    `${e.nombre} — ${e.marca} ${e.modelo}`,
    '',
    ...e.ficha.specs.map((s) => `• ${s.label}: ${s.valor}`),
    `• Dimensiones: ${e.ficha.dimensiones}`,
    `• Alimentación: ${e.ficha.consumo}`,
    e.ficha.garantiaMeses ? `• Garantía: ${e.ficha.garantiaMeses} meses` : null,
    '',
    `Precio: US$ ${e.precioUsd.toLocaleString('es-AR')}`,
    'Sistema GM · Tucumán',
  ]
    .filter(Boolean)
    .join('\n');

export default function FichaTecnicaModal({ equipo, onCerrar }) {
  const [copiado, setCopiado] = useState(false);
  if (!equipo) return null;

  const estado = getEstadoStock(equipo.estadoStock);
  const texto = textoFicha(equipo);

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(texto);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 1800);
    } catch {
      /* el navegador puede bloquear el portapapeles */
    }
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm">
      <div className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-gray-700 bg-gray-950 shadow-2xl">
        {/* Cabecera */}
        <div className="flex shrink-0 items-start justify-between gap-3 border-b border-gray-800 bg-gray-900 px-4 py-3">
          <div className="min-w-0">
            <h3 className="truncate text-sm font-bold text-white">{equipo.nombre}</h3>
            <p className="truncate font-mono text-[10px] uppercase tracking-wider text-gray-500">
              {equipo.marca} {equipo.modelo} · {equipo.id} · {equipo.categoria}
            </p>
          </div>
          <button
            type="button"
            onClick={onCerrar}
            className="shrink-0 rounded p-1 text-gray-500 transition-colors hover:bg-gray-800 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          {/* Comercial */}
          <div className="grid grid-cols-2 divide-x divide-gray-800 border-b border-gray-800 md:grid-cols-4">
            {[
              { label: 'Precio de venta', valor: usd(equipo.precioUsd), clase: 'text-gray-100' },
              { label: 'Costo', valor: usd(equipo.costoUsd), clase: 'text-gray-400' },
              { label: 'Margen', valor: pct(equipo.margenPct, 0), clase: 'text-emerald-400' },
              { label: 'Stock', valor: `${equipo.stock} + ${equipo.transito}`, clase: estado.clase },
            ].map((k) => (
              <div key={k.label} className="p-3 text-center">
                <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-gray-600">
                  {k.label}
                </p>
                <p className={`font-mono text-sm font-bold ${k.clase}`}>{k.valor}</p>
              </div>
            ))}
          </div>

          {/* Especificaciones */}
          <div className="p-4">
            <p className="mb-2 font-mono text-[9px] uppercase tracking-[0.2em] text-gray-600">
              Especificaciones técnicas
            </p>
            <dl className="divide-y divide-gray-800 rounded border border-gray-800">
              {equipo.ficha.specs.map((s) => (
                <div key={s.label} className="flex gap-4 px-3 py-2">
                  <dt className="w-40 shrink-0 font-mono text-[10px] uppercase tracking-wider text-gray-600">
                    {s.label}
                  </dt>
                  <dd className="text-xs text-gray-200">{s.valor}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
              {[
                { icon: Ruler, label: 'Dimensiones', valor: equipo.ficha.dimensiones },
                { icon: Zap, label: 'Alimentación', valor: equipo.ficha.consumo },
                {
                  icon: ShieldCheck,
                  label: 'Garantía',
                  valor: equipo.ficha.garantiaMeses
                    ? `${equipo.ficha.garantiaMeses} meses`
                    : 'Sin garantía',
                },
              ].map((d) => {
                const Icono = d.icon;
                return (
                  <div key={d.label} className="rounded border border-gray-800 bg-gray-900/60 p-2.5">
                    <p className="mb-1 flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.15em] text-gray-600">
                      <Icono className="h-3 w-3" />
                      {d.label}
                    </p>
                    <p className="text-[11px] text-gray-200">{d.valor}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Acciones */}
        <div className="flex shrink-0 items-center justify-end gap-2 border-t border-gray-800 bg-gray-900 px-4 py-3">
          <button
            type="button"
            onClick={copiar}
            className="inline-flex items-center gap-1.5 rounded border border-gray-700 px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400 transition-colors hover:text-white"
          >
            {copiado ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
            {copiado ? 'Copiado' : 'Copiar ficha'}
          </button>

          <a
            href={`https://wa.me/?text=${encodeURIComponent(texto)}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded border border-emerald-500/50 bg-emerald-500/10 px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-emerald-400 transition-colors hover:bg-emerald-500/20"
          >
            <MessageCircle className="h-3 w-3" />
            Compartir
          </a>
        </div>
      </div>
    </div>
  );
}
