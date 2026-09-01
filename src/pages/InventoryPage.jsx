import React from 'react';
import InventoryTable from '../components/inventory/InventoryTable';
import ReplenishmentAlerts from '../components/inventory/ReplenishmentAlerts';

export default function InventoryPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 flex flex-col h-full">
      <div>
        <h2 className="text-2xl font-bold text-text mb-1">Inventario y Catálogo</h2>
        <p className="text-textMuted">Gestión de stock, cálculo de márgenes reales y reposición automática.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 flex-1 min-h-[500px]">
        {/* Tabla de Inventario Principal - 3 Columnas en pantallas grandes */}
        <div className="xl:col-span-3 flex flex-col">
          <InventoryTable />
        </div>
        
        {/* Alertas Predictivas - 1 Columna */}
        <div className="xl:col-span-1 flex flex-col">
          <ReplenishmentAlerts />
        </div>
      </div>
    </div>
  );
}
