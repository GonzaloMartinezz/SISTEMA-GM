// ============================================================================
// SISTEMA GM · M-03 SEGUIMIENTOS · WHATSAPP Y MAILING
// ----------------------------------------------------------------------------
// Dos mitades. Arriba, a quién le toca hoy: los leads abiertos ordenados por
// los días que hace que nadie les escribe, con el botón de escribir al lado. Es
// una lista de trabajo, no un informe.
//
// Abajo, lo que ya salió. Se registra solo cuando se manda desde acá: si el
// mensaje se escribe por fuera del sistema, el sistema no puede saberlo y no
// lo va a inventar. Por eso conviene salir siempre desde este botón.
// ============================================================================

import React, { useMemo, useState } from 'react';
import { Mail, MessageCircle, Send, Inbox, Clock } from 'lucide-react';
import Panel from '../../../shared/gm-ui/Panel';
import Tabla from '../../../shared/gm-ui/Tabla';
import Chip from '../../../shared/gm-ui/Chip';
import BotonGm from '../../../shared/gm-ui/BotonGm';
import Avatar from '../../../shared/gm-ui/Avatar';
import EstadoVacio from '../../../shared/gm-ui/EstadoVacio';
import { useSeguimientos } from '../context/SeguimientosContext';
import { ESTADO_COLOR } from '../../../shared/gm-ui/tokens';
import { DIAS_FRIO } from '../config/pipeline.config';
import { ChipEtapa, ChipTemperatura } from '../components/ChipEtapa';
import FilaEstadisticas from '../../../shared/gm-ui/FilaEstadisticas';
import ModalMensaje from '../components/ModalMensaje';

const DIA = 86400000;

const fechaHora = (v) =>
  new Date(v).toLocaleString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });

