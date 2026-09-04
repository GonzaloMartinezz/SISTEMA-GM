// ============================================================================
// SISTEMA GM · EQUIPAMIENTOS · ESQUEMA DEL FORMULARIO
// ============================================================================

import { CATEGORIAS, TIPOS } from './inventario.config';

export const CAMPOS_EQUIPO = [
  { name: 'id', label: 'Código', tipo: 'texto', requerido: true, placeholder: 'EQ-107', ayuda: 'No se repite. Es la clave del equipo.' },
  { name: 'nombre', label: 'Nombre del equipo', tipo: 'texto', requerido: true, ancho: 2 },
  { name: 'marca', label: 'Marca', tipo: 'texto' },
  { name: 'modelo', label: 'Modelo', tipo: 'texto' },
  { name: 'categoria', label: 'Rubro', tipo: 'select', opciones: CATEGORIAS, requerido: true, defecto: 'Odontología' },
  { name: 'tipo', label: 'Tipo', tipo: 'select', opciones: TIPOS, requerido: true, defecto: 'Equipo Pesado' },
  { name: 'costoUsd', label: 'Costo USD', tipo: 'moneda', requerido: true, defecto: 0 },
  { name: 'precioUsd', label: 'Precio de venta USD', tipo: 'moneda', requerido: true, defecto: 0 },
  { name: 'stock', label: 'Stock', tipo: 'numero', defecto: 0, min: 0 },
  { name: 'transito', label: 'En tránsito', tipo: 'numero', defecto: 0, min: 0 },
  { name: 'minStock', label: 'Stock mínimo', tipo: 'numero', defecto: 1, min: 0, ayuda: 'Debajo de este número salta la alerta.' },
  { name: 'vendidos12m', label: 'Vendidos últimos 12 m', tipo: 'numero', defecto: 0, min: 0 },
  { name: 'garantiaMeses', label: 'Garantía (meses)', tipo: 'numero', defecto: 0, min: 0 },
  { name: 'dimensiones', label: 'Dimensiones', tipo: 'texto', placeholder: '190 × 80 × 120 cm' },
  { name: 'consumo', label: 'Alimentación', tipo: 'texto', ancho: 2, placeholder: '220V · 1200W' },
];

/** Equipo del sistema -> valores planos del formulario. */
export const aFormulario = (e) => ({
  id: e.id, nombre: e.nombre, marca: e.marca || '', modelo: e.modelo || '',
  categoria: e.categoria, tipo: e.tipo, costoUsd: e.costoUsd, precioUsd: e.precioUsd,
  stock: e.stock, transito: e.transito, minStock: e.minStock, vendidos12m: e.vendidos12m,
  garantiaMeses: e.ficha?.garantiaMeses || 0,
  dimensiones: e.ficha?.dimensiones || '', consumo: e.ficha?.consumo || '',
});

/** Valores del formulario -> forma que espera el servicio. */
export const aEquipo = (f) => ({
  id: f.id, nombre: f.nombre, marca: f.marca, modelo: f.modelo,
  categoria: f.categoria, tipo: f.tipo,
  costoUsd: Number(f.costoUsd) || 0, precioUsd: Number(f.precioUsd) || 0,
  stock: Number(f.stock) || 0, transito: Number(f.transito) || 0,
  minStock: Number(f.minStock) || 1, vendidos12m: Number(f.vendidos12m) || 0,
  ficha: {
    garantiaMeses: Number(f.garantiaMeses) || 0,
    dimensiones: f.dimensiones, consumo: f.consumo, specs: [],
  },
});
