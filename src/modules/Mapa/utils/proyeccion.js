// ============================================================================
// SISTEMA GM · M-07 · PROYECCIÓN DEL MAPA (Web Mercator)
// ----------------------------------------------------------------------------
// El mapa del módulo no usa ninguna librería ni ninguna clave de API. Son estas
// cuatro fórmulas y un mosaico de imágenes.
//
// Por qué así y no con Google Maps: la clave de Google es paga por uso, hay que
// darla de alta, restringirla por dominio y renovarla; y sin clave el módulo
// anterior mostraba un plano esquemático que no servía para ubicar nada. Con
// Web Mercator y los mosaicos abiertos de OpenStreetMap el mapa anda hoy, sin
// cuenta, sin costo y sin nada que vencer. Y si algún día querés Google, el
// botón "Cómo llegar" ya te lleva ahí, que es donde de verdad hace falta.
//
// Web Mercator es la proyección que usan todos los mapas web (Google, OSM,
// Mapbox): la Tierra se corta en un cuadrado de 256×256 píxeles al zoom 0, y
// cada nivel de zoom lo duplica. Un punto se ubica con estas dos cuentas, y
// todo lo demás del mapa —el arrastre, el zoom, los pines— es aritmética sobre
// ellas.
//
// La proyección deforma cerca de los polos, pero en Tucumán (-27° de latitud)
// el error es despreciable: lo que importa acá es que el pin caiga exactamente
// sobre la esquina correcta, y eso lo cumple.
// ============================================================================

export const TAM_TILE = 256;

/** Cuántos píxeles mide el mundo entero a este zoom. */
export const tamMundo = (zoom) => TAM_TILE * 2 ** zoom;

/** lng -> píxel X absoluto del mundo. */
export function lngAX(lng, zoom) {
  return ((Number(lng) + 180) / 360) * tamMundo(zoom);
}

/** lat -> píxel Y absoluto del mundo. */
export function latAY(lat, zoom) {
  // La latitud se recorta a ±85.05113° porque más allá la fórmula tiende a
  // infinito: es el borde real de todo mapa Mercator, no un límite nuestro.
  const rad = (Math.max(-85.05112878, Math.min(85.05112878, Number(lat))) * Math.PI) / 180;
  const y = Math.log(Math.tan(Math.PI / 4 + rad / 2));
  return (1 - y / Math.PI) * (tamMundo(zoom) / 2);
}

export function xALng(x, zoom) {
  return (x / tamMundo(zoom)) * 360 - 180;
}

export function yALat(y, zoom) {
  const n = Math.PI - (2 * Math.PI * y) / tamMundo(zoom);
  return (180 / Math.PI) * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)));
}

/** Punto geográfico -> píxel absoluto. */
export const aPixel = (punto, zoom) => ({
  x: lngAX(punto.lng, zoom),
  y: latAY(punto.lat, zoom),
});

export const aGeo = (pixel, zoom) => ({
  lat: yALat(pixel.y, zoom),
  lng: xALng(pixel.x, zoom),
});

// ---------------------------------------------------------------------------
// Encuadre
// ---------------------------------------------------------------------------

/**
 * El centro y el zoom que hacen entrar todos los puntos en un contenedor.
 * Se prueba de mayor a menor zoom y se queda con el primero que entra: es más
 * simple que despejar el zoom, y con 19 niveles el costo es nulo.
 */
