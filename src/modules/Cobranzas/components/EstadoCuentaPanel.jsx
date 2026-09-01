// ============================================================================
// SISTEMA GM · COBRANZAS · ESTADO DE CUENTA Y CONTACTO
// ============================================================================

import React from 'react';
import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react';
import PanelTerminal, { Campo } from '../../../shared/ui/PanelTerminal';

const soloDigitos = (v = '') => String(v).replace(/\D/g, '');

export default function EstadoCuentaPanel({ cuenta }) {
  if (!cuenta) return null;

  const { titular, domicilios = [], cuenta: datos } = cuenta;
  const cel = soloDigitos(titular.celular || titular.telefono);
  const enMora = String(datos.estado).toUpperCase().includes('MORA');

  return (
    <div className="space-y-3">
      {/* Titular */}
      <PanelTerminal titulo="Estado de cuenta" acento={enMora ? 'rojo' : 'verde'}>
        <div className="grid grid-cols-2 gap-3 p-3">
          <Campo label="Apellido" >{titular.apellido}</Campo>
          <Campo label="Nombre">{titular.nombre}</Campo>
          <Campo label="DNI">{titular.dni}</Campo>
          <Campo label="CUIT / CUIL">{titular.cuit}</Campo>
          <Campo label="Nº de cuenta" className="col-span-2">
            {datos.numero}
          </Campo>
          <Campo label="Estado">
            <span className={enMora ? 'font-bold text-rose-400' : 'font-bold text-emerald-400'}>
              {datos.estado}
            </span>
          </Campo>
          <Campo label="Bloqueos">{datos.bloqueos}</Campo>
        </div>
      </PanelTerminal>

      {/* Contacto directo */}
      <PanelTerminal titulo="Información de contacto">
        <div className="space-y-2 p-3">
          <div className="grid grid-cols-2 gap-3">
            <Campo label="Teléfono">{titular.telefono}</Campo>
            <Campo label="Celular">{titular.celular}</Campo>
            <Campo label="Email" className="col-span-2">
              <span className="break-all">{titular.email || 'No registrado'}</span>
            </Campo>
          </div>

          <div className="flex gap-1.5 pt-1">
            <a
              href={cel ? `tel:+54${cel}` : undefined}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded border border-cyan-600/40 bg-cyan-500/10 py-1.5 font-mono text-[9px] font-bold uppercase tracking-widest text-cyan-400 transition-colors hover:bg-cyan-500/20 ${cel ? '' : 'pointer-events-none opacity-30'}`}
            >
              <Phone className="h-3 w-3" />
              Llamar
            </a>
            <a
              href={cel ? `https://wa.me/54${cel}` : undefined}
              target="_blank"
              rel="noreferrer"
              className={`flex flex-1 items-center justify-center gap-1.5 rounded border border-emerald-600/40 bg-emerald-500/10 py-1.5 font-mono text-[9px] font-bold uppercase tracking-widest text-emerald-400 transition-colors hover:bg-emerald-500/20 ${cel ? '' : 'pointer-events-none opacity-30'}`}
            >
              <MessageCircle className="h-3 w-3" />
              WhatsApp
            </a>
            <a
              href={titular.email ? `mailto:${titular.email}` : undefined}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded border border-gray-700 py-1.5 font-mono text-[9px] font-bold uppercase tracking-widest text-gray-400 transition-colors hover:text-white ${titular.email ? '' : 'pointer-events-none opacity-30'}`}
            >
              <Mail className="h-3 w-3" />
              Mail
            </a>
          </div>
        </div>
      </PanelTerminal>

      {/* Domicilios */}
      <PanelTerminal titulo="Domicilios registrados" acento="gris">
        <ul className="divide-y divide-gray-800">
          {domicilios.map((d, i) => (
            <li key={i} className="flex items-start gap-2 p-3">
              <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gray-600" />
              <div className="min-w-0 font-mono text-[11px] leading-relaxed">
                <p className="font-bold uppercase tracking-wider text-gray-500">{d.tipo}</p>
                <p className="uppercase text-gray-200">
                  {d.calle} Nº {d.numero}
                </p>
                <p className="uppercase text-gray-400">
                  ({d.cp}) {d.localidad} · {d.provincia}
                </p>
                {d.telefono && <p className="text-gray-500">Tel: {d.telefono}</p>}
              </div>
            </li>
          ))}
          {!domicilios.length && (
            <li className="p-3 font-mono text-[10px] uppercase tracking-wider text-gray-600">
              Sin domicilios registrados
            </li>
          )}
        </ul>
      </PanelTerminal>
    </div>
  );
}
