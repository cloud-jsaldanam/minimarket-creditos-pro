import React, { useState } from 'react';

export default function Clientes() {
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [guardando, setGuardando] = useState(false);

  // Conexión real al Backend
  const handleGuardarCliente = async () => {
    if (!nombre) {
      alert('⚠️ Por favor, ingresa el nombre del cliente.');
      return;
    }

    setGuardando(true);
    try {
      // Llamamos a la API que creamos en el paso anterior
      const response = await fetch('/api/clientes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          nombre: nombre, 
          telefono: telefono,
          fechaRegistro: new Date().toISOString()
        })
      });

      if (response.ok) {
        alert('✅ ¡Cliente guardado exitosamente en Cosmos DB!');
        setNombre('');
        setTelefono('');
      } else {
        alert('❌ Hubo un error al guardar en la base de datos.');
      }
    } catch (error) {
      alert('❌ Error de conexión con el servidor.');
      console.error(error);
    } finally {
      setGuardando(false);
    }
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
          className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
        />
        <input 
          type="text" 
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          placeholder="Teléfono (Opcional)" 
          className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
        />
        <button 
          onClick={handleGuardarCliente}
          disabled={guardando}
          className={`w-full text-white font-bold text-lg py-3 px-4 rounded-xl shadow-md transition-all duration-300 flex justify-center items-center gap-2 mt-2 ${guardando ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg transform hover:-translate-y-1'}`}
        >
          <span>{guardando ? '⏳' : '💾'}</span> 
          {guardando ? 'Guardando en BD...' : 'Guardar Cliente'}
        </button>
      </div>
    </div>
  );
}