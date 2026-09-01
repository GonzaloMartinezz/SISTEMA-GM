// ============================================================================
// SISTEMA GM · SEGUIMIENTOS · CONSTRUCCIÓN DE ENLACES DE CONTACTO
// ============================================================================

const VENDEDOR = 'Gonzalo Martínez';

export const soloDigitos = (valor = '') => String(valor).replace(/\D/g, '');

/** Reemplaza {variables} de una plantilla con los datos del lead. */
export function interpolar(texto = '', lead = {}) {
  const mapa = {
    nombre: lead.nombre || '',
    clinica: lead.clinica || 'tu consultorio',
    equipo: lead.equipo || 'equipo',
    monto: lead.montoUsd != null ? Number(lead.montoUsd).toLocaleString('es-AR') : '—',
    vendedor: VENDEDOR,
  };
  return texto.replace(/\{(\w+)\}/g, (_, clave) => (clave in mapa ? mapa[clave] : `{${clave}}`));
}

/** Link de WhatsApp con el mensaje ya cargado. */
export function linkWhatsApp(lead, mensaje = '') {
  const tel = soloDigitos(lead?.telefono);
  if (!tel) return null;
  const texto = encodeURIComponent(interpolar(mensaje, lead));
  return `https://wa.me/54${tel}${texto ? `?text=${texto}` : ''}`;
}

/** Link mailto con asunto y cuerpo ya cargados. */
export function linkEmail(lead, asunto = '', cuerpo = '') {
  if (!lead?.email) return null;
  const s = encodeURIComponent(interpolar(asunto, lead));
  const b = encodeURIComponent(interpolar(cuerpo, lead));
  return `mailto:${lead.email}?subject=${s}&body=${b}`;
}

/** Link de llamada telefónica. */
export function linkTelefono(lead) {
  const tel = soloDigitos(lead?.telefono);
  return tel ? `tel:+54${tel}` : null;
}

export { VENDEDOR };
