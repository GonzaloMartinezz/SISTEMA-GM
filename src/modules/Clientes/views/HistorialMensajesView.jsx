// ============================================================================
// SISTEMA GM · M-01 CLIENTES · HISTORIAL DE MENSAJES
// ----------------------------------------------------------------------------
// Trazabilidad de toda la comunicación enviada y recibida, con filtros por
// canal y por sentido, buscador por cliente o texto y el resumen de cuántas
// respuestas quedaron pendientes.
// ============================================================================

import React, { useMemo, useState } from 'react';
import { Mail, MessageCircle, MessagesSquare, Phone, Clock, Plus } from 'lucide-react';
import { useClientes } from '../context/ClientesContext';
import { registrarMensaje, marcarRespondido, eliminarMensaje } from '../services/mensajesService';
import Panel from '../../../shared/gm-ui/Panel';
import Buscador from '../../../shared/gm-ui/Buscador';
import BotonGm from '../../../shared/gm-ui/BotonGm';
import FormularioGm from '../../../shared/gm-ui/FormularioGm';
import ConfirmarGm from '../../../shared/gm-ui/ConfirmarGm';
import TarjetaKpi from '../../../shared/gm-ui/TarjetaKpi';
import ListaMensajes from '../components/mensajes/ListaMensajes';

const CAMPOS_MENSAJE = (clientes) => [
  {
    clave: 'clienteId',
    etiqueta: 'Cliente',
    tipo: 'select',
    ancho: 2,
    requerido: true,
    opciones: clientes.map((c) => ({ valor: c.id, texto: c.negocio })),
  },
  {
    clave: 'canal',
    etiqueta: 'Canal',
    tipo: 'select',
    requerido: true,
    defecto: 'whatsapp',
    opciones: [
      { valor: 'whatsapp', texto: 'WhatsApp' },
      { valor: 'mail', texto: 'Mail' },
      { valor: 'llamada', texto: 'Llamada' },
    ],
  },
  {
    clave: 'direccion',
    etiqueta: 'Sentido',
    tipo: 'select',
    requerido: true,
    defecto: 'enviado',
    opciones: [
      { valor: 'enviado', texto: 'Enviado' },
      { valor: 'recibido', texto: 'Recibido' },
    ],
  },
  { clave: 'asunto', etiqueta: 'Asunto', tipo: 'texto', ancho: 2 },
  { clave: 'texto', etiqueta: 'Mensaje', tipo: 'area', ancho: 2, requerido: true },
];

const CANALES = [
  { id: null, nombre: 'Todos' },
  { id: 'whatsapp', nombre: 'WhatsApp' },
  { id: 'mail', nombre: 'Mail' },
  { id: 'llamada', nombre: 'Llamadas' },
];

const SENTIDOS = [
  { id: null, nombre: 'Todo' },
  { id: 'enviado', nombre: 'Enviados' },
  { id: 'recibido', nombre: 'Recibidos' },
];

