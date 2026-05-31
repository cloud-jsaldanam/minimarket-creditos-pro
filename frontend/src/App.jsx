import React, { useState, useEffect } from 'react';

const ModuloClientes = ({ clientes, onClienteCreado }) => {
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [guardando, setGuardando] = useState(false);

  const registrarCliente = async () => {
    if (!nombre) return;
    setGuardando(true);
    try {
      const respuesta = await fetch('/api/CrearCliente', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ nombre, telefono })
      });
      if (respuesta.ok) { setNombre(''); setTelefono(''); onClienteCreado(); }
    } catch (error) { alert("Error al conectar."); } finally { setGuardando(false); }
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 max-w-xl mx-auto">
        <h2 className="text-xl font-bold text-slate-800 mb-4">👥 Registrar Nuevo Cliente</h2>
        <div className="space-y-4">
          <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Nombre (Ej. Juan Pérez)"/>
          <input type="text" value={telefono} onChange={(e) => setTelefono(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Teléfono (Opcional)"/>
          <button onClick={registrarCliente} disabled={!nombre || guardando} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 rounded-md">
            {guardando ? 'Guardando...' : '💾 Guardar Cliente'}
          </button>
        </div>
      </div>
    </div>
  );
};

const ModuloVentas = ({ clientes, onVentaRealizada }) => {
  const [busqueda, setBusqueda] = useState('');
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [carrito, setCarrito] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [prod, setProd] = useState({ nombre: '', precio: '', cantidad: 1 });

  const agregarAlCarrito = () => {
    if (!prod.nombre || !prod.precio) return;
    setCarrito([...carrito, { ...prod, subtotal: parseFloat(prod.precio) * parseInt(prod.cantidad) }]);
    setProd({ nombre: '', precio: '', cantidad: 1 });
  };

  const guardarVenta = async () => {
    setCargando(true);
    const respuesta = await fetch('/api/CrearVenta', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cliente: clienteSeleccionado.nombre, productos: carrito, total: carrito.reduce((a, b) => a + b.subtotal, 0) })
    });
    if (respuesta.ok) { alert("Crédito registrado."); setCarrito([]); onVentaRealizada(); }
    setCargando(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h3 className="font-bold mb-4">📝 Nueva Venta</h3>
        <input className="w-full p-2 border rounded mb-4" placeholder="Buscar cliente..." onChange={(e) => setBusqueda(e.target.value)}/>
        {clientes.filter(c => c.nombre.toLowerCase().includes(busqueda.toLowerCase())).slice(0,3).map(cli => (
          <button key={cli.id} onClick={() => setClienteSeleccionado(cli)} className="block w-full p-2 hover:bg-slate-100 text-left">👤 {cli.nombre}</button>
        ))}
        {clienteSeleccionado && <div className="mt-4 p-3 bg-indigo-50 font-bold">Cliente: {clienteSeleccionado.nombre}</div>}
        <div className="space-y-2 mt-4">
          <input className="w-full p-2 border rounded" placeholder="Producto" value={prod.nombre} onChange={(e) => setProd({...prod, nombre: e.target.value})}/>
          <div className="flex gap-2">
            <input type="number" className="w-1/2 p-2 border rounded" placeholder="Precio" value={prod.precio} onChange={(e) => setProd({...prod, precio: e.target.value})}/>
            <button onClick={agregarAlCarrito} className="w-1/2 bg-slate-800 text-white rounded">⬇️ Agregar</button>
          </div>
        </div>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h3 className="font-bold mb-4">🛒 Detalle</h3>
        {carrito.map((item, i) => <div key={i} className="flex justify-between p-2 border-b">{item.nombre} - S/ {item.subtotal.toFixed(2)}</div>)}
        <button onClick={guardarVenta} className="w-full mt-6 bg-indigo-600 text-white py-3 rounded-lg font-bold">✅ Confirmar</button>
      </div>
    </div>
  );
};

function App() {
  const [vista, setVista] = useState('clientes');
  const [clientes, setClientes] = useState([]);
  const obtenerDatos = () => { fetch('/api/GetClientes').then(res => res.json()).then(data => setClientes(data.datos || [])); };
  useEffect(() => { obtenerDatos(); }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <nav className="flex gap-4 mb-8">
        <button onClick={() => setVista('clientes')} className="font-bold text-indigo-600">👥 Clientes</button>
        <button onClick={() => setVista('ventas')} className="font-bold text-indigo-600">🛒 Venta</button>
      </nav>
      {vista === 'clientes' && <ModuloClientes clientes={clientes} onClienteCreado={obtenerDatos} />}
      {vista === 'ventas' && <ModuloVentas clientes={clientes} onVentaRealizada={obtenerDatos} />}
    </div>
  );
}
export default App;