// ============================================================================
// SISTEMA GM · M-06 · BUSCADOR DEL MÓDULO
// ----------------------------------------------------------------------------
// Busca en el texto de las notas, en sus etiquetas y en el nombre de la cosa a
// la que están pegadas. Es lo que permite escribir "autoclave" y encontrar la
// nota, sin acordarse de si la escribiste sobre el equipo o sobre el proveedor.
// ============================================================================

import React from 'react';
import Buscador from '../../../shared/gm-ui/Buscador';
import { useNotario } from '../context/NotarioContext';

export default function BuscadorGlobal() {
  const { busqueda, setBusqueda } = useNotario();

  return (
    <Buscador
      valor={busqueda}
      onChange={setBusqueda}
      placeholder="Buscar en todo lo anotado…"
      className="w-[220px] xl:w-[300px]"
    />
  );
}
