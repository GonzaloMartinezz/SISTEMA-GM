// ============================================================================
// SISTEMA GM · M-05 NOTARIO 360 · LAYOUT DEL MÓDULO
// ============================================================================

import React from 'react';
import { ScanFace } from 'lucide-react';
import LayoutModulo from '../../../shared/gm-ui/LayoutModulo';
import { SECCIONES } from '../config/secciones.config';
import { NotarioProvider, useNotario } from '../context/NotarioContext';
import BuscadorGlobal from '../components/BuscadorGlobal';

function Cuerpo() {
  const { cargando, error, recargar, ultimoCambio } = useNotario();

  return (
    <LayoutModulo
      idModulo="notario"
      numero={5}
      nombre="Notario 360°"
      icono={ScanFace}
      secciones={SECCIONES}
      cargando={cargando}
      error={error}
      onRecargar={recargar}
      ultimoCambio={ultimoCambio}
      acciones={<BuscadorGlobal />}
    />
  );
}

export default function NotarioLayout() {
  return (
    <NotarioProvider>
      <Cuerpo />
    </NotarioProvider>
  );
}
