// ============================================================================
// SISTEMA GM · SHELL DE APLICACIÓN
// ----------------------------------------------------------------------------
// App.jsx no contiene vistas ni lógica de negocio: solo monta los proveedores
// globales y delega el ruteo en routes/AppRoutes.jsx (aislamiento absoluto).
// ============================================================================

import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import { ModuleAuthProvider } from './context/ModuleAuthContext';
import { ClientProvider } from './context/ClientContext';
import { ThemeProvider } from './context/ThemeContext';
import ClientProfileModal from './components/client360/ClientProfileModal';
import AppRoutes from './routes/AppRoutes';

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <ModuleAuthProvider>
          <ClientProvider>
            <div className="h-dvh w-dvh overflow-hidden bg-background dark:bg-background/90 selection:bg-primary/30">
              <AppRoutes />
            </div>
            {/* Overlay global de perfil 360° (se autogestiona: sin cliente activo no renderiza) */}
            <ClientProfileModal />
          </ClientProvider>
        </ModuleAuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
