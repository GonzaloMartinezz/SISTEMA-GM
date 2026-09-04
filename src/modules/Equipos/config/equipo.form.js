// ============================================================================
// SISTEMA GM · M-02 EQUIPAMIENTOS · ESQUEMA DEL FORMULARIO
// ----------------------------------------------------------------------------
// Alimenta al FormularioGm compartido. El código se deja vacío en el alta: la
// base le asigna el siguiente (EQ-000001, EQ-000002…), igual que en la planilla.
// ============================================================================

import { RUBROS, TIPOS } from './secciones.config';

export const CAMPOS_EQUIPO = [
  { clave: 'nombre', etiqueta: 'Nombre del equipo', tipo: 'texto', ancho: 2, requerido: true },
  { clave: 'marca', etiqueta: 'Marca', tipo: 'texto' },
  { clave: 'modelo', etiqueta: 'Modelo', tipo: 'texto' },
  { clave: 'rubro', etiqueta: 'Rubro', tipo: 'select', opciones: RUBROS, requerido: true },
  { clave: 'tipo', etiqueta: 'Tipo', tipo: 'select', opciones: TIPOS, requerido: true },

  {
    clave: 'costoUsd',
    etiqueta: 'Costo USD',
    tipo: 'moneda',
    requerido: true,
    ayuda: 'Lo que te sale a vos, sin impuestos.',
  },
  {
    clave: 'precioUsd',
    etiqueta: 'Precio de venta USD',
    tipo: 'moneda',
    requerido: true,
    ayuda: 'El margen lo calcula el sistema.',
  },

  { clave: 'stock', etiqueta: 'Stock actual', tipo: 'numero', requerido: true },
  { clave: 'transito', etiqueta: 'En tránsito', tipo: 'numero', ayuda: 'Comprado y todavía sin llegar.' },
  {
    clave: 'minStock',
    etiqueta: 'Stock mínimo',
    tipo: 'numero',
    requerido: true,
    ayuda: 'Por debajo de este número el equipo aparece como crítico.',
  },
  { clave: 'vendidos12m', etiqueta: 'Vendidos últimos 12 meses', tipo: 'numero' },

  { clave: 'garantiaMeses', etiqueta: 'Garantía (meses)', tipo: 'numero' },
  { clave: 'dimensiones', etiqueta: 'Dimensiones', tipo: 'texto', placeholder: '190 × 80 × 120 cm' },
  { clave: 'consumo', etiqueta: 'Consumo / alimentación', tipo: 'texto', placeholder: '220V · 1200W' },
  { clave: 'catalogoUrl', etiqueta: 'Link al catálogo', tipo: 'texto', ancho: 2 },
];

/** Fila del catálogo -> objeto del formulario. */
export const aFormulario = (e = {}) => ({
  nombre: e.nombre || '',
  marca: e.marca || '',
  modelo: e.modelo || '',
  rubro: e.rubro || RUBROS[0],
  tipo: e.tipo || TIPOS[0],
  costoUsd: e.costoUsd ?? '',
  precioUsd: e.precioUsd ?? '',
  stock: e.stock ?? 0,
  transito: e.transito ?? 0,
  minStock: e.minStock ?? 1,
  vendidos12m: e.vendidos12m ?? 0,
  garantiaMeses: e.garantiaMeses ?? '',
  dimensiones: e.dimensiones || '',
  consumo: e.consumo || '',
  catalogoUrl: e.catalogoUrl || '',
});

/** Una característica de la ficha técnica. */
export const CAMPOS_SPEC = [
  {
    clave: 'label',
    etiqueta: 'Característica',
    tipo: 'texto',
    requerido: true,
    placeholder: 'Capacidad, Certificación, Incluye…',
  },
  { clave: 'valor', etiqueta: 'Valor', tipo: 'texto', requerido: true, ancho: 2 },
  { clave: 'orden', etiqueta: 'Orden', tipo: 'numero', ayuda: 'En qué posición se muestra.' },
];

export default CAMPOS_EQUIPO;
