// ============================================================================
// SISTEMA GM · M-05 · FORMULARIO DEL COMPROMISO
// ----------------------------------------------------------------------------
// El `estado` no está: se cambia con los botones de cerrar/cancelar, no en un
// desplegable. Un compromiso se cierra cuando pasó algo, no cuando alguien
// edita un campo.
//
// Las coordenadas sí están, y sin valor por defecto. El módulo viejo le metía
// las de la base a todo evento nuevo "porque todavía no hay geocodificación":
// el resultado era que cada visita cargada a mano quedaba a 0 km de la base y
// la ruta del día no servía. Vacío es la respuesta honesta: la visita no rutea
// y la vista lo dice, hasta que alguien pegue la coordenada real.
// ============================================================================

import { TIPOS } from './agenda.config';

export const CAMPOS_EVENTO = [
  { clave: 'titulo', etiqueta: 'Qué hay que hacer', tipo: 'texto', requerido: true, ancho: 2 },
  {
    clave: 'tipo',
    etiqueta: 'Tipo',
    tipo: 'select',
    defecto: 'visita',
    requerido: true,
    opciones: TIPOS.map((t) => ({ valor: t.id, texto: t.nombre })),
  },
  { clave: 'cliente', etiqueta: 'Con quién', tipo: 'texto', placeholder: 'Torres, Marcela' },
  { clave: 'fecha', etiqueta: 'Fecha', tipo: 'fecha', requerido: true },
  { clave: 'hora', etiqueta: 'Hora', tipo: 'hora', requerido: true, defecto: '09:00' },
  {
    clave: 'duracion',
    etiqueta: 'Duración (min)',
    tipo: 'numero',
    defecto: 30,
    ayuda: 'Es lo que ocupa en el día: de acá sale la carga de la jornada.',
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
  { clave: 'direccion', etiqueta: 'Dirección', tipo: 'texto', ancho: 2 },
  {
    clave: 'lat',
    etiqueta: 'Latitud',
    tipo: 'numero',
    ayuda: 'Sin coordenadas la visita no entra en la ruta del día.',
  },
  { clave: 'lng', etiqueta: 'Longitud', tipo: 'numero' },
  { clave: 'nota', etiqueta: 'Qué preparar', tipo: 'area', ancho: 2 },
];

export const aFormularioEvento = (e = {}) => ({
  titulo: e.titulo || '',
  tipo: e.tipo || 'visita',
  cliente: e.cliente || '',
  fecha: e.fecha || '',
  hora: e.hora || '09:00',
  duracion: e.duracion || 30,
  prioridad: e.prioridad || 'media',
  direccion: e.direccion || '',
  lat: e.lat ?? '',
  lng: e.lng ?? '',
  nota: e.nota || '',
});

export default CAMPOS_EVENTO;
