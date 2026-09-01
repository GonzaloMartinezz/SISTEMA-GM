// ============================================================================
// SISTEMA GM · SEGUIMIENTOS · ENVÍO CON RESPUESTAS RÁPIDAS
// ----------------------------------------------------------------------------
// Elegís una plantilla, la ves ya interpolada con los datos del lead, la podés
// editar y sale por WhatsApp o por mail con un clic.
// ============================================================================

import React, { useEffect, useMemo, useState } from 'react';
import { X, MessageCircle, Mail, Send, Copy, Check } from 'lucide-react';
import { listarPlantillas } from '../services/leadsService';
import { interpolar, linkWhatsApp, linkEmail } from '../utils/contacto';
import { getEtapa } from '../config/pipeline.config';

export default function EnviarMensajeModal({ lead, canalInicial = 'whatsapp', onCerrar, onEnviado }) {
  const [canal, setCanal] = useState(canalInicial);
  const [plantillas, setPlantillas] = useState([]);
  const [plantillaId, setPlantillaId] = useState(null);
  const [texto, setTexto] = useState('');
  const [asunto, setAsunto] = useState('');
  const [copiado, setCopiado] = useState(false);

  // Repositorio de respuestas rápidas (Supabase)
  useEffect(() => {
    let vivo = true;
    listarPlantillas().then((p) => vivo && setPlantillas(p));
    return () => {
      vivo = false;
    };
  }, []);

  const disponibles = useMemo(
    () => plantillas.filter((p) => p.canal === canal),
    [plantillas, canal]
  );

  // Al abrir o cambiar de canal, sugiere la plantilla de la etapa del lead
  useEffect(() => {
    if (!lead) return;
    const sugerida =
      disponibles.find((p) => p.etapa === lead.etapa) || disponibles[0] || null;
    setPlantillaId(sugerida?.id || null);
    setTexto(sugerida ? interpolar(sugerida.texto, lead) : '');
    setAsunto(sugerida?.asunto ? interpolar(sugerida.asunto, lead) : '');
  }, [lead, canal, disponibles]);

  if (!lead) return null;

  const etapa = getEtapa(lead.etapa);

  const elegirPlantilla = (p) => {
    setPlantillaId(p.id);
    setTexto(interpolar(p.texto, lead));
    setAsunto(p.asunto ? interpolar(p.asunto, lead) : '');
  };

  const enviar = () => {
    const url =
      canal === 'whatsapp' ? linkWhatsApp(lead, texto) : linkEmail(lead, asunto, texto);
    if (!url) return;
    window.open(url, '_blank', 'noreferrer');
    onEnviado?.(lead.id, canal === 'whatsapp' ? 'WhatsApp' : 'Email');
    onCerrar();
  };

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(texto);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 1800);
    } catch {
      /* el navegador puede bloquear el portapapeles */
    }
  };

  const puedeEnviar =
    canal === 'whatsapp' ? Boolean(lead.telefono && texto.trim()) : Boolean(lead.email && texto.trim());

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm">
      <div className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl border border-gray-700 bg-gray-950 shadow-2xl">
        {/* Cabecera */}
        <div className="flex shrink-0 items-center justify-between border-b border-gray-800 bg-gray-900 px-4 py-3">
          <div className="min-w-0">
            <h3 className="truncate text-sm font-bold text-white">
              {lead.apellido}, {lead.nombre}
            </h3>
            <p className="truncate font-mono text-[10px] uppercase tracking-wider text-gray-500">
              {lead.clinica} · <span className={etapa.color}>{etapa.label}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={onCerrar}
            className="rounded p-1 text-gray-500 transition-colors hover:bg-gray-800 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Selector de canal */}
        <div className="flex shrink-0 gap-1 border-b border-gray-800 bg-gray-950 px-4 py-2">
          {[
            { id: 'whatsapp', label: 'WhatsApp', icon: MessageCircle, ok: Boolean(lead.telefono) },
            { id: 'email', label: 'Email', icon: Mail, ok: Boolean(lead.email) },
          ].map((c) => {
            const Icon = c.icon;
            return (
              <button
                key={c.id}
                type="button"
                disabled={!c.ok}
                onClick={() => setCanal(c.id)}
                className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.15em] transition-colors disabled:opacity-30 ${
                  canal === c.id
                    ? 'border-cyan-500/50 bg-cyan-500/10 text-cyan-400'
                    : 'border-gray-700 text-gray-500 hover:text-gray-300'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {c.label}
              </button>
            );
          })}
        </div>

        {/* Cuerpo */}
        <div className="grid min-h-0 flex-1 grid-cols-1 overflow-hidden md:grid-cols-[220px_1fr]">
          {/* Repositorio de plantillas */}
          <aside className="min-h-0 overflow-y-auto border-b border-gray-800 bg-gray-950 p-2 md:border-b-0 md:border-r">
            <p className="mb-2 px-1 font-mono text-[9px] uppercase tracking-[0.2em] text-gray-600">
              Respuestas rápidas
            </p>
            <div className="space-y-1">
              {disponibles.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => elegirPlantilla(p)}
                  className={`w-full rounded border px-2 py-1.5 text-left transition-colors ${
                    plantillaId === p.id
                      ? 'border-cyan-500/40 bg-cyan-500/10'
                      : 'border-gray-800 hover:border-gray-600 hover:bg-gray-900'
                  }`}
                >
                  <span className="block truncate text-[11px] font-semibold text-gray-200">
                    {p.titulo}
                  </span>
                  <span
                    className={`font-mono text-[8px] uppercase tracking-widest ${getEtapa(p.etapa).color}`}
                  >
                    {getEtapa(p.etapa).label}
                  </span>
                </button>
              ))}
            </div>
          </aside>

          {/* Editor */}
          <div className="flex min-h-0 flex-col gap-3 overflow-y-auto p-4">
            {canal === 'email' && (
              <div>
                <label className="mb-1 block font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-gray-500">
                  Asunto
                </label>
                <input
                  value={asunto}
                  onChange={(e) => setAsunto(e.target.value)}
                  className="w-full rounded-lg border border-gray-700 bg-black/60 px-3 py-2 text-sm text-gray-200 outline-none focus:border-cyan-500/60"
                />
              </div>
            )}

            <div className="flex min-h-0 flex-1 flex-col">
              <label className="mb-1 block font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-gray-500">
                Mensaje
              </label>
              <textarea
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
                rows={canal === 'email' ? 9 : 7}
                className="w-full flex-1 resize-none rounded-lg border border-gray-700 bg-black/60 px-3 py-2.5 text-sm leading-relaxed text-gray-200 outline-none focus:border-cyan-500/60"
              />
              <p className="mt-1.5 font-mono text-[9px] uppercase tracking-wider text-gray-700">
                Destino: {canal === 'whatsapp' ? lead.telefono || '—' : lead.email || '—'}
              </p>
            </div>

            <div className="flex shrink-0 items-center justify-end gap-2">
              <button
                type="button"
                onClick={copiar}
                className="inline-flex items-center gap-1.5 rounded-md border border-gray-700 px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400 transition-colors hover:text-white"
              >
                {copiado ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                {copiado ? 'Copiado' : 'Copiar'}
              </button>
              <button
                type="button"
                onClick={enviar}
                disabled={!puedeEnviar}
                className="inline-flex items-center gap-2 rounded-md border border-emerald-500/50 bg-emerald-500/10 px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-emerald-400 transition-colors hover:bg-emerald-500/20 disabled:opacity-30"
              >
                <Send className="h-3 w-3" />
                Enviar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
