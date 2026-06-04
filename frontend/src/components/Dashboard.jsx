import React, { useState, useEffect } from 'react';

export default function Dashboard() {
  const [totalSemana, setTotalSemana] = useState(0);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    // Traemos TODAS las ventas de Cosmos DB
    fetch('/api/ventas')
      .then(res => res.json())
      .then(ventas => {
        // Sumamos solo las ventas al contado para el flujo de caja
        const total = ventas
          .filter(v => v.estado === 'Pagado')
          .reduce((acc, curr) => acc + curr.precio, 0);
        
        setTotalSemana(total);
        setCargando(false);
      })
      .catch(err => {
        console.error(err);
        setCargando(false);
      });
  }, []);

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
      <h2 className="text-xl font-extrabold text-gray-800 mb-2 flex items-center gap-2">
        <span className="text-emerald-500">📈</span> Flujo de Caja (Contado)
      </h2>
      
      {cargando ? (
        <p className="text-gray-500 animate-pulse mt-4">Calculando ingresos reales...</p>
      ) : (
        <p className="text-gray-500 mb-8 mt-4">
          Total ingresado: <span className="font-bold text-emerald-600 text-3xl">S/ {totalSemana.toFixed(2)}</span>
        </p>
      )}
    </div>
  );
}