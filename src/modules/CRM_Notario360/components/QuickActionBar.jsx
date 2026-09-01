// ============================================================================
// SISTEMA GM · NOTARIO 360° · BOTONERA DE ACCIONES RÁPIDAS
// ----------------------------------------------------------------------------
// Todo lo que se hace "en el momento de la negociación", a un clic.
// ============================================================================

import React from 'react';
import {
  Phone,
  MessageCircle,
  Mail,
  CalendarPlus,
  StickyNote,
  PhoneCall,
  Printer,
  MapPin,
} from 'lucide-react';

const soloDigitos = (valor = '') => String(valor).replace(/\D/g, '');

function AccionBoton({ icon: Icon, label, onClick, href, tono = 'neutro', disabled }) {
  const tonos = {
    neutro: 'border-gray-700 text-gray-300 hover:border-gray-500 hover:text-white hover:bg-gray-800',
    verde: 'border-emerald-600/40 text-emerald-400 hover:border-emerald-500 hover:bg-emerald-500/10',
    cyan: 'border-cyan-600/40 text-cyan-400 hover:border-cyan-500 hover:bg-cyan-500/10',
    ambar: 'border-amber-600/40 text-amber-400 hover:border-amber-500 hover:bg-amber-500/10',
  };

  const clases = `inline-flex items-center gap-1.5 rounded-md border bg-gray-900/60 px-2.5 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.12em] transition-all disabled:cursor-not-allowed disabled:opacity-30 ${tonos[tono]}`;

  if (href && !disabled) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={clases} title={label}>
        <Icon className="h-3.5 w-3.5 shrink-0" />
        <span className="hidden sm:inline">{label}</span>
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} disabled={disabled} className={clases} title={label}>
      <Icon className="h-3.5 w-3.5 shrink-0" />
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

export default function QuickActionBar({ cuenta, onNuevaNota, onRegistrarLlamado, onAgendar }) {
  if (!cuenta) return null;

  const { titular, domicilios = [] } = cuenta;
  const celular = soloDigitos(titular.celular || titular.telefono);
  const domicilioPrincipal = domicilios[0];
  const direccionMaps = domicilioPrincipal
    ? encodeURIComponent(
        `${domicilioPrincipal.calle} ${domicilioPrincipal.numero}, ${domicilioPrincipal.localidad}, ${domicilioPrincipal.provincia}`
      )
    : null;

  const saludo = `Hola ${titular.nombre}, te escribo de Sistema GM por tu cuenta ${cuenta.id}.`;

  return (
    <div className="flex shrink-0 flex-wrap items-center gap-1.5 border-b border-gray-800 bg-gray-950/60 px-4 py-2 md:px-6">
      <span className="mr-1 hidden font-mono text-[9px] uppercase tracking-[0.25em] text-gray-600 lg:inline">
        Acciones
      </span>

      <AccionBoton
        icon={Phone}
        label="Llamar"
        href={celular ? `tel:+54${celular}` : null}
        disabled={!celular}
        tono="cyan"
      />
      <AccionBoton
        icon={MessageCircle}
        label="WhatsApp"
        href={celular ? `https://wa.me/54${celular}?text=${encodeURIComponent(saludo)}` : null}
        disabled={!celular}
        tono="verde"
      />
      <AccionBoton
        icon={Mail}
        label="Email"
        href={titular.email ? `mailto:${titular.email}` : null}
        disabled={!titular.email}
      />
      <AccionBoton
        icon={MapPin}
        label="Cómo llegar"
        href={direccionMaps ? `https://www.google.com/maps/search/?api=1&query=${direccionMaps}` : null}
        disabled={!direccionMaps}
      />

      <span className="mx-1 hidden h-5 w-px bg-gray-800 sm:block" />

      <AccionBoton icon={PhoneCall} label="Grabar respuesta" onClick={onRegistrarLlamado} tono="ambar" />
      <AccionBoton icon={StickyNote} label="Nota estratégica" onClick={onNuevaNota} tono="ambar" />
      <AccionBoton icon={CalendarPlus} label="Agendar" onClick={onAgendar} />

      <span className="mx-1 hidden h-5 w-px bg-gray-800 sm:block" />

      <AccionBoton icon={Printer} label="Imprimir" onClick={() => window.print()} />
    </div>
  );
}
