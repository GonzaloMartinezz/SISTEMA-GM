// ============================================================================
// SISTEMA GM · M-04 · ESCRIBIRLE AL LEAD
// ----------------------------------------------------------------------------
// Se elige el canal, se toma una respuesta rápida (o se escribe de cero) y se
// manda. La plantilla llega con las variables ya reemplazadas por los datos del
// lead: {nombre} sale escrito como el nombre, no como {nombre}.
//
// El texto editado NO se pisa cuando cambia la lista de plantillas. La versión
// anterior de este módulo re-sugería en cada render del efecto y le borraba al
// usuario lo que estaba escribiendo. Acá la sugerencia entra una vez por canal,
// y en cuanto se toca el texto queda marcado como tocado y no se toca más.
// ============================================================================

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Check, Copy, Mail, MessageCircle, Send } from 'lucide-react';
import ModalGm from '../../../shared/gm-ui/ModalGm';
import BotonGm from '../../../shared/gm-ui/BotonGm';
import { ChipEtapa } from './ChipEtapa';
import { getEtapa } from '../config/pipeline.config';
import { interpolar, linkWhatsApp, linkEmail } from '../utils/contacto';

const CANALES = [
  { id: 'whatsapp', nombre: 'WhatsApp', icono: MessageCircle },
  { id: 'email', nombre: 'Email', icono: Mail },
];

