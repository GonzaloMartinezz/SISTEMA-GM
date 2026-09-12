// ============================================================================
// SISTEMA GM · M-09 TESORERÍA · HORIZONTES DE TIEMPO
// ----------------------------------------------------------------------------
// El módulo se mira a cuatro distancias: la semana, el mes, el año y los cinco
// años. Cada una usa lo que realmente hay:
//
//   semana   -> el flujo de caja semanal cargado (dato real)
//   mes      -> la liquidación mes a mes (dato real)
//   12 meses -> los meses reales + proyección hasta completar el año
//   5 años   -> lo real agrupado por año + proyección anual
//
// Regla que no se negocia: cada punto sabe si es dato o proyección, y quien
// dibuja tiene que mostrar esa diferencia. Un tablero que mezcla lo que pasó
// con lo que podría pasar, sin distinguirlos, hace tomar decisiones mal.
// ============================================================================

/** Un mes liquidado -> punto de la serie, en la forma que usan los gráficos. */
const puntoDeMes = (m) => ({
  etiqueta: m.etiqueta,
  ingresos: m.ventasUsd,
  egresos: m.costoMercaderiaUsd + m.gastosLogisticaUsd + m.gastosOperativosUsd + m.sueldoFijoUsd,
  neto: m.resultadoUsd,
  proyectado: false,
});

const MESES_CORTOS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

/** Etiqueta del mes que sigue a "2026-08", n meses después. */
function etiquetaFutura(ultimoMes, n) {
  const [a, m] = String(ultimoMes || '').split('-').map(Number);
  if (!a || !m) return `+${n}m`;
  const d = new Date(a, m - 1 + n, 1);
  return `${MESES_CORTOS[d.getMonth()]} ${String(d.getFullYear()).slice(2)}`;
}

export const PERIODOS = [
  { id: 'semana', nombre: 'Semana', bajada: 'el flujo semana a semana' },
  { id: 'mes', nombre: 'Mes', bajada: 'la liquidación mes a mes' },
  { id: 'anio', nombre: '12 meses', bajada: 'lo real más lo proyectado hasta el año' },
  { id: 'cinco', nombre: '5 años', bajada: 'el largo plazo, con tasa amortiguada' },
];

/**
 * Devuelve la serie del período elegido.
 * @returns {{ puntos: Array, hayProyeccion: boolean, corte: string|null, nota: string }}
 */
export function serieHorizonte(datos, periodo) {
  if (!datos) return { puntos: [], hayProyeccion: false, corte: null, nota: '' };

  const { meses, flujo, crecimientoMensual } = datos;

  // ------------------------------------------------------------------ semana
  if (periodo === 'semana') {
    return {
      puntos: flujo.map((f) => ({
        etiqueta: f.etiqueta,
        ingresos: f.ingresosUsd,
        egresos: f.egresosUsd,
        neto: f.netoUsd,
        acumulado: f.acumuladoUsd,
        proyectado: false,
      })),
      hayProyeccion: false,
      corte: null,
      nota: 'Flujo de caja semanal cargado. Todo dato real.',
    };
  }

  // --------------------------------------------------------------------- mes
  if (periodo === 'mes') {
    return {
      puntos: meses.map(puntoDeMes),
      hayProyeccion: false,
      corte: null,
      nota: `${meses.length} meses liquidados. Todo dato real.`,
    };
  }

  if (!meses.length) {
    return { puntos: [], hayProyeccion: false, corte: null, nota: 'Sin meses cargados.' };
  }

  const ultimo = meses[meses.length - 1];

  // ---------------------------------------------------------------- 12 meses
  if (periodo === 'anio') {
    const reales = meses.map(puntoDeMes);
    const faltan = Math.max(12 - reales.length, 0);
    const tasa = crecimientoMensual;

    const base = puntoDeMes(ultimo);
    const futuros = Array.from({ length: faltan }, (_, i) => {
      const factor = (1 + tasa) ** (i + 1);
      return {
        etiqueta: etiquetaFutura(ultimo.mes, i + 1),
        ingresos: base.ingresos * factor,
        egresos: base.egresos * factor,
        neto: base.neto * factor,
        proyectado: true,
      };
    });

    return {
      puntos: [...reales, ...futuros],
      hayProyeccion: futuros.length > 0,
      corte: reales.length ? reales[reales.length - 1].etiqueta : null,
      nota: faltan
        ? `${reales.length} meses reales y ${faltan} proyectados al ${(tasa * 100).toFixed(1)}% mensual.`
        : 'Los 12 meses son dato real.',
    };
  }

  // ----------------------------------------------------------------- 5 años -
  // Más allá del año la tasa se amortigua: el ritmo de una racha buena no se
  // sostiene cinco años, y proyectarlo así da un número lindo y falso.
  const TASA_LARGO = 0.015;
  const tasaAnual = (1 + Math.min(crecimientoMensual, TASA_LARGO)) ** 12 - 1;

  const anioBase = Number(String(ultimo.mes).slice(0, 4)) || new Date().getFullYear();
  const base = puntoDeMes(ultimo);

  // El año en curso se muestra con lo que realmente se liquidó.
  const realDelAnio = meses
    .filter((m) => String(m.mes).startsWith(String(anioBase)))
    .map(puntoDeMes)
    .reduce(
      (a, p) => ({
        ingresos: a.ingresos + p.ingresos,
        egresos: a.egresos + p.egresos,
        neto: a.neto + p.neto,
      }),
      { ingresos: 0, egresos: 0, neto: 0 }
    );

  const puntos = [
    { etiqueta: `${anioBase}`, ...realDelAnio, proyectado: false, parcial: true },
  ];

  let anual = { ingresos: base.ingresos * 12, egresos: base.egresos * 12, neto: base.neto * 12 };
  for (let i = 1; i <= 5; i += 1) {
    anual = {
      ingresos: anual.ingresos * (1 + tasaAnual),
      egresos: anual.egresos * (1 + tasaAnual),
      neto: anual.neto * (1 + tasaAnual),
    };
    puntos.push({ etiqueta: `${anioBase + i}`, ...anual, proyectado: true });
  }

  return {
    puntos,
    hayProyeccion: true,
    corte: `${anioBase}`,
    nota: `${anioBase} es lo liquidado hasta hoy (año parcial). Los cinco siguientes se proyectan al ${(tasaAnual * 100).toFixed(1)}% anual, con la tasa amortiguada.`,
  };
}

