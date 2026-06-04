import React, { useState } from 'react';

export default function Clientes() {
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');

  // Esta función se ejecuta al hacer clic en Guardar
  const handleGuardarCliente = () => {
    if (!nombre) {
      alert('⚠️ Por favor, ingresa el nombre del cliente.');
      return;
    }
    // Aquí luego enviaremos la data a Cosmos DB a través de tu API
    alert(`✅ ¡Cliente capturado!\nNombre: ${nombre}\nTeléfono: ${telefono}\n\n(Pronto lo conectaremos a la base de datos)`);
    
    // Limpiamos las cajas de texto
    setNombre('');
    setTelefono('');
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
      <h2 className="text-xl font-extrabold text-gray-800 mb-6 flex items-center gap-2">
        <span className="text-indigo-600">👥</span> Registrar Nuevo Cliente
      </h2>
      
      <div className="space-y-4">
        <input 
          type="text" 
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Nombre (Ej. Juan Pérez)" 
          className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
        />
        <input 
          type="text" 
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          placeholder="Teléfono (Opcional)" 
          className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
        />
        <button 
          onClick={handleGuardarCliente}
          className="w-full bg-indigo-600 text-white font-bold text-lg py-3 px-4 rounded-xl shadow-md hover:bg-indigo-700 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex justify-center items-center gap-2 mt-2"
        >
          <span>💾</span> Guardar Cliente
        </button>
      </div>
    </div>
  );
}