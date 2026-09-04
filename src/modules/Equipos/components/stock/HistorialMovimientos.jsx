// ============================================================================
// SISTEMA GM · M-02 EQUIPAMIENTOS · HISTORIAL DE MOVIMIENTOS
// ----------------------------------------------------------------------------
// Quién tocó el stock, cuándo y por qué. Sirve para dos cosas: encontrar el
// error cuando un número no cierra, y saber a qué ritmo sale cada equipo.
// ============================================================================

import React from 'react';
import { History, Minus, Plus, Truck } from 'lucide-react';
import EstadoVacio from '../../../../shared/gm-ui/EstadoVacio';

const ESTILO = {
  egreso: { icono: Minus, bg: '#FBEAE0', fg: '#A63A0C', signo: '−' },
  ingreso: { icono: Plus, bg: '#DFF0E8', fg: '#1F6F53', signo: '+' },
  transito: { icono: Truck, bg: '#E3EDF6', fg: '#23557E', signo: '+' },
};

const cuando = (iso) => {
  if (!iso) return '';
  const d = new Date(iso);
  const hoy = new Date().toISOString().slice(0, 10);
  const dia = iso.slice(0, 10);
  const hora = d.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
  if (dia === hoy) return `Hoy ${hora}`;
  return `${d.toLocaleDateString('es-AR', { day: '2-digit', month: 'short' })} · ${hora}`;
};

export default function HistorialMovimientos({ movimientos = [], limite = 12 }) {
  if (!movimientos.length) {
    return (
      <EstadoVacio
        icono={History}
        titulo="Todavía no hay movimientos"
        texto="Cada venta, compra o llegada que registres queda anotada acá con su motivo."
      />
    );
  }

  return (
    <ul className="divide-y divide-[#F4EFE7]">
      {movimientos.slice(0, limite).map((m) => {
        const e = ESTILO[m.tipo] || ESTILO.ingreso;
        const Icono = e.icono;
        return (
          <li key={m.id} className="flex items-center gap-3.5 py-3 first:pt-0 last:pb-0">
            <span
              className="grid h-9 w-9 shrink-0 place-items-center rounded-xl"
              style={{ backgroundColor: e.bg, color: e.fg }}
            >
              <Icono size={16} />
            </span>

            <div className="min-w-0 flex-1">
              <p className="truncate text-[14px] text-[#2A2118] dark:text-[#F9FAFB]">{m.equipoNombre}</p>
              <p className="truncate text-[12px] text-[#B0A697] dark:text-[#6B7280]">
                {m.motivo || m.tipo}
                {m.operador ? ` · ${m.operador}` : ''}
              </p>
            </div>

            <div className="shrink-0 text-right">
              <p className="text-[15px] font-semibold" style={{ color: e.fg }}>
                {e.signo}{m.cantidad}
              </p>
              <p className="mt-0.5 text-[11px] text-[#B0A697] dark:text-[#6B7280]">{cuando(m.fecha)}</p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
