// ============================================================================
// SISTEMA GM · M-02 EQUIPAMIENTOS · CONTROL DE STOCK
// ----------------------------------------------------------------------------
// La pantalla de todos los días: cuánto hay de cada cosa y los tres botones que
// resuelven el 100% de los casos — vendí uno, compré uno, llegó el envío.
//
// El descuento no se hace acá: se llama a gm_mover_stock, que anota el
// movimiento y ajusta el stock en la misma transacción. Si algo falla, no queda
// media operación hecha.
// ============================================================================

import React, { useMemo, useState } from 'react';
import { AlertTriangle, Boxes, PackageX, Truck } from 'lucide-react';
import { useEquipos } from '../context/EquiposContext';
import Panel from '../../../shared/gm-ui/Panel';
import Buscador from '../../../shared/gm-ui/Buscador';
import TarjetaKpi from '../../../shared/gm-ui/TarjetaKpi';
import { usd } from '../../../shared/gm-ui/graficos';
import FiltrosCategoria from '../components/basedatos/FiltrosCategoria';
import TablaStock from '../components/stock/TablaStock';
import MovimientoModal from '../components/stock/MovimientoModal';
import HistorialMovimientos from '../components/stock/HistorialMovimientos';
import AlertasReposicion from '../components/stock/AlertasReposicion';

const texto = (e) =>
  [e.codigo, e.nombre, e.marca, e.modelo, e.rubro].filter(Boolean).join(' ').toLowerCase();

export default function StockView() {
  const { equipos, movimientos, porRubro, resumen, cargando, registrarMovimiento } = useEquipos();

  const [busqueda, setBusqueda] = useState('');
  const [rubro, setRubro] = useState(null);
  const [soloCriticos, setSoloCriticos] = useState(false);
  const [orden, setOrden] = useState({ clave: 'stock', dir: 'asc' });
  const [movimiento, setMovimiento] = useState(null); // { equipo, tipo }
  const [aviso, setAviso] = useState('');

  const filtrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    const lista = equipos.filter((e) => {
      if (rubro && e.rubro !== rubro) return false;
      if (soloCriticos && e.stock > e.minStock) return false;
      return !q || texto(e).includes(q);
    });
    const dir = orden.dir === 'asc' ? 1 : -1;
    return [...lista].sort((a, b) => {
      const va = a[orden.clave];
      const vb = b[orden.clave];
      if (va == null) return 1;
      if (vb == null) return -1;
      if (typeof va === 'number' && typeof vb === 'number') return (va - vb) * dir;
      return String(va).localeCompare(String(vb), 'es') * dir;
    });
  }, [equipos, rubro, busqueda, soloCriticos, orden]);

  const ordenar = (clave) =>
    setOrden((o) => (o.clave === clave ? { clave, dir: o.dir === 'asc' ? 'desc' : 'asc' } : { clave, dir: 'asc' }));

  const confirmar = async (datos) => {
    const r = await registrarMovimiento(datos);
    setAviso(
      `${r.nombre}: quedan ${r.stock} en depósito` +
      (r.stock < r.min_stock ? ` — por debajo del mínimo de ${r.min_stock}` : '')
    );
    setTimeout(() => setAviso(''), 6000);
  };

  return (
    <div className="space-y-6">
      {/* ----------------------------- Indicadores ---------------------------- */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <TarjetaKpi
          etiqueta="Unidades en depósito"
          valor={resumen.unidades}
          detalle={`${resumen.total} equipos distintos`}
          icono={Boxes}
          tono="naranja"
        />
        <TarjetaKpi
          etiqueta="En camino"
          valor={resumen.enTransito}
          detalle="compradas y sin llegar"
          icono={Truck}
          tono="azul"
        />
        <TarjetaKpi
          etiqueta="Sin stock"
          valor={resumen.sinStock}
          detalle="no se pueden vender hoy"
          icono={PackageX}
          tono="naranja"
          tendencia={resumen.sinStock > 0 ? 'baja' : 'igual'}
        />
        <TarjetaKpi
          etiqueta="Capital en depósito"
          valor={usd(resumen.inmovilizado)}
          detalle="valuado al costo"
          icono={Boxes}
          tono="azul"
        />
      </div>

      {aviso && (
        <div className="flex items-start gap-2 rounded-xl border border-[#CDE4D9] bg-[#DFF0E8] px-4 py-3 text-[13px] text-[#1F6F53]">
          <AlertTriangle size={15} className="mt-0.5 shrink-0" />
          <span>{aviso}</span>
        </div>
      )}

      {/* ------------------------------- Tabla -------------------------------- */}
      <Panel
        titulo="Stock por equipo"
        bajada={`${filtrados.length} de ${equipos.length} equipos · los botones de la derecha registran salida, ingreso y llegada`}
        cuerpoClassName="p-0"
      >
        <div className="flex flex-col gap-4 border-b border-[#F0EAE1] dark:border-[#333333] px-6 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <FiltrosCategoria rubros={porRubro} valor={rubro} onChange={setRubro} total={equipos.length} />
            <button
              type="button"
              onClick={() => setSoloCriticos((v) => !v)}
              className={`rounded-full border px-3.5 py-2 text-[13px] transition ${
                soloCriticos
                  ? 'border-[#B4551A] bg-[#FBE5C8] dark:bg-[#2A1608] text-[#8A3F11]'
                  : 'border-[#E8E0D5] dark:border-[#333333] bg-[#FFFFFF] dark:bg-[#1E1E1E] text-[#6E6559] dark:text-[#9CA3AF] hover:border-[#D5CABA]'
              }`}
            >
              Sólo lo que falta
            </button>
          </div>

          <Buscador
            valor={busqueda}
            onChange={setBusqueda}
            placeholder="Buscar equipo…"
            className="w-full lg:w-[300px]"
          />
        </div>

        {cargando ? (
          <div className="px-6 py-16 text-center text-[14px] text-[#948A7C]">Cargando stock…</div>
        ) : (
          <TablaStock
            equipos={filtrados}
            orden={orden}
            onOrdenar={ordenar}
            onMovimiento={(equipo, tipo) => setMovimiento({ equipo, tipo })}
          />
        )}
      </Panel>

      {/* -------------------- Reposición + historial -------------------------- */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Panel titulo="Para reponer" bajada="Lo que está en el mínimo o por debajo, ordenado por urgencia.">
          <AlertasReposicion
            equipos={equipos}
            onReponer={(equipo, tipo) => setMovimiento({ equipo, tipo })}
          />
        </Panel>

        <Panel titulo="Últimos movimientos" bajada="Todo lo que entró y salió, con su motivo.">
          <HistorialMovimientos movimientos={movimientos} />
        </Panel>
      </div>

      {movimiento && (
        <MovimientoModal
          equipo={movimiento.equipo}
          tipo={movimiento.tipo}
          onCerrar={() => setMovimiento(null)}
          onConfirmar={confirmar}
        />
      )}
    </div>
  );
}
