// ============================================================================
// SISTEMA GM · M-02 EQUIPAMIENTOS · LAYOUT DEL MÓDULO
// ============================================================================

import React from 'react';
import { Package } from 'lucide-react';
import LayoutModulo from '../../../shared/gm-ui/LayoutModulo';
import { SECCIONES } from '../config/secciones.config';
import { EquiposProvider, useEquipos } from '../context/EquiposContext';

function Cuerpo() {
  const { cargando, error, recargar, ultimoCambio } = useEquipos();

  return (
    <LayoutModulo
      idModulo="equipos"
      numero={2}
      nombre="Equipamientos"
      icono={Package}
      secciones={SECCIONES}
      cargando={cargando}
      error={error}
      onRecargar={recargar}
      ultimoCambio={ultimoCambio}
    />
  );
}

export default function EquiposLayout() {
  return (
    <EquiposProvider>
      <Cuerpo />
    </EquiposProvider>
  );
}
