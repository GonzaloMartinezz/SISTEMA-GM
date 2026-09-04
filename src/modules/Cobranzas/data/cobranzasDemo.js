// ============================================================================
// SISTEMA GM · M-08 COBRANZAS · DATOS DE DEMOSTRACIÓN
// ----------------------------------------------------------------------------
// Lo que se ve cuando el sistema todavía no está conectado a Supabase.
//
// Dos decisiones que valen la pena explicar:
//
// 1) Las fechas son RELATIVAS a hoy, no fijas. Una demo con fechas escritas a
//    mano se pudre sola: a los tres meses todas las cuotas figuran vencidas y
//    el módulo parece roto cuando en realidad está bien.
//
// 2) Las cuotas y los saldos se calculan acá con exactamente el mismo criterio
//    que usa la base (reparto parejo, la última cuota absorbe el redondeo,
//    estado derivado de los cobros). Si la demo mintiera, probar el módulo sin
//    conexión no serviría de nada.
// ============================================================================

const HOY = new Date();
const hoy0 = new Date(HOY.getFullYear(), HOY.getMonth(), HOY.getDate());

const iso = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

/** Suma meses cuidando los meses cortos: 31/01 + 1 mes cae el 28/02, no el 03/03. */
const masMeses = (fecha, n) => {
  const d = new Date(fecha.getFullYear(), fecha.getMonth() + n, 1);
  const ultimoDia = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
  d.setDate(Math.min(fecha.getDate(), ultimoDia));
  return d;
};

const desdeHoy = (meses, dia) => {
  const base = masMeses(hoy0, meses);
  if (dia == null) return base;
  const ultimoDia = new Date(base.getFullYear(), base.getMonth() + 1, 0).getDate();
  return new Date(base.getFullYear(), base.getMonth(), Math.min(dia, ultimoDia));
};

const diasEntre = (a, b) => Math.round((a - b) / 86400000);
const r2 = (n) => Math.round(n * 100) / 100;

/** Una cuota se puede pagar adelantada, pero el pago no puede tener fecha
 *  futura: la plata entró el día que entró. Sin esta línea, una venta pagada
 *  por adelantado mete cobros en meses que todavía no pasaron y el resultado
 *  del período deja de cerrar contra la caja. */
const nuncaEnElFuturo = (f) => (f > hoy0 ? hoy0 : f);

