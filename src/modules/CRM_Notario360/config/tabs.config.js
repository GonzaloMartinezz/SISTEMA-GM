// ============================================================================
// SISTEMA GM · NOTARIO 360° · DEFINICIÓN DE PESTAÑAS
// ----------------------------------------------------------------------------
// Las seis pestañas tabuladas del módulo. Se navegan sin recargar la página.
// ============================================================================

import {
  FileText,
  MapPin,
  Gauge,
  Receipt,
  ArrowLeftRight,
  History,
} from 'lucide-react';

export const NOTARIO_TABS = [
  { id: 'generales', label: 'Generales', short: 'GRAL', icon: FileText, desc: 'Estado, bloqueos y datos contractuales' },
  { id: 'domicilios', label: 'Domicilios', short: 'DOM', icon: MapPin, desc: 'Particular, postal y laboral' },
  { id: 'margenes', label: 'Márgenes', short: 'MARG', icon: Gauge, desc: 'Asignados, libres y períodos' },
  { id: 'pagos', label: 'Pagos', short: 'PAGOS', icon: Receipt, desc: 'Mínimos elegidos y pagos efectuados' },
  { id: 'movimientos', label: 'Movimientos', short: 'MOV', icon: ArrowLeftRight, desc: 'Consumos y cuotas por período' },
  { id: 'historiales', label: 'Historiales', short: 'HIST', icon: History, desc: 'Llamados, notas y visitas' },
];

export const TAB_POR_DEFECTO = 'generales';

export default NOTARIO_TABS;