export default function ModalMensaje({ lead, canalInicial = 'whatsapp', plantillas = [], onCerrar, onEnviado }) {
  const [canal, setCanal] = useState(canalInicial);
  const [texto, setTexto] = useState('');
  const [asunto, setAsunto] = useState('');
  const [elegida, setElegida] = useState(null);
  const [copiado, setCopiado] = useState(false);
  const tocado = useRef(false);

  const disponibles = useMemo(
    () => plantillas.filter((p) => p.canal === canal),
    [plantillas, canal]
  );

  // Sugerencia inicial por canal: la plantilla de la etapa del lead si existe.
  useEffect(() => {
    if (tocado.current) return;
    const sugerida =
      disponibles.find((p) => p.etapa === lead?.etapa) || disponibles[0] || null;
    setElegida(sugerida?.id || null);
    setTexto(sugerida ? interpolar(sugerida.texto, lead) : '');
    setAsunto(sugerida?.asunto ? interpolar(sugerida.asunto, lead) : '');
  }, [canal, disponibles, lead]);

  const usar = (p) => {
    tocado.current = false;
    setElegida(p.id);
    setTexto(interpolar(p.texto, lead));
    setAsunto(p.asunto ? interpolar(p.asunto, lead) : '');
  };

  const cambiarCanal = (id) => {
    tocado.current = false;
    setCanal(id);
  };

  const destino = canal === 'whatsapp' ? lead?.telefono : lead?.email;
  const puedeEnviar = Boolean(destino && texto.trim());

  const enviar = () => {
    const url =
      canal === 'whatsapp' ? linkWhatsApp(lead, texto) : linkEmail(lead, asunto, texto);
    if (!url) return;
    window.open(url, '_blank', 'noreferrer');
    onEnviado?.(lead.id, {
      canal: canal === 'whatsapp' ? 'WhatsApp' : 'Email',
      texto: interpolar(texto, lead),
      asunto: canal === 'email' ? interpolar(asunto, lead) : null,
      plantilla: elegida,
    });
    onCerrar?.();
  };

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(interpolar(texto, lead));
      setCopiado(true);
      setTimeout(() => setCopiado(false), 1800);
    } catch {
      /* sin portapapeles: no es un error que valga la pena mostrarle a nadie */
    }
  };

  return (
    <ModalGm
      abierto={Boolean(lead)}
      titulo={`Escribirle a ${lead?.nombre || ''} ${lead?.apellido || ''}`.trim()}
      bajada={`${lead?.id} · ${lead?.clinica || ''}`}
      onCerrar={onCerrar}
      ancho="max-w-4xl"
      pie={
        <>
          <BotonGm variante="fantasma" icono={copiado ? Check : Copy} onClick={copiar}>
            {copiado ? 'Copiado' : 'Copiar texto'}
          </BotonGm>
          <BotonGm variante="solido" icono={Send} onClick={enviar} disabled={!puedeEnviar}>
            Abrir y registrar
          </BotonGm>
        </>
      }
    >
      <div className="grid gap-5 lg:grid-cols-[220px_minmax(0,1fr)]">
        {/* ------------------------- respuestas rápidas ------------------------ */}
        <aside className="min-w-0">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--gm-texto-tenue)]">
            Respuestas rápidas
          </p>
          <div className="max-h-[300px] space-y-1.5 overflow-y-auto pr-1">
            {disponibles.length === 0 && (
              <p className="rounded-xl border border-dashed border-[#DDD3C4] px-3 py-4 text-[12px] text-[var(--gm-texto-tenue)]">
                No hay respuestas guardadas para este canal.
              </p>
            )}
            {disponibles.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => usar(p)}
                className={`w-full rounded-xl border px-3 py-2.5 text-left transition ${
                  elegida === p.id
                    ? 'border-[#B4551A] bg-[var(--gm-acento-suave-bg)] '
                    : 'border-[var(--gm-borde)]  bg-[var(--gm-superficie)]  hover:bg-[var(--gm-superficie-suave)] '
                }`}
              >
                <p className="truncate text-[13px] font-medium text-[var(--gm-texto)]">{p.titulo}</p>
                {p.etapa && (
                  <p className="mt-1 text-[11px]" style={{ color: getEtapa(p.etapa).color }}>
                    {getEtapa(p.etapa).nombre}
                  </p>
                )}
              </button>
            ))}
          </div>
        </aside>

        {/* ------------------------------ redacción ---------------------------- */}
        <div className="min-w-0">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex overflow-hidden rounded-xl border border-[var(--gm-borde)]">
              {CANALES.map((c) => {
                const ok = c.id === 'whatsapp' ? Boolean(lead?.telefono) : Boolean(lead?.email);
                return (
                  <button
                    key={c.id}
                    type="button"
                    disabled={!ok}
                    onClick={() => cambiarCanal(c.id)}
                    title={ok ? c.nombre : `El lead no tiene ${c.id === 'whatsapp' ? 'teléfono' : 'email'}`}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-[13px] font-medium transition disabled:cursor-not-allowed disabled:opacity-40 ${
                      canal === c.id
                        ? 'bg-[var(--gm-acento-suave-bg)]  text-[var(--gm-acento-fuerte)]'
                        : 'bg-[var(--gm-superficie)]  text-[var(--gm-texto-suave)] hover:bg-[var(--gm-superficie-suave)] '
                    }`}
                  >
                    <c.icono size={14} />
                    {c.nombre}
                  </button>
                );
              })}
            </div>
            <ChipEtapa etapa={lead?.etapa} />
          </div>

          {canal === 'email' && (
            <label className="mb-3 flex flex-col gap-1.5">
              <span className="text-[12px] font-medium text-[var(--gm-texto-medio)]">Asunto</span>
              <input
                type="text"
                value={asunto}
                onChange={(e) => {
                  tocado.current = true;
                  setAsunto(e.target.value);
                }}
                className="h-11 w-full rounded-xl border border-[var(--gm-borde)] bg-[var(--gm-superficie)] px-3.5 text-[14px] text-[var(--gm-texto)] outline-none transition focus:border-[#2F6DA0] focus:ring-4 focus:ring-[#2F6DA0]/10"
              />
            </label>
          )}

          <label className="flex flex-col gap-1.5">
            <span className="text-[12px] font-medium text-[var(--gm-texto-medio)]">Mensaje</span>
            <textarea
              rows={canal === 'email' ? 9 : 8}
              value={texto}
              onChange={(e) => {
                tocado.current = true;
                setTexto(e.target.value);
              }}
              placeholder="Escribí el mensaje o elegí una respuesta rápida."
              className="w-full rounded-xl border border-[var(--gm-borde)] bg-[var(--gm-superficie)] px-3.5 py-2.5 text-[14px] leading-relaxed text-[var(--gm-texto)] outline-none transition placeholder:text-[var(--gm-texto-tenue)] focus:border-[#2F6DA0] focus:ring-4 focus:ring-[#2F6DA0]/10"
            />
          </label>

          <p className="mt-2 text-[12px] text-[var(--gm-texto-suave)]">
            Destino: <span className="text-[var(--gm-texto-medio)]">{destino || '—'}</span>
            {!destino && ' · cargale el dato al lead para poder escribirle.'}
          </p>
        </div>
      </div>
    </ModalGm>
  );
}
