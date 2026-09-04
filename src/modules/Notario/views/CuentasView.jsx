// ============================================================================
// SISTEMA GM · M-06 NOTARIO 360 · CUENTAS
// ----------------------------------------------------------------------------
// El padrón financiero, que es de donde venía este módulo. Se conserva porque
// es información real que ya estaba cargada; lo que cambia es el diseño y que
// ahora cada cuenta muestra sus notas y su historial sin salir de acá.
//
// El progreso se dibuja como barra y no como medidor circular: hay que comparar
// varias cuentas entre sí de un vistazo, y dos semicírculos al lado no se
// comparan; dos barras que arrancan del mismo margen, sí.
// ============================================================================

import React, { useMemo, useState } from 'react';
import { Landmark, NotebookPen, TriangleAlert, Users } from 'lucide-react';
import Panel from '../../../shared/gm-ui/Panel';
import Tabla from '../../../shared/gm-ui/Tabla';
import TarjetaKpi from '../../../shared/gm-ui/TarjetaKpi';
import Chip from '../../../shared/gm-ui/Chip';
import EstadoVacio from '../../../shared/gm-ui/EstadoVacio';
import { ESTADO_COLOR } from '../../../shared/gm-ui/tokens';
import { useNotario } from '../context/NotarioContext';

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
  const { cuentas, notas, busqueda, cargando } = useNotario();
  const [activa, setActiva] = useState(null);

  const filtradas = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    if (!q) return cuentas;
    return cuentas.filter((c) =>
      [c.numero, c.cliente, c.estado, c.etapa, c.responsable]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q))
    );
  }, [cuentas, busqueda]);

  const notasDeCuenta = useMemo(() => {
    const m = new Map();
    notas
      .filter((n) => n.entidad === 'cuenta')
      .forEach((n) => m.set(n.entidadCodigo, (m.get(n.entidadCodigo) || 0) + 1));
    return m;
  }, [notas]);

  const enMora = cuentas.filter((c) => (c.estado || '').toUpperCase().includes('MORA'));
  const negociado = cuentas.reduce((a, c) => a + c.montoNegociado, 0);
  const progresoMedio = cuentas.length
    ? cuentas.reduce((a, c) => a + c.progreso, 0) / cuentas.length
    : 0;

  const COLUMNAS = [
    {
      clave: 'numero',
      titulo: 'Cuenta',
      ancho: '24%',
      render: (c) => (
        <div className="min-w-0">
          <p className="truncate font-medium text-[#2A2118] dark:text-[#F9FAFB]">{c.cliente || 'Sin cliente'}</p>
          <p className="truncate font-mono text-[12px] text-[#948A7C]">{c.numero}</p>
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
      render: (c) => <span className="text-[13px] text-[#6E6559] dark:text-[#9CA3AF]">{c.etapa || '—'}</span>,
    },
    {
      clave: 'progreso',
      titulo: 'Progreso',
      ancho: '17%',
      render: (c) => (
        <div className="min-w-[110px]">
          <div className="flex items-baseline justify-between">
            <span className="text-[12px] tabular-nums text-[#6E6559] dark:text-[#9CA3AF]">{c.progreso}%</span>
          </div>
          <span className="mt-1 block h-1.5 overflow-hidden rounded-full bg-[#F3EDE4] dark:bg-[#121212]">
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
      render: (c) => <span className="text-[13px] text-[#6E6559] dark:text-[#9CA3AF]">{fecha(c.ultimaVisita)}</span>,
    },
    {
      clave: 'notas',
      titulo: 'Notas',
      ancho: '8%',
      render: (c) => {
        const n = notasDeCuenta.get(c.numero) || 0;
        return n ? (
          <span className="inline-flex items-center gap-1 text-[13px] text-[#6E6559] dark:text-[#9CA3AF]">
            <NotebookPen size={13} className="text-[#B0A697] dark:text-[#6B7280]" />
            {n}
          </span>
        ) : (
          <span className="text-[12px] text-[#C6BCAC]">—</span>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <TarjetaKpi etiqueta="Cuentas" valor={cuentas.length} detalle="en el padrón" icono={Landmark} tono="azul" />
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
      >
        {cargando ? (
          <p className="py-16 text-center text-[14px] text-[#948A7C]">Cargando el padrón…</p>
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
              <div className="mt-4 flex flex-wrap gap-2 border-t border-[#F0EAE1] dark:border-[#333333] pt-4">
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
                <ul className="divide-y divide-[#F4EFE7]">
                  {suyas.map((n) => (
                    <li key={n.id} className="px-6 py-3.5">
                      {n.titulo && (
                        <p className="text-[14px] font-medium text-[#2A2118] dark:text-[#F9FAFB]">{n.titulo}</p>
                      )}
                      <p className="mt-0.5 whitespace-pre-line text-[13px] leading-relaxed text-[#948A7C]">
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
    </div>
  );
}

function Dato({ titulo, valor, ancho }) {
  if (!valor) return null;
  return (
    <div className={ancho ? 'sm:col-span-2' : ''}>
      <dt className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#B0A697] dark:text-[#6B7280]">
        {titulo}
      </dt>
      <dd className="mt-1 text-[14px] leading-relaxed text-[#2A2118] dark:text-[#F9FAFB]">{valor}</dd>
    </div>
  );
}
