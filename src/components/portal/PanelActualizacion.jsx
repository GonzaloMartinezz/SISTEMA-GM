// ============================================================================
// SISTEMA GM · RESULTADO DE LA ACTUALIZACIÓN
// ----------------------------------------------------------------------------
// Lo que se abre después de tocar "Actualizar". Contesta tres preguntas en
// este orden, que es el orden en que importan:
//
//   ¿entró algo nuevo?        -> los cambios, comparando antes y después
//   ¿quedó algo mal?          -> las planillas con error, arriba de todo
//   ¿qué tiene el sistema?    -> el conteo de cada cosa
//
// Las planillas que anduvieron bien van colapsadas al final. Si todo salió
// bien no hay nada que leer, y esa es justamente la información.
// ============================================================================

import React, { useMemo, useState } from 'react';
import {
  AlertTriangle, CheckCircle2, ChevronDown, Clock, Database, FileSpreadsheet, X,
} from 'lucide-react';

const numero = (v) => Number(v || 0).toLocaleString('es-AR');
const usd = (v) => `US$ ${Number(v || 0).toLocaleString('es-AR')}`;

const TONO_ESTADO = {
  'al dia':      { texto: 'text-emerald-400', fondo: 'bg-emerald-500/10', nombre: 'al día' },
  reciente:      { texto: 'text-sky-400',     fondo: 'bg-sky-500/10',     nombre: 'reciente' },
  viejo:         { texto: 'text-white/40',    fondo: 'bg-white/[0.04]',   nombre: 'sin cambios' },
  'sin datos':   { texto: 'text-white/30',    fondo: 'bg-white/[0.03]',   nombre: 'nunca envió' },
  'con errores': { texto: 'text-rose-400',    fondo: 'bg-rose-500/10',    nombre: 'con errores' },
};

