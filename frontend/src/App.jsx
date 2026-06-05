import React, { useState, useEffect } from 'react';
import Clientes from './components/Clientes';
import Ventas from './components/Ventas';
import Dashboard from './components/Dashboard';
import Deudores from './components/Deudores';

function App() {
  const [autenticado, setAutenticado] = useState(false);
  const [cargandoSesion, setCargandoSesion] = useState(true);
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [errorLogin, setErrorLogin] = useState('');
  const [vistaActiva, setVistaActiva] = useState('dashboard');

  // VERIFICAR SESIÓN ACTIVA AL REFRESCAR LA PÁGINA
  useEffect(() => {
    const sesionGuardada = localStorage.getItem('minimarket_session');
    if (sesionGuardada) {
      const tiempoInicio = parseInt(sesionGuardada, 10);
      const ochoHoras = 8 * 60 * 60 * 1000;
      
      if (Date.now() - tiempoInicio < ochoHoras) {
        setAutenticado(true);
      } else {
        localStorage.removeItem('minimarket_session'); // Expiró
      }
    }
    setCargandoSesion(false);
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (usuario === 'admin' && password === 'Caracas2026$$') {
      // Guardar timestamp actual en el navegador
      localStorage.setItem('minimarket_session', Date.now().toString());
      setAutenticado(true);
      setErrorLogin('');
    } else {
      setErrorLogin('Usuario o contraseña incorrectos');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('minimarket_session');
    setAutenticado(false);
    setUsuario('');
    setPassword('');
  };

  if (cargandoSesion) return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Cargando...</div>;

  if (!autenticado) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-200">
          <div className="text-center mb-8">
            <span className="text-5xl">🏪</span>
            <h1 className="text-2xl font-black text-gray-800 mt-4">Sistema Minimarket</h1>
            <p className="text-gray-500">Ingresa tus credenciales para continuar</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            {errorLogin && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center border border-red-200">{errorLogin}</div>}
            <input type="text" placeholder="Usuario" value={usuario} onChange={e => setUsuario(e.target.value)} className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none" />
            <input type="password" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none" />
            <button type="submit" className="w-full bg-gray-900 text-white font-bold py-3 rounded-xl hover:bg-gray-800 transition-all shadow-md">Ingresar al Sistema</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans text-gray-800">
      <div className="flex justify-between items-center border-b border-gray-200 pb-2 mb-10">
        <div className="flex flex-wrap gap-6 text-lg">
          <button onClick={() => setVistaActiva('dashboard')} className={`flex items-center gap-2 transition-colors ${vistaActiva === 'dashboard' ? 'text-emerald-600 font-bold border-b-2 border-emerald-600 pb-2 -mb-[9px]' : 'text-gray-400 hover:text-emerald-500'}`}><span>📈</span> Dashboard</button>
          <button onClick={() => setVistaActiva('ventas')} className={`flex items-center gap-2 transition-colors ${vistaActiva === 'ventas' ? 'text-orange-500 font-bold border-b-2 border-orange-500 pb-2 -mb-[9px]' : 'text-gray-400 hover:text-orange-400'}`}><span>🛒</span> Nueva Venta</button>
          <button onClick={() => setVistaActiva('clientes')} className={`flex items-center gap-2 transition-colors ${vistaActiva === 'clientes' ? 'text-indigo-700 font-bold border-b-2 border-indigo-700 pb-2 -mb-[9px]' : 'text-gray-400 hover:text-indigo-500'}`}><span>👥</span> Clientes</button>
          <button onClick={() => setVistaActiva('deudores')} className={`flex items-center gap-2 transition-colors ${vistaActiva === 'deudores' ? 'text-red-500 font-bold border-b-2 border-red-500 pb-2 -mb-[9px]' : 'text-gray-400 hover:text-red-400'}`}><span>⚠️</span> Deudores</button>
        </div>
        <button onClick={handleLogout} className="text-sm font-bold text-gray-500 hover:text-red-600 transition-colors">Cerrar Sesión</button>
      </div>

      <div className="max-w-4xl mx-auto">
        {vistaActiva === 'dashboard' && <Dashboard />}
        {vistaActiva === 'ventas' && <Ventas />}
        {vistaActiva === 'clientes' && <Clientes />}
        {vistaActiva === 'deudores' && <Deudores />}
      </div>
    </div>
  );
}

export default App;