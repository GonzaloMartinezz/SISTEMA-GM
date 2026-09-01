// ============================================================================
// SISTEMA GM · EQUIPAMIENTOS · ESTADOS DE STOCK
// ============================================================================

export const ESTADOS_STOCK = {
  'sin-stock': { label: 'Sin stock', clase: 'text-rose-400', borde: 'border-rose-500/40 bg-rose-500/10' },
  bajo: { label: 'Stock bajo', clase: 'text-amber-400', borde: 'border-amber-500/40 bg-amber-500/10' },
  normal: { label: 'Normal', clase: 'text-emerald-400', borde: 'border-emerald-500/40 bg-emerald-500/10' },
  sobrestock: { label: 'Sobrestock', clase: 'text-sky-400', borde: 'border-sky-500/40 bg-sky-500/10' },
};

export const getEstadoStock = (id) => ESTADOS_STOCK[id] || ESTADOS_STOCK.normal;

export const CATEGORIAS = ['Odontología', 'Veterinaria', 'Diagnóstico'];
export const TIPOS = ['Equipo Pesado', 'Consumible'];