export function encuadrar(puntos, ancho, alto, { maxZoom = 16, margen = 64 } = {}) {
  const validos = (puntos || []).filter(
    (p) => Number.isFinite(p?.lat) && Number.isFinite(p?.lng)
  );
  if (!validos.length) return null;

  const lat = validos.reduce((a, p) => a + p.lat, 0) / validos.length;
  const lng = validos.reduce((a, p) => a + p.lng, 0) / validos.length;
  const centro = { lat, lng };

  if (validos.length === 1) return { centro, zoom: 14 };

  const util = { ancho: Math.max(ancho - margen * 2, 80), alto: Math.max(alto - margen * 2, 80) };

  for (let z = maxZoom; z >= 1; z -= 1) {
    const xs = validos.map((p) => lngAX(p.lng, z));
    const ys = validos.map((p) => latAY(p.lat, z));
    const anchoPx = Math.max(...xs) - Math.min(...xs);
    const altoPx = Math.max(...ys) - Math.min(...ys);
    if (anchoPx <= util.ancho && altoPx <= util.alto) {
      // El centro geométrico del encuadre, no el promedio de las latitudes:
      // en Mercator no son lo mismo, y usar el promedio corre el mapa.
      return {
        centro: aGeo(
          { x: (Math.min(...xs) + Math.max(...xs)) / 2, y: (Math.min(...ys) + Math.max(...ys)) / 2 },
          z
        ),
        zoom: z,
      };
    }
  }
  return { centro, zoom: 1 };
}

/** Los tiles que cubren un rectángulo del mundo, con su posición en pantalla. */
export function tilesVisibles(centro, zoom, ancho, alto) {
  const c = aPixel(centro, zoom);
  const izq = c.x - ancho / 2;
  const arr = c.y - alto / 2;

  const maxTile = 2 ** zoom;
  const desde = { x: Math.floor(izq / TAM_TILE), y: Math.floor(arr / TAM_TILE) };
  const hasta = {
    x: Math.floor((izq + ancho) / TAM_TILE),
    y: Math.floor((arr + alto) / TAM_TILE),
  };

  const salida = [];
  for (let ty = desde.y; ty <= hasta.y; ty += 1) {
    // Fuera del rango vertical no hay mundo: no se pide un tile que no existe.
    if (ty < 0 || ty >= maxTile) continue;
    for (let tx = desde.x; tx <= hasta.x; tx += 1) {
      // En cambio el eje X da la vuelta: el mundo es cilíndrico.
      const envuelto = ((tx % maxTile) + maxTile) % maxTile;
      salida.push({
        clave: `${zoom}/${envuelto}/${ty}@${tx}`,
        z: zoom,
        x: envuelto,
        y: ty,
        izquierda: tx * TAM_TILE - izq,
        arriba: ty * TAM_TILE - arr,
      });
    }
  }
  return salida;
}

/** Punto geográfico -> píxel dentro del contenedor. */
export function aPantalla(punto, centro, zoom, ancho, alto) {
  const c = aPixel(centro, zoom);
  const p = aPixel(punto, zoom);
  return { x: p.x - c.x + ancho / 2, y: p.y - c.y + alto / 2 };
}

/** Píxel del contenedor -> punto geográfico. */
export function desdePantalla(pixel, centro, zoom, ancho, alto) {
  const c = aPixel(centro, zoom);
  return aGeo({ x: c.x + pixel.x - ancho / 2, y: c.y + pixel.y - alto / 2 }, zoom);
}

/** Corre el centro tantos píxeles (para el arrastre). */
export function desplazar(centro, zoom, dx, dy) {
  const c = aPixel(centro, zoom);
  return aGeo({ x: c.x - dx, y: c.y - dy }, zoom);
}

// ---------------------------------------------------------------------------
// Distancia
// ---------------------------------------------------------------------------

const R_TIERRA_KM = 6371;
const rad = (g) => (g * Math.PI) / 180;

/** Haversine: distancia real sobre la esfera, no sobre el mapa deformado. */
export function distanciaKm(a, b) {
  if (!a || !b) return 0;
  const dLat = rad(b.lat - a.lat);
  const dLng = rad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R_TIERRA_KM * Math.asin(Math.sqrt(h));
}

/** Grados de una línea de retícula legibles: -26.85 -> "26.85° S". */
export const etiquetaLat = (v) => `${Math.abs(v).toFixed(2)}° ${v < 0 ? 'S' : 'N'}`;
export const etiquetaLng = (v) => `${Math.abs(v).toFixed(2)}° ${v < 0 ? 'O' : 'E'}`;
