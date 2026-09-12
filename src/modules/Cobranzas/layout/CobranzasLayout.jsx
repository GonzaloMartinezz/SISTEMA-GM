// ============================================================================
// SISTEMA GM · M-07 COBRANZAS · LAYOUT DEL MÓDULO
// ============================================================================

import React from 'react';
import { ShieldAlert } from 'lucide-react';
import LayoutModulo from '../../../shared/gm-ui/LayoutModulo';
import Buscador from '../../../shared/gm-ui/Buscador';
import { SECCIONES } from '../config/secciones.config';
import { CobranzasProvider, useCobranzas } from '../context/CobranzasContext';

function Cuerpo() {
  const { cargando, error, recargar, ultimoCambio, busqueda, setBusqueda } = useCobranzas();

  return (
    <LayoutModulo
      idModulo="cobranzas"
      numero={7}
      nombre="Cobranzas"
      icono={ShieldAlert}
      secciones={SECCIONES}
      cargando={cargando}
      error={error}
      onRecargar={recargar}
      ultimoCambio={ultimoCambio}
      acciones={
        <Buscador
          valor={busqueda}
          onChange={setBusqueda}
          placeholder="Buscar cliente, venta o equipo…"
          className="w-[220px] xl:w-[280px]"
        />
      }
    />
  );
}

export default function CobranzasLayout() {
  return (
    <CobranzasProvider>
      <Cuerpo />
    </CobranzasProvider>
  );
}
