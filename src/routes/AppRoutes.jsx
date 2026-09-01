// ============================================================================
// SISTEMA GM · MAPA DE RUTAS AISLADAS
// ----------------------------------------------------------------------------
// Todo módulo entra envuelto en <ModuleGuard>. Sin credenciales validadas para
// ese módulo puntual, la ruta no se monta y el usuario vuelve al Portal Hub.
// El lazy loading garantiza que los módulos inactivos ni siquiera se descarguen.
// ============================================================================

import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import PortalHubPage from '../pages/PortalHubPage';
import ModuleGuard from './ModuleGuard';

// ---- Layouts modulares -----------------------------------------------------
const CrmLayout = lazy(() => import('../components/layout/CrmLayout'));
const ClientBaseLayout = lazy(() => import('../components/layout/ClientBaseLayout'));
const MessagingLayout = lazy(() => import('../components/layout/MessagingLayout'));
const FinanceLayout = lazy(() => import('../components/layout/FinanceLayout'));
const InventoryLayout = lazy(() => import('../components/layout/InventoryLayout'));
const Notario360Layout = lazy(() => import('../modules/CRM_Notario360/layout/Notario360Layout'));

// ---- Vistas ----------------------------------------------------------------
const ClientsPage = lazy(() => import('../pages/crm/ClientsPage'));
const TrackingPage = lazy(() => import('../pages/crm/TrackingPage'));
const AgendaPage = lazy(() => import('../pages/crm/AgendaPage'));
const RemindersPage = lazy(() => import('../pages/crm/RemindersPage'));
const StatsPage = lazy(() => import('../pages/crm/StatsPage'));
const MessagingPage = lazy(() => import('../pages/MessagingPage'));
const FinancePage = lazy(() => import('../pages/FinancePage'));
const InventoryPage = lazy(() => import('../pages/InventoryPage'));

const AgendaLogisticaDashboard = lazy(() =>
  import('../modules/AgendaLogistica/views/AgendaLogisticaDashboard')
);
const CobranzasMain = lazy(() => import('../modules/Cobranzas/views/CobranzasMain'));
const SeguimientosDashboard = lazy(() =>
  import('../modules/Seguimientos/views/SeguimientosDashboard')
);
const TesoreriaDashboard = lazy(() => import('../modules/Tesoreria/views/TesoreriaDashboard'));
const InventarioDashboard = lazy(() =>
  import('../modules/Equipamientos/views/InventarioDashboard')
);
const MapaLogisticaDashboard = lazy(() =>
  import('../modules/MapaLogistica/views/MapaLogisticaDashboard')
);

const PadronView = lazy(() => import('../modules/CRM_Notario360/views/PadronView'));
const FichaCuentaView = lazy(() => import('../modules/CRM_Notario360/views/FichaCuentaView'));
const MainDashboardView = lazy(() => import('../modules/CRM_Notario360/views/MainDashboardView'));
const DealsView = lazy(() => import('../modules/CRM_Notario360/views/DealsView'));
const MensajesView = lazy(() => import('../modules/CRM_Notario360/views/MensajesView'));
const ActividadesView = lazy(() => import('../modules/CRM_Notario360/views/ActividadesView'));
const ReportesView = lazy(() => import('../modules/CRM_Notario360/views/ReportesView'));

function ModuleFallback() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="h-7 w-7 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-textMuted">
          Montando entorno
        </span>
      </div>
    </div>
  );
}

