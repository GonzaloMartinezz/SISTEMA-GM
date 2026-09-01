// ============================================================================
// SISTEMA GM · SEGUIMIENTOS · REPOSITORIO DE RESPUESTAS RÁPIDAS
// ----------------------------------------------------------------------------
// Variables disponibles: {nombre} {clinica} {equipo} {monto} {vendedor}
// ============================================================================

export const PLANTILLAS = [
  {
    id: 'primer-contacto',
    etapa: 'comienzo',
    titulo: 'Primer contacto',
    canal: 'whatsapp',
    texto:
      'Hola {nombre}, ¿cómo estás? Soy {vendedor} de Sistema GM, trabajamos con equipamiento odontológico y veterinario en Tucumán. ¿Tenés un minuto para que te cuente qué tenemos disponible?',
  },
  {
    id: 'envio-catalogo',
    etapa: 'comienzo',
    titulo: 'Envío de catálogo',
    canal: 'whatsapp',
    texto:
      'Hola {nombre}, te paso el catálogo actualizado con precios y fichas técnicas. Cualquier consulta sobre el {equipo} me avisás y lo vemos.',
  },
  {
    id: 'seguimiento-cotizacion',
    etapa: 'proceso',
    titulo: 'Seguimiento de cotización',
    canal: 'whatsapp',
    texto:
      'Hola {nombre}, ¿pudiste ver la cotización del {equipo} que te mandé? Quedo atento por si querés que ajustemos algo.',
  },
  {
    id: 'financiacion',
    etapa: 'convencer',
    titulo: 'Opciones de financiación',
    canal: 'whatsapp',
    texto:
      'Hola {nombre}, te comento que el {equipo} lo podemos financiar en cuotas sin interés. Si te sirve armamos un plan a tu medida.',
  },
  {
    id: 'objecion-precio',
    etapa: 'convencer',
    titulo: 'Objeción de precio',
    canal: 'whatsapp',
    texto:
      'Hola {nombre}, entiendo lo del presupuesto. Puedo mejorarte la condición si cerramos esta semana, y sumo la instalación sin cargo. ¿Lo vemos?',
  },
  {
    id: 'cierre',
    etapa: 'posible-venta',
    titulo: 'Empujón de cierre',
    canal: 'whatsapp',
    texto:
      'Hola {nombre}, tengo la última unidad del {equipo} reservada para {clinica}. ¿Confirmamos así te la aseguro?',
  },
  {
    id: 'post-venta',
    etapa: 'cerrado',
    titulo: 'Post venta',
    canal: 'whatsapp',
    texto:
      'Hola {nombre}, ¿cómo viene funcionando el {equipo}? Cualquier cosa que necesites de service o insumos, escribime.',
  },
  {
    id: 'mail-propuesta',
    etapa: 'proceso',
    titulo: 'Propuesta formal (email)',
    canal: 'email',
    asunto: 'Propuesta comercial · {equipo}',
    texto:
      'Estimado/a {nombre}:\n\nAdjunto la propuesta comercial del {equipo} para {clinica}, por un total de USD {monto}, con financiación disponible.\n\nQuedo a disposición.\n\n{vendedor}\nSistema GM · Tucumán',
  },
  {
    id: 'mail-reactivacion',
    etapa: 'convencer',
    titulo: 'Reactivación (email)',
    canal: 'email',
    asunto: 'Seguimos disponibles para {clinica}',
    texto:
      'Estimado/a {nombre}:\n\nRetomo el contacto por el {equipo}. Tenemos disponibilidad inmediata y las condiciones se mantienen este mes.\n\n{vendedor}\nSistema GM · Tucumán',
  },
];

export const plantillasPorEtapa = (etapaId) =>
  PLANTILLAS.filter((p) => !etapaId || p.etapa === etapaId);

export default PLANTILLAS;
