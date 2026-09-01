import React, { useState } from 'react';
import { GlassCard } from '../ui/GlassCard';
import { DollarSign, ArrowRightLeft } from 'lucide-react';

const mockPayments = [
  { id: 1, client: "Centro Radiológico", item: "Tomógrafo 3D", totalUsd: 45000, paidUsd: 20000, status: "Seña" },
  { id: 2, client: "Dr. Carlos Ruiz", item: "Kit Quirúrgico x5", totalUsd: 300, paidUsd: 300, status: "Cancelado" },
  { id: 3, client: "VetLife", item: "Ecógrafo Portátil", totalUsd: 8000, paidUsd: 0, status: "Pendiente" },
];

export default function PaymentsHistory() {
  const [exchangeRate, setExchangeRate] = useState(1150); // Valor de ejemplo ARS

  return (
    <GlassCard className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-bold text-text">Pagos y Saldos</h3>
          <p className="text-sm text-textMuted">Gestión Bimonetaria (USD/ARS)</p>
        </div>
        <div className="bg-surfaceHighlight/30 p-2 rounded-lg border border-surfaceHighlight flex items-center gap-2">
          <ArrowRightLeft className="w-4 h-4 text-textMuted" />
          <span className="text-xs text-textMuted">1 USD = </span>
          <input 
            type="number" 
            value={exchangeRate}
            onChange={(e) => setExchangeRate(e.target.value)}
            className="w-16 bg-background border border-surfaceHighlight rounded px-1 text-sm text-primary font-bold outline-none text-right"
          />
          <span className="text-xs text-textMuted">ARS</span>
        </div>
      </div>

      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left text-sm min-w-[600px]">
          <thead className="text-textMuted bg-background/50 border-y border-surfaceHighlight">
            <tr>
              <th className="px-4 py-3 font-medium">Cliente / Venta</th>
              <th className="px-4 py-3 font-medium text-right">Total USD</th>
              <th className="px-4 py-3 font-medium text-right">Pagado</th>
              <th className="px-4 py-3 font-medium text-right">Saldo Deudor</th>
              <th className="px-4 py-3 font-medium text-center">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surfaceHighlight">
            {mockPayments.map(payment => {
              const pending = payment.totalUsd - payment.paidUsd;
              const pendingArs = pending * exchangeRate;
              
              return (
                <tr key={payment.id} className="hover:bg-surfaceHighlight/50 transition-colors group">
                  <td className="px-4 py-3">
                    <p className="font-medium text-text group-hover:text-primary transition-colors">{payment.client}</p>
                    <p className="text-xs text-textMuted">{payment.item}</p>
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-text">${payment.totalUsd.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right text-[#25D366] font-medium">${payment.paidUsd.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right">
                    <p className={`font-bold ${pending > 0 ? 'text-accent' : 'text-textMuted'}`}>
                      ${pending.toLocaleString()} USD
                    </p>
                    {pending > 0 && (
                      <p className="text-xs text-textMuted">~${pendingArs.toLocaleString()} ARS</p>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase border ${
                      payment.status === 'Cancelado' ? 'bg-[#25D366]/10 text-[#25D366] border-[#25D366]/30' :
                      payment.status === 'Seña' ? 'bg-secondary/10 text-secondary border-secondary/30' :
                      'bg-accent/10 text-accent border-accent/30'
                    }`}>
                      {payment.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </GlassCard>
  );
}
