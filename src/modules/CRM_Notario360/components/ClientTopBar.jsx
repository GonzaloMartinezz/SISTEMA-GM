// ============================================================================
// SISTEMA GM · NOTARIO 360° · CABECERA PERSISTENTE DE LA CUENTA
// ----------------------------------------------------------------------------
// Siempre visible mientras se navegan las pestañas: quién es, qué cuenta es,
// en qué estado está y qué tan cerca está de cerrarse la operación.
// ============================================================================

import React from 'react';
import { CreditCard, Fingerprint, Building2, User, ShieldAlert, ShieldCheck } from 'lucide-react';
import ProgressGauge from './ProgressGauge';

const iniciales = (nombre = '', apellido = '') =>
  `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase();

const estiloEstado = (estado = '') => {
  const e = estado.toUpperCase();
  if (e.includes('MORA') || e.includes('SUSPEND'))
    return 'border-rose-500/40 bg-rose-500/10 text-rose-400';
  if (e.includes('CORRIENTE')) return 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400';
  return 'border-amber-500/40 bg-amber-500/10 text-amber-400';
};

const iconoClasificacion = (clasificacion = '') => {
  const c = clasificacion.toLowerCase();
  if (c.includes('clínica') || c.includes('clinica')) return Building2;
  if (c.includes('empresa')) return Building2;
  return User;
};

export default function ClientTopBar({ cuenta }) {
  if (!cuenta) return null;

  const { titular, cuenta: datos, comercial } = cuenta;
  const IconoClase = iconoClasificacion(titular.clasificacion);
  const conRestriccion = !String(datos.bloqueos || '').toUpperCase().includes('SIN');

  return (
    <header className="shrink-0 border-b border-gray-800 bg-gray-950/90 px-4 py-3 backdrop-blur md:px-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        {/* ---------- Identidad ---------- */}
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-cyan-500/30 bg-cyan-500/10 font-mono text-base font-bold text-cyan-400">
            {iniciales(titular.nombre, titular.apellido)}
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="truncate text-base font-bold tracking-tight text-white md:text-lg">
                {titular.apellido}, {titular.nombre}
              </h2>
              <span className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-gray-300">
                <IconoClase className="h-3 w-3" />
                {titular.clasificacion}
              </span>
            </div>

            <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[11px] text-gray-400">
              <span className="inline-flex items-center gap-1.5">
                <Fingerprint className="h-3 w-3 text-gray-600" />
                DNI {titular.dni}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CreditCard className="h-3 w-3 text-gray-600" />
                {datos.numero}
              </span>
              <span className="hidden text-gray-600 sm:inline">·</span>
              <span className="hidden sm:inline">{datos.tipo}</span>
              <span className="hidden text-gray-600 md:inline">·</span>
              <span className="hidden md:inline">{cuenta.id}</span>
            </div>
          </div>
        </div>

        {/* ---------- Estado ---------- */}
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.15em] ${estiloEstado(datos.estado)}`}
          >
            {conRestriccion ? <ShieldAlert className="h-3 w-3" /> : <ShieldCheck className="h-3 w-3" />}
            {datos.estado}
          </span>

          <span
            className={`inline-flex items-center rounded-md border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.15em] ${
              conRestriccion
                ? 'border-rose-500/30 bg-rose-500/5 text-rose-300'
                : 'border-gray-700 bg-gray-900 text-gray-400'
            }`}
          >
            {datos.bloqueos}
          </span>

          <span className="hidden items-center rounded-md border border-gray-700 bg-gray-900 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.15em] text-gray-400 xl:inline-flex">
            {datos.sucursal} · {datos.convenio}
          </span>
        </div>

        {/* ---------- Progreso comercial ---------- */}
        <div className="flex shrink-0 items-center gap-4 border-t border-gray-800 pt-3 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
          <ProgressGauge valor={comercial?.progreso} etiqueta={comercial?.etapa} />
          <div className="leading-tight">
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-gray-500">
              Próximo paso
            </p>
            <p className="max-w-[220px] truncate text-xs font-medium text-gray-200">
              {comercial?.proximoPaso || 'Sin definir'}
            </p>
            <p className="mt-0.5 font-mono text-[10px] text-gray-500">
              Resp. {comercial?.responsable} · Últ. visita {comercial?.ultimaVisita}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
