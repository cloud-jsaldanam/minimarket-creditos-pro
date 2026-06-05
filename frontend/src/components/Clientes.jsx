import React, { useState, useEffect } from 'react';

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [notificacion, setNotificacion] = useState({ visible: false, texto: '', tipo: '' });

  // VALIDACIÓN DE SEGURIDAD
  const esAdmin = localStorage.getItem('minimarket_user') === 'admin';

  const cargarClientes = () => {
    fetch('/api/clientes').then(res => res.json()).then(data => { if(Array.isArray(data)) setClientes(data); });
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
        cargarClientes();
      } else {
        mostrarNotificacion(`❌ ${data.error || 'Error al guardar'}`, 'error');
      }
    } catch (error) {
      mostrarNotificacion('❌ Error de conexión.', 'error');
    } finally {
      setGuardando(false);
    }
  };

  const eliminarCliente = async (id) => {
    if (!esAdmin) return; // Doble capa de seguridad
    if(window.confirm("¿Estás seguro de eliminar a este cliente permanentemente?")) {
      await fetch(`/api/clientes?id=${id}`, { method: 'DELETE' });
      cargarClientes();
      mostrarNotificacion('🗑️ Cliente eliminado', 'exito');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 md:p-8 rounded-2xl shadow-lg border border-gray-100">
        <h2 className="text-lg md:text-xl font-extrabold text-gray-800 mb-6 flex items-center gap-2">
          <span className="text-indigo-600">👥</span> Registrar Nuevo Cliente
        </h2>

        {notificacion.visible && (
          <div className={`p-4 mb-6 rounded-xl text-sm font-medium ${notificacion.tipo === 'exito' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
            {notificacion.texto}
          </div>
        )}
        
        {/* Adaptable a móviles */}
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre (Ej. Juan Pérez)" className="w-full md:w-1/2 border border-gray-300 rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500" />
          <input type="text" value={telefono} onChange={(e) => setTelefono(e.target.value)} placeholder="Teléfono (Opcional)" className="w-full md:w-1/2 border border-gray-300 rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500" />
        </div>
        <button onClick={handleGuardarCliente} disabled={guardando} className="w-full text-white font-bold py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 transition-all shadow-md">
          {guardando ? 'Guardando...' : 'Guardar Cliente'}
        </button>
      </div>

      <div className="bg-white p-5 md:p-8 rounded-2xl shadow-lg border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg md:text-xl font-extrabold text-gray-800">Directorio ({clientes.length})</h2>
        </div>
        <div className="max-h-64 overflow-y-auto border border-gray-100 rounded-xl">
          {clientes.map(c => (
            <div key={c.id} className="p-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between sm:items-center hover:bg-gray-50 group gap-2">
              <div>
                <p className="font-bold text-gray-700">{c.nombre}</p>
                <p className="text-sm text-gray-500">{c.telefono || 'Sin teléfono'}</p>
              </div>
              {/* Solo se muestra si es admin */}
              {esAdmin && (
                <button onClick={() => eliminarCliente(c.id)} className="bg-red-50 text-red-400 px-3 py-2 sm:py-1 rounded-md sm:opacity-0 group-hover:opacity-100 hover:bg-red-500 hover:text-white transition-all text-sm font-bold w-full sm:w-auto mt-2 sm:mt-0">
                  Eliminar
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}