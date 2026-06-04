import React, { useState, useEffect } from 'react';

export default function Ventas() {
  const [clientes, setClientes] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [producto, setProducto] = useState('');
  const [precio, setPrecio] = useState('');
  const [tipoPago, setTipoPago] = useState('Contado');
  const [guardando, setGuardando] = useState(false);
  const [notificacion, setNotificacion] = useState({ visible: false, texto: '', tipo: '' });

  useEffect(() => {
    fetch('/api/clientes')
      .then(res => res.json())
      .then(data => {
        if(Array.isArray(data)) setClientes(data);
      })
      .catch(err => console.error("Error API:", err));
  }, []);

  const mostrarNotificacion = (texto, tipo) => {
    setNotificacion({ visible: true, texto, tipo });
    setTimeout(() => setNotificacion({ visible: false, texto: '', tipo: '' }), 4000);
  };

  const clientesFiltrados = busqueda === '' ? [] : clientes.filter(c => 
    c.nombre?.toLowerCase().includes(busqueda.toLowerCase())
  );

  const handleAgregarVenta = async () => {
    if (!clienteSeleccionado || !producto || !precio) {
      mostrarNotificacion('⚠️ Por favor selecciona un cliente y completa la venta.', 'error');
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
        mostrarNotificacion('✅ Venta registrada correctamente.', 'exito');
        setBusqueda(''); setClienteSeleccionado(null); setProducto(''); setPrecio('');
      } else {
        mostrarNotificacion('❌ Error al guardar en la base de datos.', 'error');
      }
    } catch (error) {
      mostrarNotificacion('❌ Error de comunicación con el servidor.', 'error');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
      <h2 className="text-xl font-extrabold text-gray-800 mb-6 flex items-center gap-2">
        <span className="text-orange-500">📝</span> Nueva Venta
      </h2>

      {notificacion.visible && (
        <div className={`p-4 mb-6 rounded-xl font-medium transition-all ${notificacion.tipo === 'exito' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {notificacion.texto}
        </div>
      )}
      
      <div className="space-y-4 relative">
        <div className="relative">
          <input 
            type="text" 
            value={busqueda}
            onChange={(e) => {
              setBusqueda(e.target.value);
              setClienteSeleccionado(null);
            }}
            placeholder="Buscar cliente por nombre..." 
            className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {clientesFiltrados.length > 0 && !clienteSeleccionado && (
            <ul className="absolute z-20 w-full bg-white border border-gray-200 rounded-lg shadow-xl max-h-48 overflow-y-auto mt-1">
              {clientesFiltrados.map(c => (
                <li 
                  key={c.id} 
                  onClick={() => { setClienteSeleccionado(c); setBusqueda(c.nombre); }}
                  className="px-4 py-3 hover:bg-indigo-50 cursor-pointer border-b border-gray-100 font-medium text-gray-700"
                >
                  {c.nombre}
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
            className={`w-1/3 text-white font-bold py-3 px-4 rounded-xl transition-all flex justify-center items-center gap-1 ${guardando ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-800 hover:bg-gray-900 shadow-md'}`}
          >
            <span>{guardando ? '⏳' : '⬇️'}</span> {guardando ? '...' : 'Agregar'}
          </button>
        </div>
      </div>
    </div>
  );
}