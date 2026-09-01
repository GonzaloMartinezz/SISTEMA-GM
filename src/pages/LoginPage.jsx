import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, LayoutDashboard, Users, Package, Truck, Wallet, Send, CheckCircle, ShieldAlert } from 'lucide-react';

export default function LoginPage({ onLogin }) {
  const navigate = useNavigate();
  const [selectedDashboard, setSelectedDashboard] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  const dashboards = [
    { id: 'notario-360', name: 'Notario 360°', icon: LayoutDashboard, path: '/notario-360' },
    { id: 'tesoreria', name: 'Tesorería', icon: Wallet, path: '/tesoreria' },
    { id: 'seguimientos', name: 'Seguimientos', icon: Send, path: '/seguimientos' },
    { id: 'agenda-logistica', name: 'Agenda & Mapa', icon: Truck, path: '/agenda-logistica' },
    { id: 'cobranzas', name: 'Cobranzas', icon: ShieldAlert, path: '/cobranzas' },
    { id: 'equipamientos', name: 'Equipamientos', icon: Package, path: '/equipamientos' },
  ];

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === '483' && password === '120304') {
      setLoginSuccess(true);
      setError(false);
      setTimeout(() => {
        onLogin(true);
        navigate(selectedDashboard.path);
      }, 1500);
    } else {
      setError(true);
    }
  };

  const openModal = (dashboard) => {
    setSelectedDashboard(dashboard);
    setUsername('');
    setPassword('');
    setError(false);
    setLoginSuccess(false);
  };

  return (
    <div className="w-full h-screen bg-gradient-to-b from-black to-blue-950 flex flex-col items-center justify-between py-4 md:py-6 relative overflow-hidden font-sans text-white">
      
      {/* Top Part: Logo */}
      <div className="flex flex-col items-center justify-center w-full z-10 p-2 h-[35vh]">
         <div className="w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 rounded-full overflow-hidden border-4 border-blue-500/30 shadow-[0_0_80px_rgba(37,99,235,0.4)] flex items-center justify-center bg-black/40 backdrop-blur-sm">
           <img 
              src="/LOGOia.png" 
              alt="Logo Sistema Martinez" 
              className="w-full h-full object-cover" 
           />
         </div>
      </div>

      {/* Bottom Part: Dashboard Selector */}
      <div className="w-full px-4 z-10 pb-4 h-[65vh] flex flex-col justify-center">
        <div className="bg-black/40 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-4 md:p-6 shadow-2xl h-full flex flex-col justify-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 h-full">
            {dashboards.map((dash) => {
              const Icon = dash.icon;
              return (
                <button
                  key={dash.id}
                  onClick={() => openModal(dash)}
                  className="flex flex-col items-center justify-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-blue-600/20 hover:border-blue-400/50 hover:-translate-y-1 transition-all duration-300 group h-full"
                >
                  <Icon className="w-10 h-10 md:w-12 md:h-12 text-blue-400 group-hover:text-blue-300 group-hover:scale-110 transition-all duration-300 drop-shadow-md" />
                  <span className="font-bold text-sm md:text-base tracking-widest uppercase text-gray-200 group-hover:text-white text-center leading-tight">{dash.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modal */}
      {selectedDashboard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-[#050510] border border-blue-500/30 rounded-3xl p-0 max-w-3xl w-full relative shadow-[0_0_80px_rgba(37,99,235,0.2)] overflow-hidden flex flex-col md:flex-row min-h-[350px]">
            
            {!loginSuccess && (
              <button 
                onClick={() => setSelectedDashboard(null)}
                className="absolute top-4 right-4 z-20 text-gray-400 hover:text-white bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-full p-2 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            )}

            {/* Modal Left Side - Visual */}
            <div className={`hidden md:flex flex-col items-center justify-center w-2/5 p-8 border-r border-white/5 relative overflow-hidden transition-colors duration-500 ${loginSuccess ? 'bg-gradient-to-br from-green-900/40 to-[#050510]' : 'bg-gradient-to-br from-blue-900/40 to-[#050510]'}`}>
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
              <selectedDashboard.icon className={`w-24 h-24 mb-4 relative z-10 transition-colors duration-500 ${loginSuccess ? 'text-green-400 drop-shadow-[0_0_15px_rgba(74,222,128,0.5)]' : 'text-blue-400 drop-shadow-[0_0_15px_rgba(96,165,250,0.5)]'}`} />
              <h4 className="text-2xl font-bold text-center text-white tracking-widest relative z-10">{selectedDashboard.name}</h4>
              <p className={`text-center text-xs mt-3 relative z-10 transition-colors duration-500 ${loginSuccess ? 'text-green-200/70' : 'text-blue-200/70'}`}>
                {loginSuccess ? 'Autorización Concedida' : 'Conexión Segura'}
              </p>
            </div>

            {/* Modal Right Side - Form */}
            <div className="w-full md:w-3/5 p-8 md:p-12 flex flex-col justify-center relative">
              {loginSuccess ? (
                <div className="flex-1 flex flex-col items-center justify-center animate-in zoom-in fade-in duration-500">
                  <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
                    <CheckCircle className="w-10 h-10 text-green-400" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-center mb-2 uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-200 drop-shadow-[0_0_10px_rgba(74,222,128,0.5)] leading-snug">
                    BIENVENIDO
                  </h3>
                  <div className="flex items-center gap-2 mt-4 text-green-500 text-xs tracking-widest uppercase">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-ping"></div>
                    Cargando Entorno...
                  </div>
                </div>
              ) : (
                <>
                  <div className="mb-6">
                    <h3 className="text-xl md:text-2xl font-bold text-center mb-2 uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-200">
                      CREDENCIALES
                    </h3>
                  </div>

                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] pl-1">Usuario</label>
                      <input 
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-600 focus:border-blue-500 focus:bg-blue-900/10 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                        placeholder="Ingrese su usuario..."
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] pl-1">Contraseña</label>
                      <input 
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-600 focus:border-blue-500 focus:bg-blue-900/10 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                        placeholder="••••••••"
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
                        className="w-full bg-gradient-to-r from-blue-700 to-blue-500 hover:from-blue-600 hover:to-blue-400 text-white font-bold py-3.5 rounded-xl transition-all tracking-[0.2em] text-sm shadow-lg shadow-blue-900/50 hover:shadow-blue-600/50 hover:-translate-y-1"
                      >
                        INGRESAR AL SISTEMA
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
