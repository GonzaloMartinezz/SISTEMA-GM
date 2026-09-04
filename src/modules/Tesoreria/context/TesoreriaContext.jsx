// ============================================================================
// SISTEMA GM · TESORERÍA · CONTEXTO
// ============================================================================

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { obtenerFinanzas } from '../../../shared/finanzas/finanzasService';
import { PARAMETROS } from '../../../shared/finanzas/finanzasDemo';

const TesoreriaContext = createContext(null);

export function TesoreriaProvider({ children }) {
  const [datos, setDatos] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [params, setParams] = useState(PARAMETROS);

  const recargar = useCallback(async () => {
    setCargando(true);
    try {
      setDatos(await obtenerFinanzas(params));
    } finally {
      setCargando(false);
    }
  }, [params]);

  useEffect(() => {
    recargar();
  }, [recargar]);

  const value = useMemo(
    () => ({ datos, cargando, params, setParams, recargar }),
    [datos, cargando, params, recargar]
  );

  return <TesoreriaContext.Provider value={value}>{children}</TesoreriaContext.Provider>;
}

export function useTesoreria() {
  const ctx = useContext(TesoreriaContext);
  if (!ctx) throw new Error('useTesoreria debe usarse dentro de <TesoreriaProvider>.');
  return ctx;
}

export default TesoreriaContext;
