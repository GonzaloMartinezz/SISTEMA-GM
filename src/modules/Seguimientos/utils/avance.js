// ============================================================================
// SISTEMA GM · M-03 SEGUIMIENTOS · CÁLCULOS DE AVANCE
// ----------------------------------------------------------------------------
// Todo lo que se dibuja en la sección "Avances" sale de acá, y todo sale del
// historial real de etapas que escribe la base. Nada se estima.
//
// Dos reglas que no se negocian:
//
//  1. La velocidad se calcula SÓLO con tramos cerrados. Un lead que lleva 40
//     días en "Convencer" y todavía no salió no aporta "40 días de duración":
//     aporta un mínimo. Meterlo en el promedio lo hunde y da un número que
//     parece preciso y no lo es. Por eso cada barra dice sobre cuántos tramos
//     está calculada, y si no hay ninguno lo dice en lugar de mostrar un 0.
//
//  2. La línea de tiempo recorta al rango elegido, pero un tramo que empezó
//     antes se dibuja desde el borde y se marca como recortado. Si se lo
//     dibujara empezando en el borde sin avisar, parecería que la venta arrancó
//     ese día.
// ============================================================================

import { ETAPAS, getEtapa, indiceEtapa } from '../config/pipeline.config';

const DIA = 86400000;

export const RANGOS = [
  { id: '30', nombre: '30 días', dias: 30 },
  { id: '90', nombre: '3 meses', dias: 90 },
  { id: '180', nombre: '6 meses', dias: 180 },
  { id: '365', nombre: '12 meses', dias: 365 },
];

export const getRango = (id) => RANGOS.find((r) => r.id === id) || RANGOS[1];

const aFecha = (v) => (v instanceof Date ? v : new Date(`${v}T00:00:00`));
const enDias = (a, b) => Math.max(0, Math.round((aFecha(b) - aFecha(a)) / DIA));

/** dd/mm de una fecha ISO, para los ejes. */
export const fechaCorta = (iso) =>
  iso ? aFecha(iso).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit' }) : '—';

// ---------------------------------------------------------------------------
// Línea de tiempo (una fila por lead, un segmento por etapa)
// ---------------------------------------------------------------------------

/**
 * @param {Array} historial tramos de gm_lead_etapas
 * @param {Array} leads     leads visibles (ya filtrados por la vista)
 * @param {number} dias     ancho de la ventana
 */
export function lineaTiempo(historial, leads, dias) {
  const hoy = new Date();
  const inicio = new Date(hoy.getTime() - dias * DIA);
  const total = Math.max(1, enDias(inicio, hoy));

  const porLead = new Map();
  historial.forEach((t) => {
    if (!porLead.has(t.leadCodigo)) porLead.set(t.leadCodigo, []);
    porLead.get(t.leadCodigo).push(t);
  });

  const filas = leads
    .map((lead) => {
      const tramos = (porLead.get(lead.id) || [])
        .slice()
        .sort((a, b) => aFecha(a.desde) - aFecha(b.desde));

      const segmentos = tramos
        .map((t) => {
          const d0 = aFecha(t.desde);
          const d1 = t.hasta ? aFecha(t.hasta) : hoy;
          if (d1 < inicio) return null; // terminó antes de la ventana

          const recortado = d0 < inicio;
          const desde = recortado ? inicio : d0;
          const etapa = getEtapa(t.etapa);

          return {
            etapaId: t.etapa,
            etapa: etapa.nombre,
            color: etapa.color,
            desdeIso: t.desde,
            hastaIso: t.hasta,
            recortado,
            enCurso: t.enCurso,
            dias: t.dias,
            // Porcentajes sobre la ventana: es lo que consume el CSS.
            izquierda: (enDias(inicio, desde) / total) * 100,
            ancho: Math.max((enDias(desde, d1) / total) * 100, 1.2),
          };
        })
        .filter(Boolean);

      return { lead, segmentos };
    })
    .filter((f) => f.segmentos.length);

  // Marcas del eje: una por mes cuando la ventana es larga, si no cada semana.
  const paso = dias > 120 ? 30 : 7;
  const marcas = [];
  for (let d = 0; d <= dias; d += paso) {
    const fecha = new Date(inicio.getTime() + d * DIA);
    marcas.push({ pos: (d / dias) * 100, texto: fechaCorta(fecha.toISOString().slice(0, 10)) });
  }

  return { filas, marcas, inicioIso: inicio.toISOString().slice(0, 10) };
}

