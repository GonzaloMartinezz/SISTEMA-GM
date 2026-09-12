// ============================================================================
// SISTEMA GM · M-06 · DATOS DE DEMOSTRACIÓN
// ----------------------------------------------------------------------------
// Sólo se usan si el sistema corre sin Supabase configurado. Las coordenadas
// son reales de Tucumán: aunque sea una demo, los puntos caen donde tienen que
// caer.
// ============================================================================

const iso = (n) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export const CLIENTES_DEMO = [
  {
    codigo: 'CTA-000483', nombre: 'Odontología Torres', titular: 'Marcela Torres',
    rubro: 'Odontología', clasificacion: 'Particular', estado: 'corriente',
    telefono: '3815551234', celular: '3815551234', email: 'marcela@odontologiatorres.com',
    direccion: 'Balcarce 171', localidad: 'San Miguel de Tucumán', provincia: 'Tucumán',
    lat: -26.8285, lng: -65.2038, clienteDesde: '2024-03-15', notas: null,
    ultimaVisita: iso(-12), proximaFecha: iso(1), proximoTipo: 'visita',
    proximoTitulo: 'Demostración de sillón odontológico', compromisosAbiertos: 2,
    leadCodigo: 'LD-001', leadEtapa: 'posible-venta', montoEnJuego: 15900, notasCargadas: 1,
  },
  {
    codigo: 'CTA-000512', nombre: 'Consultorio Paz', titular: 'Rodrigo Paz',
    rubro: 'Odontología', clasificacion: 'Particular', estado: 'mora',
    telefono: '3815559090', celular: '3815559090', email: 'rodri.paz@gmail.com',
    direccion: 'Muñecas 640', localidad: 'San Miguel de Tucumán', provincia: 'Tucumán',
    lat: -26.8195, lng: -65.2321, clienteDesde: '2025-06-02', notas: null,
    ultimaVisita: iso(-40), proximaFecha: iso(1), proximoTipo: 'llamada',
    proximoTitulo: 'Gestión de mora · plan de pago', compromisosAbiertos: 1,
    leadCodigo: 'LD-002', leadEtapa: 'convencer', montoEnJuego: 3200, notasCargadas: 0,
  },
  {
    codigo: 'CLI-000003', nombre: 'Veterinaria Norte', titular: 'Lucía Gómez',
    rubro: 'Veterinaria', clasificacion: 'Particular', estado: 'lead',
    telefono: '3815557788', celular: '3815557788', email: 'contacto@vetnorte.com.ar',
    direccion: 'Av. Aconquija 1500', localidad: 'Yerba Buena', provincia: 'Tucumán',
    lat: -26.8151, lng: -65.3182, clienteDesde: null, notas: null,
    ultimaVisita: iso(-8), proximaFecha: iso(1), proximoTipo: 'visita',
    proximoTitulo: 'Presentación de ecógrafo portátil', compromisosAbiertos: 1,
    leadCodigo: 'LD-003', leadEtapa: 'proceso', montoEnJuego: 8400, notasCargadas: 0,
  },
  {
    codigo: 'CLI-000004', nombre: 'Centro de Diagnóstico Sur', titular: 'Hernán Sosa',
    rubro: 'Diagnóstico por Imagen', clasificacion: 'Institución', estado: 'lead',
    telefono: '3815552211', celular: '3815552211', email: 'compras@diagnosticosur.com',
    direccion: 'Ruta 306 km 4', localidad: 'Alderetes', provincia: 'Tucumán',
    lat: -26.8162, lng: -65.1355, clienteDesde: null, notas: null,
    ultimaVisita: null, proximaFecha: iso(2), proximoTipo: 'mail',
    proximoTitulo: 'Cotización de rayos X panorámico', compromisosAbiertos: 1,
    leadCodigo: 'LD-004', leadEtapa: 'comienzo', montoEnJuego: 22500, notasCargadas: 0,
  },
  {
    codigo: 'CLI-000005', nombre: 'Odontología Integral Ríos', titular: 'Andrea Ríos',
    rubro: 'Odontología', clasificacion: 'Particular', estado: 'lead',
    telefono: '3815554433', celular: '3815554433', email: 'andrea.rios@gmail.com',
    direccion: 'Belgrano 480', localidad: 'Tafí Viejo', provincia: 'Tucumán',
    lat: -26.7331, lng: -65.2671, clienteDesde: null, notas: null,
    ultimaVisita: iso(-70), proximaFecha: iso(1), proximoTipo: 'visita',
    proximoTitulo: 'Entrega de autoclave', compromisosAbiertos: 1,
    leadCodigo: 'LD-005', leadEtapa: 'comienzo', montoEnJuego: 900, notasCargadas: 0,
  },
  {
    codigo: 'CLI-000006', nombre: 'Clínica Veterinaria Juárez', titular: 'Pablo Juárez',
    rubro: 'Veterinaria', clasificacion: 'Particular', estado: 'lead',
    telefono: '3815556677', celular: '3815556677', email: 'pjuarez@vetjuarez.com',
    direccion: 'Av. Roca 1200', localidad: 'Banda del Río Salí', provincia: 'Tucumán',
    lat: -26.8362, lng: -65.1664, clienteDesde: null, notas: null,
    ultimaVisita: iso(-25), proximaFecha: iso(3), proximoTipo: 'visita',
    proximoTitulo: 'Relevamiento de quirófano', compromisosAbiertos: 1,
    leadCodigo: 'LD-006', leadEtapa: 'proceso', montoEnJuego: 5600, notasCargadas: 0,
  },
  {
    codigo: 'CLI-000007', nombre: 'Consultorio Ledesma', titular: 'Silvina Ledesma',
    rubro: 'Odontología', clasificacion: 'Particular', estado: 'lead',
    telefono: '3815558822', celular: '3815558822', email: 'sledesma@hotmail.com',
    direccion: 'Sarmiento 220', localidad: 'Concepción', provincia: 'Tucumán',
    lat: -27.3452, lng: -65.5941, clienteDesde: null, notas: null,
    ultimaVisita: iso(-95), proximaFecha: iso(5), proximoTipo: 'visita',
    proximoTitulo: 'Instalación de compresor', compromisosAbiertos: 1,
    leadCodigo: 'LD-007', leadEtapa: 'convencer', montoEnJuego: 1800, notasCargadas: 1,
  },
  {
    codigo: 'CLI-000008', nombre: 'Clínica Dental Bulacio', titular: 'Federico Bulacio',
    rubro: 'Odontología', clasificacion: 'Particular', estado: 'corriente',
    telefono: '3815553311', celular: '3815553311', email: 'fede@dentalbulacio.com',
    direccion: 'Congreso 380', localidad: 'San Miguel de Tucumán', provincia: 'Tucumán',
    lat: -26.8218, lng: -65.2158, clienteDesde: '2025-11-20', notas: null,
    ultimaVisita: iso(-5), proximaFecha: iso(8), proximoTipo: 'llamada',
    proximoTitulo: 'Control post instalación', compromisosAbiertos: 1,
    leadCodigo: null, leadEtapa: null, montoEnJuego: 0, notasCargadas: 0,
  },
];

