// ============================================================================
// SISTEMA GM · M-09 TESORERÍA · LAYOUT DEL MÓDULO
// ============================================================================

import React from 'react';
import { Wallet } from 'lucide-react';
import LayoutModulo from '../../../shared/gm-ui/LayoutModulo';
import { SECCIONES } from '../config/secciones.config';
import { FinanzasProvider, useFinanzas } from '../context/FinanzasContext';
import MonedaControl from '../components/MonedaControl';
import SelectorPeriodo from '../components/SelectorPeriodo';

function Cuerpo() {
  const { cargando, error, recargar, ultimoCambio } = useFinanzas();

  return (
    <LayoutModulo
      idModulo="finanzas"
      numero={9}
      nombre="Tesorería"
      icono={Wallet}
      secciones={SECCIONES}
      cargando={cargando}
      error={error}
      onRecargar={recargar}
      ultimoCambio={ultimoCambio}
      acciones={
        <>
          <SelectorPeriodo />
          <MonedaControl />
        </>
      }
    />
  );
}

export default function FinanzasLayout() {
  return (
    <FinanzasProvider>
      <Cuerpo />
    </FinanzasProvider>
  );
}
