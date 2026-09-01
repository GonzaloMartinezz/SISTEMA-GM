import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';

// Datos Mock
const salesData = [
  { name: 'Ene', ventas: 4000, proyectado: 2400 },
  { name: 'Feb', ventas: 3000, proyectado: 1398 },
  { name: 'Mar', ventas: 2000, proyectado: 9800 },
  { name: 'Abr', ventas: 2780, proyectado: 3908 },
  { name: 'May', ventas: 1890, proyectado: 4800 },
  { name: 'Jun', ventas: 2390, proyectado: 3800 },
  { name: 'Jul', ventas: 3490, proyectado: 4300 },
];

const nicheData = [
  { name: 'Odontología', value: 400 },
  { name: 'Veterinaria', value: 300 },
  { name: 'Diagnóstico por Imagen', value: 300 },
  { name: 'Estética', value: 200 },
];
const COLORS = ['#00ffcc', '#bf00ff', '#ff0055', '#3E8E7E'];

const commissionData = [
  { name: 'Semana 1', comision: 400 },
  { name: 'Semana 2', comision: 300 },
  { name: 'Semana 3', comision: 550 },
  { name: 'Semana 4', comision: 800 },
];

export default function GlobalAnalyticsCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      {/* Gráfico 1: Ventas y Proyección (Area Chart) */}
      <div className="bg-surface/30 border border-surfaceHighlight rounded-2xl p-6 shadow-lg col-span-1 lg:col-span-2">
        <h3 className="text-lg font-bold text-white mb-6">Ventas vs. Proyección Mensual (USD)</h3>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={salesData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorVentas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00ffcc" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#00ffcc" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorProyectado" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#bf00ff" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#bf00ff" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
              <XAxis dataKey="name" stroke="#9ca3af" tick={{fill: '#9ca3af'}} />
              <YAxis stroke="#9ca3af" tick={{fill: '#9ca3af'}} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0a0a0a', borderColor: '#262626', borderRadius: '8px' }}
                itemStyle={{ color: '#fff' }}
              />
              <Area type="monotone" dataKey="ventas" stroke="#00ffcc" fillOpacity={1} fill="url(#colorVentas)" />
              <Area type="monotone" dataKey="proyectado" stroke="#bf00ff" fillOpacity={1} fill="url(#colorProyectado)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Gráfico 2: Comisiones Semanales (Bar Chart) */}
      <div className="bg-surface/30 border border-surfaceHighlight rounded-2xl p-6 shadow-lg">
        <h3 className="text-lg font-bold text-white mb-6">Comisiones Ganadas (USD)</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={commissionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
              <XAxis dataKey="name" stroke="#9ca3af" tick={{fill: '#9ca3af'}} />
              <YAxis stroke="#9ca3af" tick={{fill: '#9ca3af'}} />
              <Tooltip 
                cursor={{fill: '#262626'}}
                contentStyle={{ backgroundColor: '#0a0a0a', borderColor: '#262626', borderRadius: '8px' }}
              />
              <Bar dataKey="comision" fill="#00ffcc" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Gráfico 3: Distribución por Nicho (Pie Chart) */}
      <div className="bg-surface/30 border border-surfaceHighlight rounded-2xl p-6 shadow-lg">
        <h3 className="text-lg font-bold text-white mb-6">Distribución por Nicho Médico</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={nicheData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {nicheData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#0a0a0a', borderColor: '#262626', borderRadius: '8px' }}
              />
              <Legend verticalAlign="bottom" height={36} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
