// ============================================================================
// SISTEMA GM · UI · BARRA LATERAL DE MÓDULO
// ----------------------------------------------------------------------------
// La misma navegación para todos los módulos: rail neutro, sección activa
// marcada con tinte y una barrita al costado. En escritorio queda fija a la
// izquierda; en mobile se convierte en una tira horizontal que scrollea.
// Cada módulo sólo aporta su número, su nombre, su ícono y sus secciones.
// ============================================================================

import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LogOut, X } from 'lucide-react';

export default function BarraLateralModulo({ numero, nombre, icono: Icono, secciones = [], menuAbierto, setMenuAbierto }) {
  const navigate = useNavigate();

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 w-64 lg:w-[264px] flex shrink-0 flex-col bg-[var(--gm-superficie)] border-r border-[var(--gm-borde)] transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${
        menuAbierto ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* Identidad del módulo */}
      <div className="flex items-center gap-3 px-6 py-6">
        {Icono && (
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[var(--gm-acento-suave-bg)] text-[var(--gm-acento)] shrink-0">
            <Icono size={21} strokeWidth={2} />
          </span>
        )}
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--gm-texto-medio)] truncate">
            Módulo {numero}
          </p>
          <p className="text-[17px] leading-tight text-[var(--gm-texto)] truncate">{nombre}</p>
        </div>
        <button
          type="button"
          onClick={() => setMenuAbierto(false)}
          className="lg:hidden p-2 -mr-2 rounded-xl text-[var(--gm-texto-medio)] hover:bg-[var(--gm-superficie-fuerte)] hover:text-[var(--gm-texto)] transition-colors shrink-0"
        >
          <X size={20} strokeWidth={2} />
        </button>
      </div>

      {/* Secciones */}
      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-2">
        {secciones.map((s) => (
          <NavLink
            key={s.id}
            to={s.ruta}
            onClick={() => setMenuAbierto(false)}
            className={({ isActive }) =>
              `group relative flex items-center gap-3 rounded-xl px-3.5 py-3 text-[14px] transition-colors shrink-0 ${
                isActive
                  ? 'bg-[var(--gm-acento-suave-bg)] text-[var(--gm-acento-fuerte)]'
                  : 'text-[var(--gm-texto-medio)] hover:bg-[var(--gm-superficie-fuerte)] hover:text-[var(--gm-texto)]'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span
                    className="absolute inset-y-2 left-0 w-[3px] rounded-r bg-[var(--gm-acento)]"
                    aria-hidden="true"
                  />
                )}
                <s.icono
                  size={18}
                  strokeWidth={2}
                  className={
                    isActive
                      ? 'text-[var(--gm-acento)]'
                      : 'text-[var(--gm-texto-medio)] group-hover:text-[var(--gm-texto-medio)]'
                  }
                />
                <span className="whitespace-nowrap">{s.nombre}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Salida al Portal Hub */}
      <div className="border-t border-[var(--gm-divisor)] p-3">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-[14px] text-[var(--gm-texto-medio)] transition hover:bg-[var(--gm-superficie-fuerte)] hover:text-[var(--gm-texto)]"
        >
          <LogOut size={18} strokeWidth={2} className="text-[var(--gm-texto-medio)]" />
          Volver al Portal
        </button>
      </div>
    </aside>
  );
}
