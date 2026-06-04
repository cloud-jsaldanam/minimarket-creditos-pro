import React, { useState, useEffect } from 'react';

export default function Deudores() {
  const [deudores, setDeudores] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    fetch('/api/ventas')
      .then(res => res.json())
      .then(ventas => {
        if(Array.isArray(ventas)) {
          // Filtramos solo las ventas que están marcadas como deuda
          const deudasPendientes = ventas.filter(v => v.estado === 'Deuda');
          setDeudores(deudasPendientes);
        }
        setCargando(false);
      })
      .catch(err => setCargando(false));
  }, []);

  const totalDeuda = deudores.reduce((acc, curr) => acc + curr.precio, 0);

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg border border-red-100 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-bl-full -z-10"></div>

      <div className="flex justify-between items-end mb-6">
        <h2 className="text-xl font-extrabold text-gray-800 flex items-center gap-2">
          <span className="text-red-500">⚠️</span> Clientes con Deuda
        </h2>
        <div className="text-right">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Deuda Total</p>
          <p className="text-2xl font-black text-red-600">S/ {totalDeuda.toFixed(2)}</p>
        </div>
      </div>

      <div className="space-y-3">
        {cargando ? (
          <p className="text-gray-500 animate-pulse">Cargando deudas de la base de datos...</p>
        ) : deudores.length === 0 ? (
          <p className="text-emerald-600 font-bold bg-emerald-50 p-4 rounded-lg border border-emerald-100">¡Felicidades! No tienes cuentas por cobrar.</p>
        ) : (
          deudores.map((deuda) => {
            // Calculamos los días transcurridos desde que se hizo la venta
            const diasRetraso = Math.floor((new Date() - new Date(deuda.fecha)) / (1000 * 60 * 60 * 24));
            
            return (
              <div key={deuda.id} className="flex justify-between items-center p-4 bg-gray-50 border border-gray-100 rounded-xl hover:bg-red-50 hover:border-red-200 transition-colors">
                <div>
                  <p className="font-bold text-gray-800">{deuda.clienteNombre}</p>
                  <p className="text-xs text-gray-500 font-medium">Producto: {deuda.producto}</p>
                  <p className="text-xs text-red-400 font-bold mt-1">{diasRetraso} días de retraso</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-bold text-gray-800">S/ {deuda.precio.toFixed(2)}</span>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  );
}