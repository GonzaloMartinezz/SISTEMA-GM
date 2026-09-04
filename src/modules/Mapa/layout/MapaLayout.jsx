// ============================================================================
// SISTEMA GM · M-07 MAPA Y LOGÍSTICA · LAYOUT DEL MÓDULO
// ============================================================================

import React from 'react';
import { Map } from 'lucide-react';
import LayoutModulo from '../../../shared/gm-ui/LayoutModulo';
import Buscador from '../../../shared/gm-ui/Buscador';
import { SECCIONES } from '../config/secciones.config';
import { MapaProvider, useMapa } from '../context/MapaContext';

function Cuerpo() {
  const { cargando, error, recargar, ultimoCambio, busqueda, setBusqueda } = useMapa();

  return (
    <LayoutModulo
      numero={7}
      nombre="Mapa y Logística"
      icono={Map}
      secciones={SECCIONES}
      cargando={cargando}
      error={error}
      onRecargar={recargar}
      ultimoCambio={ultimoCambio}
      acciones={
        <Buscador
          valor={busqueda}
          onChange={setBusqueda}
          placeholder="Buscar cliente, zona o dirección…"
          className="w-[220px] xl:w-[280px]"
        />
      }
    />
  );
}

export default function MapaLayout() {
  return (
    <MapaProvider>
      <Cuerpo />
    </MapaProvider>
  );
}
