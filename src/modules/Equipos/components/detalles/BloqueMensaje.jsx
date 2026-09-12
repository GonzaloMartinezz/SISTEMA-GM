// ============================================================================
// SISTEMA GM · M-02 EQUIPAMIENTOS · TEXTO LISTO PARA EL CLIENTE
// ----------------------------------------------------------------------------
// Muestra exactamente lo que se va a copiar, para que no haya sorpresas al
// pegarlo. Dos interruptores: mandar o no el precio, y mandar o no la
// disponibilidad. El costo y el margen nunca salen de acá.
// ============================================================================

import React, { useMemo, useState } from 'react';
import { Check, Copy, MessageCircle } from 'lucide-react';
import BotonGm from '../../../../shared/gm-ui/BotonGm';
import { textoParaCliente, copiar, linkWhatsApp } from '../../utils/mensaje';

function Interruptor({ activo, onChange, children }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!activo)}
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[12px] transition ${
        activo
          ? 'border-[#B4551A] bg-[#FBE5C8] dark:bg-[#2A1608] text-[#8A3F11]'
          : 'border-[var(--gm-borde)] dark:border-[#333333] bg-[var(--gm-superficie)] dark:bg-[#1E1E1E] text-[#948A7C] hover:border-[#D5CABA]'
      }`}
    >
      <span
        className={`grid h-3.5 w-3.5 place-items-center rounded-full border ${
          activo ? 'border-[#B4551A] bg-[#B4551A] text-[#FFFFFF]' : 'border-[#D5CABA]'
        }`}
      >
        {activo && <Check size={9} strokeWidth={3.5} />}
      </span>
      {children}
    </button>
  );
}

export default function BloqueMensaje({ equipo, specs = [] }) {
  const [conPrecio, setConPrecio] = useState(true);
  const [conDisponibilidad, setConDisponibilidad] = useState(true);
  const [copiado, setCopiado] = useState(false);

  const texto = useMemo(
    () => textoParaCliente(equipo, specs, { conPrecio, conDisponibilidad }),
    [equipo, specs, conPrecio, conDisponibilidad]
  );

  const alCopiar = async () => {
    const ok = await copiar(texto);
    setCopiado(ok);
    setTimeout(() => setCopiado(false), 2200);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Interruptor activo={conPrecio} onChange={setConPrecio}>
          Incluir precio
        </Interruptor>
        <Interruptor activo={conDisponibilidad} onChange={setConDisponibilidad}>
          Incluir disponibilidad
        </Interruptor>
      </div>

      <pre className="max-h-[320px] overflow-auto whitespace-pre-wrap rounded-xl border border-[var(--gm-borde)] dark:border-[#333333] bg-[#FCFAF6] dark:bg-[#2D2D2D] px-4 py-3.5 font-sans text-[13px] leading-relaxed text-[#2A2118] dark:text-[#F9FAFB]">
        {texto}
      </pre>

      <div className="flex flex-wrap gap-2">
        <BotonGm variante="solido" tamano="sm" icono={copiado ? Check : Copy} onClick={alCopiar}>
          {copiado ? 'Copiado' : 'Copiar texto'}
        </BotonGm>
        <BotonGm
          variante="contorno"
          tamano="sm"
          icono={MessageCircle}
          onClick={() => window.open(linkWhatsApp(texto), '_blank')}
        >
          Abrir en WhatsApp
        </BotonGm>
      </div>

      <p className="text-[12px] text-[var(--gm-texto-medio)] dark:text-[#6B7280]">
        El costo y el margen no se incluyen nunca: este bloque es para mandarle al cliente.
      </p>
    </div>
  );
}
