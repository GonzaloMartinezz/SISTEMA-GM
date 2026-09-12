// ============================================================================
// SISTEMA GM · M-07 COBRANZAS · CUENTAS DEL NEGOCIO
// ----------------------------------------------------------------------------
// Acá vive la única distinción que hay que tener clara para no manejarse a
// ciegas, y por eso está escrita y no sólo implementada:
//
//   CAJA    = la plata que efectivamente se movió en el mes.
//             Es lo que hay en el bolsillo. Sirve para saber si llegás a fin
//             de mes.
//
//   MARGEN  = lo que vendiste menos lo que te costó, aunque todavía no lo
//             hayas cobrado. Es lo que ganaste. Sirve para saber si el negocio
//             funciona.
//
// Un mes puede tener margen enorme y caja negativa (vendiste a 18 cuotas y
// pagaste el equipo al contado), o caja positiva y margen cero (cobraste
// cuotas viejas y no vendiste nada). Mirar una sola de las dos es la forma
// más común de tomar una mala decisión con la mejor intención.
// ============================================================================

import { CATEGORIAS, CATEGORIAS_DE_COSTO } from '../config/cobranzas.config';

const r2 = (n) => Math.round((Number(n) || 0) * 100) / 100;
const suma = (arr, f) => r2(arr.reduce((a, x) => a + (Number(f(x)) || 0), 0));

/** Totales del período que se está mirando. */
export function totales(meses = []) {
  const cerrados = meses.filter((m) => !m.esFuturo);
  const cobrado = suma(cerrados, (m) => m.cobradoUsd);
  const egresos = suma(cerrados, (m) => m.egresosUsd);
  const retiros = suma(cerrados, (m) => m.retiroUsd);

  return {
    cobrado,
    egresos,
    // El retiro es plata tuya que sacás, no un costo de operar. Se separa para
    // que el resultado no castigue al negocio por pagarte a vos.
    costos: r2(egresos - retiros),
    retiros,
    caja: r2(cobrado - egresos),
    resultado: r2(cobrado - (egresos - retiros)),
    vendido: suma(cerrados, (m) => m.vendidoUsd),
    costoVendido: suma(cerrados, (m) => m.costoVendidoUsd),
    margen: suma(cerrados, (m) => m.margenUsd),
    ventas: cerrados.reduce((a, m) => a + m.ventasCantidad, 0),
    sueldo: suma(cerrados, (m) => m.sueldoUsd),
    mercaderia: suma(cerrados, (m) => m.mercaderiaUsd),
    meses: cerrados.length,
  };
}

/** Cuánto pesa cada categoría de gasto en el período. */
export function porCategoria(meses = []) {
  const cerrados = meses.filter((m) => !m.esFuturo);
  const campo = {
    mercaderia: 'mercaderiaUsd',
    logistica: 'logisticaUsd',
    sueldo: 'sueldoUsd',
    impuestos: 'impuestosUsd',
    operativo: 'operativoUsd',
    retiro: 'retiroUsd',
    otro: 'otroUsd',
  };

  const filas = CATEGORIAS.map((c) => ({
    ...c,
    monto: suma(cerrados, (m) => m[campo[c.id]] || 0),
  })).filter((c) => c.monto > 0);

  const total = suma(filas, (c) => c.monto);
  return filas
    .map((c) => ({ ...c, pct: total > 0 ? (c.monto / total) * 100 : 0 }))
    .sort((a, b) => b.monto - a.monto);
}

/**
 * Caja acumulada mes a mes. Es la curva que de verdad importa: no interesa
 * tanto si un mes dio negativo, sino si la línea sube o baja con el tiempo.
 */
export function acumulado(meses = []) {
  let saldo = 0;
  return meses
    .filter((m) => !m.esFuturo)
    .map((m) => {
      saldo = r2(saldo + m.cajaUsd);
      return { ...m, acumulado: saldo };
    });
}

/**
 * La cascada de un período: de lo que se vendió a lo que quedó.
 * Cada escalón resta algo, y el último es el resultado.
 */
