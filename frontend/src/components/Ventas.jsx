import React, { useState } from 'react';

export default function Ventas() {
  const [cliente, setCliente] = useState('');
  const [producto, setProducto] = useState('');
  const [precio, setPrecio] = useState('');

  const handleAgregarVenta = () => {
    if (!cliente || !producto || !precio) {
      alert('⚠️ Por favor completa todos los campos de la venta.');
      return;
    }
    alert(`🛒 ¡Venta Registrada en Frontend!\nCliente: ${cliente}\nProducto: ${producto}\nPrecio: S/ ${precio}`);
    setProducto('');
    setPrecio('');
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
      <h2 className="text-xl font-extrabold text-gray-800 mb-6 flex items-center gap-2">
        <span className="text-orange-500">📝</span> Nueva Venta
      </h2>
      
      <div className="space-y-4">
        <input 
          type="text" 
          value={cliente}
          onChange={(e) => setCliente(e.target.value)}
          placeholder="Buscar cliente..." 
          className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
        />
        <input 
          type="text" 
          value={producto}
          onChange={(e) => setProducto(e.target.value)}
          placeholder="Producto" 
          className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
        />
        
        <div className="flex gap-4">
          <input 
            type="number" 
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            placeholder="Precio" 
            className="w-2/3 border border-gray-300 rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
          />
          <button 
            onClick={handleAgregarVenta}
            className="w-1/3 bg-gray-800 text-white font-bold py-3 px-4 rounded-xl shadow-md hover:bg-gray-900 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex justify-center items-center gap-1"
          >
            <span>⬇️</span> Agregar
          </button>
        </div>
      </div>
    </div>
  );
}