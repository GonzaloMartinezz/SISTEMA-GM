// ============================================================================
// SISTEMA GM · EQUIPAMIENTOS · CONTEXTO
// ============================================================================

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { listarEquipos, resumirInventario } from '../../../shared/inventario/inventarioService';
import { CATEGORIAS, TIPOS } from '../config/inventario.config';

const InventarioContext = createContext(null);

export function InventarioProvider({ children }) {
  const [equipos, setEquipos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [categorias, setCategorias] = useState(() => [...CATEGORIAS]);
  const [tipos, setTipos] = useState(() => [...TIPOS]);
  const [soloAlertas, setSoloAlertas] = useState(false);

  useEffect(() => {
    let vivo = true;
    listarEquipos()
      .then((data) => vivo && setEquipos(data))
      .finally(() => vivo && setCargando(false));
    return () => {
      vivo = false;
    };
  }, []);

  const toggleCategoria = useCallback(
    (c) => setCategorias((p) => (p.includes(c) ? p.filter((x) => x !== c) : [...p, c])),
    []
  );
  const toggleTipo = useCallback(
    (t) => setTipos((p) => (p.includes(t) ? p.filter((x) => x !== t) : [...p, t])),
    []
  );

  const visibles = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    return equipos.filter((e) => {
      if (!categorias.includes(e.categoria)) return false;
      if (!tipos.includes(e.tipo)) return false;
      if (soloAlertas && !['bajo', 'sin-stock'].includes(e.estadoStock)) return false;
      if (!q) return true;
      return [e.nombre, e.marca, e.modelo, e.id].some((c) =>
        String(c).toLowerCase().includes(q)
      );
    });
  }, [equipos, categorias, tipos, soloAlertas, busqueda]);

  const resumen = useMemo(() => resumirInventario(equipos), [equipos]);

  const value = useMemo(
    () => ({
      equipos,
      visibles,
      resumen,
      cargando,
      busqueda,
      setBusqueda,
      categorias,
      toggleCategoria,
      tipos,
      toggleTipo,
      soloAlertas,
      setSoloAlertas,
    }),
    [
      equipos,
      visibles,
      resumen,
      cargando,
      busqueda,
      categorias,
      toggleCategoria,
      tipos,
      toggleTipo,
      soloAlertas,
    ]
  );

  return <InventarioContext.Provider value={value}>{children}</InventarioContext.Provider>;
}

export function useInventario() {
  const ctx = useContext(InventarioContext);
  if (!ctx) throw new Error('useInventario debe usarse dentro de <InventarioProvider>.');
  return ctx;
}

export default InventarioContext;
