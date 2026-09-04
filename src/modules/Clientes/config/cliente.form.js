// ============================================================================
// SISTEMA GM · M-01 CLIENTES · ESQUEMA DEL FORMULARIO DE CLIENTE
// ----------------------------------------------------------------------------
// Alimenta al RegistroModal compartido. Los campos son exactamente los que pidió
// el negocio: nombre de negocio, profesional, teléfono y ubicación, más los
// datos de clasificación que usa el resto del sistema.
// ============================================================================

export const RUBROS = ['Odontología', 'Veterinaria', 'Diagnóstico por Imagen'];
export const CLASIFICACIONES = ['Premium', 'Estándar', 'Inicial'];
export const ESTADOS = ['lead', 'activo', 'inactivo'];

export const CAMPOS_CLIENTE = [
  { clave: 'negocio', etiqueta: 'Nombre del negocio', tipo: 'texto', ancho: 2, requerido: true },
  { clave: 'profesionalNombre', etiqueta: 'Nombre del profesional', tipo: 'texto', requerido: true },
  { clave: 'profesionalApellido', etiqueta: 'Apellido del profesional', tipo: 'texto', requerido: true },
  { clave: 'rubro', etiqueta: 'Rubro', tipo: 'select', opciones: RUBROS, requerido: true },
  { clave: 'clasificacion', etiqueta: 'Clasificación', tipo: 'select', opciones: CLASIFICACIONES },
  { clave: 'telefono', etiqueta: 'Teléfono', tipo: 'texto' },
  { clave: 'celular', etiqueta: 'Celular / WhatsApp', tipo: 'texto' },
  { clave: 'email', etiqueta: 'Correo electrónico', tipo: 'texto', ancho: 2 },
  { clave: 'ubicacion', etiqueta: 'Ubicación del negocio', tipo: 'texto', ancho: 2, requerido: true },
  { clave: 'localidad', etiqueta: 'Localidad', tipo: 'texto' },
  { clave: 'provincia', etiqueta: 'Provincia', tipo: 'texto' },
  { clave: 'estado', etiqueta: 'Estado', tipo: 'select', opciones: ESTADOS },
  { clave: 'notas', etiqueta: 'Notas', tipo: 'area', ancho: 2 },
];

/** Fila de Supabase -> objeto del formulario. */
export const aFormulario = (c = {}) => ({
  negocio: c.negocio || '',
  profesionalNombre: c.profesional_nombre || '',
  profesionalApellido: c.profesional_apellido || '',
  rubro: c.rubro || RUBROS[0],
  clasificacion: c.clasificacion || 'Estándar',
  telefono: c.telefono || '',
  celular: c.celular || '',
  email: c.email || '',
  ubicacion: c.ubicacion || '',
  localidad: c.localidad || '',
  provincia: c.provincia || 'Tucumán',
  estado: c.estado || 'lead',
  notas: c.notas || '',
  codigo: c.codigo || '',
});

export default CAMPOS_CLIENTE;
