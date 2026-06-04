import React, { useState } from 'react';
import Clientes from './components/Clientes';
import Ventas from './components/Ventas';
import Dashboard from './components/Dashboard';
import Deudores from './components/Deudores';

function App() {
  const [vistaActiva, setVistaActiva] = useState('dashboard'); // El dashboard será la pantalla inicial

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans text-gray-800">
      
      {/* Menú de Navegación Mejorado */}
      <div className="flex flex-wrap gap-6 mb-10 text-lg border-b border-gray-200 pb-2">
        <button onClick={() => setVistaActiva('dashboard')} className={`flex items-center gap-2 transition-colors ${vistaActiva === 'dashboard' ? 'text-emerald-600 font-bold border-b-2 border-emerald-600 pb-2 -mb-[9px]' : 'text-gray-400 hover:text-emerald-500'}`}>
          <span>📈</span> Dashboard
        </button>
        <button onClick={() => setVistaActiva('ventas')} className={`flex items-center gap-2 transition-colors ${vistaActiva === 'ventas' ? 'text-orange-500 font-bold border-b-2 border-orange-500 pb-2 -mb-[9px]' : 'text-gray-400 hover:text-orange-400'}`}>
          <span>🛒</span> Nueva Venta
        </button>
        <button onClick={() => setVistaActiva('clientes')} className={`flex items-center gap-2 transition-colors ${vistaActiva === 'clientes' ? 'text-indigo-700 font-bold border-b-2 border-indigo-700 pb-2 -mb-[9px]' : 'text-gray-400 hover:text-indigo-500'}`}>
          <span>👥</span> Clientes
        </button>
        <button onClick={() => setVistaActiva('deudores')} className={`flex items-center gap-2 transition-colors ${vistaActiva === 'deudores' ? 'text-red-500 font-bold border-b-2 border-red-500 pb-2 -mb-[9px]' : 'text-gray-400 hover:text-red-400'}`}>
          <span>⚠️</span> Deudores
        </button>
      </div>

      {/* Renderizado Dinámico */}
      <div className="max-w-3xl mx-auto">
        {vistaActiva === 'dashboard' && <Dashboard />}
        {vistaActiva === 'ventas' && <Ventas />}
        {vistaActiva === 'clientes' && <Clientes />}
        {vistaActiva === 'deudores' && <Deudores />}
      </div>

    </div>
  );
}

export default App;