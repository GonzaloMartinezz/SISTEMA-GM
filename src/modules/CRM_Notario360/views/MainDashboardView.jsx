import React from 'react';
import { 
  Briefcase, ArrowUp, ArrowDown, Plus, Send, Download, 
  MoreHorizontal, ChevronDown, CheckCircle2, XCircle
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  Cell, PieChart, Pie
} from 'recharts';

export default function MainDashboardView() {
  
  const cashflowData = [
    { name: 'JAN', income: 1500, expense: 800 },
    { name: 'FEB', income: 2000, expense: 1200 },
    { name: 'MAR', income: 3200, expense: 1000 },
    { name: 'APR', income: 1800, expense: 1100 },
    { name: 'MAY', income: 2500, expense: 1500 },
    { name: 'JUN', income: 3800, expense: 900 },
  ];

  const recentTransactions = [
    { id: 1, name: 'Marcela Torres', amount: '$15,900', type: 'Venta Directa', date: '20 Oct 2026', status: 'Complete' },
    { id: 2, name: 'Azizay Muscry', amount: '$8,500', type: 'Equipamiento', date: '19 Oct 2026', status: 'Canceled' },
    { id: 3, name: 'Rachel Vigmel', amount: '$3,000', type: 'Consultoría', date: '18 Oct 2026', status: 'Complete' },
  ];

  const goalData = [
    { name: 'Progress', value: 1224, fill: '#0052FF' },
    { name: 'Remaining', value: 2000 - 1224, fill: '#1E1E1E' }
  ];

  return (
    <div className="h-full overflow-y-auto pb-8 hide-scrollbar">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* ROW 1 */}
        {/* Tarjeta Principal: Total Pipeline */}
        <div className="lg:col-span-1.5 bg-white border border-gray-100 rounded-3xl p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col justify-between" style={{ gridColumn: 'span 1.5' }}>
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/30">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-gray-800 text-lg">Total Pipeline</span>
            </div>
            <div className="flex gap-2">
              <button className="flex items-center gap-1 px-3 py-1 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold text-gray-600">
                <span className="text-blue-600">USD</span> <ChevronDown className="w-3 h-3" />
              </button>
              <button className="flex items-center gap-1 px-3 py-1 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold text-gray-600">
                ALL TIME <ChevronDown className="w-3 h-3" />
              </button>
            </div>
          </div>

          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-5xl font-black text-gray-900 tracking-tight">$50,764.00</h2>
              <div className="flex items-center gap-2 mt-3">
                <span className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-md">
                  <ArrowUp className="w-3 h-3" /> 12%
                </span>
                <span className="text-xs text-gray-500 font-medium">Balance increase, Good progress.</span>
              </div>
            </div>
            
            {/* Sparkline Simulada */}
            <div className="flex items-end gap-1 h-12">
              <div className="w-3 h-4 bg-green-400 rounded-sm"></div>
              <div className="w-3 h-6 bg-blue-300 rounded-sm"></div>
              <div className="w-3 h-8 bg-blue-500 rounded-sm"></div>
              <div className="w-3 h-5 bg-blue-400 rounded-sm"></div>
              <div className="w-3 h-10 bg-blue-600 rounded-sm"></div>
            </div>
          </div>

          <div className="flex gap-3">
            <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/20">
              <Plus className="w-4 h-4" /> Nuevo Lead
            </button>
            <button className="flex-1 bg-gray-900 hover:bg-black text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-gray-900/20">
              <Send className="w-4 h-4" /> Enviar Coti
            </button>
            <button className="flex-1 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-all">
              <Download className="w-4 h-4" /> Exportar
            </button>
          </div>
        </div>

        {/* Tarjetas Secundarias: Income y Expense */}
        <div className="lg:col-span-1.5 flex flex-col gap-6" style={{ gridColumn: 'span 1.5' }}>
          <div className="grid grid-cols-2 gap-6 flex-1">
            
            {/* Ventas Ganadas */}
            <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col justify-between">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30">
                    <ArrowDown className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-bold text-gray-800">Ganadas</span>
                </div>
                <span className="text-xs font-semibold text-gray-500 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">JUN 2026</span>
              </div>
              
              <div>
                <h3 className="text-3xl font-black text-gray-900 mb-2">$5,000<span className="text-lg text-gray-400">.00</span></h3>
                <span className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-md w-max mb-3">
                  <ArrowUp className="w-3 h-3" /> $456
                </span>
                <p className="text-[10px] text-gray-500 font-medium">Income increased by <strong className="text-green-600">9.1%</strong> from last month.</p>
              </div>

              <div className="flex justify-between mt-4 pt-4 border-t border-gray-100">
                <div>
                  <p className="text-[10px] text-gray-400 font-semibold uppercase">Consultoría</p>
                  <p className="font-bold text-gray-800 text-sm">$3,000</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-semibold uppercase">Equipos</p>
                  <p className="font-bold text-gray-800 text-sm">$2,000</p>
                </div>
              </div>
            </div>

            {/* Ventas Perdidas */}
            <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col justify-between">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center shadow-lg shadow-red-500/30">
                    <ArrowUp className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-bold text-gray-800">Perdidas</span>
                </div>
                <span className="text-xs font-semibold text-gray-500 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">JUN 2026</span>
              </div>
              
              <div>
                <h3 className="text-3xl font-black text-gray-900 mb-2">$4,000<span className="text-lg text-gray-400">.00</span></h3>
                <span className="flex items-center gap-1 text-xs font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-md w-max mb-3">
                  <ArrowDown className="w-3 h-3" /> $456 vs last month
                </span>
              </div>

              <div className="mt-4">
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden flex">
                  <div className="h-full bg-gray-800 w-1/2"></div>
                  <div className="h-full bg-blue-500 w-1/3"></div>
                  <div className="h-full bg-yellow-400 w-1/6"></div>
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-[9px] font-bold text-gray-500 uppercase flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-gray-800"></div> Competencia</span>
                  <span className="text-[9px] font-bold text-gray-500 uppercase flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div> Precio</span>
                  <span className="text-[9px] font-bold text-gray-500 uppercase flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-yellow-400"></div> Otros</span>
                </div>
              </div>
            </div>

          </div>
        </div>


        {/* ROW 2 */}
        
        {/* Metas */}
        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                <span className="font-bold text-sm">🎯</span>
              </div>
              <span className="font-bold text-gray-800">Mis Metas</span>
            </div>
            <button className="p-1.5 bg-gray-50 hover:bg-gray-100 rounded-md text-gray-500">
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="bg-[#1A1C23] rounded-2xl p-6 text-white text-center relative overflow-hidden">
            <h4 className="font-semibold text-sm mb-6 z-10 relative">Objetivo Mensual</h4>
            
            <div className="h-32 relative z-10">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={goalData}
                    cx="50%"
                    cy="100%"
                    startAngle={180}
                    endAngle={0}
                    innerRadius={80}
                    outerRadius={100}
                    paddingAngle={0}
                    dataKey="value"
                    stroke="none"
                  >
                    {goalData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute bottom-0 left-0 w-full text-center">
                <p className="text-xs text-gray-400 font-semibold mb-1">Target</p>
                <h3 className="text-3xl font-black">$1,224</h3>
                <p className="text-[10px] text-gray-500">/ $2000</p>
              </div>
            </div>
          </div>
        </div>

        {/* Chart de Ventas */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex-1">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                  <BarChart className="w-4 h-4" />
                </div>
                <span className="font-bold text-gray-800">Proyección de Ventas</span>
              </div>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold text-gray-600">2026</span>
                <span className="px-3 py-1 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold text-gray-600">6 MONTH</span>
              </div>
            </div>

            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={cashflowData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }} barSize={32}>
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fill: '#9CA3AF', fontWeight: 600 }} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fill: '#9CA3AF', fontWeight: 600 }}
                  />
                  <Tooltip 
                    cursor={{fill: 'transparent'}}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
                  />
                  <Bar dataKey="income" fill="#E5E7EB" radius={[4, 4, 0, 0]} stackId="a" />
                  <Bar dataKey="expense" fill="#3B82F6" radius={[4, 4, 0, 0]} stackId="a">
                    {
                      cashflowData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.name === 'MAR' ? '#A3E635' : (entry.name === 'JUN' ? '#E5E7EB' : '#3B82F6')} />
                      ))
                    }
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Historial de Transacciones (Full width abajo) */}
        <div className="lg:col-span-3 bg-white border border-gray-100 rounded-3xl p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
              <span className="font-bold text-gray-800">Últimos Cierres</span>
            </div>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search..." 
                className="bg-gray-50 border border-gray-200 rounded-full pl-4 pr-10 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 w-48"
              />
            </div>
          </div>

          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Monto</th>
                <th className="px-4 py-3">Tipo</th>
                <th className="px-4 py-3">Fecha</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3 font-semibold text-gray-900 text-sm flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-blue-100 flex items-center justify-center text-blue-600 text-xs">{tx.name[0]}</div>
                    {tx.name}
                  </td>
                  <td className="px-4 py-3 font-bold text-gray-900 text-sm">{tx.amount}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 font-medium">{tx.type}</td>
                  <td className="px-4 py-3 text-sm text-gray-500 font-medium">{tx.date}</td>
                  <td className="px-4 py-3">
                    {tx.status === 'Complete' ? (
                      <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider">
                        <CheckCircle2 className="w-3 h-3" /> Completado
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider">
                        <XCircle className="w-3 h-3" /> Perdido
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}

// Para el icono de Reloj que falta arriba (Clock):
import { Clock } from 'lucide-react';
