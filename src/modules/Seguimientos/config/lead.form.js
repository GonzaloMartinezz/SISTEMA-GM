// ============================================================================
// SISTEMA GM · M-03 SEGUIMIENTOS · FORMULARIO DEL LEAD
// ----------------------------------------------------------------------------
// Esquema para FormularioGm. Los campos son los mismos de siempre; cambia la
// forma de declararlos (clave/etiqueta/texto) porque el formulario compartido
// del sistema claro usa ese vocabulario.
//
// "Interacciones" no está: lo lleva el sistema solo cada vez que se manda un
// mensaje o se marca un llamado. Un contador que se puede escribir a mano deja
// de servir para medir nada.
// ============================================================================

import { ETAPAS } from './pipeline.config';

const RUBROS = ['Odontología', 'Veterinaria', 'Diagnóstico por Imagen'];

export const CAMPOS_LEAD = [
  { clave: 'id', etiqueta: 'Código', tipo: 'texto', requerido: true, placeholder: 'LD-009' },
  { clave: 'clinica', etiqueta: 'Nombre del negocio', tipo: 'texto', requerido: true },
  { clave: 'nombre', etiqueta: 'Nombre', tipo: 'texto', requerido: true },
  { clave: 'apellido', etiqueta: 'Apellido', tipo: 'texto', requerido: true },
  {
    clave: 'especialidad',
    etiqueta: 'Rubro',
    tipo: 'select',
    opciones: RUBROS,
    defecto: 'Odontología',
  },
  { clave: 'zona', etiqueta: 'Zona', tipo: 'texto', placeholder: 'San Miguel de Tucumán' },
  {
    clave: 'telefono',
    etiqueta: 'Teléfono',
    tipo: 'texto',
    placeholder: '3815551234',
    ayuda: 'Sin 0 ni 15: se usa para armar el link de WhatsApp.',
  },
  { clave: 'email', etiqueta: 'Email', tipo: 'texto' },
  {
    clave: 'etapa',
    etiqueta: 'Etapa',
    tipo: 'select',
    defecto: 'comienzo',
    opciones: ETAPAS.map((e) => ({ valor: e.id, texto: e.nombre })),
  },
  {
    clave: 'prioridad',
    etiqueta: 'Prioridad',
    tipo: 'select',
    defecto: 'media',
    opciones: [
      { valor: 'alta', texto: 'Alta' },
      { valor: 'media', texto: 'Media' },
      { valor: 'baja', texto: 'Baja' },
    ],
  },
  { clave: 'equipo', etiqueta: 'Equipo de interés', tipo: 'texto', ancho: 2 },
  { clave: 'montoUsd', etiqueta: 'Monto USD', tipo: 'moneda', defecto: 0 },
  { clave: 'proximoPaso', etiqueta: 'Próximo paso', tipo: 'area', ancho: 2 },
];

/** Lead del tablero -> valores del formulario. */
export const aFormularioLead = (l = {}) => ({
  id: l.id || '',
  clinica: l.clinica || '',
  nombre: l.nombre || '',
  apellido: l.apellido || '',
  especialidad: l.especialidad || 'Odontología',
  zona: l.zona || '',
  telefono: l.telefono || '',
  email: l.email || '',
  etapa: l.etapa || 'comienzo',
  prioridad: l.prioridad || 'media',
  equipo: l.equipo || '',
  montoUsd: l.montoUsd || 0,
  proximoPaso: l.proximoPaso || '',
});

export default CAMPOS_LEAD;
