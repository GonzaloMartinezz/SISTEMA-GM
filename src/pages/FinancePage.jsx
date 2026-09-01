import React from 'react';
import QuoteGenerator from '../components/finance/QuoteGenerator';
import PaymentsHistory from '../components/finance/PaymentsHistory';

export default function FinancePage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 flex flex-col h-full">
      <div>
        <h2 className="text-2xl font-bold text-text mb-1">Finanzas y Cotizaciones</h2>
        <p className="text-textMuted">Genera PDFs comerciales y gestiona saldos bimonetarios.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 flex-1 min-h-[500px]">
        {/* Generador de PDFs */}
        <div className="flex flex-col">
          <QuoteGenerator />
        </div>

        {/* Historial de Pagos y Divisas */}
        <div className="flex flex-col">
          <PaymentsHistory />
        </div>
      </div>
    </div>
  );
}
