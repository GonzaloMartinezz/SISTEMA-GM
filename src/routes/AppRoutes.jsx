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
const ClientesLayout = lazy(() => import('../modules/Clientes/layout/ClientesLayout'));
const NotarioLayout = lazy(() => import('../modules/Notario/layout/NotarioLayout'));

// ---- Vistas ----------------------------------------------------------------
const BaseDatosView = lazy(() => import('../modules/Clientes/views/BaseDatosView'));
const InformesView = lazy(() => import('../modules/Clientes/views/InformesView'));
const SeguimientosClientesView = lazy(() =>
  import('../modules/Clientes/views/SeguimientosView')
);
const HistorialMensajesView = lazy(() =>
  import('../modules/Clientes/views/HistorialMensajesView')
);
const AgendaClientesView = lazy(() => import('../modules/Clientes/views/AgendaClientesView'));

const AgendaLayout = lazy(() => import('../modules/Agenda/layout/AgendaLayout'));
const AgHoyView = lazy(() => import('../modules/Agenda/views/HoyView'));
const AgSemanaView = lazy(() => import('../modules/Agenda/views/SemanaView'));
const AgMesView = lazy(() => import('../modules/Agenda/views/MesView'));
const AgPendientesView = lazy(() => import('../modules/Agenda/views/PendientesView'));
const CobranzasLayout = lazy(() => import('../modules/Cobranzas/layout/CobranzasLayout'));
const CbVentasView = lazy(() => import('../modules/Cobranzas/views/VentasView'));
const CbCalendarioView = lazy(() => import('../modules/Cobranzas/views/CalendarioView'));
const CbCajaView = lazy(() => import('../modules/Cobranzas/views/CajaView'));
const CbResultadoView = lazy(() => import('../modules/Cobranzas/views/ResultadoView'));
const SeguimientosLayout = lazy(() => import('../modules/Seguimientos/layout/SeguimientosLayout'));
const SgPipelineView = lazy(() => import('../modules/Seguimientos/views/PipelineView'));
const SgAvancesView = lazy(() => import('../modules/Seguimientos/views/AvancesView'));
const SgMensajeriaView = lazy(() => import('../modules/Seguimientos/views/MensajeriaView'));
const SgPlantillasView = lazy(() => import('../modules/Seguimientos/views/PlantillasView'));
const FinanzasLayout = lazy(() => import('../modules/Finanzas/layout/FinanzasLayout'));
const FzResumenView = lazy(() => import('../modules/Finanzas/views/ResumenView'));
const FzIngresosEgresosView = lazy(() => import('../modules/Finanzas/views/IngresosEgresosView'));
const FzProyeccionesView = lazy(() => import('../modules/Finanzas/views/ProyeccionesView'));
const FzFiscalView = lazy(() => import('../modules/Finanzas/views/FiscalView'));
const EquiposLayout = lazy(() => import('../modules/Equipos/layout/EquiposLayout'));
const EqBaseDatosView = lazy(() => import('../modules/Equipos/views/BaseDatosView'));
const EqDetallesView = lazy(() => import('../modules/Equipos/views/DetallesView'));
const EqStockView = lazy(() => import('../modules/Equipos/views/StockView'));
const MapaLayout = lazy(() => import('../modules/Mapa/layout/MapaLayout'));
const MpMapaView = lazy(() => import('../modules/Mapa/views/MapaView'));
const MpAgendaView = lazy(() => import('../modules/Mapa/views/AgendaMapaView'));
const MpRutaView = lazy(() => import('../modules/Mapa/views/RutaView'));
const MpCoberturaView = lazy(() => import('../modules/Mapa/views/CoberturaView'));

