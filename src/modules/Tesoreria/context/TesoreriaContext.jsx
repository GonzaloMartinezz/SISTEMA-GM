// ============================================================================
// SISTEMA GM · TESORERÍA · CONTEXTO
// ============================================================================

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { obtenerFinanzas } from '../../../shared/finanzas/finanzasService';
import { PARAMETROS } from '../../../shared/finanzas/finanzasDemo';

const TesoreriaContext = createContext(null);

export function TesoreriaProvider({ children }) {
  const [datos, setDatos] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [params, setParams] = useState(PARAMETROS);

  useEffect(() => {
    let vivo = true;
    setCargando(true);
    obtenerFinanzas(params)
      .then((d) => vivo && setDatos(d))
      .finally(() => vivo && setCargando(false));
    return () => {
      vivo = false;
    };
  }, [params]);

  const value = useMemo(
    () => ({ datos, cargando, params, setParams }),
    [datos, cargando, params]
  );

  return <TesoreriaContext.Provider value={value}>{children}</TesoreriaContext.Provider>;
}

export function useTesoreria() {
  const ctx = useContext(TesoreriaContext);
  if (!ctx) throw new Error('useTesoreria debe usarse dentro de <TesoreriaProvider>.');
  return ctx;
}

export default TesoreriaContext;
