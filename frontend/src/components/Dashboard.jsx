import React, { useState, useEffect } from 'react';

export default function Dashboard() {
  const [metricas, setMetricas] = useState({ contado: 0, deudas: 0, total: 0 });
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    fetch('/api/ventas')
      .then(res => res.json())
      .then(ventas => {
        if(Array.isArray(ventas)) {
          let cajaReal = 0;
          let cuentasPorCobrar = 0;

          ventas.forEach(v => {
            // Evaluamos el total del pedido (soporta la versión vieja sin carrito y la nueva)
            const totalPedido = v.total || v.precio || 0;
            
            if (v.estado === 'Pagado') {
              cajaReal += totalPedido;
            } 
            else if (v.estado === 'Deuda') {
              // El saldo pendiente a cobrar
              const saldoPendiente = v.saldo !== undefined ? v.saldo : totalPedido;
              cuentasPorCobrar += saldoPendiente;
              
              // Lo que ya te abonaron (ingresó a caja física)
              const pagadoHastaAhora = totalPedido - saldoPendiente;
              cajaReal += pagadoHastaAhora;
            }
          });

          setMetricas({ 
            contado: cajaReal, 
            deudas: cuentasPorCobrar, 
            total: cajaReal + cuentasPorCobrar 
          });
        }
        setCargando(false);
      });
  }, []);

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
      <h2 className="text-xl font-extrabold text-gray-800 mb-6 flex items-center gap-2">
        <span className="text-blue-500">📊</span> Resumen Financiero General
      </h2>
      
      {cargando ? (
        <p className="text-gray-500 animate-pulse">Calculando flujo de caja...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-100 shadow-sm">
            <p className="text-sm text-emerald-700 font-bold uppercase tracking-wide">Ingresos (Caja Real)</p>
            <p className="text-3xl font-black text-emerald-600 mt-2">S/ {metricas.contado.toFixed(2)}</p>
          </div>
          
          <div className="bg-red-50 p-6 rounded-xl border border-red-100 shadow-sm">
            <p className="text-sm text-red-700 font-bold uppercase tracking-wide">Por Cobrar (Créditos)</p>
            <p className="text-3xl font-black text-red-600 mt-2">S/ {metricas.deudas.toFixed(2)}</p>
          </div>

          <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 shadow-sm">
            <p className="text-sm text-blue-700 font-bold uppercase tracking-wide">Capital Movido Total</p>
            <p className="text-3xl font-black text-blue-600 mt-2">S/ {metricas.total.toFixed(2)}</p>
          </div>
        </div>
      )}
    </div>
  );
}