const NtNotasView = lazy(() => import('../modules/Notario/views/NotasView'));
const NtTrazabilidadView = lazy(() => import('../modules/Notario/views/TrazabilidadView'));
const NtFichaView = lazy(() => import('../modules/Notario/views/FichaView'));
const NtCuentasView = lazy(() => import('../modules/Notario/views/CuentasView'));

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
        {/* Módulo 1 rediseñado: tema claro y las cinco secciones del Plan Maestro. */}
        <Route
          path="/crm"
          element={
            <ModuleGuard moduleId="clientes" showTopBar={false}>
              <ClientesLayout />
            </ModuleGuard>
          }
        >
          <Route index element={<Navigate to="/crm/base-datos" replace />} />
          <Route path="base-datos" element={<BaseDatosView />} />
          <Route path="informes" element={<InformesView />} />
          <Route path="seguimientos" element={<SeguimientosClientesView />} />
          <Route path="mensajes" element={<HistorialMensajesView />} />
          <Route path="agenda" element={<AgendaClientesView />} />
          {/* Rutas viejas del CRM: se redirigen para no dejar enlaces muertos. */}
          <Route path="clients" element={<Navigate to="/crm/base-datos" replace />} />
          <Route path="tracking" element={<Navigate to="/crm/seguimientos" replace />} />
          <Route path="reminders" element={<Navigate to="/crm/agenda" replace />} />
          <Route path="stats" element={<Navigate to="/crm/informes" replace />} />
        </Route>

        <Route path="/clients" element={<Navigate to="/crm/base-datos" replace />} />
        <Route path="/messaging" element={<Navigate to="/crm/mensajes" replace />} />

        {/* ------------------ M-02 · Equipamientos ------------------ */}
        {/* Módulo 2 rediseñado: catálogo, ficha técnica y control de stock. */}
        <Route
          path="/equipamientos"
          element={
            <ModuleGuard moduleId="equipamientos" showTopBar={false}>
              <EquiposLayout />
            </ModuleGuard>
          }
        >
          <Route index element={<Navigate to="/equipamientos/stock" replace />} />
          <Route path="base-datos" element={<EqBaseDatosView />} />
          <Route path="detalles" element={<EqDetallesView />} />
          <Route path="stock" element={<EqStockView />} />
        </Route>

        {/* La ruta vieja del inventario redirige, para no dejar enlaces muertos. */}
        <Route path="/inventory" element={<Navigate to="/equipamientos/stock" replace />} />

        {/* ------------------ M-03 · Tesorería ------------------ */}
        {/* Modulo 3 rediseniado: resumen, movimientos, proyecciones y fiscal. */}
        <Route
          path="/tesoreria"
          element={
            <ModuleGuard moduleId="tesoreria" showTopBar={false}>
              <FinanzasLayout />
            </ModuleGuard>
          }
        >
          <Route index element={<Navigate to="/tesoreria/resumen" replace />} />
          <Route path="resumen" element={<FzResumenView />} />
          <Route path="ingresos-egresos" element={<FzIngresosEgresosView />} />
          <Route path="proyecciones" element={<FzProyeccionesView />} />
          <Route path="fiscal" element={<FzFiscalView />} />
        </Route>

        {/* La ruta vieja de finanzas redirige, para no dejar enlaces muertos. */}
        <Route path="/finance" element={<Navigate to="/tesoreria/resumen" replace />} />

        {/* ------------------ M-04 · Seguimientos ------------------ */}
        {/* Modulo 4 rediseniado: proceso, avances, mensajeria y respuestas. */}
        <Route
          path="/seguimientos"
          element={
            <ModuleGuard moduleId="seguimientos" showTopBar={false}>
              <SeguimientosLayout />
            </ModuleGuard>
          }
        >
          <Route index element={<Navigate to="/seguimientos/pipeline" replace />} />
          <Route path="pipeline" element={<SgPipelineView />} />
          <Route path="avances" element={<SgAvancesView />} />
          <Route path="mensajeria" element={<SgMensajeriaView />} />
          <Route path="plantillas" element={<SgPlantillasView />} />
        </Route>

        {/* ------------------ M-05 · Agenda Inteligente ------------------ */}
        {/* Modulo 5 rediseniado: hoy, semana, mes y la bandeja de pendientes. */}
        <Route
          path="/agenda-logistica"
          element={
            <ModuleGuard moduleId="agenda" showTopBar={false}>
              <AgendaLayout />
            </ModuleGuard>
          }
        >
          <Route index element={<Navigate to="/agenda-logistica/hoy" replace />} />
          <Route path="hoy" element={<AgHoyView />} />
          <Route path="semana" element={<AgSemanaView />} />
          <Route path="mes" element={<AgMesView />} />
          <Route path="pendientes" element={<AgPendientesView />} />
        </Route>

        {/* ------------------ M-06 · Notario 360° ------------------ */}
        {/* Modulo 6 rediseniado: notas de todo el sistema, trazabilidad,
            ficha 360 y el padron de cuentas. */}
        <Route
          path="/notario-360"
          element={
            <ModuleGuard moduleId="notario360" showTopBar={false}>
              <NotarioLayout />
            </ModuleGuard>
          }
        >
          <Route index element={<Navigate to="/notario-360/notas" replace />} />
          <Route path="notas" element={<NtNotasView />} />
          <Route path="trazabilidad" element={<NtTrazabilidadView />} />
          <Route path="ficha" element={<NtFichaView />} />
          <Route path="cuentas" element={<NtCuentasView />} />
          {/* Rutas viejas del modulo: redirigen para no dejar enlaces muertos. */}
          <Route path="dashboard" element={<Navigate to="/notario-360/notas" replace />} />
          <Route path="padron" element={<Navigate to="/notario-360/cuentas" replace />} />
          <Route path="ficha/:cuentaId" element={<Navigate to="/notario-360/ficha" replace />} />
          <Route path="deals" element={<Navigate to="/notario-360/cuentas" replace />} />
          <Route path="mensajes" element={<Navigate to="/seguimientos/mensajeria" replace />} />
          <Route path="actividades" element={<Navigate to="/notario-360/trazabilidad" replace />} />
          <Route path="reportes" element={<Navigate to="/notario-360/trazabilidad" replace />} />
        </Route>

        {/* ------------------ M-07 · Mapa y Logística ------------------ */}
        {/* Modulo 7 rediseniado: mapa propio, agenda ubicada, ruta y cobertura. */}
        <Route
          path="/logistics"
          element={
            <ModuleGuard moduleId="logistica" showTopBar={false}>
              <MapaLayout />
            </ModuleGuard>
          }
        >
          <Route index element={<Navigate to="/logistics/mapa" replace />} />
          <Route path="mapa" element={<MpMapaView />} />
          <Route path="agenda" element={<MpAgendaView />} />
          <Route path="ruta" element={<MpRutaView />} />
          <Route path="cobertura" element={<MpCoberturaView />} />
        </Route>

        {/* La ruta vieja del mapa redirige, para no dejar enlaces muertos. */}
        <Route path="/mapa-logistica" element={<Navigate to="/logistics/mapa" replace />} />

        {/* ------------------ M-08 · Cobranzas ------------------ */}
        {/* Modulo 8 rediseniado: ventas con plan de cuotas, calendario de
            cobros, caja del negocio y resultado mes a mes. */}
        <Route
          path="/cobranzas"
          element={
            <ModuleGuard moduleId="cobranzas" showTopBar={false}>
              <CobranzasLayout />
            </ModuleGuard>
          }
        >
          <Route index element={<Navigate to="/cobranzas/ventas" replace />} />
          <Route path="ventas" element={<CbVentasView />} />
          <Route path="calendario" element={<CbCalendarioView />} />
          <Route path="caja" element={<CbCajaView />} />
          <Route path="resultado" element={<CbResultadoView />} />
          {/* Rutas viejas del modulo: redirigen para no dejar enlaces muertos. */}
          <Route path="estado-de-cuenta" element={<Navigate to="/cobranzas/ventas" replace />} />
          <Route path="estructura" element={<Navigate to="/cobranzas/resultado" replace />} />
          <Route path="llamados" element={<Navigate to="/cobranzas/ventas" replace />} />
          <Route path="auditoria" element={<Navigate to="/cobranzas/caja" replace />} />
        </Route>

        {/* ------------------ Fallback ------------------ */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
