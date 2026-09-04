// ============================================================================
// SISTEMA GM · UI · CONFIRMACIÓN DE BORRADO
// ----------------------------------------------------------------------------
// Nada se borra sin decir qué se borra. El botón destructivo nunca es el que
// tiene el foco por defecto.
// ============================================================================

import React, { useState } from 'react';
import { Loader2, TriangleAlert } from 'lucide-react';
import ModalGm from './ModalGm';
import BotonGm from './BotonGm';
import { useTema } from './TemaProvider';

export default function ConfirmarGm({
  abierto,
  titulo = 'Confirmar borrado',
  detalle,
  advertencia,
  textoBoton = 'Eliminar',
  onCerrar,
  onConfirmar,
}) {
  const { tinte } = useTema();
  const [borrando, setBorrando] = useState(false);
  const [error, setError] = useState('');

  const confirmar = async () => {
    if (borrando) return;
    setBorrando(true);
    setError('');
    try {
      await onConfirmar();
      onCerrar?.();
    } catch (err) {
      setError(err.message || 'No se pudo eliminar.');
    } finally {
      setBorrando(false);
    }
  };

  return (
    <ModalGm
      abierto={abierto}
      titulo={titulo}
      onCerrar={borrando ? undefined : onCerrar}
      ancho="max-w-md"
      pie={
        <>
          <BotonGm variante="fantasma" onClick={onCerrar} disabled={borrando}>
            Cancelar
          </BotonGm>
          <BotonGm variante="peligro" onClick={confirmar} disabled={borrando}>
            {borrando && <Loader2 size={15} className="animate-spin" />}
            {borrando ? 'Eliminando…' : textoBoton}
          </BotonGm>
        </>
      }
    >
      <div className="flex items-start gap-3">
        <span
          className="grid h-10 w-10 shrink-0 place-items-center rounded-xl"
          style={{ backgroundColor: tinte.peligro.bg, color: tinte.peligro.fg }}
        >
          <TriangleAlert size={19} />
        </span>
        <div className="min-w-0">
          {detalle && <p className="text-[14px] leading-relaxed text-[var(--gm-texto)]">{detalle}</p>}
          {advertencia && (
            <p className="mt-2 text-[13px] leading-relaxed text-[var(--gm-texto-medio)]">
              {advertencia}
            </p>
          )}
          {error && (
            <p className="mt-3 text-[13px]" style={{ color: tinte.peligro.fg }}>
              {error}
            </p>
          )}
        </div>
      </div>
    </ModalGm>
  );
}
