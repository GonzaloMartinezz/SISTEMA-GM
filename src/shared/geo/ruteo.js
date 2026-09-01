// ============================================================================
// SISTEMA GM · CAPA COMPARTIDA · CÁLCULO GEOGRÁFICO Y RUTEO
// ============================================================================

const R_TIERRA_KM = 6371;
const rad = (g) => (g * Math.PI) / 180;

/** Distancia en km entre dos coordenadas (fórmula de Haversine). */
export function distanciaKm(a, b) {
  if (!a || !b) return 0;
  const dLat = rad(b.lat - a.lat);
  const dLng = rad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R_TIERRA_KM * Math.asin(Math.sqrt(h));
}

/**
 * Ruta optimizada por vecino más cercano desde un punto de partida.
 * Devuelve las paradas ordenadas con su distancia parcial y acumulada.
 */
export function optimizarRuta(base, paradas) {
  const pendientes = [...paradas];
  const orden = [];
  let actual = base;
  let acumulado = 0;

  while (pendientes.length) {
    let mejor = 0;
    let mejorDist = Infinity;
    pendientes.forEach((p, i) => {
      const d = distanciaKm(actual, p);
      if (d < mejorDist) {
        mejorDist = d;
        mejor = i;
      }
    });
    const elegida = pendientes.splice(mejor, 1)[0];
    acumulado += mejorDist;
    orden.push({ ...elegida, distancia: mejorDist, acumulado });
    actual = elegida;
  }

  return { orden, totalKm: acumulado };
}

/** Ruta en el orden en que fue agendada (para comparar contra la optimizada). */
export function rutaCronologica(base, paradas) {
  let actual = base;
  let acumulado = 0;
  const orden = paradas.map((p) => {
    const d = distanciaKm(actual, p);
    acumulado += d;
    actual = p;
    return { ...p, distancia: d, acumulado };
  });
  return { orden, totalKm: acumulado };
}

/** Enlace de Google Maps con origen, destino y waypoints intermedios. */
export function linkGoogleMapsRuta(base, paradas) {
  if (!paradas.length) return null;
  const punto = (p) => `${p.lat},${p.lng}`;
  const destino = paradas[paradas.length - 1];
  const intermedias = paradas.slice(0, -1).map(punto).join('|');
  return (
    'https://www.google.com/maps/dir/?api=1' +
    `&origin=${punto(base)}` +
    `&destination=${punto(destino)}` +
    (intermedias ? `&waypoints=${encodeURIComponent(intermedias)}` : '') +
    '&travelmode=driving'
  );
}

/** Minutos estimados de manejo (velocidad urbana promedio 28 km/h). */
export const minutosDeViaje = (km) => Math.round((km / 28) * 60);
