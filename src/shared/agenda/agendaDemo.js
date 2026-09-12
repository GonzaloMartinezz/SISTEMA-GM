// ============================================================================
// SISTEMA GM · CAPA COMPARTIDA · AGENDA Y GEOLOCALIZACIÓN (datos demo)
// ----------------------------------------------------------------------------
// La Agenda (M-04) y el Mapa (M-06) leen de acá: los mismos eventos que se
// programan son los que el ruteo cruza con las ubicaciones.
// ============================================================================

/** Fecha base de la demo (hoy). Se usa para armar el tablero diario. */
const hoy = new Date();
const iso = (d) => d.toISOString().slice(0, 10);
const masDias = (n) => {
  const d = new Date(hoy);
  d.setDate(d.getDate() + n);
  return iso(d);
};

export const HOY = iso(hoy);
export const MANANA = masDias(1);

export const EVENTOS_DEMO = [
  {
    id: 'EV-001',
    fecha: HOY,
    hora: '09:00',
    duracion: 45,
    tipo: 'visita',
    titulo: 'Demostración de sillón odontológico',
    cliente: 'Torres, Marcela',
    clienteId: 'CTA-000483',
    direccion: 'Balcarce 171, San Miguel de Tucumán',
    lat: -26.8285,
    lng: -65.2038,
    estado: 'pendiente',
    prioridad: 'alta',
    nota: 'Llevar ficha técnica y plan de 9 cuotas',
  },
  {
    id: 'EV-002',
    fecha: HOY,
    hora: '10:30',
    duracion: 20,
    tipo: 'llamada',
    titulo: 'Gestión de mora · plan de pago',
    cliente: 'Paz, Rodrigo',
    clienteId: 'CTA-000512',
    direccion: 'Av. Mate de Luna 2140, San Miguel de Tucumán',
    lat: -26.8195,
    lng: -65.2321,
    estado: 'pendiente',
    prioridad: 'alta',
    nota: 'Cobra los días 5 · ofrecer 3 cuotas',
  },
  {
    id: 'EV-003',
    fecha: HOY,
    hora: '12:00',
    duracion: 60,
    tipo: 'visita',
    titulo: 'Relevamiento de quirófano',
    cliente: 'Juárez, Pablo',
    clienteId: null,
    direccion: 'Ruta 9 km 1298, Banda del Río Salí',
    lat: -26.8362,
    lng: -65.1664,
    estado: 'pendiente',
    prioridad: 'media',
    nota: 'Medir espacio para mesa hidráulica',
  },
  {
    id: 'EV-004',
    fecha: HOY,
    hora: '15:30',
    duracion: 40,
    tipo: 'visita',
    titulo: 'Presentación de ecógrafo portátil',
    cliente: 'Gómez, Lucía',
    clienteId: null,
    direccion: 'Av. Aconquija 1450, Yerba Buena',
    lat: -26.8151,
    lng: -65.3182,
    estado: 'pendiente',
    prioridad: 'alta',
    nota: 'Pide propuesta formal por mail',
  },
  {
    id: 'EV-005',
    fecha: HOY,
    hora: '17:00',
    duracion: 15,
    tipo: 'llamada',
    titulo: 'Seguimiento post venta',
    cliente: 'Bulacio, Federico',
    clienteId: null,
    direccion: 'Muñecas 850, San Miguel de Tucumán',
    lat: -26.8218,
    lng: -65.2158,
    estado: 'pendiente',
    prioridad: 'baja',
    nota: 'Consultar por insumos de fotocurado',
  },
  {
    id: 'EV-006',
    fecha: MANANA,
    hora: '09:30',
    duracion: 45,
    tipo: 'visita',
    titulo: 'Entrega de autoclave',
    cliente: 'Ríos, Andrea',
    clienteId: null,
    direccion: 'Av. Alem 320, Tafí Viejo',
    lat: -26.7331,
    lng: -65.2671,
    estado: 'pendiente',
    prioridad: 'media',
    nota: 'Coordinar con el flete a primera hora',
  },
  {
    id: 'EV-007',
    fecha: MANANA,
    hora: '11:00',
    duracion: 30,
    tipo: 'llamada',
    titulo: 'Cotización de rayos X panorámico',
    cliente: 'Sosa, Hernán',
    clienteId: null,
    direccion: 'Av. Rivadavia 1300, Alderetes',
    lat: -26.8162,
    lng: -65.1355,
    estado: 'pendiente',
    prioridad: 'alta',
    nota: 'Confirmar disponibilidad de equipo importado',
  },
];

/** Cartera geolocalizada completa (para el mapa, más allá de la agenda). */
export const CLIENTES_GEO = [
  { id: 'CTA-000483', nombre: 'Torres, Marcela', clinica: 'Odontología Torres', zona: 'San Miguel de Tucumán', lat: -26.8285, lng: -65.2038, estado: 'corriente', especialidad: 'Odontología' },
  { id: 'CTA-000512', nombre: 'Paz, Rodrigo', clinica: 'Consultorio Paz', zona: 'San Miguel de Tucumán', lat: -26.8195, lng: -65.2321, estado: 'mora', especialidad: 'Odontología' },
  { id: 'LD-003', nombre: 'Gómez, Lucía', clinica: 'Veterinaria Norte', zona: 'Yerba Buena', lat: -26.8151, lng: -65.3182, estado: 'lead', especialidad: 'Veterinaria' },
  { id: 'LD-004', nombre: 'Sosa, Hernán', clinica: 'Centro de Diagnóstico Sur', zona: 'Alderetes', lat: -26.8162, lng: -65.1355, estado: 'lead', especialidad: 'Diagnóstico' },
  { id: 'LD-005', nombre: 'Ríos, Andrea', clinica: 'Odontología Integral Ríos', zona: 'Tafí Viejo', lat: -26.7331, lng: -65.2671, estado: 'lead', especialidad: 'Odontología' },
  { id: 'LD-006', nombre: 'Juárez, Pablo', clinica: 'Clínica Veterinaria Juárez', zona: 'Banda del Río Salí', lat: -26.8362, lng: -65.1664, estado: 'lead', especialidad: 'Veterinaria' },
  { id: 'LD-007', nombre: 'Ledesma, Silvina', clinica: 'Consultorio Ledesma', zona: 'Concepción', lat: -27.3452, lng: -65.5941, estado: 'lead', especialidad: 'Odontología' },
  { id: 'LD-008', nombre: 'Bulacio, Federico', clinica: 'Clínica Dental Bulacio', zona: 'San Miguel de Tucumán', lat: -26.8218, lng: -65.2158, estado: 'corriente', especialidad: 'Odontología' },
];

/** Punto de partida de las rutas (base operativa). */
export const BASE_OPERATIVA = {
  nombre: 'Base GM · San Miguel de Tucumán',
  lat: -26.8241,
  lng: -65.2226,
};

export default EVENTOS_DEMO;
