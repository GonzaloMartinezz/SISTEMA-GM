// ============================================================================
// SISTEMA GM · M-04 SEGUIMIENTOS · RESPUESTAS RÁPIDAS
// ----------------------------------------------------------------------------
// El taller de textos. Cada respuesta se guarda con su canal y, si corresponde,
// con la etapa en la que conviene usarla: eso es lo que después hace que el
// modal de envío sugiera sola la correcta.
//
// La vista previa se muestra con un lead de ejemplo real de la cartera, no con
// las llaves crudas. Escribir "{nombre}" y no ver nunca cómo queda es la mejor
// forma de mandar un WhatsApp que diga "Hola {nombre}".
// ============================================================================

import React, { useMemo, useState } from 'react';
import { Mail, MessageCircle, Pencil, Plus, Trash2, Wand2 } from 'lucide-react';
import Panel from '../../../shared/gm-ui/Panel';
import BotonGm from '../../../shared/gm-ui/BotonGm';
import Chip from '../../../shared/gm-ui/Chip';
import FormularioGm from '../../../shared/gm-ui/FormularioGm';
import ConfirmarGm from '../../../shared/gm-ui/ConfirmarGm';
import EstadoVacio from '../../../shared/gm-ui/EstadoVacio';
import { useSeguimientos } from '../context/SeguimientosContext';
import { ETAPAS, getEtapa } from '../config/pipeline.config';
import { interpolar } from '../utils/contacto';

const CANALES = [
  { id: 'whatsapp', nombre: 'WhatsApp', icono: MessageCircle, tono: 'aqua' },
  { id: 'email', nombre: 'Email', icono: Mail, tono: 'azul' },
];

const CAMPOS_PLANTILLA = [
  { clave: 'titulo', etiqueta: 'Título', tipo: 'texto', requerido: true, ancho: 2 },
  {
    clave: 'canal',
    etiqueta: 'Canal',
    tipo: 'select',
    defecto: 'whatsapp',
    requerido: true,
    opciones: [
      { valor: 'whatsapp', texto: 'WhatsApp' },
      { valor: 'email', texto: 'Email' },
    ],
  },
  {
    clave: 'etapa',
    etiqueta: 'Etapa sugerida',
    tipo: 'select',
    opciones: ETAPAS.map((e) => ({ valor: e.id, texto: e.nombre })),
    ayuda: 'Se ofrece sola cuando el lead está en esta etapa.',
  },
  {
    clave: 'asunto',
    etiqueta: 'Asunto (sólo email)',
    tipo: 'texto',
    ancho: 2,
    placeholder: 'Propuesta comercial · {equipo}',
  },
  {
    clave: 'texto',
    etiqueta: 'Texto',
    tipo: 'area',
    requerido: true,
    ancho: 2,
    ayuda: 'Variables: {nombre} {clinica} {equipo} {monto} {vendedor}',
  },
];

/** Lead de muestra para la vista previa: uno real de la cartera si hay. */
const EJEMPLO = {
  nombre: 'Marcela',
  clinica: 'Odontología Torres',
  equipo: 'sillón odontológico',
  montoUsd: 15900,
};

