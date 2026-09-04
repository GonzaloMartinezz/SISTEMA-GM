// ============================================================================
// SISTEMA GM · M-04 SEGUIMIENTOS · LAYOUT DEL MÓDULO
// ----------------------------------------------------------------------------
// El buscador vive en el encabezado, no dentro de una vista: filtra las cuatro
// secciones a la vez, así que tiene que estar donde se vea siempre.
// ============================================================================

import React from 'react';
import { Send } from 'lucide-react';
import LayoutModulo from '../../../shared/gm-ui/LayoutModulo';
import { SECCIONES } from '../config/secciones.config';
import { SeguimientosProvider, useSeguimientos } from '../context/SeguimientosContext';
import BuscadorLeads from '../components/BuscadorLeads';

function Cuerpo() {
  const { cargando, error, recargar, ultimoCambio } = useSeguimientos();

  return (
    <LayoutModulo
      numero={4}
      nombre="Seguimientos"
      icono={Send}
      secciones={SECCIONES}
      cargando={cargando}
      error={error}
      onRecargar={recargar}
      ultimoCambio={ultimoCambio}
      acciones={<BuscadorLeads />}
    />
  );
}

export default function SeguimientosLayout() {
  return (
    <SeguimientosProvider>
      <Cuerpo />
    </SeguimientosProvider>
  );
}
