import React, { useMemo } from 'react';
import MetricsCard from '../components/dashboard/MetricsCard';
import GlobalAnalyticsCharts from '../components/dashboard/GlobalAnalyticsCharts';
import { DollarSign, TrendingUp, PackageSearch, Users, Activity } from 'lucide-react';

export default function DashboardPage() {
  const metrics = useMemo(() => [
    { title: "Comisiones (Mes)", value: "$4,850", subtitle: "+15% vs mes pasado", icon: DollarSign, trend: "up", glow: true },
    { title: "Nuevos Clientes", value: "24", subtitle: "+8% vs mes pasado", icon: Users, trend: "up" },
    { title: "Ventas Cerradas", value: "12", subtitle: "2 esta semana", icon: Activity, trend: "up" },
    { title: "Sueldo Proyectado", value: "$6,200", subtitle: "Fijo + Comisiones", icon: TrendingUp, trend: "up", glow: true },
  ], []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-8">
      
      {/* Header del Dashboard */}
      <div>
        <h2 className="text-3xl font-bold text-white mb-2 tracking-wide">Analytics Global</h2>
        <p className="text-textMuted text-sm">Centro de mando: monitorea ventas, proyecciones y comisiones en tiempo real.</p>
      </div>

      {/* Grid de KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <MetricsCard key={index} {...metric} />
        ))}
      </div>

      {/* Gráficos Recharts */}
      <div className="w-full mt-8">
        <GlobalAnalyticsCharts />
      </div>
      
    </div>
  );
}
