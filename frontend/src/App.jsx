import React from 'react';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans text-gray-800">
      
      {/* Navegación Superior */}
      <div className="flex gap-6 mb-10 text-indigo-700 font-bold text-lg">
        <button className="flex items-center gap-2 hover:text-indigo-900 transition-colors">
          <span>👥</span> Clientes
        </button>
        <button className="flex items-center gap-2 text-gray-400 hover:text-indigo-700 transition-colors">
          <span>🛒</span> Venta
        </button>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* TARJETA 1: Nuevo Cliente (Efecto Flotante) */}
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
          <h2 className="text-xl font-extrabold text-gray-800 mb-6 flex items-center gap-2">
            <span className="text-indigo-600">👥</span> Registrar Nuevo Cliente
          </h2>
          
          <div className="space-y-4">
            <input 
              type="text" 
              placeholder="Nombre (Ej. Juan Pérez)" 
              className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
            />
            <input 
              type="text" 
              placeholder="Teléfono (Opcional)" 
              className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
            />
            <button className="w-full bg-indigo-600 text-white font-bold text-lg py-3 px-4 rounded-xl shadow-md hover:bg-indigo-700 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex justify-center items-center gap-2 mt-2">
              <span>💾</span> Guardar Cliente
            </button>
          </div>
        </div>

        {/* TARJETA 2: Nueva Venta (Efecto Flotante) */}
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
          <h2 className="text-xl font-extrabold text-gray-800 mb-6 flex items-center gap-2">
            <span className="text-orange-500">📝</span> Nueva Venta
          </h2>
          
          <div className="space-y-4">
            <input 
              type="text" 
              placeholder="Buscar cliente..." 
              className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
            />
            <input 
              type="text" 
              placeholder="Producto" 
              className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
            />
            
            <div className="flex gap-4">
              <input 
                type="text" 
                placeholder="Precio" 
                className="w-2/3 border border-gray-300 rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
              />
              <button className="w-1/3 bg-gray-800 text-white font-bold py-3 px-4 rounded-xl shadow-md hover:bg-gray-900 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex justify-center items-center gap-1">
                <span>⬇️</span> Agregar
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;