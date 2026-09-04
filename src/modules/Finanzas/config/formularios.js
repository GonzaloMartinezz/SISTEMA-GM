// ============================================================================
// SISTEMA GM · M-03 TESORERÍA · ESQUEMAS DE FORMULARIO
// ----------------------------------------------------------------------------
// Alimentan al FormularioGm compartido. Son los mismos campos que aceptaba la
// consola anterior: sólo cambió la forma de pedirlos.
// ============================================================================

export const CATEGORIAS_GASTO = [
  'Operativo',
  'Logística',
  'Comercial',
  'Impuestos',
  'Personal',
  'Financiero',
];

export const PERIODICIDADES = ['semanal', 'mensual'];

/** Un mes de la liquidación. La clave es "mes" (2026-08). */
export const CAMPOS_MES = [
  {
    clave: 'mes',
    etiqueta: 'Mes',
    tipo: 'texto',
    requerido: true,
    placeholder: '2026-09',
    ayuda: 'Formato año-mes. Es la clave: si ya existe, se actualiza.',
  },
  {
    clave: 'etiqueta',
    etiqueta: 'Etiqueta',
    tipo: 'texto',
    requerido: true,
    placeholder: 'sep 26',
    ayuda: 'Cómo se lee en los gráficos.',
  },
  { clave: 'ventasUsd', etiqueta: 'Ventas USD', tipo: 'moneda', requerido: true },
  {
    clave: 'costoMercaderiaUsd',
    etiqueta: 'Costo de mercadería USD',
    tipo: 'moneda',
    requerido: true,
    ayuda: 'Lo que costó lo que se vendió.',
  },
  { clave: 'gastosLogisticaUsd', etiqueta: 'Gastos de logística USD', tipo: 'moneda' },
  { clave: 'gastosOperativosUsd', etiqueta: 'Gastos operativos USD', tipo: 'moneda' },
];

/** Un gasto fijo. */
export const CAMPOS_GASTO = [
  { clave: 'concepto', etiqueta: 'Concepto', tipo: 'texto', ancho: 2, requerido: true },
  {
    clave: 'categoria',
    etiqueta: 'Categoría',
    tipo: 'select',
    opciones: CATEGORIAS_GASTO,
    requerido: true,
    defecto: 'Operativo',
  },
  {
    clave: 'periodicidad',
    etiqueta: 'Periodicidad',
    tipo: 'select',
    opciones: PERIODICIDADES,
    requerido: true,
    defecto: 'mensual',
    ayuda: 'Los semanales se mensualizan multiplicando por 4,33.',
  },
  { clave: 'montoUsd', etiqueta: 'Monto USD', tipo: 'moneda', requerido: true },
];

/** Parámetros del negocio: cambian el resultado de todo el módulo. */
export const CAMPOS_PARAMETROS = [
  {
    clave: 'sueldoFijoUsd',
    etiqueta: 'Sueldo fijo USD',
    tipo: 'moneda',
    requerido: true,
    ayuda: 'Lo que cobrás sí o sí, más allá de las ventas.',
  },
  {
    clave: 'comisionPct',
    etiqueta: 'Comisión %',
    tipo: 'numero',
    requerido: true,
    ayuda: 'Sobre las ventas del mes.',
  },
  {
    clave: 'tipoCambio',
    etiqueta: 'Tipo de cambio',
    tipo: 'numero',
    requerido: true,
    ayuda: 'Pesos por dólar. Sólo afecta cómo se muestra, no lo que se guarda.',
  },
  { clave: 'ivaPct', etiqueta: 'IVA %', tipo: 'numero' },
  { clave: 'ingresosBrutosPct', etiqueta: 'Ingresos brutos %', tipo: 'numero' },
  { clave: 'retencionesPct', etiqueta: 'Retenciones %', tipo: 'numero' },
  { clave: 'inversionInicialUsd', etiqueta: 'Inversión inicial USD', tipo: 'moneda', ayuda: 'Base del ROI.' },
  { clave: 'ahorroUsd', etiqueta: 'Ahorro USD', tipo: 'moneda' },
  { clave: 'liquidezUsd', etiqueta: 'Liquidez USD', tipo: 'moneda' },
  { clave: 'reservaImpuestosUsd', etiqueta: 'Reserva para impuestos USD', tipo: 'moneda' },
];
