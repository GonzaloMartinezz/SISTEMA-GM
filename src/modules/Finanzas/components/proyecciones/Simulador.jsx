// ============================================================================
// SISTEMA GM · M-03 TESORERÍA · SIMULADOR DE RENTABILIDAD
// ----------------------------------------------------------------------------
// La pregunta de todos los días: "si le hago 15% de descuento, ¿me sigue
// conviniendo?". La cuenta la hace simularOperacion() en el servicio; acá se
// pide el dato y se muestra el resultado con un semáforo.
// ============================================================================

import React, { useMemo, useState } from 'react';
import { Calculator } from 'lucide-react';
import { simularOperacion } from '../../../../shared/finanzas/finanzasService';

const BASE_INPUT =
  'h-11 w-full rounded-xl border border-[#E8E0D5] dark:border-[#333333] bg-[#FFFFFF] dark:bg-[#1E1E1E] px-3.5 text-[14px] text-[#2A2118] dark:text-[#F9FAFB] outline-none transition focus:border-[#B4551A] focus:ring-4 focus:ring-[#B4551A]/10';

const SEMAFORO = [
  { min: 25, texto: 'Conviene', color: '#1F6F53', fondo: '#DFF0E8' },
  { min: 12, texto: 'Justo', color: '#7A5600', fondo: '#FAF0D9' },
  { min: -Infinity, texto: 'No conviene', color: '#A63A0C', fondo: '#FBEAE0' },
];

function Fila({ etiqueta, valor, fuerte = false, negativo = false }) {
  return (
    <div className="flex items-baseline justify-between gap-3 py-2">
      <span className={`text-[13px] ${fuerte ? 'text-[#2A2118] dark:text-[#F9FAFB]' : 'text-[#6E6559] dark:text-[#9CA3AF]'}`}>{etiqueta}</span>
      <span
        className={`${fuerte ? 'text-[15px] font-semibold' : 'text-[14px]'}`}
        style={{ color: negativo ? '#A63A0C' : '#2A2118' }}
      >
        {valor}
      </span>
    </div>
  );
}

export default function Simulador({ comisionPct = 8, enMoneda }) {
  const [form, setForm] = useState({
    precioUsd: 15900,
    costoUsd: 10400,
    logisticaUsd: 320,
    descuentoPct: 10,
  });

  const r = useMemo(() => simularOperacion({ ...form, comisionPct }), [form, comisionPct]);
  const tono = SEMAFORO.find((s) => r.margenPct >= s.min) || SEMAFORO[SEMAFORO.length - 1];

  const set = (campo) => (e) => setForm((f) => ({ ...f, [campo]: Number(e.target.value) || 0 }));

  const campos = [
    ['precioUsd', 'Precio de lista USD'],
    ['costoUsd', 'Costo USD'],
    ['logisticaUsd', 'Logística USD'],
    ['descuentoPct', 'Descuento %'],
  ];

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {campos.map(([clave, etiqueta]) => (
          <label key={clave} className="flex flex-col gap-1.5">
            <span className="text-[12px] font-medium text-[#6E6559] dark:text-[#9CA3AF]">{etiqueta}</span>
            <input type="number" value={form[clave]} onChange={set(clave)} className={BASE_INPUT} />
          </label>
        ))}
      </div>

      <div className="rounded-xl border border-[#E8E0D5] dark:border-[#333333] p-4">
        <div className="divide-y divide-[#F4EFE7]">
          <Fila etiqueta="Precio final al cliente" valor={enMoneda(r.precioFinal)} />
          <Fila etiqueta={`Comisión ${comisionPct}%`} valor={`− ${enMoneda(r.comisionUsd)}`} negativo />
          <Fila etiqueta="Margen antes de comisión" valor={enMoneda(r.margenUsd)} />
          <Fila
            etiqueta="Te queda"
            valor={enMoneda(r.margenNetoUsd)}
            fuerte
            negativo={r.margenNetoUsd < 0}
          />
        </div>

        <div
          className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl px-4 py-3"
          style={{ backgroundColor: tono.fondo }}
        >
          <span className="inline-flex items-center gap-2 text-[14px] font-semibold" style={{ color: tono.color }}>
            <Calculator size={16} />
            {tono.texto}
          </span>
          <span className="text-[13px]" style={{ color: tono.color }}>
            margen {r.margenPct.toFixed(1)}% · markup {r.markupPct.toFixed(1)}% sobre el costo
          </span>
        </div>
      </div>

      <p className="text-[12px] leading-relaxed text-[#948A7C]">
        El semáforo usa el margen sobre el precio final: verde arriba de 25%, amarillo entre 12 y 25,
        rojo por debajo. Son los umbrales del negocio, no una regla general.
      </p>
    </div>
  );
}
