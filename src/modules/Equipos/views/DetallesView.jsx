// ============================================================================
// SISTEMA GM · M-02 EQUIPAMIENTOS · INFORMACIÓN DETALLADA
// ----------------------------------------------------------------------------
// Dos columnas: a la izquierda el equipo, a la derecha todo lo que sabemos de
// él y el texto listo para copiar y mandarle al cliente por WhatsApp.
// El equipo elegido queda en la URL (?equipo=EQ-101), así se puede llegar
// directo desde la Base de Datos o guardar el enlace.
// ============================================================================

import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FileText } from 'lucide-react';
import { useEquipos } from '../context/EquiposContext';
import Panel from '../../../shared/gm-ui/Panel';
import EstadoVacio from '../../../shared/gm-ui/EstadoVacio';
import ListaEquipos from '../components/detalles/ListaEquipos';
import FichaTecnica from '../components/detalles/FichaTecnica';
import BloqueMensaje from '../components/detalles/BloqueMensaje';

const texto = (e) =>
  [e.codigo, e.nombre, e.marca, e.modelo, e.rubro].filter(Boolean).join(' ').toLowerCase();

export default function DetallesView() {
  const { equipos, specsPorEquipo, cargando, guardarFicha, borrarFicha } = useEquipos();
  const [params, setParams] = useSearchParams();
  const [busqueda, setBusqueda] = useState('');

  const seleccionado = params.get('equipo');

  // Si no hay nada elegido (o el elegido ya no existe), se toma el primero.
  useEffect(() => {
    if (cargando || !equipos.length) return;
    if (!seleccionado || !equipos.some((e) => e.codigo === seleccionado)) {
      setParams({ equipo: equipos[0].codigo }, { replace: true });
    }
  }, [cargando, equipos, seleccionado, setParams]);

  const filtrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    return q ? equipos.filter((e) => texto(e).includes(q)) : equipos;
  }, [equipos, busqueda]);

  const equipo = equipos.find((e) => e.codigo === seleccionado) || null;
  const specs = equipo ? specsPorEquipo.get(equipo.codigo) || [] : [];

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
      <Panel
        className="xl:col-span-4 xl:h-[calc(100vh-260px)]"
        titulo="Equipos"
        bajada="Elegí uno para ver su ficha completa."
        cuerpoClassName="p-0 min-h-0"
      >
        <ListaEquipos
          equipos={filtrados}
          seleccionado={seleccionado}
          onSeleccionar={(codigo) => setParams({ equipo: codigo })}
          busqueda={busqueda}
          onBuscar={setBusqueda}
        />
      </Panel>

      <div className="space-y-6 xl:col-span-8">
        <Panel titulo="Ficha técnica" bajada="Lo que necesitás saber vos, y lo que te van a preguntar.">
          {cargando ? (
            <p className="py-10 text-center text-[14px] text-[#948A7C]">Cargando ficha…</p>
          ) : equipo ? (
            <FichaTecnica
              equipo={equipo}
              specs={specs}
              onGuardarSpec={guardarFicha}
              onBorrarSpec={borrarFicha}
            />
          ) : (
            <EstadoVacio
              icono={FileText}
              titulo="Todavía no hay equipos cargados"
              texto="Cargá el primero desde la Base de Datos y su ficha aparece acá."
            />
          )}
        </Panel>

        {equipo && (
          <Panel
            titulo="Para mandarle al cliente"
            bajada="Copiás y pegás en WhatsApp o en un mail. Ya viene con el formato puesto."
          >
            <BloqueMensaje equipo={equipo} specs={specs} />
          </Panel>
        )}
      </div>
    </div>
  );
}