export default function MensajeriaView() {
  const { leads, mensajes, plantillas, porCodigo, cargando, marcarContacto } = useSeguimientos();
  const [mensaje, setMensaje] = useState(null);

  const pendientes = useMemo(
    () =>
      leads
        .filter((l) => l.etapa !== 'cerrado')
        .filter((l) => (l.diasSinContacto || 0) > DIAS_FRIO)
        .sort((a, b) => (b.diasSinContacto || 0) - (a.diasSinContacto || 0)),
    [leads]
  );

  const stats = useMemo(() => {
    const ahora = Date.now();
    const en = (dias) => mensajes.filter((m) => ahora - new Date(m.fecha).getTime() <= dias * DIA);
    const semana = en(7);
    const mes = en(30);
    return {
      semana: semana.length,
      mes: mes.length,
      whatsapp: mes.filter((m) => m.canal === 'WhatsApp').length,
      email: mes.filter((m) => m.canal === 'Email').length,
      respondidos: mes.filter((m) => m.respondido).length,
      pendientes: pendientes.length,
    };
  }, [mensajes, pendientes]);

  const estadisticas = [
    { etiqueta: 'Enviados · 7 días', valor: stats.semana, detalle: 'desde el sistema' },
    { etiqueta: 'Enviados · 30 días', valor: stats.mes, detalle: 'todos los canales' },
    { etiqueta: 'Por WhatsApp', valor: stats.whatsapp, detalle: 'en los últimos 30 días' },
    { etiqueta: 'Por email', valor: stats.email, detalle: 'en los últimos 30 días' },
    {
      etiqueta: 'Con respuesta',
      valor: stats.respondidos,
      detalle: stats.mes ? `de ${stats.mes} enviados` : 'sin envíos todavía',
      color: stats.respondidos > 0 ? ESTADO_COLOR.bien : undefined,
    },
    {
      etiqueta: 'Le deben respuesta',
      valor: stats.pendientes,
      detalle: `abiertos con +${DIAS_FRIO} días de silencio`,
      color: stats.pendientes > 0 ? ESTADO_COLOR.critico : undefined,
    },
  ];

  const COLUMNAS = [
    {
      clave: 'fecha',
      titulo: 'Cuándo',
      ancho: '14%',
      render: (m) => <span className="whitespace-nowrap text-[13px]">{fechaHora(m.fecha)}</span>,
    },
    {
      clave: 'lead',
      titulo: 'A quién',
      ancho: '24%',
      render: (m) => {
        const l = porCodigo.get(m.leadCodigo);
        return l ? (
          <div className="flex items-center gap-2.5">
            <Avatar nombre={`${l.nombre} ${l.apellido}`} tamano="sm" />
            <div className="min-w-0">
              <p className="truncate text-[13px] font-medium">
                {l.apellido}, {l.nombre}
              </p>
              <p className="truncate text-[11px] text-[var(--gm-texto-suave)]">{l.clinica}</p>
            </div>
          </div>
        ) : (
          <span className="text-[13px] text-[var(--gm-texto-tenue)]">{m.leadCodigo} · lead eliminado</span>
        );
      },
    },
    {
      clave: 'canal',
      titulo: 'Canal',
      ancho: '11%',
      render: (m) => (
        <Chip tono={m.canal === 'Email' ? 'azul' : 'aqua'}>{m.canal}</Chip>
      ),
    },
    {
      clave: 'texto',
      titulo: 'Mensaje',
      render: (m) => (
        <div className="min-w-0">
          {m.asunto && <p className="truncate text-[12px] text-[var(--gm-texto-medio)]">{m.asunto}</p>}
          <p className="line-clamp-2 text-[13px] text-[var(--gm-texto-suave)]">{m.texto}</p>
        </div>
      ),
    },
    {
      clave: 'respondido',
      titulo: 'Respuesta',
      ancho: '11%',
      render: (m) =>
        m.respondido ? (
          <Chip tono="aqua" punto>
            Respondió
          </Chip>
        ) : (
          <span className="text-[12px] text-[var(--gm-texto-tenue)]">—</span>
        ),
    },
  ];

  return (
    <div className="space-y-6">
      <Panel sinEncabezado cuerpoClassName="p-0">
        <FilaEstadisticas items={estadisticas} />
      </Panel>

      {/* --------------------------- lista de trabajo ------------------------ */}
      <Panel
        titulo="Para escribirles hoy"
        bajada={`Oportunidades abiertas con más de ${DIAS_FRIO} días sin contacto, de la más olvidada a la más reciente.`}
        acciones={<Clock size={16} className="text-[var(--gm-texto-tenue)]" />}
        cuerpoClassName={pendientes.length ? 'p-0' : 'p-6'}
      >
        {pendientes.length === 0 ? (
          <EstadoVacio
            icono={Inbox}
            titulo="Nadie está esperando"
            texto="Todas las oportunidades abiertas tuvieron contacto esta semana."
          />
        ) : (
          <ul className="divide-y divide-[var(--gm-divisor)]">
            {pendientes.map((l) => (
              <li key={l.id} className="flex flex-wrap items-center gap-x-4 gap-y-2 px-6 py-3.5">
                <Avatar nombre={`${l.nombre} ${l.apellido}`} tamano="sm" />
                <div className="min-w-[170px] flex-1">
                  <p className="truncate text-[14px] font-medium text-[var(--gm-texto)]">
                    {l.apellido}, {l.nombre}
                  </p>
                  <p className="truncate text-[12px] text-[var(--gm-texto-suave)]">
                    {l.clinica} · {l.equipo || 'sin equipo'}
                  </p>
                </div>
                <ChipEtapa etapa={l.etapa} />
                <ChipTemperatura dias={l.diasSinContacto} />
                <div className="ml-auto flex items-center gap-2">
                  <BotonGm
                    variante="suave"
                    tamano="sm"
                    icono={MessageCircle}
                    disabled={!l.telefono}
                    onClick={() => setMensaje({ lead: l, canal: 'whatsapp' })}
                  >
                    WhatsApp
                  </BotonGm>
                  <BotonGm
                    variante="contorno"
                    tamano="sm"
                    icono={Mail}
                    disabled={!l.email}
                    onClick={() => setMensaje({ lead: l, canal: 'email' })}
                  >
                    Mail
                  </BotonGm>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Panel>

      {/* ------------------------------ historial ---------------------------- */}
      <Panel
        titulo="Lo que se mandó"
        bajada="Cada mensaje que salió desde el sistema queda anotado acá con su fecha, su canal y su texto."
        acciones={<Send size={16} className="text-[var(--gm-texto-tenue)]" />}
        cuerpoClassName="p-0"
      >
        <Tabla
          columnas={COLUMNAS}
          filas={mensajes}
          claveFila={(m) => m.id}
          alto="max-h-[520px]"
          vacioTitulo={cargando ? 'Cargando envíos…' : 'Todavía no saliste a escribir desde acá'}
          vacioTexto="Cuando mandes un WhatsApp o un mail desde el botón de arriba, el envío queda registrado en esta lista."
          vacioIcono={Send}
        />
      </Panel>

      {mensaje && (
        <ModalMensaje
          lead={mensaje.lead}
          canalInicial={mensaje.canal}
          plantillas={plantillas}
          onCerrar={() => setMensaje(null)}
          onEnviado={marcarContacto}
        />
      )}
    </div>
  );
}
