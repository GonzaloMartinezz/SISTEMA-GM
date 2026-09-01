import React, { useState, useMemo } from 'react';
import { GlassCard } from '../ui/GlassCard';
import { Package, Search, Filter, AlertTriangle } from 'lucide-react';

const mockInventory = [
  { id: 1, name: "Tomógrafo 3D (Alta Gama)", type: "Equipo Pesado", category: "Diagnóstico", cost: 45000, salePrice: 65000, stock: 1, transit: 1, minStock: 1 },
  { id: 2, name: "Sillón Odontológico Standard", type: "Equipo Pesado", category: "Odontología", cost: 3500, salePrice: 5000, stock: 3, transit: 0, minStock: 2 },
  { id: 3, name: "Ecógrafo Portátil VET", type: "Equipo Pesado", category: "Veterinaria", cost: 8000, salePrice: 12000, stock: 0, transit: 2, minStock: 1 },
  { id: 4, name: "Kit Quirúrgico Premium x5", type: "Consumible", category: "Odontología", cost: 150, salePrice: 300, stock: 12, transit: 20, minStock: 15 },
  { id: 5, name: "Caja Placas Radiográficas", type: "Consumible", category: "Diagnóstico", cost: 50, salePrice: 90, stock: 4, transit: 0, minStock: 10 },
];

export default function InventoryTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("Todos");

  const filteredInventory = useMemo(() => {
    return mockInventory.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === "Todos" || item.type === filterType;
      return matchesSearch && matchesType;
    });
  }, [searchTerm, filterType]);

  const calculateMargin = (cost, salePrice) => {
    return (((salePrice - cost) / salePrice) * 100).toFixed(1);
  };

  return (
    <GlassCard className="flex flex-col h-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h3 className="text-xl font-bold text-text">Catálogo y Stock</h3>
          <p className="text-sm text-textMuted">Control de equipos pesados e insumos recurrentes</p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-textMuted h-4 w-4" />
            <input 
              type="text" 
              placeholder="Buscar producto..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-background border border-surfaceHighlight rounded-md py-2 pl-9 pr-4 text-sm text-text focus:border-primary focus:ring-1 focus:ring-primary outline-none"
            />
          </div>
          <div className="relative">
            <select 
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="appearance-none bg-background border border-surfaceHighlight rounded-md py-2 pl-4 pr-10 text-sm text-text focus:border-primary outline-none"
            >
              <option value="Todos">Todos los tipos</option>
              <option value="Equipo Pesado">Equipos Pesados</option>
              <option value="Consumible">Consumibles</option>
            </select>
            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-textMuted h-4 w-4 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="text-textMuted bg-background/50 border-y border-surfaceHighlight">
            <tr>
              <th className="px-4 py-3 font-medium">Producto</th>
              <th className="px-4 py-3 font-medium">Categoría</th>
              <th className="px-4 py-3 font-medium text-right">Costo (USD)</th>
              <th className="px-4 py-3 font-medium text-right">Precio Venta</th>
              <th className="px-4 py-3 font-medium text-center">Margen</th>
              <th className="px-4 py-3 font-medium text-center">Stock</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surfaceHighlight">
            {filteredInventory.map(item => {
              const margin = calculateMargin(item.cost, item.salePrice);
              const isLowStock = item.stock < item.minStock;
              
              return (
                <tr key={item.id} className="hover:bg-surfaceHighlight/50 transition-colors group">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${item.type === 'Equipo Pesado' ? 'bg-primary/10 text-primary' : 'bg-secondary/10 text-secondary'}`}>
                        <Package className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-medium text-text group-hover:text-primary transition-colors">{item.name}</p>
                        <p className="text-xs text-textMuted">{item.type}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-textMuted">{item.category}</td>
                  <td className="px-4 py-3 text-right text-textMuted">${item.cost.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right font-medium text-text">${item.salePrice.toLocaleString()}</td>
                  <td className="px-4 py-3 text-center">
                    <span className="text-xs font-semibold text-primary">{margin}%</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      {isLowStock && <AlertTriangle className="w-4 h-4 text-accent animate-pulse" title="Stock Bajo" />}
                      <span className={`font-bold ${isLowStock ? 'text-accent' : 'text-text'}`}>
                        {item.stock}
                      </span>
                      {item.transit > 0 && (
                        <span className="text-xs text-textMuted" title="En tránsito">
                          (+{item.transit})
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filteredInventory.length === 0 && (
          <div className="text-center py-8 text-textMuted">
            No se encontraron productos en el inventario.
          </div>
        )}
      </div>
    </GlassCard>
  );
}
