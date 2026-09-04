// ============================================================================
// SISTEMA GM · M-02 EQUIPAMIENTOS · BASE DE DATOS
// ----------------------------------------------------------------------------
// Todo el equipamiento del negocio en un solo lugar, separado por rubro
// (Odontología, Veterinaria, Diagnóstico por Imagen). Alta, edición y baja, y
// desde cada fila se salta a la ficha técnica.
// ============================================================================

import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Boxes, DollarSign, Package, Percent, Plus, Download } from 'lucide-react';
import { useEquipos } from '../context/EquiposContext';
import { CAMPOS_EQUIPO, aFormulario } from '../config/equipo.form';
import Panel from '../../../shared/gm-ui/Panel';
import Buscador from '../../../shared/gm-ui/Buscador';
import BotonGm from '../../../shared/gm-ui/BotonGm';
import TarjetaKpi from '../../../shared/gm-ui/TarjetaKpi';
import FormularioGm from '../../../shared/gm-ui/FormularioGm';
import ConfirmarGm from '../../../shared/gm-ui/ConfirmarGm';
import { usd } from '../../../shared/gm-ui/graficos';
import FiltrosCategoria from '../components/basedatos/FiltrosCategoria';
import TablaEquipos from '../components/basedatos/TablaEquipos';

const texto = (e) =>
  [e.codigo, e.nombre, e.marca, e.modelo, e.rubro, e.tipo].filter(Boolean).join(' ').toLowerCase();

export default function BaseDatosView() {
  const { equipos, porRubro, resumen, cargando, altaEquipo, editarEquipo, bajaEquipo } = useEquipos();
  const navigate = useNavigate();

  const [busqueda, setBusqueda] = useState('');
  const [rubro, setRubro] = useState(null);
  const [orden, setOrden] = useState({ clave: 'nombre', dir: 'asc' });
  const [editando, setEditando] = useState(null);
  const [borrando, setBorrando] = useState(null);

  const filtrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    const lista = equipos.filter(
      (e) => (!rubro || e.rubro === rubro) && (!q || texto(e).includes(q))
    );
    const dir = orden.dir === 'asc' ? 1 : -1;
    return [...lista].sort((a, b) => {
      const va = a[orden.clave];
      const vb = b[orden.clave];
      if (typeof va === 'number' && typeof vb === 'number') return (va - vb) * dir;
      return String(va ?? '').localeCompare(String(vb ?? ''), 'es') * dir;
    });
  }, [equipos, rubro, busqueda, orden]);

  const ordenar = (clave) =>
    setOrden((o) => (o.clave === clave ? { clave, dir: o.dir === 'asc' ? 'desc' : 'asc' } : { clave, dir: 'asc' }));

  const guardar = async (form) => {
    if (editando?.id) await editarEquipo(editando.id, form);
    else await altaEquipo(form);
  };

  const exportarCsv = () => {
    const cab = ['CÓDIGO', 'NOMBRE', 'MARCA', 'MODELO', 'RUBRO', 'TIPO', 'COSTO USD', 'PRECIO USD', 'STOCK', 'EN TRÁNSITO', 'MÍNIMO'];
    const filas = filtrados.map((e) => [
      e.codigo, e.nombre, e.marca || '', e.modelo || '', e.rubro, e.tipo,
      e.costoUsd, e.precioUsd, e.stock, e.transito, e.minStock,
    ]);
    const csv = [cab, ...filas]
      .map((f) => f.map((v) => `"${String(v ?? '').replace(/"/g, '""')}"`).join(';'))
      .join('\r\n');

    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([`﻿${csv}`], { type: 'text/csv;charset=utf-8' }));
    a.download = `equipamiento-gm-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(a.href);
  };

  return (
    <div className="space-y-6">
      {/* ----------------------------- Indicadores ---------------------------- */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <TarjetaKpi
          etiqueta="Equipos en catálogo"
          valor={resumen.total}
          detalle={`${resumen.unidades} unidades en depósito`}
          icono={Package}
          tono="naranja"
        />
        <TarjetaKpi
          etiqueta="Capital inmovilizado"
          valor={usd(resumen.inmovilizado)}
          detalle={`${usd(resumen.potencial)} si se vende todo`}
          icono={DollarSign}
          tono="azul"
        />
        <TarjetaKpi
          etiqueta="Margen promedio"
          valor={`${resumen.margenPromedio.toFixed(1)}%`}
          detalle="sobre el precio de venta"
          icono={Percent}
          tono="naranja"
        />
        <TarjetaKpi
          etiqueta="Para reponer"
          valor={resumen.criticos}
          detalle={`${resumen.enTransito} unidades en camino`}
          icono={Boxes}
          tono="azul"
          tendencia={resumen.criticos > 0 ? 'baja' : 'igual'}
        />
      </div>

      {/* ------------------------------ Catálogo ------------------------------ */}
      <Panel
        titulo="Catálogo de equipamiento"
        bajada={`${filtrados.length} de ${equipos.length} equipos visibles`}
        cuerpoClassName="p-0"
        acciones={
          <>
            <BotonGm variante="contorno" tamano="sm" icono={Download} onClick={exportarCsv}>
              Exportar
            </BotonGm>
            <BotonGm variante="solido" tamano="sm" icono={Plus} onClick={() => setEditando({})}>
              Nuevo equipo
            </BotonGm>
          </>
        }
      >
        <div className="flex flex-col gap-4 border-b border-[#F0EAE1] dark:border-[#333333] px-6 py-4 lg:flex-row lg:items-center lg:justify-between">
          <FiltrosCategoria rubros={porRubro} valor={rubro} onChange={setRubro} total={equipos.length} />
          <Buscador
            valor={busqueda}
            onChange={setBusqueda}
            placeholder="Buscar por nombre, marca, modelo o código…"
            className="w-full lg:w-[340px]"
          />
        </div>

        {cargando ? (
          <div className="px-6 py-16 text-center text-[14px] text-[#948A7C]">Cargando catálogo…</div>
        ) : (
          <TablaEquipos
            equipos={filtrados}
            orden={orden}
            onOrdenar={ordenar}
            onVerFicha={(e) => navigate(`/equipamientos/detalles?equipo=${encodeURIComponent(e.codigo)}`)}
            onEditar={setEditando}
            onEliminar={setBorrando}
          />
        )}
      </Panel>

      {/* ------------------------------- Modales ------------------------------ */}
      <FormularioGm
        abierto={!!editando}
        titulo={editando?.id ? 'Editar equipo' : 'Nuevo equipo'}
        bajada={
          editando?.id
            ? 'Los cambios impactan en el catálogo, en la ficha técnica y en el control de stock.'
            : 'Cargá el equipo con su costo, su precio y el stock que tenés hoy.'
        }
        campos={CAMPOS_EQUIPO}
        valores={editando?.id ? aFormulario(editando) : undefined}
        onCerrar={() => setEditando(null)}
        onGuardar={guardar}
        textoBoton={editando?.id ? 'Guardar cambios' : 'Crear equipo'}
      />

      <ConfirmarGm
        abierto={!!borrando}
        detalle={borrando ? `Se va a dar de baja "${borrando.nombre}".` : ''}
        advertencia="Sale del catálogo y del control de stock, pero su ficha técnica y su historial de movimientos se conservan."
        textoBoton="Dar de baja"
        onCerrar={() => setBorrando(null)}
        onConfirmar={() => bajaEquipo(borrando.id)}
      />
    </div>
  );
}
