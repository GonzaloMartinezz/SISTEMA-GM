// ============================================================================
// SISTEMA GM · M-02 EQUIPAMIENTOS · TEXTO PARA EL CLIENTE
// ----------------------------------------------------------------------------
// Arma el bloque que se pega en WhatsApp o en un mail. Usa el formato de
// WhatsApp (*negrita*) porque es donde termina el 90% de las veces; en un mail
// los asteriscos se leen igual sin molestar.
//
// Regla del negocio: al cliente se le manda el precio de venta, nunca el costo
// ni el margen. Por eso esta función no recibe el costo.
// ============================================================================

const usd = (v) =>
  `US$ ${Number(v || 0).toLocaleString('es-AR', { maximumFractionDigits: 0 })}`;

/**
 * @param {object} equipo  fila del catálogo
 * @param {Array}  specs   características de la ficha técnica
 * @param {object} opciones  { conPrecio, conDisponibilidad }
 */
export function textoParaCliente(equipo, specs = [], opciones = {}) {
  const { conPrecio = true, conDisponibilidad = true } = opciones;
  if (!equipo) return '';

  const lineas = [];

  lineas.push(`*${equipo.nombre}*`);
  const marca = [equipo.marca, equipo.modelo].filter(Boolean).join(' ');
  if (marca) lineas.push(marca);
  lineas.push('');

  specs.forEach((s) => lineas.push(`• ${s.label}: ${s.valor}`));

  const extras = [];
  if (equipo.dimensiones) extras.push(`• Medidas: ${equipo.dimensiones}`);
  if (equipo.consumo && equipo.consumo !== '—') extras.push(`• Alimentación: ${equipo.consumo}`);
  if (equipo.garantiaMeses) extras.push(`• Garantía: ${equipo.garantiaMeses} meses`);
  if (extras.length) {
    if (specs.length) lineas.push('');
    lineas.push(...extras);
  }

  if (conPrecio && equipo.precioUsd > 0) {
    lineas.push('');
    lineas.push(`*Precio: ${usd(equipo.precioUsd)}*`);
  }

  if (conDisponibilidad) {
    lineas.push('');
    if (equipo.stock > 0) {
      lineas.push(
        equipo.stock === 1 ? 'Disponible: última unidad en stock.' : 'Disponible: entrega inmediata.'
      );
    } else if (equipo.transito > 0) {
      lineas.push('Sin stock por el momento, tenemos unidades en camino.');
    } else {
      lineas.push('Sin stock por el momento. Consultanos por el plazo de reposición.');
    }
  }

  return lineas.join('\n');
}

/** Copia al portapapeles y devuelve true si pudo. */
export async function copiar(texto) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(texto);
      return true;
    }
  } catch {
    // Sigue por el camino viejo.
  }

  // Respaldo para navegadores que no dan permiso de portapapeles.
  try {
    const area = document.createElement('textarea');
    area.value = texto;
    area.style.position = 'fixed';
    area.style.opacity = '0';
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(area);
    return ok;
  } catch {
    return false;
  }
}

/** Enlace de WhatsApp con el texto ya cargado. */
export function linkWhatsApp(texto, telefono) {
  const n = String(telefono || '').replace(/\D/g, '');
  const base = n ? `https://wa.me/${n.length <= 10 ? `54${n}` : n}` : 'https://wa.me/';
  return `${base}?text=${encodeURIComponent(texto)}`;
}
