// ============================================================================
// SISTEMA GM · M-01 CLIENTES · LAYOUT DEL MÓDULO
// ----------------------------------------------------------------------------
// El caparazón es el compartido: acá sólo se dice qué módulo es, qué secciones
// tiene y de dónde salen los datos. El proveedor envuelve todo, así ninguna
// sección vuelve a pedir lo mismo.
// ============================================================================

import React from 'react';
import { Users } from 'lucide-react';
import LayoutModulo from '../../../shared/gm-ui/LayoutModulo';
import { SECCIONES } from '../config/secciones.config';
import { ClientesProvider, useClientes } from '../context/ClientesContext';

function Cuerpo() {
  const { cargando, error, recargar, ultimoCambio } = useClientes();

  return (
    <LayoutModulo
      idModulo="clientes"
      numero={1}
      nombre="Clientes"
      icono={Users}
      secciones={SECCIONES}
      cargando={cargando}
      error={error}
      onRecargar={recargar}
      ultimoCambio={ultimoCambio}
    />
  );
}

export default function ClientesLayout() {
  return (
    <ClientesProvider>
      <Cuerpo />
    </ClientesProvider>
  );
}
