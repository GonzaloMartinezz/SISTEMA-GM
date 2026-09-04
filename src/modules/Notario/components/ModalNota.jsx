// ============================================================================
// SISTEMA GM · M-06 · ESCRIBIR UNA NOTA
// ----------------------------------------------------------------------------
// No usa el formulario genérico del sistema porque el campo importante de esta
// pantalla —de qué habla la nota— es un buscador sobre todo el sistema, y eso
// no entra en un desplegable.
//
// El único campo obligatorio es el texto. El título, el tipo, la entidad y las
// etiquetas ayudan a encontrarla después, pero si están de más se convierten en
// fricción: una nota que cuesta escribir no se escribe, y una nota que no se
// escribe no sirve para nada.
// ============================================================================

import React, { useEffect, useState } from 'react';
import { AlertTriangle, Loader2, Pin } from 'lucide-react';
import ModalGm from '../../../shared/gm-ui/ModalGm';
import BotonGm from '../../../shared/gm-ui/BotonGm';
import { TIPOS_NOTA } from '../config/notario.config';
import SelectorEntidad from './SelectorEntidad';

const INPUT =
  'h-11 w-full rounded-xl border border-[#E8E0D5] bg-white px-3.5 text-[14px] text-[#2A2118] outline-none transition placeholder:text-[#B0A697] focus:border-[#2F6DA0] focus:ring-4 focus:ring-[#2F6DA0]/10';

const vacia = (previo = {}) => ({
  titulo: '',
  texto: '',
  tipo: 'operativa',
  entidad: null,
  entidadCodigo: null,
  etiquetas: '',
  fijada: false,
  ...previo,
});

