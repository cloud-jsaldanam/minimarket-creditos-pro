import React from 'react';

export default function Deudores() {
  // Datos simulados (Luego vendrán de Cosmos DB)
  const deudores = [
    { id: 1, nombre: 'Carlos Rodríguez', monto: 150.50, diasRetraso: 12 },
    { id: 2, nombre: 'María Fernández', monto: 45.00, diasRetraso: 3 },
    { id: 3, nombre: 'Tienda "El Sol"', monto: 890.00, diasRetraso: 25 },
  ];

  const totalDeuda = deudores.reduce((acc, curr) => acc + curr.monto, 0);

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg border border-red-100 relative overflow-hidden">
      {/* Decoración de fondo */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-bl-full -z-10"></div>

      <div className="flex justify-between items-end mb-6">
        <h2 className="text-xl font-extrabold text-gray-800 flex items-center gap-2">
          <span className="text-red-500">⚠️</span> Clientes con Deuda
        </h2>
        <div className="text-right">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Deuda Total</p>
          <p className="text-2xl font-black text-red-600">${totalDeuda.toFixed(2)}</p>
        </div>
      </div>

      <div className="space-y-3">
        {deudores.map((deudor) => (
          <div key={deudor.id} className="flex justify-between items-center p-4 bg-gray-50 border border-gray-100 rounded-xl hover:bg-red-50 hover:border-red-200 transition-colors">
            <div>
              <p className="font-bold text-gray-800">{deudor.nombre}</p>
              <p className="text-xs text-red-400 font-medium">{deudor.diasRetraso} días de retraso</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-bold text-gray-800">${deudor.monto.toFixed(2)}</span>
              <button className="bg-white border border-gray-200 text-gray-600 px-3 py-1 rounded-lg text-sm hover:bg-gray-800 hover:text-white transition-colors shadow-sm">
                Abonar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}