export function cascada(meses = []) {
  const t = totales(meses);
  const cerrados = meses.filter((m) => !m.esFuturo);
  const logistica = suma(cerrados, (m) => m.logisticaUsd);
  const impuestos = suma(cerrados, (m) => m.impuestosUsd);
  const operativo = suma(cerrados, (m) => m.operativoUsd + m.otroUsd);

  // Ojo: acá la mercadería es el costo de LO QUE SE VENDIÓ, no lo que se
  // compró en el período. Es la única forma de que el margen tenga sentido:
  // si restara las compras, un mes en que llenaste el depósito daría pérdida
  // aunque hayas vendido bien.
  return [
    { etiqueta: 'Vendido',              valor: t.vendido,       tipo: 'base' },
    { etiqueta: 'Costo de lo vendido',  valor: -t.costoVendido, tipo: 'resta' },
    { etiqueta: 'Margen',               valor: t.margen,        tipo: 'subtotal' },
    { etiqueta: 'Logística',  valor: -logistica,       tipo: 'resta' },
    { etiqueta: 'Sueldo',     valor: -t.sueldo,        tipo: 'resta' },
    { etiqueta: 'Impuestos',  valor: -impuestos,       tipo: 'resta' },
    { etiqueta: 'Operativo',  valor: -operativo,       tipo: 'resta' },
    {
      etiqueta: 'Ganancia',
      valor: r2(t.margen - logistica - t.sueldo - impuestos - operativo),
      tipo: 'final',
    },
  ];
}

/** Cuánto queda por cobrar en total y cuánto de eso ya está vencido. */
export function cartera(ventas = []) {
  const abiertas = ventas.filter((v) => v.estado !== 'anulada' && v.saldoUsd > 0.01);
  const vencido = suma(abiertas, (v) => v.vencidoUsd);
  const porCobrar = suma(abiertas, (v) => v.saldoUsd);

  return {
    porCobrar,
    vencido,
    alDia: r2(porCobrar - vencido),
    // Qué porcentaje de lo que te deben ya debería haber entrado. Es EL número
    // de un módulo de cobranzas: si sube, algo se está descontrolando.
    morosidadPct: porCobrar > 0 ? (vencido / porCobrar) * 100 : 0,
    ventasAbiertas: abiertas.length,
    ventasAtrasadas: abiertas.filter((v) => v.cuotasVencidas > 0).length,
    clientesDeudores: new Set(abiertas.map((v) => v.clienteCodigo || v.cliente)).size,
    peor: abiertas
      .filter((v) => v.diasAtraso != null)
      .sort((a, b) => (b.diasAtraso || 0) - (a.diasAtraso || 0))[0] || null,
  };
}

/** Deuda agrupada por cliente: con quién hay que hablar, no qué venta mirar. */
export function deudaPorCliente(ventas = []) {
  const mapa = new Map();
  ventas
    .filter((v) => v.estado !== 'anulada' && v.saldoUsd > 0.01)
    .forEach((v) => {
      const k = v.clienteCodigo || v.cliente;
      if (!mapa.has(k)) {
        mapa.set(k, {
          clave: k,
          cliente: v.cliente,
          titular: v.titular,
          telefono: v.telefono,
          celular: v.celular,
          email: v.email,
          localidad: v.localidad,
          rubro: v.rubro,
          saldo: 0,
          vencido: 0,
          ventas: 0,
          diasAtraso: null,
          proximoVencimiento: null,
        });
      }
      const x = mapa.get(k);
      x.saldo = r2(x.saldo + v.saldoUsd);
      x.vencido = r2(x.vencido + v.vencidoUsd);
      x.ventas += 1;
      if (v.diasAtraso != null && (x.diasAtraso == null || v.diasAtraso > x.diasAtraso)) {
        x.diasAtraso = v.diasAtraso;
      }
      if (v.proximoVencimiento &&
          (!x.proximoVencimiento || v.proximoVencimiento < x.proximoVencimiento)) {
        x.proximoVencimiento = v.proximoVencimiento;
      }
    });

  return [...mapa.values()].sort((a, b) => b.vencido - a.vencido || b.saldo - a.saldo);
}

/** Suma de movimientos de caja de una lista ya filtrada. */
export function resumenCaja(movimientos = []) {
  const ingresos = movimientos.filter((m) => m.flujo === 'ingreso');
  const egresos = movimientos.filter((m) => m.flujo === 'egreso');
  const entro = suma(ingresos, (m) => m.montoUsd);
  const salio = suma(egresos, (m) => m.montoUsd);
  const retiros = suma(egresos.filter((m) => m.categoria === 'retiro'), (m) => m.montoUsd);

  const mayor = [...egresos].sort((a, b) => b.montoUsd - a.montoUsd)[0] || null;

  return {
    entro,
    salio,
    neto: r2(entro - salio),
    retiros,
    operativo: r2(salio - retiros),
    movimientos: movimientos.length,
    cobros: ingresos.length,
    pagos: egresos.length,
    mayorEgreso: mayor,
  };
}

/** Sólo las categorías que se consideran costo del negocio. */
export const esCosto = (categoria) => CATEGORIAS_DE_COSTO.includes(categoria);
