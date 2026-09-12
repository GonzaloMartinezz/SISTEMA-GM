// ============================================================================
// SISTEMA GM · M-05 · DATOS DE DEMOSTRACIÓN
// ----------------------------------------------------------------------------
// Sólo se usan cuando el sistema corre sin Supabase configurado. Con la base
// conectada, este archivo no se toca.
// ============================================================================

const hace = (dias, horas = 9) => {
  const d = new Date();
  d.setDate(d.getDate() - dias);
  d.setHours(horas, 0, 0, 0);
  return d.toISOString();
};

export const NOTAS_DEMO = [
  {
    id: 'NT-001',
    titulo: 'Cobra los días 10',
    texto: 'Trabaja con obra social provincial: los cobros le entran los días 10. No sirve pasarle factura antes del 5.',
    tipo: 'estrategica',
    entidad: 'cliente',
    entidadCodigo: 'CLI-001',
    etiquetas: ['cobranza', 'obra social'],
    fijada: true,
    operador: 'G. Martínez',
    creada: hace(12),
    actualizada: hace(12),
  },
  {
    id: 'NT-002',
    titulo: 'El autoclave viene sin manguera',
    texto: 'Los últimos tres autoclaves de SteriLab vinieron sin la manguera de desagote. Pedirla aparte al hacer el pedido.',
    tipo: 'problema',
    entidad: 'equipo',
    entidadCodigo: 'EQ-102',
    etiquetas: ['proveedor', 'sterilab'],
    fijada: true,
    operador: 'G. Martínez',
    creada: hace(8),
    actualizada: hace(8),
  },
  {
    id: 'NT-003',
    titulo: 'Descuento pactado',
    texto: 'Le prometí 8% si cierra antes de fin de mes. Queda por escrito acá.',
    tipo: 'acuerdo',
    entidad: 'lead',
    entidadCodigo: 'LD-001',
    etiquetas: ['precio'],
    fijada: false,
    operador: 'G. Martínez',
    creada: hace(5),
    actualizada: hace(5),
  },
  {
    id: 'NT-004',
    titulo: 'Probar venta de insumos por suscripción',
    texto: 'Los descartables se repiten todos los meses. Probar con dos o tres clientes un envío fijo mensual.',
    tipo: 'idea',
    entidad: null,
    entidadCodigo: null,
    etiquetas: ['insumos', 'ideas'],
    fijada: false,
    operador: 'G. Martínez',
    creada: hace(3),
    actualizada: hace(3),
  },
  {
    id: 'NT-005',
    titulo: 'Revisar el flete de Concepción',
    texto: 'El transportista subió el flete a Concepción. Ver si conviene juntar entregas de esa zona en un solo viaje.',
    tipo: 'operativa',
    entidad: 'gasto',
    entidadCodigo: 'G-03',
    etiquetas: ['logistica', 'costos'],
    fijada: false,
    operador: 'G. Martínez',
    creada: hace(1),
    actualizada: hace(1),
  },
];

export const ENTIDADES_DEMO = [
  { entidad: 'cliente', codigo: 'CLI-001', nombre: 'Odontología Torres', detalle: 'Marcela Torres · Odontología · San Miguel', busqueda: 'cli-001 odontología torres marcela' },
  { entidad: 'cliente', codigo: 'CLI-002', nombre: 'Veterinaria Norte', detalle: 'Lucía Gómez · Veterinaria · Yerba Buena', busqueda: 'cli-002 veterinaria norte lucía gómez' },
  { entidad: 'lead', codigo: 'LD-001', nombre: 'Torres, Marcela', detalle: 'Odontología Torres · Sillón odontológico · posible-venta', busqueda: 'ld-001 torres marcela sillón' },
  { entidad: 'equipo', codigo: 'EQ-102', nombre: 'Autoclave 12 litros', detalle: 'SteriLab · AC-12 · Odontología', busqueda: 'eq-102 autoclave sterilab' },
  { entidad: 'equipo', codigo: 'EQ-103', nombre: 'Ecógrafo veterinario portátil', detalle: 'VetScan · VS-200 · Veterinaria', busqueda: 'eq-103 ecógrafo vetscan' },
  { entidad: 'gasto', codigo: 'G-03', nombre: 'Flete y logística', detalle: 'Operativo · mensual', busqueda: 'g-03 flete logística' },
  { entidad: 'cuenta', codigo: '6276 4904 5482 0003', nombre: 'Odontología Torres', detalle: 'Consumo · CORRIENTE · Negociación', busqueda: '6276 odontología torres corriente' },
];

export const BITACORA_DEMO = [
  { fecha: hace(0, 10), modulo: 'seguimientos', clase: 'mensaje', titulo: 'Mensaje por WhatsApp', detalle: 'Hola Marcela, tengo la última unidad reservada. ¿Confirmamos?', entidad: 'lead', entidad_codigo: 'LD-001', codigo: 'MS-001', operador: 'G. Martínez' },
  { fecha: hace(1, 15), modulo: 'agenda', clase: 'compromiso', titulo: 'Cumplido: Entrega de insumos', detalle: 'Ríos, Andrea · Entregado y firmado', entidad: 'evento', entidad_codigo: 'EV-016', codigo: 'EV-016', operador: 'G. Martínez' },
  { fecha: hace(2, 11), modulo: 'equipamientos', clase: 'stock', titulo: 'Salida de 1 unidad', detalle: 'Autoclave 12 litros · Venta a Consultorio Paz', entidad: 'equipo', entidad_codigo: 'EQ-102', codigo: 'MST-001', operador: 'G. Martínez' },
  { fecha: hace(3, 9), modulo: 'seguimientos', clase: 'etapa', titulo: 'La venta pasó a posible-venta', detalle: 'Odontología Torres · Sillón odontológico completo', entidad: 'lead', entidad_codigo: 'LD-001', codigo: 'HE-004', operador: 'G. Martínez' },
  { fecha: hace(4, 16), modulo: 'cobranzas', clase: 'llamado', titulo: 'Llamado a Recepción', detalle: 'Pidió rellamar · 15/08 Rellamar', entidad: 'cuenta', entidad_codigo: '6276 4904 5482 0117', codigo: 'LLA-001', operador: 'G. Martínez' },
  { fecha: hace(6, 12), modulo: 'notario', clase: 'visita', titulo: 'Visita a Consultorio Paz', detalle: 'Gestión de mora · Quedó en pagar el viernes', entidad: 'cuenta', entidad_codigo: '6276 4904 5482 0117', codigo: 'VIS-001', operador: 'G. Martínez' },
  { fecha: hace(9, 14), modulo: 'notario', clase: 'pago', titulo: 'Pago recibido', detalle: 'REC-4412 · Sucursal centro · ARS 185000', entidad: 'cuenta', entidad_codigo: '6276 4904 5482 0003', codigo: 'PAG-001', operador: 'G. Martínez' },
  { fecha: hace(15, 9), modulo: 'tesoreria', clase: 'liquidacion', titulo: 'Mes liquidado: Ago', detalle: 'Ventas USD 29650 · costo USD 18400', entidad: null, entidad_codigo: null, codigo: '2026-08', operador: 'G. Martínez' },
];

export default NOTAS_DEMO;
