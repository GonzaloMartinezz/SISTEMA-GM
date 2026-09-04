import React, { createContext, useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  // Inicializamos leyendo de localStorage o preferencia del sistema
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('gm-theme-dark');
    if (saved !== null) {
      return saved === 'true';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const location = useLocation();

  // El portal hub siempre es claro
  const isPortalHub = location.pathname === '/' || location.pathname === '/login';

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Si estamos en el portal, forzamos light mode temporalmente
    if (isPortalHub) {
      root.classList.remove('dark');
    } else {
      // Si estamos en un módulo, aplicamos el modo oscuro según la preferencia
      if (isDarkMode) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  }, [isDarkMode, isPortalHub]);

  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      localStorage.setItem('gm-theme-dark', String(next));
      return next;
    });
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, isPortalHub }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
