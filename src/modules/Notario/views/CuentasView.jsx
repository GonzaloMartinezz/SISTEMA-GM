// ============================================================================
// SISTEMA GM · M-05 NOTARIO 360 · CUENTAS
// ----------------------------------------------------------------------------
// El padrón financiero, que es de donde venía este módulo. Se conserva porque
// es información real que ya estaba cargada; lo que cambia es el diseño y que
// ahora cada cuenta muestra sus notas y su historial sin salir de acá.
//
// El progreso se dibuja como barra y no como medidor circular: hay que comparar
// varias cuentas entre sí de un vistazo, y dos semicírculos al lado no se
// comparan; dos barras que arrancan del mismo margen, sí.
// ============================================================================

import React, { useEffect, useMemo, useState } from 'react';
import {
  Landmark, NotebookPen, Pencil, Plus, RotateCcw, TriangleAlert, Users, XCircle,
} from 'lucide-react';
import Panel from '../../../shared/gm-ui/Panel';
import Tabla from '../../../shared/gm-ui/Tabla';
import TarjetaKpi from '../../../shared/gm-ui/TarjetaKpi';
import BotonGm from '../../../shared/gm-ui/BotonGm';
import Chip from '../../../shared/gm-ui/Chip';
import EstadoVacio from '../../../shared/gm-ui/EstadoVacio';
import FormularioGm from '../../../shared/gm-ui/FormularioGm';
import ConfirmarGm from '../../../shared/gm-ui/ConfirmarGm';
import { ESTADO_COLOR } from '../../../shared/gm-ui/tokens';
import { useNotario } from '../context/NotarioContext';
import { listarClientes } from '../../../shared/cuentas/cuentasService';

const CAMPOS_CUENTA = (clientes) => [
  {
    clave: 'clienteId',
    etiqueta: 'Cliente',
    tipo: 'select',
    ancho: 2,
    requerido: true,
    opciones: clientes.map((c) => ({ valor: c.id, texto: `${c.codigo} · ${c.negocio}` })),
  },
  { clave: 'tipo', etiqueta: 'Tipo', tipo: 'texto' },
  { clave: 'estado', etiqueta: 'Estado', tipo: 'texto', placeholder: 'EN MORA / CORRIENTE' },
  { clave: 'etapa', etiqueta: 'Etapa', tipo: 'texto' },
  { clave: 'progreso', etiqueta: 'Progreso (%)', tipo: 'numero', defecto: 0 },
  { clave: 'montoNegociado', etiqueta: 'Monto negociado', tipo: 'moneda', defecto: 0 },
  {
    clave: 'moneda',
    etiqueta: 'Moneda',
    tipo: 'select',
    defecto: 'ARS',
    opciones: [
      { valor: 'ARS', texto: 'ARS' },
      { valor: 'USD', texto: 'USD' },
    ],
  },
  { clave: 'responsable', etiqueta: 'Responsable', tipo: 'texto' },
  { clave: 'sucursal', etiqueta: 'Sucursal', tipo: 'texto' },
  { clave: 'convenio', etiqueta: 'Convenio', tipo: 'texto' },
  { clave: 'alta', etiqueta: 'Fecha de alta', tipo: 'fecha' },
  { clave: 'vencimiento', etiqueta: 'Vencimiento', tipo: 'fecha' },
  { clave: 'bloqueos', etiqueta: 'Bloqueos', tipo: 'texto', ancho: 2 },
  { clave: 'proximoPaso', etiqueta: 'Próximo paso', tipo: 'area', ancho: 2 },
];

const ars = (v) => `$ ${Math.round(Number(v || 0)).toLocaleString('es-AR')}`;

/** El estado viene en mayúsculas de la base ("EN MORA"). Se normaliza acá. */
const TONO_ESTADO = (estado = '') => {
  const e = estado.toUpperCase();
  if (e.includes('MORA')) return { tono: 'rosa', color: ESTADO_COLOR.critico };
  if (e.includes('CORRIENTE')) return { tono: 'aqua', color: ESTADO_COLOR.bien };
  return { tono: 'gris', color: ESTADO_COLOR.neutro };
};

const fecha = (iso) =>
  iso ? new Date(`${iso}T00:00:00`).toLocaleDateString('es-AR') : '—';