function Pastilla({ activo, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3.5 py-2 text-[13px] font-medium transition ${
        activo
          ? 'border-[var(--gm-acento)] bg-[var(--gm-acento-suave-bg)] text-[var(--gm-acento-fuerte)]'
          : 'border-[var(--gm-borde)] bg-[var(--gm-superficie)] text-[var(--gm-texto-medio)] hover:border-[var(--gm-borde-fuerte)] hover:bg-[var(--gm-superficie-suave)]'
      }`}
    >
      {children}
    </button>
  );
}

export default function HistorialMensajesView() {
  const { mensajes, clientes, cargando, recargar } = useClientes();
  const [canal, setCanal] = useState(null);
  const [sentido, setSentido] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [alta, setAlta] = useState(false);
  const [borrando, setBorrando] = useState(null);

  const enviar = async (form) => {
    await registrarMensaje(form);
    await recargar();
  };

  const toggleRespondido = async (mensaje) => {
    await marcarRespondido(mensaje.id, !mensaje.respondido);
    await recargar();
  };

  const eliminar = async () => {
    await eliminarMensaje(borrando.id);
    await recargar();
  };

  const filtrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    return mensajes.filter((m) => {
      if (canal && m.canal !== canal) return false;
      if (sentido && m.direccion !== sentido) return false;
      if (!q) return true;
      return [m.cliente, m.asunto, m.texto, m.operador, m.plantilla]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(q);
    });
  }, [mensajes, canal, sentido, busqueda]);

  const resumen = useMemo(() => {
    const whatsapp = mensajes.filter((m) => m.canal === 'whatsapp').length;
    const mail = mensajes.filter((m) => m.canal === 'mail').length;
    const llamadas = mensajes.filter((m) => m.canal === 'llamada').length;
    const pendientes = mensajes.filter((m) => m.direccion === 'enviado' && !m.respondido).length;
    return { whatsapp, mail, llamadas, pendientes };
  }, [mensajes]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <TarjetaKpi etiqueta="WhatsApp" valor={resumen.whatsapp} detalle="mensajes registrados" icono={MessageCircle} tono="naranja" />
        <TarjetaKpi etiqueta="Correos" valor={resumen.mail} detalle="enviados y recibidos" icono={Mail} tono="azul" />
        <TarjetaKpi etiqueta="Llamadas" valor={resumen.llamadas} detalle="registradas en el sistema" icono={Phone} tono="naranja" />
        <TarjetaKpi
          etiqueta="Sin respuesta"
          valor={resumen.pendientes}
          detalle="envíos esperando contestación"
          icono={Clock}
          tono="azul"
          tendencia={resumen.pendientes > 0 ? 'baja' : 'igual'}
        />
      </div>

      <Panel
        titulo="Bitácora de comunicaciones"
        bajada={`${filtrados.length} de ${mensajes.length} registros visibles`}
        cuerpoClassName="p-0"
        acciones={
          <BotonGm variante="solido" tamano="sm" icono={Plus} onClick={() => setAlta(true)}>
            Nuevo mensaje
          </BotonGm>
        }
      >
        <div className="flex flex-col gap-4 border-b border-[var(--gm-divisor)] px-6 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            {CANALES.map((c) => (
              <Pastilla key={c.nombre} activo={canal === c.id} onClick={() => setCanal(c.id)}>
                {c.nombre}
              </Pastilla>
            ))}
            <span className="mx-1 hidden h-6 w-px bg-[var(--gm-borde)] sm:inline-block" />
            {SENTIDOS.map((s) => (
              <Pastilla key={s.nombre} activo={sentido === s.id} onClick={() => setSentido(s.id)}>
                {s.nombre}
              </Pastilla>
            ))}
          </div>

          <Buscador
            valor={busqueda}
            onChange={setBusqueda}
            placeholder="Buscar por cliente, asunto o texto…"
            className="w-full lg:w-[340px]"
          />
        </div>

        <div className="px-6 py-6">
          {cargando ? (
            <p className="py-10 text-center text-[14px] text-[var(--gm-texto-medio)]">Cargando historial…</p>
          ) : (
            <ListaMensajes
              mensajes={filtrados}
              onMarcarRespondido={toggleRespondido}
              onEliminar={setBorrando}
            />
          )}
        </div>
      </Panel>

      <p className="flex items-center gap-2 text-[12px] text-[var(--gm-texto-medio)]">
        <MessagesSquare size={13} />
        Los envíos hechos desde el módulo de Seguimientos se registran acá automáticamente.
      </p>

      <FormularioGm
        abierto={alta}
        titulo="Nuevo mensaje"
        bajada="Queda registrado en la bitácora del cliente elegido."
        campos={CAMPOS_MENSAJE(clientes)}
        onCerrar={() => setAlta(false)}
        onGuardar={enviar}
        textoBoton="Registrar"
      />

      <ConfirmarGm
        abierto={!!borrando}
        detalle={borrando ? `Se va a eliminar el mensaje con "${borrando.cliente}".` : ''}
        advertencia="Esta acción no se puede deshacer."
        textoBoton="Eliminar"
        onCerrar={() => setBorrando(null)}
        onConfirmar={eliminar}
      />
    </div>
  );
}