export default function ModalNota({ nota, entidades, entidadFija, onCerrar, onGuardar }) {
  const [form, setForm] = useState(vacia);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');

  const esNueva = nota === 'nueva';

  useEffect(() => {
    if (!nota) return;
    setError('');
    if (esNueva) {
      setForm(vacia(entidadFija ? { entidad: entidadFija.entidad, entidadCodigo: entidadFija.codigo } : {}));
    } else {
      setForm({
        titulo: nota.titulo || '',
        texto: nota.texto || '',
        tipo: nota.tipo || 'operativa',
        entidad: nota.entidad,
        entidadCodigo: nota.entidadCodigo,
        etiquetas: (nota.etiquetas || []).join(', '),
        fijada: Boolean(nota.fijada),
      });
    }
  }, [nota, esNueva, entidadFija]);

  const set = (clave) => (e) => setForm((f) => ({ ...f, [clave]: e.target.value }));

  const guardar = async () => {
    if (!form.texto.trim()) {
      setError('Escribí el texto de la nota: es lo único que no puede faltar.');
      return;
    }
    setGuardando(true);
    setError('');
    try {
      await onGuardar({ ...form, id: esNueva ? null : nota.id }, esNueva);
      onCerrar?.();
    } catch (err) {
      setError(err.message || 'No se pudo guardar.');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <ModalGm
      abierto={Boolean(nota)}
      titulo={esNueva ? 'Nueva nota' : `Editar ${nota?.id}`}
      bajada="Módulo 6 · Notario 360. Lo único obligatorio es el texto."
      onCerrar={guardando ? undefined : onCerrar}
      ancho="max-w-3xl"
      pie={
        // Envuelto en un único contenedor con flex-wrap: en celular el pie del
        // modal es angosto y las tres acciones no entran en una sola fila.
        <div className="flex w-full flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setForm((f) => ({ ...f, fijada: !f.fijada }))}
            className={`inline-flex h-11 items-center gap-2 rounded-xl border px-3.5 text-[13px] font-medium transition ${
              form.fijada
                ? 'border-[#B4551A66] bg-[#FBE5C8] text-[#8A3F11]'
                : 'border-[#E8E0D5] bg-white text-[#948A7C] hover:bg-[#FCFAF6]'
            }`}
          >
            <Pin size={15} />
            {form.fijada ? 'Fijada arriba' : 'Fijar arriba'}
          </button>
          <div className="ml-auto flex items-center gap-2">
            <BotonGm variante="fantasma" onClick={onCerrar} disabled={guardando}>
              Cancelar
            </BotonGm>
            <BotonGm variante="solido" onClick={guardar} disabled={guardando}>
              {guardando && <Loader2 size={15} className="animate-spin" />}
              {guardando ? 'Guardando…' : esNueva ? 'Guardar nota' : 'Guardar cambios'}
            </BotonGm>
          </div>
        </div>
      }
    >
      {error && (
        <div className="mb-4 flex items-start gap-2 rounded-xl border border-[#EDCBB4] bg-[#FBEAE0] px-3.5 py-3 text-[13px] text-[#A63A0C]">
          <AlertTriangle size={15} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-4">
        {/* ------------------------------- tipo ---------------------------- */}
        <div>
          <p className="mb-2 text-[12px] font-medium text-[#6E6559]">Qué clase de nota es</p>
          <div className="flex flex-wrap gap-2">
            {TIPOS_NOTA.map((t) => {
              const activo = form.tipo === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  title={t.bajada}
                  onClick={() => setForm((f) => ({ ...f, tipo: t.id }))}
                  className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] font-medium transition"
                  style={
                    activo
                      ? { backgroundColor: `${t.color}1A`, borderColor: `${t.color}66`, color: '#3D3225' }
                      : { backgroundColor: '#FFFFFF', borderColor: '#E8E0D5', color: '#948A7C' }
                  }
                >
                  <t.icono size={13} style={{ color: activo ? t.color : '#C6BCAC' }} />
                  {t.nombre}
                </button>
              );
            })}
          </div>
        </div>

        {/* ------------------------------ título --------------------------- */}
        <label className="flex flex-col gap-1.5">
          <span className="text-[12px] font-medium text-[#6E6559]">
            Título <span className="font-normal text-[#B0A697]">(opcional, ayuda a encontrarla)</span>
          </span>
          <input
            type="text"
            value={form.titulo}
            onChange={set('titulo')}
            placeholder="El autoclave viene sin manguera"
            className={INPUT}
          />
        </label>

        {/* ------------------------------- texto --------------------------- */}
        <label className="flex flex-col gap-1.5">
          <span className="text-[12px] font-medium text-[#6E6559]">
            La nota <span className="text-[#B4551A]">*</span>
          </span>
          <textarea
            rows={5}
            value={form.texto}
            onChange={set('texto')}
            placeholder="Escribí lo que no querés olvidarte."
            className={`${INPUT} h-auto py-2.5 leading-relaxed`}
          />
        </label>

        {/* ------------------------------ entidad -------------------------- */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[12px] font-medium text-[#6E6559]">
            ¿De qué habla?{' '}
            <span className="font-normal text-[#B0A697]">
              (opcional: si la dejás vacía queda como nota suelta)
            </span>
          </span>
          <SelectorEntidad
            entidades={entidades}
            valor={form.entidad ? { entidad: form.entidad, codigo: form.entidadCodigo } : null}
            onCambiar={(v) =>
              setForm((f) => ({
                ...f,
                entidad: v?.entidad || null,
                entidadCodigo: v?.codigo || null,
              }))
            }
          />
        </div>

        {/* ----------------------------- etiquetas ------------------------- */}
        <label className="flex flex-col gap-1.5">
          <span className="text-[12px] font-medium text-[#6E6559]">Etiquetas</span>
          <input
            type="text"
            value={form.etiquetas}
            onChange={set('etiquetas')}
            placeholder="proveedor, precio, urgente"
            className={INPUT}
          />
          <span className="text-[11px] text-[#B0A697]">
            Separadas por coma. Se guardan en minúscula para que “Precio” y “precio” sean la misma.
          </span>
        </label>
      </div>
    </ModalGm>
  );
}