// ---------------------------------------------------------------------------
// Las ventas, en crudo
// ---------------------------------------------------------------------------
// pagadas: cuántas cuotas se pagaron enteras, de la primera en adelante.
// parcial: cuánto se pagó de la cuota siguiente a esas.
const SEMILLA = [
  {
    codigo: 'VT-001', cliente: 'Clínica Dental Bulacio', clienteCodigo: 'CLI-000008',
    titular: 'Bulacio, Federico', rubro: 'Odontología', localidad: 'San Miguel de Tucumán',
    telefono: '0381-4553311', celular: '381-5553311', email: 'fede@dentalbulacio.com',
    equipoCodigo: 'EQ-101', detalle: 'Sillón odontológico completo + instalación',
    mesVenta: -7, diaVenta: 10, total: 15900, costo: 10400, anticipo: 4000,
    cuotas: 10, mesPrimerVto: -6, interes: 0, pagadas: 5, parcial: 600,
    nota: 'Instalado a los diez días. Cliente puntual hasta hace dos meses.',
  },
  {
    codigo: 'VT-002', cliente: 'Odontología Integral Ríos', clienteCodigo: 'CLI-000005',
    titular: 'Ríos, Andrea', rubro: 'Odontología', localidad: 'Tafí Viejo',
    telefono: '0381-4554433', celular: '381-5554433', email: 'andrea.rios@gmail.com',
    equipoCodigo: 'EQ-102', detalle: 'Autoclave 12 litros',
    mesVenta: -4, diaVenta: 20, total: 3200, costo: 2100, anticipo: 1200,
    cuotas: 6, mesPrimerVto: -3, interes: 0, pagadas: 3, parcial: 0,
    nota: null,
  },
  {
    codigo: 'VT-003', cliente: 'Veterinaria Norte', clienteCodigo: 'CLI-000003',
    titular: 'Gómez, Lucía', rubro: 'Veterinaria', localidad: 'Yerba Buena',
    telefono: '0381-4557788', celular: '381-5557788', email: 'contacto@vetnorte.com.ar',
    equipoCodigo: 'EQ-103', detalle: 'Ecógrafo veterinario portátil',
    mesVenta: -10, diaVenta: 15, total: 8400, costo: 5600, anticipo: 2400,
    cuotas: 12, mesPrimerVto: -9, interes: 0, pagadas: 12, parcial: 0,
    nota: 'Terminó de pagar antes de tiempo.',
  },
  {
    codigo: 'VT-004', cliente: 'Centro de Diagnóstico Sur', clienteCodigo: 'CLI-000004',
    titular: 'Sosa, Hernán', rubro: 'Diagnóstico por Imagen', localidad: 'Alderetes',
    telefono: '0381-4552211', celular: '381-5552211', email: 'compras@diagnosticosur.com',
    equipoCodigo: 'EQ-105', detalle: 'Rayos X panorámico digital',
    mesVenta: -3, diaVenta: 5, total: 22500, costo: 15800, anticipo: 6500,
    cuotas: 18, mesPrimerVto: -2, interes: 5, pagadas: 0, parcial: 0,
    nota: 'La venta más grande del año. Financiada a 18 con 5% de interés.',
  },
  {
    codigo: 'VT-005', cliente: 'Clínica Veterinaria Juárez', clienteCodigo: 'CLI-000006',
    titular: 'Juárez, Pablo', rubro: 'Veterinaria', localidad: 'Banda del Río Salí',
    telefono: '0381-4556677', celular: '381-5556677', email: 'pjuarez@vetjuarez.com',
    equipoCodigo: 'EQ-104', detalle: 'Mesa quirúrgica hidráulica',
    mesVenta: 0, diaVenta: 2, total: 5600, costo: 3700, anticipo: 1600,
    cuotas: 8, mesPrimerVto: 1, interes: 0, pagadas: 0, parcial: 0,
    nota: 'Recién cerrada, todavía no vence nada.',
  },
  {
    codigo: 'VT-006', cliente: 'Consultorio Ledesma', clienteCodigo: 'CLI-000007',
    titular: 'Ledesma, Silvina', rubro: 'Odontología', localidad: 'Concepción',
    telefono: '03865-428822', celular: '3865-558822', email: 'sledesma@hotmail.com',
    equipoCodigo: 'EQ-106', detalle: 'Compresor odontológico silencioso',
    mesVenta: -1, diaVenta: 15, total: 1800, costo: 1150, anticipo: 1800,
    cuotas: 0, mesPrimerVto: null, interes: 0, pagadas: 0, parcial: 0,
    nota: 'Pagó todo de contado.',
  },
  {
    codigo: 'VT-007', cliente: 'Odontología Torres', clienteCodigo: 'CTA-000483',
    titular: 'Torres, Marcela', rubro: 'Odontología', localidad: 'San Miguel de Tucumán',
    telefono: '0381-4943494', celular: '381-5551234', email: 'marcela@odontologiatorres.com',
    equipoCodigo: 'CS-202', detalle: 'Lámpara de fotocurado LED',
    mesVenta: -2, diaVenta: 2, total: 1250, costo: 780, anticipo: 250,
    cuotas: 4, mesPrimerVto: -1, interes: 0, pagadas: 0, parcial: 0,
    nota: null,
  },
];

const MEDIOS_ROTA = ['transferencia', 'transferencia', 'efectivo', 'transferencia'];

// ---------------------------------------------------------------------------
// Se arma todo de una pasada
// ---------------------------------------------------------------------------
const ventas = [];
const cuotas = [];
const cobros = [];
let nCuota = 0;
let nCobro = 0;

