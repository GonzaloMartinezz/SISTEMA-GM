// ============================================================================
// SISTEMA GM · M-05 AGENDA INTELIGENTE · LAYOUT DEL MÓDULO
// ----------------------------------------------------------------------------
// El navegador de fechas vive en el encabezado porque manda sobre las cuatro
// secciones a la vez: es el "dónde estoy parado" del módulo entero.
// ============================================================================

import React from 'react';
import { CalendarClock } from 'lucide-react';
import LayoutModulo from '../../../shared/gm-ui/LayoutModulo';
import { SECCIONES } from '../config/secciones.config';
import { AgendaProvider, useAgenda } from '../context/AgendaContext';
import NavegadorFecha from '../components/NavegadorFecha';

function Cuerpo() {
  const { cargando, error, recargar, ultimoCambio } = useAgenda();

  return (
    <LayoutModulo
      numero={5}
      nombre="Agenda Inteligente"
      icono={CalendarClock}
      secciones={SECCIONES}
      cargando={cargando}
      error={error}
      onRecargar={recargar}
      ultimoCambio={ultimoCambio}
      acciones={<NavegadorFecha />}
    />
  );
}

export default function AgendaLayout() {
  return (
    <AgendaProvider>
      <Cuerpo />
    </AgendaProvider>
  );
}
