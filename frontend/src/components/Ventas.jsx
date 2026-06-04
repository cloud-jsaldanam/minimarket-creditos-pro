import React, { useState, useEffect } from 'react';

export default function Ventas() {
  const [clientes, setClientes] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [producto, setProducto] = useState('');
  const [precio, setPrecio] = useState('');
  const [tipoPago, setTipoPago] = useState('Contado');
  const [guardando, setGuardando] = useState(false);

  // 1. Al cargar la pantalla, traemos los clientes reales de Cosmos DB
  useEffect(() => {
    fetch('/api/clientes')
      .then(res => res.json())
      .then(data => setClientes(data))
      .catch(err => console.error("Error cargando clientes:", err));
  }, []);

  // 2. Lógica del buscador en tiempo real
  const clientesFiltrados = busqueda === '' ? [] : clientes.filter(c => 
    c.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const seleccionarCliente = (cliente) => {
    setClienteSeleccionado(cliente);
    setBusqueda(cliente.nombre); // Llenamos el input con el nombre
  };

  // 3. Guardar la venta en la Base de Datos
  const handleAgregarVenta = async () => {
    if (!clienteSeleccionado || !producto || !precio) {
      alert('⚠️ Por favor selecciona un cliente y completa la venta.');
      return;
    }

    setGuardando(true);
    try {
      const response = await fetch('/api/ventas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          clienteId: clienteSeleccionado.id,
          clienteNombre: clienteSeleccionado.nombre,
          producto,
          precio: parseFloat(precio),
          tipoPago,
          estado: tipoPago === 'Crédito' ? 'Deuda' : 'Pagado'
        })
      });

      if (response.ok) {
        alert('✅ ¡Venta Registrada Exitosamente!');
        setBusqueda(''); setClienteSeleccionado(null); setProducto(''); setPrecio('');
      }
    } catch (error) {
      alert('❌ Error al guardar la venta.');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
      <h2 className="text-xl font-extrabold text-gray-800 mb-6 flex items-center gap-2">
        <span className="text-orange-500">📝</span> Nueva Venta
      </h2>
      
      <div className="space-y-4 relative">
        {/* BUSCADOR AUTOCOMPLETADO */}
        <div className="relative">
          <input 
            type="text" 
            value={busqueda}
            onChange={(e) => {
              setBusqueda(e.target.value);
              setClienteSeleccionado(null); // Resetea si cambia el texto
            }}
            placeholder="Buscar cliente por nombre..." 
            className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {/* Menú desplegable de resultados */}
          {clientesFiltrados.length > 0 && !clienteSeleccionado && (
            <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg shadow-xl max-h-48 overflow-y-auto mt-1">
              {clientesFiltrados.map(c => (
                <li 
                  key={c.id} 
                  onClick={() => seleccionarCliente(c)}
                  className="px-4 py-3 hover:bg-indigo-50 cursor-pointer border-b border-gray-100 font-medium text-gray-700"
                >
                  {c.nombre} <span className="text-xs text-gray-400 ml-2">{c.telefono}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <input 
          type="text" 
          value={producto}
          onChange={(e) => setProducto(e.target.value)}
          placeholder="Producto o Descripción" 
          className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        
        <div className="flex gap-4">
          <input 
            type="number" 
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            placeholder="Precio (S/)" 
            className="w-1/3 border border-gray-300 rounded-xl px-4 py-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <select 
            value={tipoPago}
            onChange={(e) => setTipoPago(e.target.value)}
            className="w-1/3 border border-gray-300 rounded-xl px-4 py-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="Contado">Contado</option>
            <option value="Crédito">A Crédito (Deuda)</option>
          </select>
          <button 
            onClick={handleAgregarVenta}
            disabled={guardando}
            className="w-1/3 bg-gray-800 text-white font-bold py-3 px-4 rounded-xl hover:bg-gray-900 transition-all flex justify-center items-center gap-1"
          >
            <span>{guardando ? '⏳' : '⬇️'}</span> {guardando ? '...' : 'Agregar'}
          </button>
        </div>
      </div>
    </div>
  );
}