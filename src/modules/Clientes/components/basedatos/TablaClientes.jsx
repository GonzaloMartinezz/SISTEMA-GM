// ============================================================================
// SISTEMA GM · M-01 CLIENTES · TABLA DEL DIRECTORIO
// ----------------------------------------------------------------------------
// Las cuatro columnas que pidió el negocio (negocio, profesional, teléfono y
// ubicación) más rubro y estado. El teléfono es un enlace directo a WhatsApp:
// desde la base de datos se pasa a la acción en un clic.
// ============================================================================

import React from 'react';
import { MessageCircle, Pencil, Trash2, UserSearch } from 'lucide-react';
import Tabla from '../../../../shared/gm-ui/Tabla';
import Chip from '../../../../shared/gm-ui/Chip';
import Avatar from '../../../../shared/gm-ui/Avatar';
import { RUBRO_TONO } from '../../../../shared/gm-ui/tokens';
import { useTema } from '../../../../shared/gm-ui/TemaProvider';

const TINTE_ESTADO = { activo: 'aqua', lead: 'azul', inactivo: 'gris' };

const soloDigitos = (t) => (t ? String(t).replace(/\D/g, '') : '');

const linkWhatsApp = (tel) => {
  const n = soloDigitos(tel);
  if (!n) return null;
  return `https://wa.me/${n.length <= 10 ? `54${n}` : n}`;
};

export default function TablaClientes({ clientes, onVerFicha, onEditar, onEliminar, orden, onOrdenar }) {
  const { tinte } = useTema();

  const columnas = [
    {
      clave: 'negocio',
      titulo: 'Nombre de negocio',
      ordenable: true,
      render: (c) => (
        <div className="flex min-w-0 items-center gap-3">
          <Avatar nombre={c.negocio || '?'} tamano="sm" />
          <div className="min-w-0">
            <p className="truncate font-medium text-[var(--gm-texto)]">{c.negocio}</p>
            <p className="truncate text-[12px] text-[var(--gm-texto-medio)]">{c.codigo}</p>
          </div>
        </div>
      ),
    },
    {
      clave: 'profesional',
      titulo: 'Profesional',
      ordenable: true,
      render: (c) => (
        <span className="text-[var(--gm-texto-medio)]">
          {[c.profesional_apellido, c.profesional_nombre].filter(Boolean).join(', ') || '—'}
        </span>
      ),
    },
    {
      clave: 'rubro',
      titulo: 'Rubro',
      ordenable: true,
      render: (c) => (
        <Chip tono={RUBRO_TONO[c.rubro] || 'gris'} punto>
          {c.rubro || 'Sin rubro'}
        </Chip>
      ),
    },
    {
      clave: 'telefono',
      titulo: 'Teléfono',
      render: (c) => {
        const tel = c.celular || c.telefono;
        const link = linkWhatsApp(tel);
        if (!tel) return <span className="text-[var(--gm-texto-medio)]">—</span>;
        return link ? (
          <a
            href={link}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1.5 font-medium text-[var(--gm-acento)] hover:underline"
          >
            <MessageCircle size={14} />
            {tel}
          </a>
        ) : (
          <span>{tel}</span>
        );
      },
    },
    {
      clave: 'ubicacion',
      titulo: 'Ubicación del negocio',
      render: (c) => (
        <div className="min-w-0">
          <p className="truncate text-[var(--gm-texto-medio)]">{c.ubicacion || '—'}</p>
          {c.localidad && <p className="truncate text-[12px] text-[var(--gm-texto-medio)]">{c.localidad}</p>}
        </div>
      ),
    },
    {
      clave: 'estado',
      titulo: 'Estado',
      render: (c) => <Chip tono={TINTE_ESTADO[c.estado] || 'gris'}>{c.estado || '—'}</Chip>,
    },
    {
      clave: 'acciones',
      titulo: '',
      ancho: 120,
      render: (c) => (
        <div className="flex items-center justify-end gap-1">
          <button
            type="button"
            title="Ver ficha"
            onClick={(e) => { e.stopPropagation(); onVerFicha(c); }}
            className="grid h-8 w-8 place-items-center rounded-lg text-[var(--gm-texto-suave)] transition hover:bg-[var(--gm-acento-suave-bg)] hover:text-[var(--gm-acento)]"
          >
            <UserSearch size={15} />
          </button>
          <button
            type="button"
            title="Editar"
            onClick={(e) => { e.stopPropagation(); onEditar(c); }}
            className="grid h-8 w-8 place-items-center rounded-lg text-[var(--gm-texto-suave)] transition hover:bg-[var(--gm-superficie-fuerte)] hover:text-[var(--gm-texto)]"
          >
            <Pencil size={15} />
          </button>
          <button
            type="button"
            title="Eliminar"
            onClick={(e) => { e.stopPropagation(); onEliminar(c); }}
            style={{ '--gm-peligro-bg': tinte.peligro.bg, '--gm-peligro-fg': tinte.peligro.fg }}
            className="grid h-8 w-8 place-items-center rounded-lg text-[var(--gm-texto-suave)] transition hover:bg-[var(--gm-peligro-bg)] hover:text-[var(--gm-peligro-fg)]"
          >
            <Trash2 size={15} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <Tabla
      columnas={columnas}
      filas={clientes}
      claveFila={(c) => c.id}
      onFilaClick={onVerFicha}
      orden={orden}
      onOrdenar={onOrdenar}
      alto="flex-1 min-h-0"
      vacioTitulo="No hay clientes que coincidan"
      vacioTexto="Cambiá el rubro o el texto de búsqueda, o cargá un cliente nuevo con el botón de arriba."
    />
  );
}
