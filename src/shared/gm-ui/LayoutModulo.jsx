// ============================================================================
// SISTEMA GM · UI · CAPARAZÓN DE MÓDULO
// ----------------------------------------------------------------------------
// Barra lateral + encabezado + área de contenido. Todos los módulos usan este
// mismo caparazón, así moverse entre Clientes y Equipamientos no obliga a
// reaprender dónde está cada cosa.
//
// gm-escala: el módulo se dibuja al 80% para que entre más información en
// pantalla sin achicar cada componente a mano (ver index.css).
//
// idModulo: si se pasa, todo el contenido queda envuelto en <TemaProvider>,
// con su propio interruptor claro/oscuro en el encabezado y su propia
// preferencia guardada (un módulo puede quedar en oscuro y otro en claro, a
// propósito — ver TemaProvider.jsx). Si no se pasa, el módulo se comporta
// exactamente como siempre: sólo modo claro, sin interruptor.
// ============================================================================

import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import BarraLateralModulo from './BarraLateralModulo';
import EncabezadoSeccion from './EncabezadoSeccion';
import { TemaProvider, useTema } from './TemaProvider';

function LayoutModuloInterior({
  numero,
  nombre,
  icono,
  secciones = [],
  cargando,
  error,
  onRecargar,
  ultimoCambio,
  acciones,
}) {
  const { tema, variablesCss, tinte } = useTema();
  const [menuAbierto, setMenuAbierto] = useState(false);

  return (
    <div
      className="gm-escala flex h-full w-full flex-col bg-[var(--gm-fondo)] text-[var(--gm-texto)] lg:flex-row relative"
      data-tema={tema}
      style={variablesCss}
    >
      {/* Overlay para móvil */}
      {menuAbierto && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMenuAbierto(false)}
        />
      )}

      <BarraLateralModulo
        numero={numero}
        nombre={nombre}
        icono={icono}
        secciones={secciones}
        menuAbierto={menuAbierto}
        setMenuAbierto={setMenuAbierto}
      />

      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <EncabezadoSeccion
          modulo={nombre}
          secciones={secciones}
          onRecargar={onRecargar}
          cargando={cargando}
          ultimoCambio={ultimoCambio}
          acciones={acciones}
          setMenuAbierto={setMenuAbierto}
        />

        {error && (
          <div
            className="mx-6 mt-4 flex items-start gap-2 rounded-xl border px-4 py-3 text-[13px] lg:mx-8"
            style={{
              backgroundColor: tinte.peligro.bg,
              borderColor: tinte.peligro.borde,
              color: tinte.peligro.fg,
            }}
          >
            <AlertTriangle size={15} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <main className="min-h-0 flex-1 overflow-y-auto px-6 py-6 lg:px-8 lg:py-7">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default function LayoutModulo(props) {
  if (!props.idModulo) {
    // Compatibilidad: sin idModulo, ningún módulo nuevo se ve afectado — se
    // renderiza igual que siempre, sin proveedor de tema ni interruptor.
    return <LayoutModuloInterior {...props} />;
  }
  return (
    <TemaProvider idModulo={props.idModulo}>
      <LayoutModuloInterior {...props} />
    </TemaProvider>
  );
}
