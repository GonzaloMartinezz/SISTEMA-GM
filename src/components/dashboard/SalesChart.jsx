import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { GlassCard } from '../ui/GlassCard';

const data = [
  { name: 'Lun', ventas: 15000 },
  { name: 'Mar', ventas: 0 },
  { name: 'Mié', ventas: 45000 },
  { name: 'Jue', ventas: 30000 },
  { name: 'Vie', ventas: 80000 },
  { name: 'Sáb', ventas: 12000 },
  { name: 'Dom', ventas: 0 },
];

export default function SalesChart() {
  return (
    <GlassCard className="h-[400px] flex flex-col">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-text">Ventas Semanales (USD)</h3>
        <p className="text-sm text-textMuted">Rendimiento de los últimos 7 días</p>
      </div>
      
      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorVentas" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00ffcc" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#00ffcc" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
            <XAxis 
              dataKey="name" 
              stroke="#9ca3af" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false}
              dy={10}
            />
            <YAxis 
              stroke="#9ca3af" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false} 
              tickFormatter={(value) => `$${value / 1000}k`}
              dx={-10}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#171717', borderColor: '#262626', color: '#f3f4f6', borderRadius: '8px' }}
              itemStyle={{ color: '#00ffcc' }}
              formatter={(value) => [`$${value.toLocaleString()}`, 'Ventas']}
            />
            <Area 
              type="monotone" 
              dataKey="ventas" 
              stroke="#00ffcc" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorVentas)" 
              activeDot={{ r: 6, fill: '#00ffcc', stroke: '#0a0a0a', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
}
