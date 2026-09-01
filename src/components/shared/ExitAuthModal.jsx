import React, { useState } from 'react';
import { X, Lock, CheckCircle } from 'lucide-react';

export default function ExitAuthModal({ isOpen, onClose, onSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === '483' && password === '120304') {
      setSuccess(true);
      setError(false);
      setTimeout(() => {
        onSuccess();
      }, 1500);
    } else {
      setError(true);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-[#050510] border border-blue-500/30 rounded-3xl p-0 max-w-md w-full relative shadow-[0_0_80px_rgba(37,99,235,0.2)] overflow-hidden flex flex-col min-h-[350px]">
        
        {!success && (
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-20 text-gray-400 hover:text-white bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-full p-2 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        <div className="w-full p-8 md:p-12 flex flex-col justify-center relative flex-1">
          {success ? (
            <div className="flex-1 flex flex-col items-center justify-center animate-in zoom-in fade-in duration-500">
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
                <CheckCircle className="w-10 h-10 text-green-400" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-center mb-2 uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-200 drop-shadow-[0_0_10px_rgba(74,222,128,0.5)] leading-snug">
                SALIDA AUTORIZADA
              </h3>
              <div className="flex items-center gap-2 mt-4 text-green-500 text-xs tracking-widest uppercase">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-ping"></div>
                Volviendo al Hub...
              </div>
            </div>
          ) : (
            <>
              <div className="mb-6 flex flex-col items-center">
                <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mb-4 border border-blue-500/30">
                  <Lock className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-center mb-2 uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-200">
                  SEGURIDAD
                </h3>
                <p className="text-gray-400 text-xs text-center uppercase tracking-wider">
                  Credenciales requeridas para salir del módulo
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1">
                  <input 
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-600 focus:border-blue-500 focus:bg-blue-900/10 focus:ring-1 focus:ring-blue-500 outline-none transition-all text-sm"
                    placeholder="Usuario"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <input 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-600 focus:border-blue-500 focus:bg-blue-900/10 focus:ring-1 focus:ring-blue-500 outline-none transition-all text-sm"
                    placeholder="Contraseña"
                    required
                  />
                </div>

                {error && (
                  <p className="text-red-400 text-xs text-center font-medium animate-pulse bg-red-950/30 py-2 rounded-lg border border-red-900/50 mt-2">
                    Credenciales incorrectas.
                  </p>
                )}

                <div className="pt-4">
                  <button 
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-700 to-blue-500 hover:from-blue-600 hover:to-blue-400 text-white font-bold py-3 rounded-xl transition-all tracking-[0.2em] text-xs shadow-lg shadow-blue-900/50 hover:shadow-blue-600/50 hover:-translate-y-1"
                  >
                    AUTORIZAR SALIDA
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