SEMILLA.forEach((s) => {
  const fechaVenta = desdeHoy(s.mesVenta, s.diaVenta);
  const financiado = r2((s.total - s.anticipo) * (1 + s.interes / 100));

  // --- plan de cuotas, igual que gm_generar_cuotas ---
  const propias = [];
  if (s.cuotas > 0 && financiado > 0) {
    const base = r2(financiado / s.cuotas);
    let acumulado = 0;
    for (let i = 1; i <= s.cuotas; i += 1) {
      const monto = i === s.cuotas ? r2(financiado - acumulado) : base;
      if (i < s.cuotas) acumulado = r2(acumulado + base);
      nCuota += 1;
      propias.push({
        codigo: `CU-${String(nCuota).padStart(3, '0')}`,
        ventaCodigo: s.codigo,
        numero: i,
        vencimiento: iso(desdeHoy(s.mesPrimerVto + (i - 1), s.diaVenta)),
        montoUsd: monto,
        cobradoUsd: 0,
        anulada: false,
        nota: null,
      });
    }
  }

  // --- el anticipo, cobrado el día de la venta ---
  nCobro += 1;
  cobros.push({
    codigo: `CO-${String(nCobro).padStart(3, '0')}`,
    ventaCodigo: s.codigo,
    cuotaCodigo: null,
    fecha: iso(fechaVenta),
    montoUsd: s.anticipo,
    medio: s.anticipo > 2000 ? 'transferencia' : 'efectivo',
    comprobante: `TR-${8800 + nCobro}`,
    concepto: 'anticipo',
    nota: null,
  });

  // --- las cuotas que se pagaron ---
  propias.slice(0, s.pagadas).forEach((q, i) => {
    const f = nuncaEnElFuturo(desdeHoy(s.mesPrimerVto + i, Math.min(s.diaVenta + 2, 28)));
    q.cobradoUsd = q.montoUsd;
    nCobro += 1;
    cobros.push({
      codigo: `CO-${String(nCobro).padStart(3, '0')}`,
      ventaCodigo: s.codigo,
      cuotaCodigo: q.codigo,
      fecha: iso(f),
      montoUsd: q.montoUsd,
      medio: MEDIOS_ROTA[i % MEDIOS_ROTA.length],
      comprobante: `TR-${8800 + nCobro}`,
      concepto: 'cuota',
      nota: null,
    });
  });

  // --- la que se pagó a medias ---
  if (s.parcial > 0 && propias[s.pagadas]) {
    const q = propias[s.pagadas];
    const f = nuncaEnElFuturo(desdeHoy(s.mesPrimerVto + s.pagadas, Math.min(s.diaVenta + 4, 28)));
    q.cobradoUsd = s.parcial;
    nCobro += 1;
    cobros.push({
      codigo: `CO-${String(nCobro).padStart(3, '0')}`,
      ventaCodigo: s.codigo,
      cuotaCodigo: q.codigo,
      fecha: iso(f),
      montoUsd: s.parcial,
      medio: 'efectivo',
      comprobante: `REC-${500 + nCobro}`,
      concepto: 'cuota',
      nota: 'Trajo la mitad, dijo que completa el mes que viene.',
    });
  }

  // --- estado derivado de cada cuota ---
  propias.forEach((q) => {
    const saldo = Math.max(r2(q.montoUsd - q.cobradoUsd), 0);
    const d = diasEntre(new Date(`${q.vencimiento}T00:00:00`), hoy0);
    q.saldoUsd = saldo;
    q.dias = d;
    q.estado = saldo <= 0.01 ? 'pagada'
      : d < 0 ? 'vencida'
        : q.cobradoUsd > 0 ? 'parcial' : 'pendiente';
    q.cliente = s.cliente;
    q.clienteCodigo = s.clienteCodigo;
    q.titular = s.titular;
    q.telefono = s.telefono;
    q.celular = s.celular;
    q.email = s.email;
    q.localidad = s.localidad;
    q.ventaDetalle = s.detalle;
    q.ventaTotalUsd = s.total;
    q.ultimoCobro = null;
    cuotas.push(q);
  });

  // --- resumen de la venta ---
  const cobrado = r2(cobros.filter((c) => c.ventaCodigo === s.codigo)
    .reduce((a, c) => a + c.montoUsd, 0));
  const vencidas = propias.filter((q) => q.estado === 'vencida');
  const pendientes = propias.filter((q) => q.estado !== 'pagada');
  const saldo = Math.max(r2(s.total - cobrado), 0);
  const masVieja = vencidas.length ? vencidas[0].vencimiento : null;

  const estadoCobro = saldo <= 0.01 ? 'cobrada'
    : vencidas.length ? 'atrasada'
      : (propias.length === 0 && s.cuotas > 0) ? 'sin plan' : 'al dia';

  ventas.push({
    codigo: s.codigo,
    clienteCodigo: s.clienteCodigo,
    cliente: s.cliente,
    titular: s.titular,
    rubro: s.rubro,
    localidad: s.localidad,
    telefono: s.telefono,
    celular: s.celular,
    email: s.email,
    leadCodigo: null,
    equipoCodigo: s.equipoCodigo,
    detalle: s.detalle,
    fecha: iso(fechaVenta),
    moneda: 'USD',
    tipoCambio: null,
    totalUsd: s.total,
    costoUsd: s.costo,
    margenUsd: s.total - s.costo,
    margenPct: s.total > 0 ? Math.round(((s.total - s.costo) / s.total) * 1000) / 10 : 0,
    anticipoUsd: s.anticipo,
    anticipoCobradoUsd: s.anticipo,
    financiadoUsd: s.total - s.anticipo,
    cuotasPactadas: s.cuotas,
    cuotasTotal: propias.length,
    cuotasPagadas: propias.filter((q) => q.estado === 'pagada').length,
    cuotasVencidas: vencidas.length,
    vencidoUsd: r2(vencidas.reduce((a, q) => a + q.saldoUsd, 0)),
    cobradoUsd: cobrado,
    saldoUsd: saldo,
    avancePct: s.total > 0 ? Math.min(Math.round((cobrado / s.total) * 100), 100) : 0,
    ultimoCobro: cobros.filter((c) => c.ventaCodigo === s.codigo).slice(-1)[0]?.fecha || null,
    proximoVencimiento: pendientes[0]?.vencimiento || null,
    ultimoVencimiento: propias.slice(-1)[0]?.vencimiento || null,
    diasAtraso: masVieja ? -diasEntre(new Date(`${masVieja}T00:00:00`), hoy0) : null,
    primerVencimiento: propias[0]?.vencimiento || null,
    interesPct: s.interes,
    estado: saldo <= 0.01 ? 'cobrada' : 'abierta',
    estadoCobro,
    vendedor: 'Gonzalo',
    nota: s.nota,
  });
});

