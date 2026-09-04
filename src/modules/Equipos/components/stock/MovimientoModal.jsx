// ============================================================================
// SISTEMA GM · M-02 EQUIPAMIENTOS · REGISTRAR MOVIMIENTO
// ----------------------------------------------------------------------------
// Un formulario chico y muy explícito: qué equipo, cuánto y por qué. Arriba
// se ve el stock actual y abajo cómo va a quedar, así no hace falta hacer la
// cuenta mentalmente antes de confirmar.
// ============================================================================

import React, { useMemo, useState } from 'react';
import { AlertTriangle, Loader2, Minus, Plus, Truck } from 'lucide-react';
import ModalGm from '../../../../shared/gm-ui/ModalGm';
import BotonGm from '../../../../shared/gm-ui/BotonGm';

const TIPOS = {
  egreso: {
    titulo: 'Registrar salida',
    bajada: 'Una venta, una rotura o un ajuste en contra.',
    icono: Minus,
    verbo: 'Descontar',
    motivos: ['Venta', 'Muestra / demo', 'Rotura', 'Devolución al proveedor', 'Ajuste de inventario'],
  },
  ingreso: {
    titulo: 'Registrar ingreso',
    bajada: 'Una compra que ya está en el depósito o una devolución del cliente.',
    icono: Plus,
    verbo: 'Sumar',
    motivos: ['Compra', 'Devolución del cliente', 'Ajuste de inventario'],
  },
  transito: {
    titulo: 'Llegó mercadería',
    bajada: 'Pasa unidades de "en camino" al depósito.',
    icono: Truck,
    verbo: 'Ingresar',
    motivos: ['Llegó el envío', 'Entrega parcial'],
  },
};

const BASE_INPUT =
  'h-11 w-full rounded-xl border border-[#E8E0D5] dark:border-[#333333] bg-[#FFFFFF] dark:bg-[#1E1E1E] px-3.5 text-[14px] text-[#2A2118] dark:text-[#F9FAFB] outline-none transition placeholder:text-[#B0A697] dark:text-[#6B7280] focus:border-[#B4551A] focus:ring-4 focus:ring-[#B4551A]/10';

export default function MovimientoModal({ equipo, tipo, onCerrar, onConfirmar }) {
  const cfg = TIPOS[tipo] || TIPOS.egreso;
  const [cantidad, setCantidad] = useState(1);
  const [motivo, setMotivo] = useState(cfg.motivos[0]);
  const [detalle, setDetalle] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');

  const disponible = tipo === 'transito' ? equipo?.transito ?? 0 : equipo?.stock ?? 0;

  const resultado = useMemo(() => {
    const n = Number(cantidad) || 0;
    if (!equipo) return null;
    if (tipo === 'egreso') return equipo.stock - n;
    return equipo.stock + n;
  }, [cantidad, equipo, tipo]);

  if (!equipo) return null;

  const excede = tipo !== 'ingreso' && Number(cantidad) > disponible;

  const confirmar = async () => {
    const n = Number(cantidad);
    if (!n || n <= 0) {
      setError('La cantidad tiene que ser mayor a cero.');
      return;
    }
    if (excede) {
      setError(
        tipo === 'transito'
          ? `En camino hay ${disponible} unidades.`
          : `En el depósito hay ${disponible} unidades.`
      );
      return;
    }

    setGuardando(true);
    setError('');
    try {
      await onConfirmar({
        codigo: equipo.codigo,
        tipo,
        cantidad: n,
        motivo: [motivo, detalle].filter(Boolean).join(' · '),
      });
      onCerrar();
    } catch (err) {
      setError(err.message || 'No se pudo registrar el movimiento.');
    } finally {
      setGuardando(false);
    }
  };

  const Icono = cfg.icono;

  return (
    <ModalGm
      abierto
      titulo={cfg.titulo}
      bajada={cfg.bajada}
      onCerrar={guardando ? undefined : onCerrar}
      ancho="max-w-lg"
      pie={
        <>
          <BotonGm variante="fantasma" onClick={onCerrar} disabled={guardando}>
            Cancelar
          </BotonGm>
          <BotonGm variante="solido" onClick={confirmar} disabled={guardando}>
            {guardando && <Loader2 size={15} className="animate-spin" />}
            {guardando ? 'Registrando…' : `${cfg.verbo} ${cantidad || 0}`}
          </BotonGm>
        </>
      }
    >
      {/* Estado actual */}
      <div className="flex items-center gap-3 rounded-xl bg-[#FCFAF6] dark:bg-[#2D2D2D] p-4">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#FBE5C8] dark:bg-[#2A1608] text-[#8A3F11]">
          <Icono size={18} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[14px] font-medium text-[#2A2118] dark:text-[#F9FAFB]">{equipo.nombre}</p>
          <p className="truncate text-[12px] text-[#B0A697] dark:text-[#6B7280]">
            {equipo.codigo} · hoy hay {equipo.stock} en depósito
            {equipo.transito > 0 ? ` y ${equipo.transito} en camino` : ''}
          </p>
        </div>
      </div>

      {error && (
        <div className="mt-4 flex items-start gap-2 rounded-xl border border-[#EDCBB4] bg-[#FBEAE0] px-3.5 py-3 text-[13px] text-[#A63A0C]">
          <AlertTriangle size={15} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5">
          <span className="text-[12px] font-medium text-[#6E6559] dark:text-[#9CA3AF]">Cantidad</span>
          <input
            type="number"
            min="1"
            value={cantidad}
            onChange={(e) => setCantidad(e.target.value)}
            className={BASE_INPUT}
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-[12px] font-medium text-[#6E6559] dark:text-[#9CA3AF]">Motivo</span>
          <select value={motivo} onChange={(e) => setMotivo(e.target.value)} className={BASE_INPUT}>
            {cfg.motivos.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5 sm:col-span-2">
          <span className="text-[12px] font-medium text-[#6E6559] dark:text-[#9CA3AF]">
            Detalle <span className="text-[#B0A697] dark:text-[#6B7280]">(opcional)</span>
          </span>
          <input
            type="text"
            value={detalle}
            onChange={(e) => setDetalle(e.target.value)}
            placeholder="A qué cliente, número de remito, quién lo llevó…"
            className={BASE_INPUT}
          />
        </label>
      </div>

      {/* Cómo queda */}
      <p className="mt-5 text-[13px] text-[#6E6559] dark:text-[#9CA3AF]">
        Después de este movimiento el depósito queda en{' '}
        <span className="font-semibold text-[#2A2118] dark:text-[#F9FAFB]">{Math.max(resultado ?? 0, 0)}</span>
        {resultado != null && resultado < equipo.minStock && (
          <span className="text-[#A63A0C]"> — por debajo del mínimo de {equipo.minStock}</span>
        )}
        .
      </p>
    </ModalGm>
  );
}
