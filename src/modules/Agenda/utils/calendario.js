// ============================================================================
// SISTEMA GM · M-04 · FECHAS Y CARGA DE LA JORNADA
// ----------------------------------------------------------------------------
// Todo el módulo trabaja con fechas ISO cortas ("2026-09-02") como identidad y
// sólo las convierte a Date para calcular. La razón es concreta: `new Date
// ("2026-09-02")` se interpreta como UTC y en Argentina (UTC-3) devuelve el
// día anterior. Un evento del día 2 aparecía el 1 en el calendario. Por eso
// `aFecha` arma la fecha componente por componente, siempre en hora local.
//
// Y `hoyIso()` es una función, no una constante. En el módulo viejo HOY se
// calculaba al cargar el archivo: si la pestaña quedaba abierta cruzando la
// medianoche, la agenda seguía mostrando el día anterior como "hoy".
// ============================================================================

const DIA_MS = 86400000;

export const hoyIso = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

/** ISO corto -> Date en hora local (nunca UTC). */
export const aFecha = (iso) => {
  const [a, m, d] = String(iso || '').split('-').map(Number);
  return new Date(a || 1970, (m || 1) - 1, d || 1);
};

export const aIso = (fecha) =>
  `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}-${String(fecha.getDate()).padStart(2, '0')}`;

export const sumarDias = (iso, n) => {
  const d = aFecha(iso);
  d.setDate(d.getDate() + n);
  return aIso(d);
};

export const sumarMeses = (iso, n) => {
  const d = aFecha(iso);
  d.setDate(1);
  d.setMonth(d.getMonth() + n);
  return aIso(d);
};

export const diasEntre = (desde, hasta) =>
  Math.round((aFecha(hasta) - aFecha(desde)) / DIA_MS);

// ---------------------------------------------------------------------------
// Formateo
// ---------------------------------------------------------------------------

export const diaLargo = (iso) =>
  aFecha(iso).toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' });

export const diaCorto = (iso) =>
  aFecha(iso).toLocaleDateString('es-AR', { weekday: 'short', day: '2-digit' });

export const mesLargo = (iso) =>
  aFecha(iso).toLocaleDateString('es-AR', { month: 'long', year: 'numeric' });

export const numeroDia = (iso) => aFecha(iso).getDate();

/** "Hoy", "Mañana", "Ayer" o el día largo. Sirve para el encabezado. */
export const nombreRelativo = (iso) => {
  const d = diasEntre(hoyIso(), iso);
  if (d === 0) return 'Hoy';
  if (d === 1) return 'Mañana';
  if (d === -1) return 'Ayer';
  return diaLargo(iso);
};

export const esHoy = (iso) => iso === hoyIso();
export const esFinDeSemana = (iso) => [0, 6].includes(aFecha(iso).getDay());

// ---------------------------------------------------------------------------
// Rejillas
// ---------------------------------------------------------------------------

/** Los 7 días de la semana que contiene `iso`, arrancando el lunes. */
export function semanaDe(iso) {
  const d = aFecha(iso);
  const dow = (d.getDay() + 6) % 7; // lunes = 0
  const lunes = sumarDias(iso, -dow);
  return Array.from({ length: 7 }, (_, i) => sumarDias(lunes, i));
}

/**
 * La rejilla del mes: siempre semanas completas de lunes a domingo, así que
 * arranca y termina con días del mes vecino. Cada celda dice si es del mes.
 */
export function mesDe(iso) {
  const base = aFecha(iso);
  const primero = new Date(base.getFullYear(), base.getMonth(), 1);
  const dow = (primero.getDay() + 6) % 7;
  const arranque = sumarDias(aIso(primero), -dow);

  const ultimo = new Date(base.getFullYear(), base.getMonth() + 1, 0);
  const total = diasEntre(arranque, aIso(ultimo)) + 1;
  const semanas = Math.ceil(total / 7);

  return Array.from({ length: semanas * 7 }, (_, i) => {
    const dia = sumarDias(arranque, i);
    return { iso: dia, delMes: aFecha(dia).getMonth() === base.getMonth() };
  });
}

