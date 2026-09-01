// ============================================================================
// SISTEMA GM · CAPA COMPARTIDA · CONTEXTO DE LA CUENTA ACTIVA
// ----------------------------------------------------------------------------
// La cabecera persistente, la botonera y las seis pestañas leen todas de acá.
// Ninguna pestaña vuelve a pedir datos por su cuenta.
// ============================================================================

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { obtenerCuenta, guardarNota, guardarLlamado } from './cuentasService';

const CuentaContext = createContext(null);

export function CuentaProvider({ cuentaId, children }) {
  const [cuenta, setCuenta] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let vivo = true;
    setCargando(true);
    setError(null);

    obtenerCuenta(cuentaId)
      .then((data) => {
        if (!vivo) return;
        if (!data) setError(`No se encontró la cuenta ${cuentaId || ''}.`);
        setCuenta(data);
      })
      .catch((err) => vivo && setError(err.message || 'Error al cargar la cuenta.'))
      .finally(() => vivo && setCargando(false));

    return () => {
      vivo = false;
    };
  }, [cuentaId]);

  const agregarNota = useCallback(
    async (nota) => {
      if (!cuenta) return;
      const guardada = await guardarNota(cuenta.id, nota);
      setCuenta((prev) => ({
        ...prev,
        historial: { ...prev.historial, notas: [guardada, ...prev.historial.notas] },
      }));
    },
    [cuenta]
  );

  const agregarLlamado = useCallback(
    async (llamado) => {
      if (!cuenta) return;
      const guardado = await guardarLlamado(cuenta.id, llamado);
      setCuenta((prev) => ({
        ...prev,
        historial: { ...prev.historial, llamados: [guardado, ...prev.historial.llamados] },
      }));
    },
    [cuenta]
  );

  const value = useMemo(
    () => ({ cuenta, cargando, error, agregarNota, agregarLlamado }),
    [cuenta, cargando, error, agregarNota, agregarLlamado]
  );

  return <CuentaContext.Provider value={value}>{children}</CuentaContext.Provider>;
}

export function useCuenta() {
  const ctx = useContext(CuentaContext);
  if (!ctx) throw new Error('useCuenta debe usarse dentro de <CuentaProvider>.');
  return ctx;
}

export default CuentaContext;