// ---------------------------------------------------------------------------
// Embudo
// ---------------------------------------------------------------------------

export function embudo(leads) {
  return ETAPAS.map((e) => {
    const dentro = leads.filter((l) => l.etapa === e.id);
    const valor = dentro.reduce((a, l) => a + Number(l.montoUsd || 0), 0);
    return {
      id: e.id,
      nombre: e.nombre,
      color: e.color,
      probabilidad: e.probabilidad,
      cantidad: dentro.length,
      valor,
      ponderado: (valor * e.probabilidad) / 100,
    };
  });
}

// ---------------------------------------------------------------------------
// Velocidad: cuánto tarda una venta en salir de cada etapa
// ---------------------------------------------------------------------------

export function velocidadPorEtapa(historial) {
  return ETAPAS.map((e) => {
    const cerrados = historial.filter((t) => t.etapa === e.id && !t.enCurso);
    const abiertos = historial.filter((t) => t.etapa === e.id && t.enCurso);
    const promedio = cerrados.length
      ? cerrados.reduce((a, t) => a + t.dias, 0) / cerrados.length
      : null;

    return {
      id: e.id,
      nombre: e.nombre,
      color: e.color,
      promedio,
      muestras: cerrados.length,
      enCurso: abiertos.length,
      // Los que hoy están adentro y ya llevan más que el promedio: son los que
      // hay que empujar. Sin promedio no se puede decir nada y queda en 0.
      demorados:
        promedio == null ? 0 : abiertos.filter((t) => t.dias > promedio).length,
    };
  });
}

// ---------------------------------------------------------------------------
// Movimiento del período
// ---------------------------------------------------------------------------

/**
 * Cuántos leads avanzaron, retrocedieron o se cerraron dentro de la ventana.
 * Un avance es un tramo que empezó en el período y cuya etapa está más
 * adelante que la del tramo anterior del mismo lead.
 */
export function movimiento(historial, dias) {
  const corte = new Date(Date.now() - dias * DIA);
  const porLead = new Map();
  historial.forEach((t) => {
    if (!porLead.has(t.leadCodigo)) porLead.set(t.leadCodigo, []);
    porLead.get(t.leadCodigo).push(t);
  });

  let avanzaron = 0;
  let retrocedieron = 0;
  let cerraron = 0;

  porLead.forEach((tramos) => {
    const orden = tramos.slice().sort((a, b) => aFecha(a.desde) - aFecha(b.desde));
    for (let i = 1; i < orden.length; i += 1) {
      if (aFecha(orden[i].desde) < corte) continue;
      const antes = indiceEtapa(orden[i - 1].etapa);
      const ahora = indiceEtapa(orden[i].etapa);
      if (ahora > antes) avanzaron += 1;
      else if (ahora < antes) retrocedieron += 1;
      if (orden[i].etapa === 'cerrado') cerraron += 1;
    }
  });

  return { avanzaron, retrocedieron, cerraron };
}

/**
 * Leads que hoy están quietos hace más de `umbral` días en la misma etapa,
 * sin contar los ya cerrados.
 */
export function estancados(historial, leads, umbral = 21) {
  const abiertos = historial.filter((t) => t.enCurso && t.dias >= umbral && t.etapa !== 'cerrado');
  const porCodigo = new Map(leads.map((l) => [l.id, l]));
  return abiertos
    .map((t) => ({ ...t, lead: porCodigo.get(t.leadCodigo) }))
    .filter((x) => x.lead)
    .sort((a, b) => b.dias - a.dias);
}
