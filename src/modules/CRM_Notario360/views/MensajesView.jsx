import React from 'react';

export default function MensajesView() {
  return (
    <div className="h-full bg-white border border-gray-200 rounded-2xl shadow-sm p-6 flex flex-col items-center justify-center text-center">
      <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-gray-800">Historial de Mensajes</h2>
      <p className="text-gray-500 max-w-md mt-2">
        Historial: Registro completo de mensajes y seguimientos de clientes y prospectos.
      </p>
    </div>
  );
}