// ---------------------------------------------------------------------------
// Egresos: el otro lado del negocio
// ---------------------------------------------------------------------------
const GASTOS_FIJOS = [
  { codigo: 'G-03', concepto: 'Publicidad y redes',      categoria: 'operativo', monto: 180 },
  { codigo: 'G-04', concepto: 'Telefonía y datos',       categoria: 'operativo', monto: 45 },
  { codigo: 'G-05', concepto: 'Depósito y seguro',       categoria: 'operativo', monto: 320 },
  { codigo: 'G-06', concepto: 'Contador',                categoria: 'operativo', monto: 140 },
  { codigo: 'G-07', concepto: 'Herramientas y software', categoria: 'operativo', monto: 65 },
  { codigo: 'G-01', concepto: 'Combustible y peajes (mes)', categoria: 'logistica', monto: 365.5 },
  { codigo: 'G-02', concepto: 'Fletes de entrega (mes)',    categoria: 'logistica', monto: 408.5 },
  { codigo: 'G-08', concepto: 'Viáticos de visitas (mes)',  categoria: 'operativo', monto: 172 },
];

const egresos = [];
let nEgreso = 0;
const nuevoEgreso = (fecha, concepto, categoria, monto, extra = {}) => {
  nEgreso += 1;
  egresos.push({
    codigo: `EG-${String(nEgreso).padStart(3, '0')}`,
    fecha: iso(fecha),
    concepto,
    categoria,
    montoUsd: r2(monto),
    montoArs: null,
    tipoCambio: null,
    medio: extra.medio || 'transferencia',
    comprobante: extra.comprobante || null,
    proveedor: extra.proveedor || null,
    gastoCodigo: extra.gastoCodigo || null,
    ventaCodigo: extra.ventaCodigo || null,
    nota: extra.nota || null,
  });
};

// Un gasto del mes en curso sólo se carga si su día ya pasó: el depósito que
// se paga el 10 no está pagado el 3. Mostrarlo como movimiento haría que la
// caja del mes arranque con plata que todavía no salió.
const yaPaso = (f) => f <= hoy0;

for (let m = -10; m <= 0; m += 1) {
  const sueldo = desdeHoy(m, 5);
  if (yaPaso(sueldo)) nuevoEgreso(sueldo, 'Sueldo del mes', 'sueldo', 900, { proveedor: 'Gonzalo' });

  const fijos = desdeHoy(m, 10);
  if (yaPaso(fijos)) {
    GASTOS_FIJOS.forEach((g) =>
      nuevoEgreso(fijos, g.concepto, g.categoria, g.monto, { gastoCodigo: g.codigo }));
  }

  const impuestos = desdeHoy(m, 18);
  if (yaPaso(impuestos)) {
    nuevoEgreso(impuestos, 'IIBB y monotributo', 'impuestos', 210 + ((m + 10) % 5) * 18, {
      proveedor: 'AFIP / DGR',
    });
  }
}

