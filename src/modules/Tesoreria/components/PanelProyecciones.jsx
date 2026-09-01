import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export default function PanelProyecciones() {
  const roiData = [
    { name: '1 Mes', inversion: 1000, retorno: 1200 },
    { name: '3 Meses', inversion: 3000, retorno: 4500 },
    { name: '6 Meses', inversion: 6000, retorno: 10500 },
    { name: '12 Meses', inversion: 12000, retorno: 24000 },
    { name: '5 Años', inversion: 60000, retorno: 150000 },
  ];

  const cashflowData = [
    { mes: 'Ene', ingresos: 4000, egresos: 2400 },
    { mes: 'Feb', ingresos: 3000, egresos: 1398 },
    { mes: 'Mar', ingresos: 2000, egresos: 9800 },
    { mes: 'Abr', ingresos: 2780, egresos: 3908 },
    { mes: 'May', ingresos: 1890, egresos: 4800 },
    { mes: 'Jun', ingresos: 2390, egresos: 3800 },
  ];

  return (
    <div className="bg-gray-900 border border-gray-800 flex flex-col h-full font-sans overflow-auto">
      <div className="bg-gray-800 text-yellow-400 font-bold text-center py-2 border-b border-gray-800 uppercase tracking-widest text-xs">
        Analíticas Avanzadas y Proyecciones ROI
      </div>
      
      <div className="p-4 grid grid-rows-2 gap-4 flex-1">
        
        {/* Gráfico de Flujo de Caja */}
        <div className="border border-gray-700 bg-gray-950 p-4 flex flex-col">
          <h3 className="text-gray-400 font-bold text-xs uppercase mb-4 text-center">Evolución de Caja (Últimos 6 Meses)</h3>
          <div className="flex-1 min-h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cashflowData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="mes" stroke="#9CA3AF" tick={{ fontSize: 10 }} />
                <YAxis stroke="#9CA3AF" tick={{ fontSize: 10 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', fontSize: '12px' }}
                  itemStyle={{ color: '#F3F4F6' }}
                />
                <Bar dataKey="ingresos" fill="#34D399" name="Ingresos" />
                <Bar dataKey="egresos" fill="#F87171" name="Egresos" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Proyecciones ROI */}
        <div className="border border-gray-700 bg-gray-950 p-4 flex flex-col">
          <h3 className="text-gray-400 font-bold text-xs uppercase mb-4 text-center">Proyecciones de Rentabilidad (ROI)</h3>
          <div className="flex-1 min-h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={roiData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" tick={{ fontSize: 10 }} />
                <YAxis stroke="#9CA3AF" tick={{ fontSize: 10 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', fontSize: '12px' }}
                />
                <Line type="monotone" dataKey="retorno" stroke="#FBBF24" strokeWidth={3} name="Retorno Estimado" />
                <Line type="monotone" dataKey="inversion" stroke="#60A5FA" strokeWidth={2} strokeDasharray="5 5" name="Inversión Acumulada" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
