import React, { useState, useEffect } from 'react';

export default function Dashboard() {
  const [metricas, setMetricas] = useState({ 
    totalDeuda: 0, 
    totalClientes: 0, 
    topDeudores: [],
    maxDeuda: 0 
  });
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    fetch('/api/ventas')
      .then(res => res.json())
      .then(ventas => {
        if(Array.isArray(ventas)) {
          let cuentasPorCobrar = 0;
          const deudasPorCliente = {};

          ventas.forEach(v => {
            if (v.estado === 'Deuda') {
              const totalPedido = v.total || v.precio || 0;
              const saldoPendiente = v.saldo !== undefined ? v.saldo : totalPedido;
              
              if (saldoPendiente > 0) {
                cuentasPorCobrar += saldoPendiente;
                
                if (!deudasPorCliente[v.clienteNombre]) {
                  deudasPorCliente[v.clienteNombre] = 0;
                }
                deudasPorCliente[v.clienteNombre] += saldoPendiente;
              }
            }
          });

          const ranking = Object.keys(deudasPorCliente)
            .map(nombre => ({ nombre, deuda: deudasPorCliente[nombre] }))
            .sort((a, b) => b.deuda - a.deuda);

          const maximaDeuda = ranking.length > 0 ? ranking[0].deuda : 0;

          setMetricas({
            totalDeuda: cuentasPorCobrar,
            totalClientes: ranking.length,
            topDeudores: ranking.slice(0, 5),
            maxDeuda: maximaDeuda
          });
        }
        setCargando(false);
      });
  }, []);

  return (
    <div className="space-y-6">
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-red-100 flex flex-col items-center justify-center text-center">
          <p className="text-xs md:text-sm text-red-700 font-bold uppercase tracking-wide mb-2 flex items-center gap-2">
            <span>💰</span> Dinero en la calle
          </p>
          <p className="text-4xl md:text-5xl font-black text-red-600 break-words">
            {cargando ? '...' : `S/ ${metricas.totalDeuda.toFixed(2)}`}
          </p>
        </div>

        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-indigo-100 flex flex-col items-center justify-center text-center">
          <p className="text-xs md:text-sm text-indigo-700 font-bold uppercase tracking-wide mb-2 flex items-center gap-2">
            <span>👥</span> Cuentas Activas
          </p>
          <p className="text-4xl md:text-5xl font-black text-indigo-600 break-words">
            {cargando ? '...' : metricas.totalClientes}
          </p>
          <p className="text-[10px] md:text-xs text-indigo-400 mt-2 font-medium">Clientes con saldo pendiente</p>
        </div>
      </div>

      <div className="bg-white p-5 md:p-8 rounded-2xl shadow-lg border border-gray-100">
        <h2 className="text-lg md:text-xl font-extrabold text-gray-800 mb-6 flex items-center gap-2">
          <span className="text-orange-500">🏆</span> Top 5 Mayores Deudores
        </h2>

        {cargando ? (
          <p className="text-gray-500 animate-pulse text-sm">Generando ranking...</p>
        ) : metricas.topDeudores.length === 0 ? (
          <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-100 text-center">
            <p className="text-emerald-600 font-bold text-lg">🎉 ¡Todo está pagado!</p>
            <p className="text-sm text-emerald-500 mt-1">No hay deudas registradas en el sistema.</p>
          </div>
        ) : (
          <div className="space-y-5">
            {metricas.topDeudores.map((cliente, index) => {
              const porcentaje = (cliente.deuda / metricas.maxDeuda) * 100;
              
              return (
                <div key={index} className="relative">
                  <div className="flex justify-between items-end mb-2 gap-2">
                    {/* El truncate protege la interfaz si el nombre es muy largo */}
                    <p className="font-bold text-gray-700 text-sm md:text-base flex items-center gap-2 truncate flex-1">
                      <span className="text-gray-400 font-normal">#{index + 1}</span> 
                      <span className="truncate">{cliente.nombre}</span>
                    </p>
                    {/* El whitespace-nowrap evita que el precio se rompa en dos líneas */}
                    <p className="font-black text-red-500 text-sm md:text-base whitespace-nowrap">
                      S/ {cliente.deuda.toFixed(2)}
                    </p>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3 md:h-4 overflow-hidden">
                    <div 
                      className="bg-red-400 h-full rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${porcentaje}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}