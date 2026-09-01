// ============================================================================
// SISTEMA GM · NOTARIO 360° · PESTAÑA 2 · DOMICILIOS
// ============================================================================

import React from 'react';
import { MapPin, Navigation } from 'lucide-react';
import { useCuenta } from '../../../shared/cuentas/CuentaContext';
import PanelTerminal, { Campo, SinDatos } from '../../../shared/ui/PanelTerminal';

const acentoPorTipo = (tipo = '') => {
  const t = tipo.toLowerCase();
  if (t.includes('laboral')) return 'ambar';
  if (t.includes('postal')) return 'gris';
  return 'cyan';
};

export default function TabDomicilios() {
  const { cuenta } = useCuenta();
  if (!cuenta) return null;

  const domicilios = cuenta.domicilios || [];

  if (!domicilios.length) {
    return (
      <PanelTerminal titulo="Domicilios" className="h-full">
        <SinDatos mensaje="La cuenta no tiene domicilios registrados" />
      </PanelTerminal>
    );
  }

  return (
    <div className="grid h-full min-h-0 auto-rows-min grid-cols-1 gap-3 overflow-auto pr-1 md:grid-cols-2 xl:grid-cols-3">
      {domicilios.map((dom, i) => {
        const consulta = encodeURIComponent(
          `${dom.calle} ${dom.numero}, ${dom.localidad}, ${dom.provincia}`
        );
        return (
          <PanelTerminal
            key={`${dom.tipo}-${i}`}
            titulo={`Domicilio ${dom.tipo}`}
            acento={acentoPorTipo(dom.tipo)}
            acciones={
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${consulta}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 font-mono text-[9px] uppercase tracking-[0.15em] text-gray-500 transition-colors hover:text-cyan-400"
              >
                <Navigation className="h-3 w-3" />
                Mapa
              </a>
            }
          >
            <div className="space-y-3 p-3">
              {dom.empresa && (
                <Campo label="Trabaja en">
                  <span className="font-bold text-cyan-300">{dom.empresa}</span>
                </Campo>
              )}

              <div className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gray-600" />
                <div className="font-mono text-xs leading-relaxed text-gray-200">
                  <p className="uppercase">
                    {dom.calle} Nº {dom.numero}
                  </p>
                  <p className="uppercase text-gray-400">
                    ({dom.cp}) · {dom.localidad}
                  </p>
                  <p className="uppercase text-gray-500">{dom.provincia}</p>
                  {dom.referencia && (
                    <p className="mt-1 text-[11px] text-gray-500">{dom.referencia}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 border-t border-gray-800 pt-3">
                <Campo label="Teléfono">{dom.telefono}</Campo>
                <Campo label="Tel. referencia">{dom.telefonoRef}</Campo>
                <Campo label="Email" className="col-span-2">
                  <span className="break-all">{dom.email || 'No registrado'}</span>
                </Campo>
              </div>
            </div>
          </PanelTerminal>
        );
      })}
    </div>
  );
}