const ev = (codigo, dia, hora, tipo, titulo, cliente, codigoCliente, extra = {}) => ({
  codigo, fecha: iso(dia), hora, duracion: 45, tipo, titulo,
  cliente, clienteCodigo: codigoCliente, estado: 'pendiente', prioridad: 'media',
  direccion: null, lat: null, lng: null, nota: null, ...extra,
});

export const COMPROMISOS_DEMO = [
  ev('EV-101', 0, '09:00', 'visita', 'Cierre de la venta del sillón', 'Torres, Marcela', 'CTA-000483',
     { lat: -26.8285, lng: -65.2038, direccion: 'Balcarce 171', prioridad: 'alta',
       nota: 'Llevar la ficha técnica y el plan de 9 cuotas' }),
  ev('EV-102', 0, '11:30', 'llamada', 'Confirmar acreditación del pago', 'Bulacio, Federico', 'CLI-000008',
     { lat: -26.8218, lng: -65.2158, duracion: 15 }),
  ev('EV-103', 1, '09:30', 'visita', 'Entrega de autoclave', 'Ríos, Andrea', 'CLI-000005',
     { lat: -26.7331, lng: -65.2671, direccion: 'Belgrano 480, Tafí Viejo',
       nota: 'Llevar el manual y la garantía firmada' }),
  ev('EV-104', 1, '11:00', 'llamada', 'Gestión de mora · plan de pago', 'Paz, Rodrigo', 'CTA-000512',
     { lat: -26.8195, lng: -65.2321, duracion: 20, prioridad: 'alta' }),
  ev('EV-105', 1, '15:30', 'visita', 'Presentación de ecógrafo portátil', 'Gómez, Lucía', 'CLI-000003',
     { lat: -26.8151, lng: -65.3182, direccion: 'Av. Aconquija 1500, Yerba Buena', prioridad: 'alta' }),
  ev('EV-106', 1, '17:30', 'mensaje', 'Pasar el catálogo de descartables', 'Bulacio, Federico', 'CLI-000008',
     { duracion: 10, prioridad: 'baja' }),
  ev('EV-107', 2, '10:00', 'mail', 'Cotización de rayos X panorámico', 'Sosa, Hernán', 'CLI-000004',
     { duracion: 30, prioridad: 'alta' }),
  ev('EV-108', 3, '10:00', 'visita', 'Relevamiento de quirófano', 'Juárez, Pablo', 'CLI-000006',
     { lat: -26.8362, lng: -65.1664, direccion: 'Av. Roca 1200, Banda del Río Salí', duracion: 60 }),
  ev('EV-109', 5, '09:00', 'visita', 'Instalación de compresor', 'Ledesma, Silvina', 'CLI-000007',
     { lat: -27.3452, lng: -65.5941, direccion: 'Sarmiento 220, Concepción', duracion: 90 }),
  ev('EV-110', 8, '09:30', 'llamada', 'Control post instalación', 'Bulacio, Federico', 'CLI-000008',
     { lat: -26.8218, lng: -65.2158, duracion: 20 }),
  ev('EV-111', 12, '10:30', 'visita', 'Seguimiento mensual', 'Gómez, Lucía', 'CLI-000003',
     { lat: -26.8151, lng: -65.3182 }),
  ev('EV-112', 18, '11:00', 'visita', 'Segunda demo de sillón', 'Torres, Marcela', 'CTA-000483',
     { lat: -26.8285, lng: -65.2038 }),
];

export default CLIENTES_DEMO;
