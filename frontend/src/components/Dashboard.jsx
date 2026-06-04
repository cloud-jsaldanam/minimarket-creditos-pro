import React from 'react';

export default function Dashboard() {
  // Datos simulados (Luego vendrán de Cosmos DB)
  const ventasSemanales = [
    { dia: 'Lun', total: 120 }, { dia: 'Mar', total: 350 },
    { dia: 'Mié', total: 200 }, { dia: 'Jue', total: 450 },
    { dia: 'Vie', total: 600 }, { dia: 'Sáb', total: 800 },
    { dia: 'Dom', total: 550 }
  ];

  // Matemáticas en el frontend (¡Costo Cero en BD!)
  const maxVenta = Math.max(...ventasSemanales.map(v => v.total));
  const totalSemana = ventasSemanales.reduce((acc, curr) => acc + curr.total, 0);

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
      <h2 className="text-xl font-extrabold text-gray-800 mb-2 flex items-center gap-2">
        <span className="text-emerald-500">📈</span> Rendimiento Semanal
      </h2>
      <p className="text-gray-500 mb-8">Total acumulado: <span className="font-bold text-emerald-600 text-2xl">${totalSemana}</span></p>
      
      {/* Gráfico de barras hecho 100% con Tailwind */}
      <div className="flex items-end justify-between h-48 gap-2 bg-gray-50 p-4 rounded-xl border border-gray-100">
        {ventasSemanales.map((v, index) => {
          const altura = (v.total / maxVenta) * 100; // Porcentaje de altura
          return (
            <div key={index} className="flex flex-col items-center w-full group">
              {/* Tooltip flotante al pasar el mouse */}
              <span className="opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold text-gray-700 mb-1">
                ${v.total}
              </span>
              {/* La barra */}
              <div 
                className="w-full bg-emerald-400 rounded-t-md group-hover:bg-emerald-500 transition-all duration-500"
                style={{ height: `${altura}%`, minHeight: '10px' }}
              ></div>
              <span className="text-xs text-gray-500 mt-2 font-medium">{v.dia}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}