export default function PlantillasView() {
  const { plantillas, leads, guardarUnaPlantilla, borrarUnaPlantilla } = useSeguimientos();
  const [editando, setEditando] = useState(null);
  const [borrando, setBorrando] = useState(null);

  const muestra = leads[0] || EJEMPLO;

  const porCanal = useMemo(
    () =>
      CANALES.map((c) => ({
        ...c,
        lista: plantillas.filter((p) => p.canal === c.id),
      })),
    [plantillas]
  );

  const guardar = (valores) =>
    guardarUnaPlantilla({
      ...valores,
      id: editando === 'nueva' ? null : editando?.id,
    });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="max-w-2xl text-[13px] leading-relaxed text-[#948A7C]">
          Los textos que más usás, listos para salir. Las variables entre llaves se reemplazan solas
          con los datos del lead cuando abrís el mensaje. La vista previa de abajo usa a{' '}
          <span className="text-[#6E6559] dark:text-[#9CA3AF]">
            {muestra.nombre} {muestra.apellido || ''}
          </span>{' '}
          como ejemplo.
        </p>
        <BotonGm variante="solido" tamano="sm" icono={Plus} onClick={() => setEditando('nueva')}>
          Nueva respuesta
        </BotonGm>
      </div>

      {porCanal.map((c) => (
        <Panel
          key={c.id}
          titulo={c.nombre}
          bajada={`${c.lista.length} ${c.lista.length === 1 ? 'respuesta guardada' : 'respuestas guardadas'}`}
          acciones={<c.icono size={16} className="text-[#B0A697] dark:text-[#6B7280]" />}
        >
          {c.lista.length === 0 ? (
            <EstadoVacio
              icono={Wand2}
              titulo={`Sin respuestas de ${c.nombre}`}
              texto="Guardá los textos que repetís todos los días y dejá de escribirlos de cero."
            />
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              {c.lista.map((p) => {
                const etapa = p.etapa ? getEtapa(p.etapa) : null;
                return (
                  <article
                    key={p.id}
                    className="group relative flex flex-col overflow-hidden rounded-xl border border-[#E8E0D5] dark:border-[#333333] bg-[#FCFAF6] dark:bg-[#2D2D2D] p-4 pl-5"
                  >
                    <span
                      className="absolute inset-y-0 left-0 w-[3px]"
                      style={{ backgroundColor: etapa ? etapa.color : '#DDD3C4' }}
                      aria-hidden="true"
                    />

                    <header className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-[14px] font-semibold text-[#2A2118] dark:text-[#F9FAFB]">
                          {p.titulo}
                        </p>
                        <p className="mt-1 text-[11px] text-[#B0A697] dark:text-[#6B7280]">{p.id}</p>
                      </div>
                      <div className="flex shrink-0 items-center gap-1">
                        {etapa && <Chip tono="gris">{etapa.nombre}</Chip>}
                        <button
                          type="button"
                          aria-label="Editar respuesta"
                          onClick={() => setEditando(p)}
                          className="grid h-8 w-8 place-items-center rounded-lg text-[#948A7C] transition hover:bg-[#F3EDE4] dark:hover:bg-[#121212] hover:text-[#2A2118] dark:text-[#F9FAFB]"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          type="button"
                          aria-label="Eliminar respuesta"
                          onClick={() => setBorrando(p)}
                          className="grid h-8 w-8 place-items-center rounded-lg text-[#B0A697] dark:text-[#6B7280] transition hover:bg-[#FBEAE0] hover:text-[#A63A0C]"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </header>

                    {p.asunto && (
                      <p className="mt-3 truncate rounded-lg bg-white dark:bg-[#1E1E1E] px-3 py-2 text-[12px] text-[#6E6559] dark:text-[#9CA3AF]">
                        <span className="text-[#B0A697] dark:text-[#6B7280]">Asunto: </span>
                        {interpolar(p.asunto, muestra)}
                      </p>
                    )}

                    <p className="mt-3 whitespace-pre-line rounded-lg bg-white dark:bg-[#1E1E1E] px-3 py-2.5 text-[13px] leading-relaxed text-[#6E6559] dark:text-[#9CA3AF]">
                      {interpolar(p.texto, muestra)}
                    </p>
                  </article>
                );
              })}
            </div>
          )}
        </Panel>
      ))}

      <FormularioGm
        abierto={Boolean(editando)}
        titulo={editando === 'nueva' ? 'Nueva respuesta rápida' : 'Editar respuesta'}
        bajada="Variables disponibles: {nombre} {clinica} {equipo} {monto} {vendedor}"
        campos={CAMPOS_PLANTILLA}
        valores={editando && editando !== 'nueva' ? editando : null}
        textoBoton={editando === 'nueva' ? 'Crear respuesta' : 'Guardar cambios'}
        onCerrar={() => setEditando(null)}
        onGuardar={guardar}
      />

      <ConfirmarGm
        abierto={Boolean(borrando)}
        titulo="¿Eliminar esta respuesta rápida?"
        detalle={borrando ? `${borrando.id} · ${borrando.titulo}` : ''}
        advertencia="Los mensajes que ya se mandaron con este texto no se tocan: queda guardado lo que se envió."
        onCerrar={() => setBorrando(null)}
        onConfirmar={() => borrarUnaPlantilla(borrando.id)}
      />
    </div>
  );
}
