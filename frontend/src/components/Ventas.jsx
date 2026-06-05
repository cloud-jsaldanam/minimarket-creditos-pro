import React, { useState, useEffect } from 'react';

export default function Ventas() {
  const [clientes, setClientes] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  
  const [carrito, setCarrito] = useState([]);
  const [productoActual, setProductoActual] = useState('');
  const [precioActual, setPrecioActual] = useState('');
  
  const [guardando, setGuardando] = useState(false);
  const [notificacion, setNotificacion] = useState({ visible: false, texto: '', tipo: '' });

  useEffect(() => {
    fetch('/api/clientes').then(res => res.json()).then(data => { if(Array.isArray(data)) setClientes(data); });
  }, []);

  const mostrarNotificacion = (texto, tipo) => {
    setNotificacion({ visible: true, texto, tipo });
    setTimeout(() => setNotificacion({ visible: false, texto: '', tipo: '' }), 4000);
  };

  const clientesFiltrados = busqueda === '' ? [] : clientes.filter(c => c.nombre?.toLowerCase().includes(busqueda.toLowerCase()));

  const agregarAlCarrito = () => {
    if (!productoActual || !precioActual || isNaN(precioActual) || parseFloat(precioActual) <= 0) {
      mostrarNotificacion('⚠️ Ingresa un producto y precio válido.', 'error');
      return;
    }
    setCarrito([...carrito, { producto: productoActual, precio: parseFloat(precioActual) }]);
    setProductoActual('');
    setPrecioActual('');
  };

  const eliminarDelCarrito = (index) => {
    const nuevoCarrito = [...carrito];
    nuevoCarrito.splice(index, 1);
    setCarrito(nuevoCarrito);
  };

  const totalCarrito = carrito.reduce((sum, item) => sum + item.precio, 0);

  const handleGuardarVenta = async () => {
    if (!clienteSeleccionado) return mostrarNotificacion('⚠️ Debes seleccionar un cliente.', 'error');
    if (carrito.length === 0) return mostrarNotificacion('⚠️ El carrito está vacío.', 'error');

    setGuardando(true);
    try {
      const response = await fetch('/api/ventas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          clienteId: clienteSeleccionado.id,
          clienteNombre: clienteSeleccionado.nombre,
          items: carrito,
          total: totalCarrito,
          tipoPago: 'Crédito', // Bloqueado estrictamente a crédito
          estado: 'Deuda'
        })
      });

      if (response.ok) {
        mostrarNotificacion('✅ Crédito registrado exitosamente.', 'exito');
        setBusqueda(''); setClienteSeleccionado(null); setCarrito([]);
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
        <span className="text-orange-500">🛒</span> Registrar Nuevo Crédito
      </h2>

      {notificacion.visible && (
        <div className={`p-4 mb-6 rounded-xl font-medium ${notificacion.tipo === 'exito' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
          {notificacion.texto}
        </div>
      )}
      
      <div className="space-y-4">
        <div className="relative">
          <input type="text" value={busqueda} onChange={(e) => { setBusqueda(e.target.value); setClienteSeleccionado(null); }} placeholder="Buscar cliente..." className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500" />
          {clientesFiltrados.length > 0 && !clienteSeleccionado && (
            <ul className="absolute z-20 w-full bg-white border border-gray-200 rounded-lg shadow-xl max-h-48 overflow-y-auto mt-1">
              {clientesFiltrados.map(c => (
                <li key={c.id} onClick={() => { setClienteSeleccionado(c); setBusqueda(c.nombre); }} className="px-4 py-3 hover:bg-indigo-50 cursor-pointer border-b font-medium text-gray-700">{c.nombre}</li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex gap-4 items-end bg-gray-50 p-4 rounded-xl border border-gray-200">
          <div className="flex-1">
            <label className="block text-xs font-bold text-gray-500 mb-1">Producto</label>
            <input type="text" value={productoActual} onChange={(e) => setProductoActual(e.target.value)} className="w-full border border-gray-300 rounded-xl px-4 py-2" />
          </div>
          <div className="w-1/4">
            <label className="block text-xs font-bold text-gray-500 mb-1">Precio (S/)</label>
            <input type="number" value={precioActual} onChange={(e) => setPrecioActual(e.target.value)} className="w-full border border-gray-300 rounded-xl px-4 py-2" />
          </div>
          <button onClick={agregarAlCarrito} className="bg-indigo-100 text-indigo-700 font-bold px-4 py-2 rounded-xl hover:bg-indigo-600 hover:text-white transition-all h-10">
            + Añadir
          </button>
        </div>

        {carrito.length > 0 && (
          <div className="border border-gray-200 rounded-xl overflow-hidden mt-4">
            <div className="bg-gray-100 px-4 py-2 font-bold text-gray-700 text-sm flex justify-between">
              <span>Items a fiar</span>
              <span>S/ {totalCarrito.toFixed(2)}</span>
            </div>
            {carrito.map((item, i) => (
              <div key={i} className="flex justify-between items-center px-4 py-2 border-b border-gray-100 text-sm">
                <span>{item.producto}</span>
                <div className="flex items-center gap-4">
                  <span className="font-semibold">S/ {item.precio.toFixed(2)}</span>
                  <button onClick={() => eliminarDelCarrito(i)} className="text-red-500 hover:text-red-700">❌</button>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* BOTÓN LIMPIO Y COMPLETO */}
        <div className="pt-4 border-t border-gray-100">
          <button onClick={handleGuardarVenta} disabled={guardando} className="w-full bg-gray-900 text-white font-bold py-3 px-4 rounded-xl hover:bg-black transition-all shadow-md">
            {guardando ? 'Guardando...' : `Anotar Deuda por S/ ${totalCarrito.toFixed(2)}`}
          </button>
        </div>
      </div>
    </div>
  );
}