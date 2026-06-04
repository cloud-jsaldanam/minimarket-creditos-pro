import React, { useState, useEffect } from 'react';

export default function Deudores() {
  const [deudasAgrupadas, setDeudasAgrupadas] = useState({});
  const [cargando, setCargando] = useState(true);

  const cargarDeudas = () => {
    fetch('/api/ventas')
      .then(res => res.json())
      .then(ventas => {
        if(Array.isArray(ventas)) {
          const pendientes = ventas.filter(v => v.estado === 'Deuda');
          const agrupado = pendientes.reduce((acc, deuda) => {
            if (!acc[deuda.clienteNombre]) {
              acc[deuda.clienteNombre] = { total: 0, historial: [] };
            }
            acc[deuda.clienteNombre].total += deuda.precio;
            acc[deuda.clienteNombre].historial.push(deuda);
            return acc;
          }, {});
          setDeudasAgrupadas(agrupado);
        }
        setCargando(false);
      });
  };

  useEffect(() => { cargarDeudas(); }, []);

  const abonarDeuda = async (idVenta, deudaActual) => {
    const montoRaw = prompt(`Deuda pendiente: S/ ${deudaActual.toFixed(2)}\n\n¿Cuánto dinero abonará el cliente?`);
    if (montoRaw === null) return; // Si el usuario presiona Cancelar
    
    const monto = parseFloat(montoRaw);
    if (isNaN(monto) || monto <= 0) {
      alert("⚠️ Por favor ingresa un monto válido mayor a 0.");
      return;
    }

    try {
      await fetch('/api/ventas', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: idVenta, abono: monto })
      });
      alert(`✅ Abono de S/ ${monto.toFixed(2)} registrado correctamente.`);
      cargarDeudas(); // Recarga la lista para actualizar los saldos
    } catch (error) {
      alert("❌ Error al procesar el abono.");
    }
  };

  const totalGlobal = Object.values(deudasAgrupadas).reduce((acc, curr) => acc + curr.total, 0);

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg border border-red-100">
      <div className="flex justify-between items-end mb-6 border-b pb-4">
        <h2 className="text-xl font-extrabold text-gray-800 flex items-center gap-2">
          <span className="text-red-500">⚠️</span> Control de Créditos
        </h2>
        <div className="text-right">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Deuda Total Global</p>
          <p className="text-3xl font-black text-red-600">S/ {totalGlobal.toFixed(2)}</p>
        </div>
      </div>

      <div className="space-y-4">
        {cargando ? <p>Cargando registros...</p> : Object.keys(deudasAgrupadas).length === 0 ? (
          <p className="text-emerald-600 font-bold bg-emerald-50 p-4 rounded-lg">No hay cuentas pendientes por cobrar.</p>
        ) : (
          Object.entries(deudasAgrupadas).map(([nombre, datos]) => (
            <div key={nombre} className="border border-gray-200 rounded-xl p-4 bg-gray-50 shadow-sm">
              <div className="flex justify-between items-center mb-3">
                <p className="font-extrabold text-lg text-gray-800">{nombre}</p>
                <p className="font-bold text-red-600 text-lg">Debe: S/ {datos.total.toFixed(2)}</p>
              </div>
              
              <div className="pl-4 border-l-2 border-red-200 space-y-2 mt-2">
                {datos.historial.map(compra => (
                  <div key={compra.id} className="flex justify-between items-center bg-white p-3 rounded-lg shadow-sm text-sm border border-gray-100">
                    <div>
                      <p className="font-bold text-gray-700">{compra.producto}</p>
                      <p className="text-xs text-gray-400">{new Date(compra.fecha).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-semibold text-gray-800 text-base">S/ {compra.precio.toFixed(2)}</span>
                      <button 
                        onClick={() => abonarDeuda(compra.id, compra.precio)} 
                        className="bg-indigo-100 text-indigo-700 font-bold px-4 py-2 rounded-lg hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                      >
                        Abonar 💰
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}