export default function CuentasView() {
  const {
    cuentas, notas, busqueda, cargando, guardarCuenta, inactivarCuenta, reactivarCuenta,
  } = useNotario();
  const [activa, setActiva] = useState(null);
  const [editando, setEditando] = useState(null); // null | {} (alta) | cuenta (edición)
  const [inactivando, setInactivando] = useState(null);
  const [mostrarInactivas, setMostrarInactivas] = useState(false);
  const [clientes, setClientes] = useState([]);
  const [errorClientes, setErrorClientes] = useState('');

  useEffect(() => {
    listarClientes()
      .then(setClientes)
      .catch((e) => setErrorClientes(e.message || 'No se pudo cargar la lista de clientes.'));
  }, []);

  const guardar = (form) => guardarCuenta(form, !editando?.numero);

  const confirmarInactivar = async () => {
    const c = inactivando;
    setInactivando(null);
    if (!c) return;
    if (c.activa) await inactivarCuenta(c.numero);
    else await reactivarCuenta(c.numero);
  };

  const inactivas = cuentas.filter((c) => !c.activa).length;

  const filtradas = useMemo(() => {
    const base = mostrarInactivas ? cuentas : cuentas.filter((c) => c.activa);
    const q = busqueda.trim().toLowerCase();
    if (!q) return base;
    return base.filter((c) =>
      [c.numero, c.cliente, c.estado, c.etapa, c.responsable]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q))
    );
  }, [cuentas, busqueda, mostrarInactivas]);

  const notasDeCuenta = useMemo(() => {
    const m = new Map();
    notas
      .filter((n) => n.entidad === 'cuenta')
      .forEach((n) => m.set(n.entidadCodigo, (m.get(n.entidadCodigo) || 0) + 1));
    return m;
  }, [notas]);

  const activas = cuentas.filter((c) => c.activa);
  const enMora = activas.filter((c) => (c.estado || '').toUpperCase().includes('MORA'));
  const negociado = activas.reduce((a, c) => a + c.montoNegociado, 0);
  const progresoMedio = activas.length
    ? activas.reduce((a, c) => a + c.progreso, 0) / activas.length
    : 0;

  const COLUMNAS = [
    {
      clave: 'numero',
      titulo: 'Cuenta',
      ancho: '24%',
      render: (c) => (
        <div className="min-w-0">
          <p className={`truncate font-medium ${c.activa ? 'text-[var(--gm-texto)]' : 'text-[var(--gm-texto-suave)] line-through'}`}>
            {c.cliente || 'Sin cliente'}
          </p>
          <p className="flex items-center gap-1.5 truncate font-mono text-[12px] text-[var(--gm-texto-suave)]">
            {c.numero}
            {!c.activa && <Chip tono="gris">Inactiva</Chip>}
          </p>
        </div>
      ),
    },
    {
      clave: 'estado',
      titulo: 'Estado',
      ancho: '13%',
      render: (c) => <Chip tono={TONO_ESTADO(c.estado).tono} punto>{c.estado || '—'}</Chip>,
    },
    {
      clave: 'etapa',
      titulo: 'Etapa',
      ancho: '13%',
      render: (c) => <span className="text-[13px] text-[var(--gm-texto-medio)]">{c.etapa || '—'}</span>,
    },
    {
      clave: 'progreso',
      titulo: 'Progreso',
      ancho: '17%',
      render: (c) => (
        <div className="min-w-[110px]">
          <div className="flex items-baseline justify-between">
            <span className="text-[12px] tabular-nums text-[var(--gm-texto-medio)]">{c.progreso}%</span>
          </div>
          <span className="mt-1 block h-1.5 overflow-hidden rounded-full bg-[var(--gm-superficie-fuerte)]">
            <span
              className="block h-full rounded-full"
              style={{
                width: `${Math.min(Math.max(c.progreso, 0), 100)}%`,
                backgroundColor: TONO_ESTADO(c.estado).color,
              }}
            />
          </span>
        </div>
      ),
    },
    {
      clave: 'montoNegociado',
      titulo: 'Negociado',
      ancho: '13%',
      render: (c) => <span className="font-semibold">{ars(c.montoNegociado)}</span>,
    },
    {
      clave: 'ultimaVisita',
      titulo: 'Última visita',
      ancho: '12%',
      render: (c) => <span className="text-[13px] text-[var(--gm-texto-medio)]">{fecha(c.ultimaVisita)}</span>,
    },
    {
      clave: 'notas',
      titulo: 'Notas',
      ancho: '8%',
      render: (c) => {
        const n = notasDeCuenta.get(c.numero) || 0;
        return n ? (
          <span className="inline-flex items-center gap-1 text-[13px] text-[var(--gm-texto-medio)]">
            <NotebookPen size={13} className="text-[var(--gm-texto-tenue)]" />
            {n}
          </span>
        ) : (
          <span className="text-[12px] text-[var(--gm-texto-suave)]">—</span>
        );
      },
    },
    {
      clave: 'acciones',
      titulo: '',
      ancho: '76',
      render: (c) => (
        <div className="flex items-center gap-1">
          <button
            type="button"
            title="Editar"
            onClick={(e) => { e.stopPropagation(); setEditando(c); }}
            className="grid h-8 w-8 place-items-center rounded-lg text-[var(--gm-texto-suave)] transition hover:bg-[var(--gm-superficie-fuerte)] hover:text-[var(--gm-texto)]"
          >
            <Pencil size={14} />
          </button>
          <button
            type="button"
            title={c.activa ? 'Inactivar' : 'Reactivar'}
            onClick={(e) => { e.stopPropagation(); setInactivando(c); }}
            className="grid h-8 w-8 place-items-center rounded-lg text-[var(--gm-texto-suave)] transition hover:bg-[var(--gm-superficie-fuerte)] hover:text-[var(--gm-texto)]"
          >
            {c.activa ? <XCircle size={14} /> : <RotateCcw size={14} />}
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {errorClientes && (
        <p className="flex items-start gap-2 rounded-xl border border-[#EDCBB4] bg-[#FBEAE0] px-3.5 py-2.5 text-[13px] text-[#A63A0C]">
          <TriangleAlert size={14} className="mt-0.5 shrink-0" />
          No se pudo cargar la lista de clientes para el formulario: {errorClientes}
        </p>
      )}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <TarjetaKpi
          etiqueta="Cuentas activas"
          valor={activas.length}
          detalle={inactivas ? `${inactivas} inactivada${inactivas === 1 ? '' : 's'}` : 'en el padrón'}
          icono={Landmark}
          tono="azul"
        />
        <TarjetaKpi
          etiqueta="En mora"
          valor={enMora.length}
          detalle={enMora.length ? 'requieren gestión' : 'ninguna atrasada'}
          icono={TriangleAlert}
          tono="naranja"
        />
        <TarjetaKpi
          etiqueta="Negociado"
          valor={ars(negociado)}
          detalle="suma de lo acordado"
          icono={Users}
          tono="verde"
        />
        <TarjetaKpi
          etiqueta="Progreso medio"
          valor={`${Math.round(progresoMedio)}%`}
          detalle="promedio del padrón"
          icono={Landmark}
          tono="crema"
        />
      </div>

      <Panel
        titulo="Padrón de cuentas"
        bajada="Tocá una fila para ver su detalle y lo que tenés anotado de ella."
        cuerpoClassName="p-0"
        acciones={
          <div className="flex items-center gap-2">
            {inactivas > 0 && (
              <BotonGm
                variante={mostrarInactivas ? 'contorno' : 'fantasma'}
                tamano="sm"
                onClick={() => setMostrarInactivas((v) => !v)}
              >
                {mostrarInactivas ? 'Ocultar inactivas' : `Ver ${inactivas} inactivada${inactivas === 1 ? '' : 's'}`}
              </BotonGm>
            )}
            <BotonGm variante="solido" tamano="sm" icono={Plus} onClick={() => setEditando({})}>
              Nueva cuenta
            </BotonGm>
          </div>
        }
      >
        {cargando ? (
          <p className="py-16 text-center text-[14px] text-[var(--gm-texto-suave)]">Cargando el padrón…</p>
        ) : (
          <Tabla
            columnas={COLUMNAS}
            filas={filtradas}
            claveFila={(c) => c.numero}
            filaActiva={activa?.numero}
            onFilaClick={(c) => setActiva(activa?.numero === c.numero ? null : c)}
            alto="max-h-[440px]"
            vacioIcono={Landmark}
            vacioTitulo="Sin cuentas cargadas"
            vacioTexto="El padrón se llena desde la planilla CUENTAS del Drive o desde este módulo."
          />
        )}
      </Panel>

      {activa && (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <Panel titulo={activa.cliente || activa.numero} bajada={`Cuenta ${activa.numero}`}>
            <dl className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
              <Dato titulo="Tipo" valor={activa.tipo} />
              <Dato titulo="Responsable" valor={activa.responsable} />
              <Dato titulo="Sucursal" valor={activa.sucursal} />
              <Dato titulo="Convenio" valor={activa.convenio} />
              <Dato titulo="Alta" valor={fecha(activa.alta)} />
              <Dato titulo="Vencimiento" valor={fecha(activa.vencimiento)} />
              <Dato titulo="Bloqueos" valor={activa.bloqueos} ancho />
              <Dato titulo="Próximo paso" valor={activa.proximoPaso} ancho />
            </dl>

            {activa.avisos?.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2 border-t border-[var(--gm-borde-fuerte)] pt-4">
                {activa.avisos.map((a) => (
                  <Chip key={a} tono="amarillo">
                    {a}
                  </Chip>
                ))}
              </div>
            )}
          </Panel>

          <Panel
            titulo="Lo anotado de esta cuenta"
            bajada="Se escribe desde la sección Notas o desde la Ficha 360."
            cuerpoClassName="p-0"
          >
            {(() => {
              const suyas = notas.filter(
                (n) => n.entidad === 'cuenta' && n.entidadCodigo === activa.numero
              );
              return suyas.length === 0 ? (
                <EstadoVacio
                  icono={NotebookPen}
                  titulo="Sin notas de esta cuenta"
                  texto="Lo que sepas de ella y no esté en ningún campo, anotalo en la sección Notas eligiéndola como entidad."
                />
              ) : (
                <ul className="divide-y divide-[var(--gm-divisor)]">
                  {suyas.map((n) => (
                    <li key={n.id} className="px-6 py-3.5">
                      {n.titulo && (
                        <p className="text-[14px] font-medium text-[var(--gm-texto)]">{n.titulo}</p>
                      )}
                      <p className="mt-0.5 whitespace-pre-line text-[13px] leading-relaxed text-[var(--gm-texto-suave)]">
                        {n.texto}
                      </p>
                    </li>
                  ))}
                </ul>
              );
            })()}
          </Panel>
        </div>
      )}

      <FormularioGm
        abierto={!!editando}
        titulo={editando?.numero ? 'Editar cuenta' : 'Nueva cuenta'}
        bajada={
          editando?.numero
            ? 'Los cambios impactan en el padrón y en la Ficha 360° del cliente.'
            : 'El número de cuenta lo asigna el sistema automáticamente.'
        }
        campos={CAMPOS_CUENTA(clientes)}
        valores={editando?.numero ? editando : undefined}
        onCerrar={() => setEditando(null)}
        onGuardar={guardar}
        textoBoton={editando?.numero ? 'Guardar cambios' : 'Crear cuenta'}
      />

      <ConfirmarGm
        abierto={Boolean(inactivando)}
        titulo={inactivando?.activa ? '¿Inactivar esta cuenta?' : '¿Reactivar esta cuenta?'}
        detalle={inactivando ? `${inactivando.cliente || 'Sin cliente'} · ${inactivando.numero}` : ''}
        advertencia={
          inactivando?.activa
            ? 'La cuenta deja de contar como activa en el padrón. Los domicilios, períodos, pagos, movimientos, llamados, notas y visitas se conservan tal cual y podés reactivarla cuando quieras.'
            : 'La cuenta vuelve a contar como activa en el padrón.'
        }
        onCerrar={() => setInactivando(null)}
        onConfirmar={confirmarInactivar}
      />
    </div>
  );
}

function Dato({ titulo, valor, ancho }) {
  if (!valor) return null;
  return (
    <div className={ancho ? 'sm:col-span-2' : ''}>
      <dt className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--gm-texto-tenue)]">
        {titulo}
      </dt>
      <dd className="mt-1 text-[14px] leading-relaxed text-[var(--gm-texto)]">{valor}</dd>
    </div>
  );
}
