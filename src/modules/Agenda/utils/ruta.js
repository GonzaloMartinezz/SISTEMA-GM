// ============================================================================
// SISTEMA GM · M-05 · RUTA DEL DÍA
// ----------------------------------------------------------------------------
// El cálculo geográfico (Haversine, vecino más cercano, link de Maps) sigue
// viviendo en shared/geo/ruteo: es el mismo que usa el módulo de logística y no
// hay razón para tener dos. Lo que se agrega acá es el filtro previo, y es
// importante:
//
// El módulo viejo hacía `lat: Number(r.latitud)`. Como `Number(null)` es 0, un
// compromiso sin coordenadas cargadas entraba a la ruta como el punto (0, 0)
// —que está en el Golfo de Guinea— y el total del día saltaba a diez mil
// kilómetros. La ruta quedaba inservible y no se veía por qué.
//
// Acá una visita sin coordenadas simplemente no rutea, y la vista dice cuántas
// quedaron afuera. Es preferible una ruta de tres paradas que avisa que le
// falta una, a una de cuatro que miente el número.
// ============================================================================

import {
  distanciaKm, optimizarRuta, rutaCronologica, linkGoogleMapsRuta,
} from '../../../shared/geo/ruteo';
import { BASE_OPERATIVA, minutosDeViaje } from '../config/agenda.config';

/** ¿Tiene coordenadas reales? El (0,0) se descarta: nadie trabaja ahí. */
export const tieneCoordenadas = (e) =>
  Number.isFinite(e?.lat) && Number.isFinite(e?.lng) && !(e.lat === 0 && e.lng === 0);

/**
 * Arma la ruta del día con las visitas que se pueden rutear.
 * @returns {{ruteables, sinCoordenadas, optimizada, cronologica, ahorroKm, minutos, link, base}}
 */
export function rutaDelDia(eventos, base = BASE_OPERATIVA) {
  const visitas = eventos.filter((e) => e.tipo === 'visita' && e.estado !== 'cancelado');
  const ruteables = visitas.filter(tieneCoordenadas);
  const sinCoordenadas = visitas.filter((e) => !tieneCoordenadas(e));

  const optimizada = optimizarRuta(base, ruteables);
  const cronologica = rutaCronologica(base, ruteables);

  // Volver a la base también son kilómetros: el día no termina en la última
  // visita, termina cuando volvés. Contarlo cambia la estimación bastante.
  const vuelta = optimizada.orden.length
    ? distanciaKm(optimizada.orden[optimizada.orden.length - 1], base)
    : 0;

  const totalConVuelta = optimizada.totalKm + vuelta;

  return {
    base,
    ruteables,
    sinCoordenadas,
    optimizada,
    cronologica,
    vueltaKm: vuelta,
    totalKm: totalConVuelta,
    ahorroKm: cronologica.totalKm - optimizada.totalKm,
    minutos: minutosDeViaje(totalConVuelta),
    link: linkGoogleMapsRuta(base, optimizada.orden),
  };
}

export { distanciaKm, minutosDeViaje };
