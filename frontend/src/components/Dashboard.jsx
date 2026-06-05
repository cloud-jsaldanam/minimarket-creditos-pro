import React, { useState, useEffect } from 'react';

export default function Dashboard() {
  const [deudaTotalActiva, setDeudaTotalActiva] = useState(0);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    fetch('/api/ventas')
      .then(res => res.json())
      .then(ventas => {
        if(Array.isArray(ventas)) {
          let cuentasPorCobrar = 0;

          ventas.forEach(v => {
            if (v.estado === 'Deuda') {
              const totalPedido = v.total || v.precio || 0;
              const saldoPendiente = v.saldo !== undefined ? v.saldo : totalPedido;
              cuentasPorCobrar += saldoPendiente;
            }
          });

          setDeudaTotalActiva(cuentasPorCobrar);
        }
        setCargando(false);
      });
  }, []);

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
      <h2 className="text-xl font-extrabold text-gray-800 mb-6 flex items-center gap-2">
        <span className="text-red-500">📊</span> Resumen Financiero
      </h2>
      
      {cargando ? (
        <p className="text-gray-500 animate-pulse">Calculando saldos pendientes...</p>
      ) : (
        <div className="bg-red-50 p-8 rounded-2xl border border-red-100 shadow-sm flex flex-col items-center justify-center text-center">
          <p className="text-sm text-red-700 font-bold uppercase tracking-wide mb-2">Total de Dinero en la Calle (Por Cobrar)</p>
          <p className="text-5xl font-black text-red-600">S/ {deudaTotalActiva.toFixed(2)}</p>
          <p className="text-xs text-red-400 mt-4 font-medium">Este monto refleja únicamente las deudas activas actuales.</p>
        </div>
      )}
    </div>
  );
}