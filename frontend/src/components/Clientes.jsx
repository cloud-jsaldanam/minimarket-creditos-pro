import React, { useState, useEffect } from 'react';

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [notificacion, setNotificacion] = useState({ visible: false, texto: '', tipo: '' });

  const cargarClientes = () => {
    fetch('/api/clientes')
      .then(res => res.json())
      .then(data => { if(Array.isArray(data)) setClientes(data); });
  };

  useEffect(() => { cargarClientes(); }, []);

  const mostrarNotificacion = (texto, tipo) => {
    setNotificacion({ visible: true, texto, tipo });
    setTimeout(() => setNotificacion({ visible: false, texto: '', tipo: '' }), 4000);
  };

  const handleGuardarCliente = async () => {
    if (!nombre) return mostrarNotificacion('⚠️ Ingresa el nombre del cliente.', 'error');
    setGuardando(true);
    try {
      const response = await fetch('/api/clientes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: nombre.trim(), telefono })
      });
      
      const data = await response.json();
      if (response.ok) {
        mostrarNotificacion('✅ Cliente guardado exitosamente', 'exito');
        setNombre(''); setTelefono('');
        cargarClientes(); // Recargamos la lista
      } else {
        mostrarNotificacion(`❌ ${data.error || 'Error al guardar'}`, 'error');
      }
    } catch (error) {
      mostrarNotificacion('❌ Error de conexión.', 'error');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
        <h2 className="text-xl font-extrabold text-gray-800 mb-6 flex items-center gap-2">
          <span className="text-indigo-600">👥</span> Registrar Nuevo Cliente
        </h2>

        {notificacion.visible && (
          <div className={`p-4 mb-6 rounded-xl font-medium ${notificacion.tipo === 'exito' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
            {notificacion.texto}
          </div>
        )}
        
        <div className="flex gap-4 mb-2">
          <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre (Ej. Juan Pérez)" className="w-1/2 border border-gray-300 rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500" />
          <input type="text" value={telefono} onChange={(e) => setTelefono(e.target.value)} placeholder="Teléfono (Opcional)" className="w-1/2 border border-gray-300 rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500" />
        </div>
        <button onClick={handleGuardarCliente} disabled={guardando} className="w-full text-white font-bold py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 transition-all">
          {guardando ? 'Guardando...' : 'Guardar Cliente'}
        </button>
      </div>

      {/* LISTA DE CLIENTES REGISTRADOS */}
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
        <h2 className="text-xl font-extrabold text-gray-800 mb-4">Directorio de Clientes ({clientes.length})</h2>
        <div className="max-h-64 overflow-y-auto border border-gray-100 rounded-xl">
          {clientes.map(c => (
            <div key={c.id} className="p-4 border-b border-gray-100 flex justify-between items-center hover:bg-gray-50">
              <p className="font-bold text-gray-700">{c.nombre}</p>
              <p className="text-sm text-gray-500">{c.telefono || 'Sin teléfono'}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}