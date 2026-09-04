// ============================================================================
// SISTEMA GM · M-01 CLIENTES · BASE DE DATOS
// ----------------------------------------------------------------------------
// Directorio centralizado de todas las cuentas. Buscador, filtro por rubro,
// alta / edición / baja y acceso a la ficha completa. Es la sección de entrada
// del módulo: si algo no está acá, no está en el sistema.
// ============================================================================

import React, { useMemo, useState } from 'react';
import { Download, Plus, Users, UserCheck, Sparkles, MapPin } from 'lucide-react';
import { useClientes } from '../context/ClientesContext';
import { CAMPOS_CLIENTE, aFormulario } from '../config/cliente.form';
import Panel from '../../../shared/gm-ui/Panel';
import Buscador from '../../../shared/gm-ui/Buscador';
import BotonGm from '../../../shared/gm-ui/BotonGm';
import TarjetaKpi from '../../../shared/gm-ui/TarjetaKpi';
import FormularioGm from '../../../shared/gm-ui/FormularioGm';
import ConfirmarGm from '../../../shared/gm-ui/ConfirmarGm';
import FiltrosRubro from '../components/basedatos/FiltrosRubro';
import TablaClientes from '../components/basedatos/TablaClientes';
import FichaClientePanel from '../components/basedatos/FichaClientePanel';

const texto = (c) =>
  [c.negocio, c.profesional_nombre, c.profesional_apellido, c.localidad, c.ubicacion, c.telefono, c.celular]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

const valorOrden = (c, clave) => {
  if (clave === 'profesional') return `${c.profesional_apellido || ''} ${c.profesional_nombre || ''}`;
  return c[clave] ?? '';
};

