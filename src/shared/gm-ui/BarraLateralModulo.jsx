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
import { LogOut } from 'lucide-react';

export default function BarraLateralModulo({ numero, nombre, icono: Icono, secciones = [] }) {
  const navigate = useNavigate();

  return (
    <aside className="flex shrink-0 flex-col border-b border-[var(--gm-borde)] bg-[var(--gm-superficie)] lg:h-full lg:w-[264px] lg:border-b-0 lg:border-r">
      {/* Identidad del módulo */}
      <div className="hidden items-center gap-3 px-6 py-6 lg:flex">
        {Icono && (
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[var(--gm-acento-suave-bg)] text-[var(--gm-acento)]">
            <Icono size={21} strokeWidth={2} />
          </span>
        )}
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--gm-texto-medio)]">
            Módulo {numero}
          </p>
          <p className="text-[17px] leading-tight text-[var(--gm-texto)]">{nombre}</p>
        </div>
      </div>

      {/* Secciones */}
      <nav className="flex gap-1 overflow-x-auto px-3 py-3 lg:flex-1 lg:flex-col lg:overflow-y-auto lg:px-3 lg:py-0">
        {secciones.map((s) => (
          <NavLink
            key={s.id}
            to={s.ruta}
            className={({ isActive }) =>
              `group relative flex shrink-0 items-center gap-3 rounded-xl px-3.5 py-3 text-[14px] transition-colors lg:shrink ${
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
      <div className="hidden border-t border-[var(--gm-divisor)] p-3 lg:block">
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