export default function PanelActualizacion({ abierto, resultado, onCerrar }) {
  const [verTodas, setVerTodas] = useState(false);

  const porModulo = useMemo(() => {
    if (!resultado?.planillas?.length) return [];
    const mapa = new Map();
    resultado.planillas.forEach((p) => {
      if (!mapa.has(p.modulo)) mapa.set(p.modulo, []);
      mapa.get(p.modulo).push(p);
    });
    return [...mapa.entries()];
  }, [resultado]);

  if (!abierto || !resultado) return null;

  // Con valores por defecto: este panel también se abre cuando algo salió mal,
  // y ahí es justamente cuando puede faltar un campo. Un panel de errores que
  // se rompe al mostrar el error no le sirve a nadie.
  const {
    empuje = null,
    cambios = [],
    conErrores = [],
    sinDatos = [],
    resumen = null,
    segundos = 0,
    planillas = [],
    mensaje = null,
  } = resultado;

  // Si no se llegó ni a la base, las secciones de "qué entró" y "el puente"
  // no tienen nada real que contar. Mostrarlas igual sería inventar: dirían
  // "nada nuevo" cuando la verdad es "no se pudo mirar".
  const alcanzoLaBase = resumen !== null || planillas.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onCerrar}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Resultado de la actualización"
        className="relative flex max-h-[86vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-white/[0.1] bg-[#05070f] shadow-[0_40px_120px_-30px_rgba(0,0,0,0.95)]"
      >
        {/* ----------------------------- cabecera --------------------------- */}
        <header className="flex items-start justify-between gap-4 border-b border-white/[0.07] px-6 py-5">
          <div className="min-w-0">
            <h2 className="flex items-center gap-2 text-[16px] font-semibold text-white/90">
              {resultado.ok ? (
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
              ) : (
                <AlertTriangle className="h-4 w-4 shrink-0 text-amber-400" />
              )}
              {resultado.ok ? 'Sistema actualizado' : 'Actualizado, con avisos'}
            </h2>
            <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.14em] text-white/30">
              {segundos} s · {planillas.length} planillas revisadas
            </p>
          </div>
          <button
            type="button"
            onClick={onCerrar}
            aria-label="Cerrar"
            className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-white/35 transition hover:bg-white/[0.06] hover:text-white/80"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-6 py-5">
          {/* Cuando ni siquiera se pudo llegar a la base, eso va primero: todo
              lo demás que muestre este panel sería ruido. */}
          {mensaje && (
            <p className="rounded-lg border border-amber-500/25 bg-amber-500/[0.08] px-3.5 py-3 text-[13px] leading-relaxed text-amber-200/90">
              {mensaje}
            </p>
          )}

          {/* --------------------------- qué entró -------------------------- */}
          {alcanzoLaBase && (
          <section>
            <Titulo icono={Database}>Qué entró con esta actualización</Titulo>
            {cambios.length === 0 ? (
              <p className="text-[13px] leading-relaxed text-white/45">
                Nada nuevo: lo que hay en Drive ya estaba cargado en el sistema. Es la respuesta
                normal cuando no tocaste las planillas desde la última vez.
              </p>
            ) : (
              <ul className="flex flex-wrap gap-2">
                {cambios.map((c) => (
                  <li
                    key={c.clave}
                    className={`rounded-lg border px-2.5 py-1.5 text-[12px] ${
                      c.delta > 0
                        ? 'border-emerald-500/25 bg-emerald-500/10 text-emerald-300'
                        : 'border-amber-500/25 bg-amber-500/10 text-amber-300'
                    }`}
                  >
                    {c.delta > 0 ? '+' : '−'} {c.texto}
                  </li>
                ))}
              </ul>
            )}
          </section>
          )}

          {/* ------------------------ el puente con Drive -------------------- */}
          {alcanzoLaBase && (
          <section>
            <Titulo icono={FileSpreadsheet}>El puente con Google Drive</Titulo>
            <EstadoDelPuente empuje={empuje} />
          </section>
          )}

          {/* --------------------------- problemas -------------------------- */}
          {conErrores.length > 0 && (
            <section>
              <Titulo icono={AlertTriangle} tono="text-rose-400">
                Planillas con filas que no entraron
              </Titulo>
              <ul className="space-y-2">
                {conErrores.map((p) => (
                  <li
                    key={`${p.modulo}-${p.hoja}`}
                    className="rounded-lg border border-rose-500/25 bg-rose-500/[0.07] px-3 py-2.5"
                  >
                    <p className="text-[13px] text-white/85">
                      {p.hoja}
                      <span className="ml-2 font-mono text-[11px] text-rose-400">
                        {p.errores} de {p.filas} filas
                      </span>
                    </p>
                    {p.detalleError && (
                      <p className="mt-1 break-words font-mono text-[11px] leading-relaxed text-white/40">
                        {p.detalleError}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-[12px] leading-relaxed text-white/35">
                Las filas con problema se saltean y las demás entran igual. Suele ser un dato que
                no existe todavía: un código de cliente sin cargar, o un rubro escrito distinto.
              </p>
            </section>
          )}

          {sinDatos.length > 0 && (
            <section>
              <Titulo icono={Clock} tono="text-white/45">
                Planillas que nunca mandaron nada
              </Titulo>
              <p className="mb-2 text-[12px] leading-relaxed text-white/35">
                Puede ser que la hoja todavía no exista en el Drive, que esté vacía, o que el
                script de Google no esté instalado. Los datos que ya están en la base no se tocan.
              </p>
              <div className="flex flex-wrap gap-1.5">
                {sinDatos.map((p) => (
                  <span
                    key={`${p.modulo}-${p.hoja}`}
                    className="rounded-md border border-white/[0.08] bg-white/[0.03] px-2 py-1 font-mono text-[11px] text-white/40"
                  >
                    {p.hoja}
                    {p.filasEnTabla > 0 && (
                      <span className="ml-1.5 text-emerald-400/50">{p.filasEnTabla} en base</span>
                    )}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* ------------------------ qué hay adentro ------------------------ */}
          {resumen && (
            <section>
              <Titulo icono={Database}>Qué tiene el sistema ahora</Titulo>
              <dl className="grid grid-cols-2 gap-x-4 gap-y-2.5 sm:grid-cols-4">
                <Dato t="Clientes" v={numero(resumen.clientes)} />
                <Dato t="Equipos" v={numero(resumen.equipos)} />
                <Dato t="Seguimientos" v={numero(resumen.leads)} />
                <Dato t="Agenda" v={numero(resumen.agenda)} pie="pendientes" />
                <Dato t="Ventas" v={numero(resumen.ventas)} />
                <Dato t="Cuotas" v={numero(resumen.cuotas)} />
                <Dato t="Por cobrar" v={usd(resumen.por_cobrar)} />
                <Dato
                  t="Vencido"
                  v={usd(resumen.vencido)}
                  alerta={Number(resumen.vencido) > 0}
                />
              </dl>
              {Number(resumen.pendientes) > 0 && (
                <p className="mt-3 rounded-lg border border-amber-500/20 bg-amber-500/[0.07] px-3 py-2 text-[12px] leading-relaxed text-amber-300/90">
                  Hay {resumen.pendientes} cosas esperándote en la bandeja de la Agenda: cuotas
                  vencidas, seguimientos frenados y avisos de los otros módulos.
                </p>
              )}
            </section>
          )}

          {/* ------------------------ todas las planillas -------------------- */}
          {planillas.length > 0 && (
          <section>
            <button
              type="button"
              onClick={() => setVerTodas((v) => !v)}
              className="flex w-full items-center gap-2 border-t border-white/[0.06] pt-4 text-left font-mono text-[11px] uppercase tracking-[0.16em] text-white/30 transition hover:text-white/60"
            >
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform ${verTodas ? 'rotate-180' : ''}`}
              />
              Ver las {planillas.length} planillas una por una
            </button>

            {verTodas && (
              <div className="mt-3 space-y-4">
                {porModulo.map(([modulo, hojas]) => (
                  <div key={modulo}>
                    <p className="mb-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-white/25">
                      {modulo}
                    </p>
                    <ul className="space-y-1">
                      {hojas.map((p) => {
                        const t = TONO_ESTADO[p.estado] || TONO_ESTADO.viejo;
                        return (
                          <li
                            key={`${modulo}-${p.hoja}`}
                            className="flex items-center gap-3 rounded-md bg-white/[0.02] px-2.5 py-1.5"
                          >
                            <span className="min-w-0 flex-1 truncate text-[12px] text-white/70">
                              {p.hoja}
                            </span>
                            <span className="shrink-0 font-mono text-[11px] text-white/30">
                              {numero(p.filasEnTabla)} filas
                            </span>
                            <span
                              className={`shrink-0 rounded px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider ${t.fondo} ${t.texto}`}
                            >
                              {t.nombre}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </section>
          )}
        </div>

        <footer className="flex items-center justify-between gap-3 border-t border-white/[0.07] bg-black/40 px-6 py-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/25">
            {alcanzoLaBase ? 'Los módulos ya tienen estos datos' : 'No se pudo leer la base'}
          </p>
          <button
            type="button"
            onClick={onCerrar}
            className="rounded-lg border border-white/[0.12] bg-white/[0.05] px-4 py-2 text-[13px] font-medium text-white/80 transition hover:bg-white/[0.1] hover:text-white"
          >
            Entendido
          </button>
        </footer>
      </div>
    </div>
  );
}

function EstadoDelPuente({ empuje }) {
  if (!empuje) return null;

  if (empuje.disponible && empuje.ok) {
    return (
      <p className="text-[13px] leading-relaxed text-emerald-300/90">
        Se le pidió a Google que mandara todo ahora mismo: {empuje.hojas} hojas revisadas,{' '}
        {numero(empuje.filas)} filas enviadas
        {empuje.errores > 0 ? `, ${empuje.errores} con problema` : ' sin errores'}.
      </p>
    );
  }

  if (empuje.motivo === 'no-configurado') {
    return (
      <p className="text-[13px] leading-relaxed text-white/45">
        El envío inmediato desde Drive todavía no está conectado, así que este botón no lo pudo
        forzar. <span className="text-white/70">No perdés nada</span>: las planillas se mandan
        solas cada minuto, y lo que ves acá arriba ya es lo último que llegó.
      </p>
    );
  }

  if (empuje.motivo === 'demoro') {
    return (
      <p className="text-[13px] leading-relaxed text-amber-300/90">{empuje.mensaje}</p>
    );
  }

  return (
    <p className="text-[13px] leading-relaxed text-amber-300/90">
      No se pudo forzar el envío desde Drive
      {empuje.mensaje ? `: ${empuje.mensaje}` : '.'} Las planillas siguen entrando solas cada
      minuto.
    </p>
  );
}

function Titulo({ icono: Icono, tono = 'text-white/50', children }) {
  return (
    <h3
      className={`mb-2 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] ${tono}`}
    >
      <Icono className="h-3.5 w-3.5" />
      {children}
    </h3>
  );
}

function Dato({ t, v, pie, alerta }) {
  return (
    <div>
      <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/25">{t}</dt>
      <dd className={`mt-0.5 text-[15px] tabular-nums ${alerta ? 'text-rose-400' : 'text-white/85'}`}>
        {v}
      </dd>
      {pie && <p className="text-[10px] text-white/25">{pie}</p>}
    </div>
  );
}