// Las compras de mercadería, atadas a la venta que las justifica.
SEMILLA.forEach((s, i) => {
  nuevoEgreso(desdeHoy(s.mesVenta, Math.max(s.diaVenta - 6, 2)),
    `Compra · ${s.detalle}`, 'mercaderia', s.costo, {
      proveedor: ['DentalTech SA', 'SteriLab', 'VetScan Import', 'ImagenPro', 'VetLine', 'AirDent', 'DentalTech SA'][i],
      ventaCodigo: s.codigo,
      comprobante: `FC-A-${1180 + i * 37}`,
    });
});

nuevoEgreso(desdeHoy(-6, 5),  'Flete importación contenedor', 'logistica', 640, { proveedor: 'Transportes Sur', comprobante: 'FC-B-0221' });
nuevoEgreso(desdeHoy(-3, 18), 'Flete e instalación rayos X',  'logistica', 380, { proveedor: 'Grúas Alderetes', medio: 'efectivo', ventaCodigo: 'VT-004' });
nuevoEgreso(desdeHoy(-5, 20), 'Retiro personal', 'retiro', 1200, { proveedor: 'Gonzalo' });
nuevoEgreso(desdeHoy(-2, 20), 'Retiro personal', 'retiro',  900, { proveedor: 'Gonzalo' });

// ---------------------------------------------------------------------------
// Caja: los dos flujos en un solo hilo
// ---------------------------------------------------------------------------
const NOMBRE_CONCEPTO = {
  anticipo: 'Anticipo', adelanto: 'Adelanto de cuotas', ajuste: 'Ajuste', cuota: 'Cobro de cuota',
};

const caja = [
  ...cobros.map((c) => ({
    codigo: c.codigo,
    flujo: 'ingreso',
    fecha: c.fecha,
    concepto: NOMBRE_CONCEPTO[c.concepto] || 'Cobro de cuota',
    categoria: 'cobro',
    montoUsd: c.montoUsd,
    montoArs: null,
    tipoCambio: null,
    medio: c.medio,
    comprobante: c.comprobante,
    contraparte: ventas.find((v) => v.codigo === c.ventaCodigo)?.cliente || 'Sin cliente',
    referencia: c.ventaCodigo,
    referencia2: c.cuotaCodigo,
    nota: c.nota,
  })),
  ...egresos.map((e) => ({
    codigo: e.codigo,
    flujo: 'egreso',
    fecha: e.fecha,
    concepto: e.concepto,
    categoria: e.categoria,
    montoUsd: e.montoUsd,
    montoArs: e.montoArs,
    tipoCambio: e.tipoCambio,
    medio: e.medio,
    comprobante: e.comprobante,
    contraparte: e.proveedor || '—',
    referencia: e.ventaCodigo,
    referencia2: e.gastoCodigo,
    nota: e.nota,
  })),
].sort((a, b) => (a.fecha < b.fecha ? 1 : a.fecha > b.fecha ? -1 : 0));

// ---------------------------------------------------------------------------
// Resultado mensual
// ---------------------------------------------------------------------------
const MESES_CORTOS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
const clave = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
const mesDe = (isoFecha) => String(isoFecha).slice(0, 7);
const mesHoy = clave(hoy0);

const resultado = [];
for (let m = -11; m <= 2; m += 1) {
  const inicio = new Date(hoy0.getFullYear(), hoy0.getMonth() + m, 1);
  const k = clave(inicio);
  const sumaEg = (cat) => r2(egresos
    .filter((e) => mesDe(e.fecha) === k && (!cat || e.categoria === cat))
    .reduce((a, e) => a + e.montoUsd, 0));

  const cobrado = r2(cobros.filter((c) => mesDe(c.fecha) === k).reduce((a, c) => a + c.montoUsd, 0));
  const egresosMes = sumaEg(null);
  const delMes = ventas.filter((v) => mesDe(v.fecha) === k);
  const porCobrar = cuotas.filter((q) => mesDe(q.vencimiento) === k && q.estado !== 'pagada');

  resultado.push({
    mes: k,
    inicio: iso(inicio),
    mesCorto: MESES_CORTOS[inicio.getMonth()],
    etiqueta: `${MESES_CORTOS[inicio.getMonth()]} ${inicio.getFullYear()}`,
    cobradoUsd: cobrado,
    egresosUsd: egresosMes,
    cajaUsd: r2(cobrado - egresosMes),
    mercaderiaUsd: sumaEg('mercaderia'),
    logisticaUsd: sumaEg('logistica'),
    sueldoUsd: sumaEg('sueldo'),
    impuestosUsd: sumaEg('impuestos'),
    operativoUsd: sumaEg('operativo'),
    retiroUsd: sumaEg('retiro'),
    otroUsd: sumaEg('otro'),
    ventasCantidad: delMes.length,
    vendidoUsd: r2(delMes.reduce((a, v) => a + v.totalUsd, 0)),
    costoVendidoUsd: r2(delMes.reduce((a, v) => a + v.costoUsd, 0)),
    margenUsd: r2(delMes.reduce((a, v) => a + v.margenUsd, 0)),
    porCobrarUsd: r2(porCobrar.reduce((a, q) => a + q.saldoUsd, 0)),
    cuotasPorCobrar: porCobrar.length,
    esMesActual: k === mesHoy,
    esFuturo: m > 0,
  });
}