export default function AppRoutes() {
  return (
    <Suspense fallback={<ModuleFallback />}>
      <Routes>
        {/* ------------------ Portal Hub ------------------ */}
        <Route path="/" element={<PortalHubPage />} />
        {/* El enlace público /login muestra el mismo Portal Hub */}
        <Route path="/login" element={<PortalHubPage />} />

        {/* ------------------ M-01 · Clientes ------------------ */}
        <Route
          path="/crm"
          element={
            <ModuleGuard moduleId="clientes" showTopBar={false}>
              <CrmLayout />
            </ModuleGuard>
          }
        >
          <Route index element={<Navigate to="/crm/clients" replace />} />
          <Route path="clients" element={<ClientsPage />} />
          <Route path="tracking" element={<TrackingPage />} />
          <Route path="agenda" element={<AgendaPage />} />
          <Route path="reminders" element={<RemindersPage />} />
          <Route path="stats" element={<StatsPage />} />
        </Route>

        <Route
          path="/clients"
          element={
            <ModuleGuard moduleId="clientes" showTopBar={false}>
              <ClientBaseLayout />
            </ModuleGuard>
          }
        >
          <Route
            index
            element={
              <div className="p-8 text-white">Dashboard Poblacional en construcción…</div>
            }
          />
        </Route>

        <Route
          path="/messaging"
          element={
            <ModuleGuard moduleId="clientes" showTopBar={false}>
              <MessagingLayout />
            </ModuleGuard>
          }
        >
          <Route index element={<MessagingPage />} />
        </Route>

        {/* ------------------ M-02 · Equipamientos ------------------ */}
        <Route
          path="/equipamientos"
          element={
            <ModuleGuard moduleId="equipamientos">
              <InventarioDashboard />
            </ModuleGuard>
          }
        />
        <Route
          path="/inventory"
          element={
            <ModuleGuard moduleId="equipamientos" showTopBar={false}>
              <InventoryLayout />
            </ModuleGuard>
          }
        >
          <Route index element={<InventoryPage />} />
        </Route>

        {/* ------------------ M-03 · Tesorería ------------------ */}
        <Route
          path="/tesoreria"
          element={
            <ModuleGuard moduleId="tesoreria">
              <TesoreriaDashboard />
            </ModuleGuard>
          }
        />
        <Route
          path="/finance"
          element={
            <ModuleGuard moduleId="tesoreria" showTopBar={false}>
              <FinanceLayout />
            </ModuleGuard>
          }
        >
          <Route index element={<FinancePage />} />
        </Route>

        {/* ------------------ M-04 · Seguimientos ------------------ */}
        <Route
          path="/seguimientos"
          element={
            <ModuleGuard moduleId="seguimientos">
              <SeguimientosDashboard />
            </ModuleGuard>
          }
        />

        {/* ------------------ M-05 · Agenda Inteligente ------------------ */}
        <Route
          path="/agenda-logistica"
          element={
            <ModuleGuard moduleId="agenda">
              <AgendaLogisticaDashboard />
            </ModuleGuard>
          }
        />

        {/* ------------------ M-06 · Notario 360° ------------------ */}
        <Route
          path="/notario-360"
          element={
            <ModuleGuard moduleId="notario360" showTopBar={false}>
              <Notario360Layout />
            </ModuleGuard>
          }
        >
          <Route index element={<Navigate to="/notario-360/dashboard" replace />} />
          <Route path="dashboard" element={<MainDashboardView />} />
          <Route path="padron" element={<PadronView />} />
          <Route path="ficha" element={<FichaCuentaView />} />
          <Route path="ficha/:cuentaId" element={<FichaCuentaView />} />
          <Route path="deals" element={<DealsView />} />
          <Route path="mensajes" element={<MensajesView />} />
          <Route path="actividades" element={<ActividadesView />} />
          <Route path="reportes" element={<ReportesView />} />
        </Route>

        {/* ------------------ M-07 · Mapa y Logística ------------------ */}
        <Route
          path="/logistics"
          element={
            <ModuleGuard moduleId="logistica">
              <MapaLogisticaDashboard />
            </ModuleGuard>
          }
        />

        {/* ------------------ M-08 · Cobranzas ------------------ */}
        <Route
          path="/cobranzas"
          element={
            <ModuleGuard moduleId="cobranzas">
              <CobranzasMain />
            </ModuleGuard>
          }
        />

        {/* ------------------ Fallback ------------------ */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
