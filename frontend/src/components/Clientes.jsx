import React, { useState } from 'react';

export default function Clientes() {
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [notificacion, setNotificacion] = useState({ visible: false, texto: '', tipo: '' });

  const mostrarNotificacion = (texto, tipo) => {
    setNotificacion({ visible: true, texto, tipo });
    setTimeout(() => setNotificacion({ visible: false, texto: '', tipo: '' }), 4000);
  };

  const handleGuardarCliente = async () => {
    if (!nombre) {
      mostrarNotificacion('⚠️ Por favor, ingresa el nombre del cliente.', 'error');
      return;
    }

    setGuardando(true);
    try {
      const response = await fetch('/api/clientes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, telefono, fechaRegistro: new Date().toISOString() })
      });

      if (response.ok) {
        mostrarNotificacion('✅ Cliente guardado exitosamente', 'exito');
        setNombre('');
        setTelefono('');
      } else {
        mostrarNotificacion('❌ Hubo un error al guardar en la base de datos.', 'error');
      }
    } catch (error) {
      mostrarNotificacion('❌ Error de conexión con el servidor.', 'error');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
      <h2 className="text-xl font-extrabold text-gray-800 mb-6 flex items-center gap-2">
        <span className="text-indigo-600">👥</span> Registrar Nuevo Cliente
      </h2>

      {/* Notificación elegante integrada */}
      {notificacion.visible && (
        <div className={`p-4 mb-6 rounded-xl font-medium transition-all ${notificacion.tipo === 'exito' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {notificacion.texto}
        </div>
      )}
      
      <div className="space-y-4">
        <input 
          type="text" 
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Nombre (Ej. Juan Pérez)" 
          className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <input 
          type="text" 
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          placeholder="Teléfono (Opcional)" 
          className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button 
          onClick={handleGuardarCliente}
          disabled={guardando}
          className={`w-full text-white font-bold text-lg py-3 px-4 rounded-xl shadow-md transition-all flex justify-center items-center gap-2 mt-2 ${guardando ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg'}`}
        >
          <span>{guardando ? '⏳' : '💾'}</span> {guardando ? 'Guardando...' : 'Guardar Cliente'}
        </button>
      </div>
    </div>
  );
}