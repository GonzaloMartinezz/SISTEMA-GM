import React from 'react';

export default function TabDomicilios() {
  return (
    <div className="space-y-4 font-mono text-sm h-full overflow-auto pr-2">
      
      {/* Domicilio Particular */}
      <div className="bg-gray-900 border border-gray-700 rounded-sm">
        <div className="bg-gray-800 text-cyan-400 font-bold text-center py-1.5 border-b border-gray-700 uppercase tracking-widest text-xs">
          Domicilio Particular
        </div>
        <div className="p-3 text-gray-300 grid grid-cols-[1fr_200px] gap-2 text-xs">
          <div>
            <p>PASAJE DOMINGO CORBALAN Nº:50</p>
            <p className="mt-2">(4178) - ALDERETES</p>
            <p>ALTURA AV RIVADAVIA AL 1300</p>
          </div>
          <div className="text-right">
            <p>TUCUMAN</p>
          </div>
          <div className="col-span-2 mt-2 pt-2 border-t border-gray-800 grid grid-cols-2">
            <p>Tel: 0381-4943494/-</p>
            <p>Tel.Ref: 0381-4943494/-</p>
            <p className="mt-1 col-span-2">Mail: <span className="text-gray-500">No registrado</span></p>
          </div>
        </div>
      </div>

      {/* Domicilio Postal */}
      <div className="bg-gray-900 border border-gray-700 rounded-sm">
        <div className="bg-gray-800 text-cyan-400 font-bold text-center py-1.5 border-b border-gray-700 uppercase tracking-widest text-xs">
          Domicilio Postal
        </div>
        <div className="p-3 text-gray-300 grid grid-cols-[1fr_200px] gap-2 text-xs">
          <div>
            <p>PASAJE DOMINGO CORBALAN Nº:50</p>
            <p className="mt-2">(4178) - ALDERETES</p>
            <p>ALTURA AV RIVADAVIA AL 1300</p>
          </div>
          <div className="text-right">
            <p>TUCUMAN</p>
          </div>
        </div>
      </div>

      {/* Lugar y Domicilio Laboral */}
      <div className="bg-gray-900 border border-gray-700 rounded-sm">
        <div className="bg-gray-800 text-cyan-400 font-bold text-center py-1.5 border-b border-gray-700 uppercase tracking-widest text-xs">
          Lugar y Domicilio Laboral
        </div>
        <div className="p-3 text-gray-300 grid grid-cols-[1fr_200px] gap-2 text-xs">
          <div>
            <p>Trabaja en: <span className="text-cyan-300 font-bold">MAGLIONE S.R.L</span></p>
            <p>CALLE BALCARCE Nº:171</p>
            <p className="mt-2">(4000) - SAN MIGUEL DE TUCUMAN</p>
          </div>
          <div className="text-right flex flex-col justify-end">
            <p>TUCUMAN</p>
          </div>
          <div className="col-span-2 mt-2 pt-2 border-t border-gray-800">
            <p>Tel: 0381-4311717-Int:</p>
          </div>
        </div>
      </div>

    </div>
  );
}
