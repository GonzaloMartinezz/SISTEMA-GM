// ============================================================================
// SISTEMA GM · MAPA Y LOGÍSTICA · MARCADORES INTELIGENTES
// ----------------------------------------------------------------------------
// El color del pin lo define el estado del cliente, no la especialidad.
// ============================================================================

export const ESTADOS_CLIENTE = {
  corriente: {
    label: 'Al día',
    color: '#34d399',
    clase: 'text-emerald-400',
    borde: 'border-emerald-500/40 bg-emerald-500/10',
  },
  mora: {
    label: 'En mora',
    color: '#fb7185',
    clase: 'text-rose-400',
    borde: 'border-rose-500/40 bg-rose-500/10',
  },
  lead: {
    label: 'Lead',
    color: '#38bdf8',
    clase: 'text-sky-400',
    borde: 'border-sky-500/40 bg-sky-500/10',
  },
};

export const getEstadoCliente = (id) => ESTADOS_CLIENTE[id] || ESTADOS_CLIENTE.lead;

export const ESPECIALIDADES = ['Odontología', 'Veterinaria', 'Diagnóstico'];

/** Clave de Google Maps (opcional). Sin clave se usa el mapa esquemático. */
export const GOOGLE_MAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