export default function BaseDatosView() {
  const { clientes, leads, mensajes, eventos, porRubro, cargando, altaCliente, editarCliente, bajaCliente } =
    useClientes();

  const [busqueda, setBusqueda] = useState('');
  const [rubro, setRubro] = useState(null);
  const [orden, setOrden] = useState({ clave: 'negocio', dir: 'asc' });
  const [ficha, setFicha] = useState(null);
  const [editando, setEditando] = useState(null); // null | {} (alta) | cliente (edición)
  const [borrando, setBorrando] = useState(null);

  const filtrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    const lista = clientes.filter(
      (c) => (!rubro || c.rubro === rubro) && (!q || texto(c).includes(q))
    );
    const dir = orden.dir === 'asc' ? 1 : -1;
    return [...lista].sort(
      (a, b) => String(valorOrden(a, orden.clave)).localeCompare(String(valorOrden(b, orden.clave)), 'es') * dir
    );
  }, [clientes, rubro, busqueda, orden]);

  const ordenar = (clave) =>
    setOrden((o) => (o.clave === clave ? { clave, dir: o.dir === 'asc' ? 'desc' : 'asc' } : { clave, dir: 'asc' }));

  const activos = clientes.filter((c) => c.estado === 'activo').length;
  const posibles = clientes.filter((c) => c.estado === 'lead').length;
  const localidades = new Set(clientes.map((c) => c.localidad).filter(Boolean)).size;

  const exportarCsv = () => {
    const cab = ['CÓDIGO', 'NOMBRE DE NEGOCIO', 'PROFESIONAL', 'RUBRO', 'TELÉFONO', 'UBICACIÓN', 'LOCALIDAD', 'ESTADO'];
    const filas = filtrados.map((c) => [
      c.codigo,
      c.negocio,
      [c.profesional_apellido, c.profesional_nombre].filter(Boolean).join(' '),
      c.rubro,
      c.celular || c.telefono || '',
      c.ubicacion || '',
      c.localidad || '',
      c.estado || '',
    ]);
    const csv = [cab, ...filas]
      .map((f) => f.map((v) => `"${String(v ?? '').replace(/"/g, '""')}"`).join(';'))
      .join('\r\n');

    const blob = new Blob([`﻿${csv}`], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `clientes-gm-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(a.href);
  };

  const guardar = async (form) => {
    if (editando?.id) await editarCliente(editando.id, form);
    else await altaCliente(form);
  };

  return (
    <div className="space-y-6">
      {/* ----------------------------- Indicadores ----------------------------- */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <TarjetaKpi
          etiqueta="Cartera total"
          valor={clientes.length}
          detalle="cuentas cargadas"
          icono={Users}
          tono="naranja"
        />
        <TarjetaKpi
          etiqueta="Clientes activos"
          valor={activos}
          detalle={clientes.length ? `${Math.round((activos / clientes.length) * 100)}% de la cartera` : 'sin datos'}
          icono={UserCheck}
          tono="azul"
        />
        <TarjetaKpi
          etiqueta="Posibles clientes"
          valor={posibles}
          detalle="en etapa de lead"
          icono={Sparkles}
          tono="naranja"
        />
        <TarjetaKpi
          etiqueta="Localidades"
          valor={localidades}
          detalle="con presencia comercial"
          icono={MapPin}
          tono="azul"
        />
      </div>

      {/* ------------------------------ Directorio ----------------------------- */}
      <Panel
        titulo="Directorio de cuentas"
        bajada={`${filtrados.length} de ${clientes.length} cuentas visibles`}
        cuerpoClassName="p-0"
        acciones={
          <>
            <BotonGm variante="contorno" tamano="sm" icono={Download} onClick={exportarCsv}>
              Exportar
            </BotonGm>
            <BotonGm variante="solido" tamano="sm" icono={Plus} onClick={() => setEditando({})}>
              Nuevo cliente
            </BotonGm>
          </>
        }
      >
        <div className="flex flex-col gap-4 border-b border-[var(--gm-divisor)] px-6 py-4 lg:flex-row lg:items-center lg:justify-between">
          <FiltrosRubro rubros={porRubro} valor={rubro} onChange={setRubro} total={clientes.length} />
          <Buscador
            valor={busqueda}
            onChange={setBusqueda}
            placeholder="Buscar por negocio, profesional, zona o teléfono…"
            className="w-full lg:w-[360px]"
          />
        </div>

        {cargando ? (
          <div className="px-6 py-16 text-center text-[14px] text-[var(--gm-texto-medio)]">
            Cargando cartera…
          </div>
        ) : (
          <TablaClientes
            clientes={filtrados}
            orden={orden}
            onOrdenar={ordenar}
            onVerFicha={setFicha}
            onEditar={setEditando}
            onEliminar={setBorrando}
          />
        )}
      </Panel>

      {/* -------------------------------- Modales ------------------------------- */}
      {ficha && (
        <FichaClientePanel
          cliente={ficha}
          leads={leads}
          mensajes={mensajes}
          eventos={eventos}
          onCerrar={() => setFicha(null)}
        />
      )}

      <FormularioGm
        abierto={!!editando}
        titulo={editando?.id ? 'Editar cliente' : 'Nuevo cliente'}
        bajada={
          editando?.id
            ? 'Los cambios impactan en toda la cartera y en los módulos que consumen esta cuenta.'
            : 'Cargá los datos del negocio y del profesional a cargo.'
        }
        campos={CAMPOS_CLIENTE}
        valores={editando?.id ? aFormulario(editando) : undefined}
        onCerrar={() => setEditando(null)}
        onGuardar={guardar}
        textoBoton={editando?.id ? 'Guardar cambios' : 'Crear cliente'}
      />

      <ConfirmarGm
        abierto={!!borrando}
        detalle={borrando ? `Se va a dar de baja "${borrando.negocio}".` : ''}
        advertencia="La cuenta deja de aparecer en la cartera, pero su historial de mensajes, agenda y seguimientos se conserva."
        textoBoton="Dar de baja"
        onCerrar={() => setBorrando(null)}
        onConfirmar={() => bajaCliente(borrando.id)}
      />
    </div>
  );
}
