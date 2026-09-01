// ============================================================================
// SISTEMA GM · NOTARIO 360° · PADRÓN DE CUENTAS
// ----------------------------------------------------------------------------
// Listado maestro. Cada fila abre la Ficha 360° de esa cuenta.
// ============================================================================

import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Download, Plus, ExternalLink, Loader2 } from 'lucide-react';
import { listarCuentas } from '../../../shared/cuentas/cuentasService';

const estiloEstado = (estado = '') => {
  const e = estado.toUpperCase();
  if (e.includes('MORA')) return 'bg-red-100 text-red-600';
  if (e.includes('CORRIENTE')) return 'bg-emerald-100 text-emerald-700';
  return 'bg-amber-100 text-amber-700';
};

const colorProgreso = (v) => {
  if (v >= 75) return 'bg-emerald-500';
  if (v >= 45) return 'bg-blue-500';
  if (v >= 20) return 'bg-amber-500';
  return 'bg-red-400';
};

export default function PadronView() {
  const navigate = useNavigate();
  const [cuentas, setCuentas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    let vivo = true;
    listarCuentas()
      .then((data) => vivo && setCuentas(data))
      .finally(() => vivo && setCargando(false));
    return () => {
      vivo = false;
    };
  }, []);

  const visibles = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    if (!q) return cuentas;
    return cuentas.filter((c) =>
      [c.id, c.titular.nombre, c.titular.apellido, c.titular.dni, c.titular.razonSocial]
        .filter(Boolean)
        .some((campo) => String(campo).toLowerCase().includes(q))
    );
  }, [cuentas, busqueda]);

  const abrirFicha = (id) => navigate(`/notario-360/ficha/${id}`);

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      {/* Toolbar */}
      <div className="flex flex-col items-center justify-between gap-4 border-b border-gray-100 p-4 sm:flex-row">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por titular, DNI o Nº de cuenta…"
            className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            <Filter className="h-4 w-4" /> Filtrar
          </button>
          <button className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            <Download className="h-4 w-4" /> Exportar
          </button>
          <button className="ml-2 flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-800">
            <Plus className="h-4 w-4" /> Nueva cuenta
          </button>
        </div>
      </div>

      {/* Tabla */}
      <div className="flex-1 overflow-auto">
        {cargando ? (
          <div className="flex h-full items-center justify-center gap-3 text-gray-400">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="text-sm">Cargando padrón…</span>
          </div>
        ) : (
          <table className="w-full min-w-[900px] border-collapse text-left">
            <thead className="sticky top-0 z-10 border-b border-gray-100 bg-white">
              <tr className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                <th className="px-6 py-4">Titular</th>
                <th className="px-6 py-4">Cuenta</th>
                <th className="px-6 py-4">Clasificación</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4">Etapa</th>
                <th className="px-6 py-4 w-40">Progreso</th>
                <th className="px-6 py-4">Próximo paso</th>
                <th className="px-6 py-4 text-center">Ficha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {visibles.map((c) => (
                <tr
                  key={c.id}
                  onClick={() => abrirFicha(c.id)}
                  className="group cursor-pointer transition-colors hover:bg-gray-50/80"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600">
                        {c.titular.nombre.charAt(0)}
                        {c.titular.apellido.charAt(0)}
                      </div>
                      <div>
                        <span className="block text-sm font-semibold text-gray-900 transition-colors group-hover:text-blue-600">
                          {c.titular.apellido}, {c.titular.nombre}
                        </span>
                        <span className="block text-xs text-gray-500">DNI {c.titular.dni}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-gray-600">{c.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {c.titular.razonSocial || c.titular.clasificacion}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center rounded-md px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider ${estiloEstado(c.cuenta.estado)}`}
                    >
                      {c.cuenta.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">{c.comercial?.etapa}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-full max-w-[80px] overflow-hidden rounded-full bg-gray-200">
                        <div
                          className={`h-full rounded-full ${colorProgreso(c.comercial?.progreso || 0)}`}
                          style={{ width: `${c.comercial?.progreso || 0}%` }}
                        />
                      </div>
                      <span className="text-xs font-semibold tabular-nums text-gray-600">
                        {c.comercial?.progreso || 0}%
                      </span>
                    </div>
                  </td>
                  <td className="max-w-[240px] truncate px-6 py-4 text-sm text-gray-700">
                    {c.comercial?.proximoPaso}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        abrirFicha(c.id);
                      }}
                      className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 px-2.5 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:border-blue-300 hover:text-blue-600"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      Abrir 360°
                    </button>
                  </td>
                </tr>
              ))}

              {!visibles.length && (
                <tr>
                  <td colSpan="8" className="px-6 py-16 text-center text-sm text-gray-400">
                    No se encontraron cuentas para “{busqueda}”.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Pie */}
      <div className="flex items-center justify-between border-t border-gray-100 bg-white p-4 text-sm text-gray-500">
        <span>
          {visibles.length} de {cuentas.length} cuenta{cuentas.length === 1 ? '' : 's'}
        </span>
        <span className="text-xs text-gray-400">Clic en una fila para abrir la Ficha 360°</span>
      </div>
    </div>
  );
}
