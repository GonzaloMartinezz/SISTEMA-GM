// ============================================================================
// SISTEMA GM · NOTARIO 360° · PESTAÑA 6 · HISTORIALES
// ----------------------------------------------------------------------------
// Trazabilidad completa: llamados al titular, notas grabadas y visitas físicas.
// ============================================================================

import React from 'react';
import { PhoneCall, StickyNote, MapPinned, Plus } from 'lucide-react';
import { useCuenta } from '../../../shared/cuentas/CuentaContext';
import PanelTerminal, { SinDatos } from '../../../shared/ui/PanelTerminal';

const colorTipoNota = (tipo = '') => {
  const t = tipo.toLowerCase();
  if (t.includes('alerta')) return 'border-rose-500/40 bg-rose-500/10 text-rose-400';
  if (t.includes('operativa')) return 'border-gray-600 bg-gray-800 text-gray-400';
  return 'border-amber-500/40 bg-amber-500/10 text-amber-400';
};

export default function TabHistoriales({ onRegistrarLlamado, onNuevaNota }) {
  const { cuenta } = useCuenta();
  if (!cuenta) return null;

  const { llamados = [], notas = [], visitas = [] } = cuenta.historial || {};

  const botonAgregar = (onClick, label) => (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1 font-mono text-[9px] uppercase tracking-[0.15em] text-gray-500 transition-colors hover:text-cyan-400"
    >
      <Plus className="h-3 w-3" />
      {label}
    </button>
  );

  return (
    <div className="grid h-full min-h-0 grid-cols-1 gap-3 xl:grid-cols-3">
      {/* ---------- Llamados ---------- */}
      <PanelTerminal
        titulo="Historial de llamados al titular"
        className="min-h-[220px]"
        acciones={onRegistrarLlamado ? botonAgregar(onRegistrarLlamado, 'Grabar') : null}
      >
        {llamados.length ? (
          <ul className="divide-y divide-gray-800">
            {llamados.map((ll, i) => (
              <li key={i} className="space-y-1.5 p-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                    <PhoneCall className="h-3 w-3" />
                    {ll.contacto}
                  </span>
                  <span className="font-mono text-[10px] text-gray-600">{ll.fecha}</span>
                </div>
                <p className="font-mono text-[10px] uppercase tracking-wider text-gray-500">
                  Atendió: <span className="text-gray-300">{ll.quienAtiende || '—'}</span>
                </p>
                <p className="text-xs leading-relaxed text-gray-200">{ll.respuesta}</p>
                {ll.proximoEvento && (
                  <p className="rounded border border-gray-800 bg-gray-950/60 px-2 py-1 font-mono text-[10px] text-amber-400">
                    Próximo: {ll.proximoEvento}
                  </p>
                )}
                <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-gray-700">
                  Op. {ll.operador}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <SinDatos mensaje="Sin llamados registrados" />
        )}
      </PanelTerminal>

      {/* ---------- Notas ---------- */}
      <PanelTerminal
        titulo="Notas grabadas"
        acento="ambar"
        className="min-h-[220px]"
        acciones={onNuevaNota ? botonAgregar(onNuevaNota, 'Nueva') : null}
      >
        {notas.length ? (
          <ul className="divide-y divide-gray-800">
            {notas.map((n, i) => (
              <li key={i} className="space-y-2 p-3">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`inline-flex items-center gap-1 rounded border px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider ${colorTipoNota(n.tipo)}`}
                  >
                    <StickyNote className="h-2.5 w-2.5" />
                    {n.tipo}
                  </span>
                  <span className="font-mono text-[10px] text-gray-600">{n.fecha}</span>
                </div>
                <p className="text-xs leading-relaxed text-gray-200">{n.texto}</p>
                <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-gray-700">
                  Op. {n.operador}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <SinDatos mensaje="Sin notas cargadas" />
        )}
      </PanelTerminal>

      {/* ---------- Visitas ---------- */}
      <PanelTerminal titulo="Últimas visitas físicas" acento="verde" className="min-h-[220px]">
        {visitas.length ? (
          <ul className="divide-y divide-gray-800">
            {visitas.map((v, i) => (
              <li key={i} className="space-y-1.5 p-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                    <MapPinned className="h-3 w-3" />
                    {v.motivo}
                  </span>
                  <span className="font-mono text-[10px] text-gray-600">{v.fecha}</span>
                </div>
                <p className="font-mono text-[10px] uppercase tracking-wider text-gray-500">
                  {v.lugar}
                </p>
                <p className="text-xs leading-relaxed text-gray-200">{v.resultado}</p>
              </li>
            ))}
          </ul>
        ) : (
          <SinDatos mensaje="Sin visitas registradas" />
        )}
      </PanelTerminal>
    </div>
  );
}
