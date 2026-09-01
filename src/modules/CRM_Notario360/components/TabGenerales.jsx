// ============================================================================
// SISTEMA GM · NOTARIO 360° · PESTAÑA 1 · GENERALES
// ============================================================================

import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { useCuenta } from '../../../shared/cuentas/CuentaContext';
import PanelTerminal, { Campo, SinDatos } from '../../../shared/ui/PanelTerminal';

export default function TabGenerales() {
  const { cuenta } = useCuenta();
  if (!cuenta) return null;

  const { titular, cuenta: datos } = cuenta;
  const avisos = datos.avisos || [];

  return (
    <div className="grid h-full min-h-0 grid-cols-1 gap-3 lg:grid-cols-3">
      {/* ---------- Columna izquierda ---------- */}
      <div className="flex min-h-0 flex-col gap-3 lg:col-span-2">
        <PanelTerminal titulo="Avisos del sistema" acento={avisos.length ? 'rojo' : 'gris'}>
          {avisos.length ? (
            <ul className="divide-y divide-gray-800">
              {avisos.map((aviso, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 px-3 py-2 font-mono text-[11px] font-bold uppercase tracking-wide text-rose-400"
                >
                  <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  {aviso}
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-3 py-3 font-mono text-[11px] uppercase tracking-[0.15em] text-emerald-500/80">
              Sin avisos para la cuenta
            </div>
          )}
        </PanelTerminal>

        <PanelTerminal titulo="Datos contractuales" className="flex-1">
          <table className="w-full border-collapse text-left font-mono text-[11px]">
            <thead className="sticky top-0 border-b border-gray-800 bg-gray-800/80">
              <tr className="uppercase tracking-wider text-gray-500">
                <th className="border-r border-gray-800 p-2 font-semibold text-cyan-400">Tipo</th>
                <th className="border-r border-gray-800 p-2 font-semibold">Nº de cuenta</th>
                <th className="border-r border-gray-800 p-2 font-semibold">Alta</th>
                <th className="border-r border-gray-800 p-2 font-semibold">Vto. cuenta</th>
                <th className="p-2 font-semibold">Ciclo C-F-V</th>
              </tr>
            </thead>
            <tbody className="text-gray-300">
              <tr className="border-b border-gray-800">
                <td className="border-r border-gray-800 p-2 font-bold text-blue-400">{datos.tipo}</td>
                <td className="border-r border-gray-800 p-2">{datos.numero}</td>
                <td className="border-r border-gray-800 p-2 text-center">{datos.alta}</td>
                <td className="border-r border-gray-800 p-2 text-center">{datos.vencimiento}</td>
                <td className="p-2 text-center">
                  {datos.ciclo.cierra} - {datos.ciclo.factura} - {datos.ciclo.vence}
                </td>
              </tr>
              <tr className="border-b border-gray-800 bg-gray-950/60 uppercase text-gray-500">
                <td className="border-r border-gray-800 p-2 font-bold">Día vto.</td>
                <td className="border-r border-gray-800 p-2 text-center text-cyan-300">Sucursal</td>
                <td colSpan="3" className="p-2 text-center text-cyan-300">
                  Convenio
                </td>
              </tr>
              <tr>
                <td className="border-r border-gray-800 p-2">{datos.diaVto}</td>
                <td className="border-r border-gray-800 p-2 text-center uppercase">{datos.sucursal}</td>
                <td colSpan="3" className="p-2 text-center uppercase">
                  {datos.convenio}
                </td>
              </tr>
            </tbody>
          </table>
        </PanelTerminal>
      </div>

      {/* ---------- Columna derecha ---------- */}
      <div className="flex min-h-0 flex-col gap-3">
        <PanelTerminal titulo="Estado de la cuenta">
          <div className="grid grid-cols-2 gap-3 p-3">
            <Campo label="Estado">
              <span
                className={
                  String(datos.estado).toUpperCase().includes('CORRIENTE')
                    ? 'font-bold text-emerald-400'
                    : 'font-bold text-rose-400'
                }
              >
                {datos.estado}
              </span>
            </Campo>
            <Campo label="Bloqueos">{datos.bloqueos}</Campo>
            <Campo label="Cliente desde">{titular.clienteDesde}</Campo>
            <Campo label="Clasificación">{titular.clasificacion}</Campo>
          </div>
        </PanelTerminal>

        <PanelTerminal titulo="Titular" className="flex-1">
          {titular ? (
            <div className="grid grid-cols-2 gap-3 p-3">
              <Campo label="Apellido y nombre" className="col-span-2">
                {titular.apellido}, {titular.nombre}
              </Campo>
              <Campo label="DNI">{titular.dni}</Campo>
              <Campo label="CUIT / CUIL">{titular.cuit}</Campo>
              <Campo label="Razón social" className="col-span-2">
                {titular.razonSocial}
              </Campo>
              <Campo label="Teléfono">{titular.telefono}</Campo>
              <Campo label="Celular">{titular.celular}</Campo>
              <Campo label="Email" className="col-span-2">
                <span className="break-all">{titular.email}</span>
              </Campo>
            </div>
          ) : (
            <SinDatos mensaje="Sin datos del titular" />
          )}
        </PanelTerminal>
      </div>
    </div>
  );
}
