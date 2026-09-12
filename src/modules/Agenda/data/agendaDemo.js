// ============================================================================
// SISTEMA GM · M-04 · COMPROMISOS DE DEMOSTRACIÓN
// ----------------------------------------------------------------------------
// Sólo se usan cuando el sistema corre sin Supabase configurado (por ejemplo
// una copia de prueba). Con la base conectada, este archivo no se toca.
// Las fechas se arman relativas al día de carga para que la demo nunca se vea
// vencida.
// ============================================================================

const iso = (n) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const ev = (id, dia, hora, duracion, tipo, titulo, cliente, extra = {}) => ({
  id,
  fecha: iso(dia),
  hora,
  duracion,
  tipo,
  titulo,
  cliente,
  estado: 'pendiente',
  prioridad: 'media',
  direccion: null,
  lat: null,
  lng: null,
  nota: null,
  resultado: null,
  clienteId: null,
  leadCodigo: null,
  origenModulo: null,
  origenCodigo: null,
  recordatorioMin: 30,
  ...extra,
});

export const EVENTOS_DEMO = [
  ev('EV-001', 0, '09:00', 45, 'visita', 'Demostración de sillón odontológico', 'Torres, Marcela', {
    direccion: 'Balcarce 171, San Miguel de Tucumán',
    lat: -26.8285, lng: -65.2038, prioridad: 'alta',
    nota: 'Llevar ficha técnica y plan de 9 cuotas',
  }),
  ev('EV-002', 0, '10:30', 20, 'llamada', 'Gestión de mora · plan de pago', 'Paz, Rodrigo', {
    lat: -26.8195, lng: -65.2321, prioridad: 'alta',
  }),
  ev('EV-003', 0, '12:00', 60, 'visita', 'Relevamiento de quirófano', 'Juárez, Pablo', {
    direccion: 'Av. Roca 1200, Banda del Río Salí',
    lat: -26.8362, lng: -65.1664,
  }),
  ev('EV-004', 0, '15:30', 40, 'visita', 'Presentación de ecógrafo portátil', 'Gómez, Lucía', {
    direccion: 'Av. Aconquija 1500, Yerba Buena',
    lat: -26.8151, lng: -65.3182, prioridad: 'alta',
  }),
  ev('EV-005', 0, '17:00', 15, 'mensaje', 'Seguimiento post venta', 'Bulacio, Federico', {
    prioridad: 'baja', origenModulo: 'seguimientos', origenCodigo: 'LD-008',
  }),
  ev('EV-006', 1, '09:30', 45, 'visita', 'Entrega de autoclave', 'Ríos, Andrea', {
    direccion: 'Belgrano 480, Tafí Viejo', lat: -26.7331, lng: -65.2671,
  }),
  ev('EV-007', 1, '11:00', 30, 'mail', 'Cotización de rayos X panorámico', 'Sosa, Hernán', {
    prioridad: 'alta',
  }),
  ev('EV-008', 3, '10:00', 30, 'tarea', 'Reponer autoclaves con el proveedor', '', {
    origenModulo: 'equipamientos', origenCodigo: 'EQ-102',
  }),
];

export default EVENTOS_DEMO;