/**
 * Totales del período, para las tarjetas de arriba.
 *
 * Devuelve lo real y lo proyectado por separado, nunca sumados en un solo
 * número. Si "Ingresos · 12 meses" mezclara cinco meses que pasaron con siete
 * que quizás pasen, ese total no serviría ni para cobrar ni para planificar.
 * La tarjeta muestra lo real y aclara aparte cuánto agregaría la proyección.
 */
export function resumenHorizonte(serie) {
  const puntos = serie.puntos || [];
  const reales = puntos.filter((p) => !p.proyectado);
  const proyectados = puntos.filter((p) => p.proyectado);

  const sumar = (lista, campo) => lista.reduce((a, p) => a + (p[campo] || 0), 0);

  const ingresos = sumar(reales, 'ingresos');
  const egresos = sumar(reales, 'egresos');

  return {
    ingresos,
    egresos,
    neto: ingresos - egresos,
    margenPct: ingresos > 0 ? ((ingresos - egresos) / ingresos) * 100 : 0,
    puntosReales: reales.length,
    puntosProyectados: proyectados.length,
    proyectado: {
      ingresos: sumar(proyectados, 'ingresos'),
      egresos: sumar(proyectados, 'egresos'),
      neto: sumar(proyectados, 'neto'),
    },
  };
}

/**
 * Salud financiera en una nota de 0 a 100. Tres cosas, con el peso que tienen
 * para un negocio como este:
 *   · margen neto (50%)  — si no deja plata, nada más importa
 *   · cobertura de gastos fijos con la liquidez (30%) — cuántos meses aguanta
 *   · crecimiento (20%)  — si viene para arriba o para abajo
 * Los umbrales son del negocio, no una regla universal: están acá a la vista
 * justamente para poder discutirlos.
 */
export function saludFinanciera(datos) {
  if (!datos) return null;

  const { ultimo, egresoMensualTotal, capital, crecimientoMensual } = datos;

  const margenPct = ultimo.ventasUsd > 0 ? (ultimo.resultadoUsd / ultimo.ventasUsd) * 100 : 0;
  const notaMargen = Math.max(0, Math.min(margenPct / 25, 1)) * 50;

  const mesesCobertura = egresoMensualTotal > 0 ? capital.liquidezUsd / egresoMensualTotal : 0;
  const notaCobertura = Math.max(0, Math.min(mesesCobertura / 6, 1)) * 30;

  const notaCrecimiento = Math.max(0, Math.min((crecimientoMensual + 0.02) / 0.07, 1)) * 20;

  const total = Math.round(notaMargen + notaCobertura + notaCrecimiento);
  const etiqueta =
    total >= 80 ? 'Excelente' : total >= 60 ? 'Buena' : total >= 40 ? 'Justa' : 'Delicada';

  return {
    total,
    etiqueta,
    partes: [
      { nombre: 'Margen neto', valor: Math.round(notaMargen), tope: 50, detalle: `${margenPct.toFixed(1)}% del mes` },
      { nombre: 'Cobertura de gastos', valor: Math.round(notaCobertura), tope: 30, detalle: `${mesesCobertura.toFixed(1)} meses de liquidez` },
      { nombre: 'Crecimiento', valor: Math.round(notaCrecimiento), tope: 20, detalle: `${(crecimientoMensual * 100).toFixed(1)}% mensual` },
    ],
  };
}
