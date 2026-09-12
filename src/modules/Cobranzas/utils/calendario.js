// ============================================================================
// SISTEMA GM · M-07 COBRANZAS · ARMADO DEL CALENDARIO
// ----------------------------------------------------------------------------
// Convierte una lista plana de cuotas en la grilla del mes y en los tres
// grupos que uno mira antes de arrancar el día: lo que quedó atrás, lo que
// vence esta semana y lo que viene después.
//
// La semana arranca en lunes, como se trabaja acá.
// ============================================================================

import { aFecha, hoyIso } from '../config/cobranzas.config';

const iso = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

/** Lunes = 0 … domingo = 6. getDay() devuelve domingo = 0, que no sirve acá. */
const diaSemanaLunes = (f) => (f.getDay() + 6) % 7;

export const claveMes = (fechaIso) => String(fechaIso || '').slice(0, 7);

export const mesActual = () => claveMes(hoyIso());

/** Mueve un mes 'YYYY-MM' n meses adelante o atrás. */
export const desplazarMes = (mesIso, n) => {
  const [a, m] = String(mesIso).split('-').map(Number);
  const d = new Date(a, m - 1 + n, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
};

/**
 * Grilla del mes: siempre seis semanas de siete días, así el calendario no
 * cambia de alto al pasar de mes y la pantalla no salta bajo el cursor.
 */
export function grillaDelMes(mesIso, cuotas = []) {
  const [anio, mes] = String(mesIso).split('-').map(Number);
  const primero = new Date(anio, mes - 1, 1);
  const arranque = new Date(anio, mes - 1, 1 - diaSemanaLunes(primero));
  const hoy = hoyIso();

  const porDia = new Map();
  cuotas.forEach((c) => {
    if (!c.vencimiento) return;
    const k = c.vencimiento.slice(0, 10);
    if (!porDia.has(k)) porDia.set(k, []);
    porDia.get(k).push(c);
  });

  const dias = [];
  for (let i = 0; i < 42; i += 1) {
    const f = new Date(arranque.getFullYear(), arranque.getMonth(), arranque.getDate() + i);
    const k = iso(f);
    const delDia = porDia.get(k) || [];
    dias.push({
      iso: k,
      numero: f.getDate(),
      delMes: f.getMonth() === mes - 1,
      esHoy: k === hoy,
      esPasado: k < hoy,
      cuotas: delDia,
      total: delDia.reduce((a, c) => a + (c.estado === 'pagada' ? 0 : c.saldoUsd), 0),
      cobrado: delDia.reduce((a, c) => a + c.cobradoUsd, 0),
      vencidas: delDia.filter((c) => c.estado === 'vencida').length,
      pagadas: delDia.filter((c) => c.estado === 'pagada').length,
    });
  }

  const semanas = [];
  for (let i = 0; i < 6; i += 1) semanas.push(dias.slice(i * 7, i * 7 + 7));
  return semanas;
}

/** Total de un mes, contando sólo lo que todavía no entró. */
export function resumenDelMes(mesIso, cuotas = []) {
  const delMes = cuotas.filter((c) => claveMes(c.vencimiento) === mesIso);
  const pendientes = delMes.filter((c) => c.estado !== 'pagada' && c.estado !== 'anulada');
  return {
    cuotas: delMes.length,
    pendientes: pendientes.length,
    pagadas: delMes.filter((c) => c.estado === 'pagada').length,
    vencidas: delMes.filter((c) => c.estado === 'vencida').length,
    aCobrar: pendientes.reduce((a, c) => a + c.saldoUsd, 0),
    yaCobrado: delMes.reduce((a, c) => a + c.cobradoUsd, 0),
    comprometido: delMes.reduce((a, c) => a + c.montoUsd, 0),
    clientes: new Set(delMes.map((c) => c.clienteCodigo || c.cliente)).size,
  };
}

/**
 * Los tres grupos de trabajo. "Esta semana" es de hoy al domingo, no los
 * próximos siete días: lo que importa es si entra antes del fin de semana.
 */
export function agruparPorUrgencia(cuotas = []) {
  const hoy = hoyIso();
  const f = aFecha(hoy);
  const finDeSemana = new Date(f.getFullYear(), f.getMonth(), f.getDate() + (6 - diaSemanaLunes(f)));
  const finIso = iso(finDeSemana);
  const finDeMes = iso(new Date(f.getFullYear(), f.getMonth() + 1, 0));

  const abiertas = cuotas.filter((c) => c.estado !== 'pagada' && c.estado !== 'anulada');

  return {
    vencidas: abiertas
      .filter((c) => c.vencimiento < hoy)
      .sort((a, b) => (a.vencimiento < b.vencimiento ? -1 : 1)),
    estaSemana: abiertas
      .filter((c) => c.vencimiento >= hoy && c.vencimiento <= finIso)
      .sort((a, b) => (a.vencimiento < b.vencimiento ? -1 : 1)),
    restoDelMes: abiertas
      .filter((c) => c.vencimiento > finIso && c.vencimiento <= finDeMes)
      .sort((a, b) => (a.vencimiento < b.vencimiento ? -1 : 1)),
    masAdelante: abiertas
      .filter((c) => c.vencimiento > finDeMes)
      .sort((a, b) => (a.vencimiento < b.vencimiento ? -1 : 1)),
  };
}

/**
 * Lo que se espera cobrar en los próximos N meses, mes por mes. Es la
 * proyección honesta: sale de cuotas ya pactadas, no de un pronóstico.
 */
export function proyeccion(cuotas = [], meses = 6) {
  const hoy = hoyIso();
  const base = aFecha(hoy);
  const salida = [];
  for (let i = 0; i < meses; i += 1) {
    const d = new Date(base.getFullYear(), base.getMonth() + i, 1);
    const k = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const delMes = cuotas.filter(
      (c) => claveMes(c.vencimiento) === k && c.estado !== 'pagada' && c.estado !== 'anulada'
    );
    salida.push({
      mes: k,
      cuotas: delMes.length,
      monto: delMes.reduce((a, c) => a + c.saldoUsd, 0),
      clientes: new Set(delMes.map((c) => c.clienteCodigo || c.cliente)).size,
    });
  }
  return salida;
}
