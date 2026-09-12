// ============================================================================
// SISTEMA GM · M-03 · BUSCADOR DEL ENCABEZADO
// ----------------------------------------------------------------------------
// Busca por titular, negocio, equipo, zona o código. En pantallas chicas se
// achica pero no desaparece: es la forma más rápida de llegar a un lead.
// ============================================================================

import React from 'react';
import Buscador from '../../../shared/gm-ui/Buscador';
import { useSeguimientos } from '../context/SeguimientosContext';

export default function BuscadorLeads() {
  const { busqueda, setBusqueda } = useSeguimientos();

  return (
    <Buscador
      valor={busqueda}
      onChange={setBusqueda}
      placeholder="Buscar lead, negocio, equipo o zona…"
      className="w-[220px] xl:w-[300px]"
    />
  );
}
