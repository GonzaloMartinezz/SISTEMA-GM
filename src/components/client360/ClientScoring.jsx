import React from 'react';
import { Flame, ThermometerSun } from 'lucide-react';

export default function ClientScoring({ score = 0, isEditing, onChange }) {
  // Calculamos el color y mensaje basado en el score
  const getScoreDetails = (value) => {
    if (value >= 80) return { color: 'text-red-500', bg: 'bg-red-500', shadow: 'shadow-sm', label: 'Venta Caliente' };
    if (value >= 50) return { color: 'text-orange-500', bg: 'bg-orange-500', shadow: 'shadow-sm', label: 'Interés Medio' };
    return { color: 'text-blue-500', bg: 'bg-blue-500', shadow: 'shadow-sm', label: 'Contacto Inicial / Frío' };
  };

  const details = getScoreDetails(score);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
          <ThermometerSun className={`w-5 h-5 ${details.color}`} />
        </div>
        <h3 className="text-lg font-bold text-slate-800 tracking-wide">Scoring / Termómetro</h3>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500 font-medium mb-1">Estado de Venta</p>
          <p className={`font-bold text-lg uppercase tracking-wider ${details.color}`}>
            {details.label}
          </p>
          {isEditing && (
            <div className="mt-4">
              <label className="text-xs font-bold text-slate-500 mb-1 block">Ajustar Puntaje (0-100)</label>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={score} 
                onChange={(e) => onChange && onChange(Number(e.target.value))}
                className="w-full accent-crmTeal"
              />
            </div>
          )}
        </div>
        
        {/* Gráfico circular simple con CSS */}
        <div className="relative w-20 h-20 flex items-center justify-center bg-slate-50 rounded-full shadow-inner shrink-0">
          <svg className="w-full h-full transform -rotate-90">
            <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-200" />
            <circle 
              cx="40" cy="40" r="36" 
              stroke="currentColor" 
              strokeWidth="8" 
              fill="transparent" 
              strokeDasharray={`${(score / 100) * 226} 226`} 
              className={`${details.color} transition-all duration-300 ease-out`} 
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-xl font-black text-slate-800">{score}</span>
            <span className="text-[10px] text-slate-400 uppercase font-bold">PTS</span>
          </div>
        </div>
      </div>
    </div>
  );
}