// ---------------------------------------------------------------------------
// Catálogos
// ---------------------------------------------------------------------------
export const CLIENTES_DEMO = SEMILLA.map((s) => ({
  codigo: s.clienteCodigo,
  nombre: s.cliente,
  titular: s.titular,
  rubro: s.rubro,
  localidad: s.localidad,
}));

export const EQUIPOS_DEMO = [
  { codigo: 'EQ-101', nombre: 'Sillón odontológico completo', marca: 'DentalTech', categoria: 'Odontología', costoUsd: 10400, precioUsd: 15900 },
  { codigo: 'EQ-102', nombre: 'Autoclave 12 litros', marca: 'SteriLab', categoria: 'Odontología', costoUsd: 2100, precioUsd: 3200 },
  { codigo: 'EQ-103', nombre: 'Ecógrafo veterinario portátil', marca: 'VetScan', categoria: 'Veterinaria', costoUsd: 5600, precioUsd: 8400 },
  { codigo: 'EQ-104', nombre: 'Mesa quirúrgica hidráulica', marca: 'VetLine', categoria: 'Veterinaria', costoUsd: 3700, precioUsd: 5600 },
  { codigo: 'EQ-105', nombre: 'Rayos X panorámico digital', marca: 'ImagenPro', categoria: 'Diagnóstico por Imagen', costoUsd: 15800, precioUsd: 22500 },
  { codigo: 'EQ-106', nombre: 'Compresor odontológico silencioso', marca: 'AirDent', categoria: 'Odontología', costoUsd: 1150, precioUsd: 1800 },
  { codigo: 'CS-202', nombre: 'Lámpara de fotocurado LED', marca: 'DentalTech', categoria: 'Odontología', costoUsd: 780, precioUsd: 1250 },
];

export const GASTOS_DEMO = [
  { codigo: 'G-01', concepto: 'Combustible y peajes', categoria: 'Logística', periodicidad: 'semanal', montoUsd: 85 },
  { codigo: 'G-02', concepto: 'Fletes de entrega', categoria: 'Logística', periodicidad: 'semanal', montoUsd: 95 },
  { codigo: 'G-03', concepto: 'Publicidad y redes', categoria: 'Comercial', periodicidad: 'mensual', montoUsd: 180 },
  { codigo: 'G-04', concepto: 'Telefonía y datos', categoria: 'Operativo', periodicidad: 'mensual', montoUsd: 45 },
  { codigo: 'G-05', concepto: 'Depósito y seguro', categoria: 'Operativo', periodicidad: 'mensual', montoUsd: 320 },
  { codigo: 'G-06', concepto: 'Contador', categoria: 'Administrativo', periodicidad: 'mensual', montoUsd: 140 },
  { codigo: 'G-07', concepto: 'Herramientas y software', categoria: 'Operativo', periodicidad: 'mensual', montoUsd: 65 },
  { codigo: 'G-08', concepto: 'Viáticos de visitas', categoria: 'Comercial', periodicidad: 'semanal', montoUsd: 40 },
];

export const VENTAS_DEMO = ventas.sort((a, b) => (a.fecha < b.fecha ? 1 : -1));
export const CUOTAS_DEMO = cuotas.sort((a, b) => (a.vencimiento < b.vencimiento ? -1 : 1));
export const CAJA_DEMO = caja;
export const RESULTADO_DEMO = resultado;

export default { VENTAS_DEMO, CUOTAS_DEMO, CAJA_DEMO, RESULTADO_DEMO };
