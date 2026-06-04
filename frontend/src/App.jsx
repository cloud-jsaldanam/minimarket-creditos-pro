import React, { useState } from 'react';
import Clientes from './components/Clientes';
import Ventas from './components/Ventas';

function App() {
  // Estado para saber qué pantalla mostrar (por defecto mostramos 'clientes')
  const [vistaActiva, setVistaActiva] = useState('clientes');

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans text-gray-800">
      
      {/* Menú de Navegación Interactivo */}
      <div className="flex gap-6 mb-10 text-lg">
        <button 
          onClick={() => setVistaActiva('clientes')}
          className={`flex items-center gap-2 transition-colors ${vistaActiva === 'clientes' ? 'text-indigo-700 font-bold border-b-2 border-indigo-700 pb-1' : 'text-gray-400 hover:text-indigo-500'}`}
        >
          <span>👥</span> Clientes
        </button>
        
        <button 
          onClick={() => setVistaActiva('ventas')}
          className={`flex items-center gap-2 transition-colors ${vistaActiva === 'ventas' ? 'text-orange-500 font-bold border-b-2 border-orange-500 pb-1' : 'text-gray-400 hover:text-orange-400'}`}
        >
          <span>🛒</span> Venta
        </button>
      </div>

      {/* Renderizado Dinámico: Dependiendo del botón que presiones, muestra un módulo u otro */}
      <div className="max-w-3xl mx-auto">
        {vistaActiva === 'clientes' ? <Clientes /> : <Ventas />}
      </div>

    </div>
  );
}

export default App;