// ---------------------------------------------------------------------------
// Horas
// ---------------------------------------------------------------------------

/** "09:30" -> 570 minutos. Tolera basura: devuelve null en vez de romper. */
export function aMinutos(hora) {
  const m = /^(\d{1,2}):(\d{2})/.exec(String(hora || ''));
  if (!m) return null;
  return Number(m[1]) * 60 + Number(m[2]);
}

export const aHora = (minutos) =>
  `${String(Math.floor(minutos / 60)).padStart(2, '0')}:${String(minutos % 60).padStart(2, '0')}`;

/** Hora de fin de un compromiso, para mostrar "09:00 – 09:45". */
export function horaFin(evento) {
  const ini = aMinutos(evento.hora);
  if (ini == null) return '';
  return aHora(Math.min(ini + (Number(evento.duracion) || 30), 24 * 60 - 1));
}

/** Orden por hora que no explota si a alguna fila le falta la hora. */
export const porHora = (a, b) => (aMinutos(a.hora) ?? 9999) - (aMinutos(b.hora) ?? 9999);

// ---------------------------------------------------------------------------
// Carga del día
// ---------------------------------------------------------------------------

/**
 * Cuánto ocupa un día. Sólo cuentan los compromisos vivos: lo cancelado no
 * ocupa tiempo, y lo cumplido tampoco te queda por hacer.
 *
 * `pct` se calcula contra las horas de la jornada, y se deja pasar de 100 a
 * propósito. Un día al 140% es información: significa que no entra, y taparlo
 * en 100 sería justamente esconder el problema que el número tiene que avisar.
 */
export function cargaDelDia(eventos) {
  const vivos = eventos.filter((e) => e.estado === 'pendiente');
  const minutos = vivos.reduce((a, e) => a + (Number(e.duracion) || 0), 0);
  const pct = (minutos / ((20 - 8) * 60)) * 100;
  return {
    minutos,
    horas: minutos / 60,
    pct,
    eventos: vivos.length,
    lleno: pct >= 85,
    excedido: pct > 100,
  };
}

export const horasYminutos = (minutos) => {
  const h = Math.floor(minutos / 60);
  const m = Math.round(minutos % 60);
  if (!h) return `${m} min`;
  return m ? `${h} h ${m} min` : `${h} h`;
};

// ---------------------------------------------------------------------------
// Superposiciones
// ---------------------------------------------------------------------------

/**
 * Reparte los compromisos de un día en carriles para que dos que se pisan se
 * dibujen uno al lado del otro en vez de uno encima del otro. Devuelve cada
 * evento con {carril, carriles} y también marca `pisa`, que es lo que después
 * se avisa: dos cosas a la misma hora casi siempre es un error de carga.
 */
export function repartirEnCarriles(eventos) {
  const ordenados = eventos
    .filter((e) => aMinutos(e.hora) != null)
    .slice()
    .sort(porHora);

  const grupos = [];
  let actual = [];
  let finGrupo = -1;

  ordenados.forEach((e) => {
    const ini = aMinutos(e.hora);
    const fin = ini + (Number(e.duracion) || 30);
    if (actual.length && ini >= finGrupo) {
      grupos.push(actual);
      actual = [];
      finGrupo = -1;
    }
    actual.push(e);
    finGrupo = Math.max(finGrupo, fin);
  });
  if (actual.length) grupos.push(actual);

  const salida = [];
  grupos.forEach((grupo) => {
    const carriles = []; // fin de cada carril
    grupo.forEach((e) => {
      const ini = aMinutos(e.hora);
      const fin = ini + (Number(e.duracion) || 30);
      let carril = carriles.findIndex((f) => ini >= f);
      if (carril === -1) {
        carriles.push(fin);
        carril = carriles.length - 1;
      } else {
        carriles[carril] = fin;
      }
      salida.push({ evento: e, carril, ini, fin });
    });
    const total = carriles.length;
    salida.slice(-grupo.length).forEach((s) => {
      s.carriles = total;
      s.pisa = total > 1;
    });
  });

  return salida;
}
