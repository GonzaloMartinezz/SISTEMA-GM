import React, { Suspense, lazy, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { ClientProvider } from './context/ClientContext';
import ClientProfileModal from './components/client360/ClientProfileModal';

// Layouts Modulares (Regla Absoluta - 100% Aislados)
import CrmLayout from './components/layout/CrmLayout';
import ClientBaseLayout from './components/layout/ClientBaseLayout';
import MessagingLayout from './components/layout/MessagingLayout';
import LogisticsLayout from './components/layout/LogisticsLayout';
import FinanceLayout from './components/layout/FinanceLayout';
import InventoryLayout from './components/layout/InventoryLayout';

// Lazy loading de páginas principales
const ClientsPage = lazy(() => import('./pages/crm/ClientsPage'));
const TrackingPage = lazy(() => import('./pages/crm/TrackingPage'));
const AgendaPage = lazy(() => import('./pages/crm/AgendaPage'));
const RemindersPage = lazy(() => import('./pages/crm/RemindersPage'));
const StatsPage = lazy(() => import('./pages/crm/StatsPage'));

const MessagingPage = lazy(() => import('./pages/MessagingPage'));
const LogisticsPage = lazy(() => import('./pages/LogisticsPage'));
const FinancePage = lazy(() => import('./pages/FinancePage'));
const InventoryPage = lazy(() => import('./pages/InventoryPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));

// Nuevos módulos Titanio
const AgendaLogisticaDashboard = lazy(() => import('./modules/AgendaLogistica/views/AgendaLogisticaDashboard'));
const CobranzasMain = lazy(() => import('./modules/Cobranzas/views/CobranzasMain'));
const SeguimientosDashboard = lazy(() => import('./modules/Seguimientos/views/SeguimientosDashboard'));
const Notario360Layout = lazy(() => import('./modules/CRM_Notario360/layout/Notario360Layout'));
const PadronView = lazy(() => import('./modules/CRM_Notario360/views/PadronView'));
const MainDashboardView = lazy(() => import('./modules/CRM_Notario360/views/MainDashboardView'));
const DealsView = lazy(() => import('./modules/CRM_Notario360/views/DealsView'));
const MensajesView = lazy(() => import('./modules/CRM_Notario360/views/MensajesView'));
const ActividadesView = lazy(() => import('./modules/CRM_Notario360/views/ActividadesView'));
const ReportesView = lazy(() => import('./modules/CRM_Notario360/views/ReportesView'));
const TesoreriaDashboard = lazy(() => import('./modules/Tesoreria/views/TesoreriaDashboard'));
const InventarioDashboard = lazy(() => import('./modules/Equipamientos/views/InventarioDashboard'));

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('sm_auth_token') === 'true';
  });

  const handleLogin = (status) => {
    setIsAuthenticated(status);
    if (status) {
      localStorage.setItem('sm_auth_token', 'true');
    } else {
      localStorage.removeItem('sm_auth_token');
    }
  };

  return (
    <BrowserRouter>
      <div className="flex h-screen bg-background overflow-hidden selection:bg-primary/30">
        <ClientProvider>
          <Suspense fallback={
            <div className="flex items-center justify-center h-full w-full relative z-50 bg-background">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          }>
            <Routes>
              {/* Portal (Login) siempre accesible */}
              <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
              <Route path="/" element={<Navigate to="/login" replace />} />

              {/* Módulos (Rutas Protegidas) */}
              {isAuthenticated ? (
                <>
                  <Route path="/crm" element={<CrmLayout />}>
                    <Route index element={<Navigate to="/crm/clients" replace />} />
                    <Route path="clients" element={<ClientsPage />} />
                    <Route path="tracking" element={<TrackingPage />} />
                    <Route path="agenda" element={<AgendaPage />} />
                    <Route path="reminders" element={<RemindersPage />} />
                    <Route path="stats" element={<StatsPage />} />
                  </Route>

                  <Route path="/clients" element={<ClientBaseLayout />}>
                    <Route index element={<div className="text-white p-8">Dashboard Poblacional en construcción...</div>} />
                  </Route>

                  <Route path="/messaging" element={<MessagingLayout />}>
                    <Route index element={<MessagingPage />} />
                  </Route>

                  <Route path="/logistics" element={<LogisticsLayout />}>
                    <Route index element={<LogisticsPage />} />
                  </Route>

                  <Route path="/finance" element={<FinanceLayout />}>
                    <Route index element={<FinancePage />} />
                  </Route>

                  <Route path="/inventory" element={<InventoryLayout />}>
                    <Route index element={<InventoryPage />} />
                  </Route>

                  {/* Nuevos Módulos Cyber-minimalistas Titanio */}
                  <Route path="/agenda-logistica" element={<AgendaLogisticaDashboard />} />
                  <Route path="/cobranzas" element={<CobranzasMain />} />
                  <Route path="/seguimientos" element={<SeguimientosDashboard />} />
                  <Route path="/notario-360" element={<Notario360Layout />}>
                    <Route index element={<Navigate to="/notario-360/dashboard" replace />} />
                    <Route path="dashboard" element={<MainDashboardView />} />
                    <Route path="padron" element={<PadronView />} />
                    <Route path="deals" element={<DealsView />} />
                    <Route path="mensajes" element={<MensajesView />} />
                    <Route path="actividades" element={<ActividadesView />} />
                    <Route path="reportes" element={<ReportesView />} />
                  </Route>
                  <Route path="/tesoreria" element={<TesoreriaDashboard />} />
                  <Route path="/equipamientos" element={<InventarioDashboard />} />
                  
                  <Route path="*" element={<Navigate to="/login" replace />} />
                </>
              ) : (
                <Route path="*" element={<Navigate to="/login" replace />} />
              )}
            </Routes>
          </Suspense>
          
          {/* Overlay global para perfil de cliente 360 */}
          {isAuthenticated && <ClientProfileModal />}
        </ClientProvider>
      </div>
    </BrowserRouter>
  );
}
