import React, { useState, useEffect } from 'react';

export default function Deudores() {
  const [deudasAgrupadas, setDeudasAgrupadas] = useState({});
  const [ventasOriginales, setVentasOriginales] = useState([]);
  const [cargando, setCargando] = useState(true);

  const cargarDeudas = () => {
    fetch('/api/ventas').then(res => res.json()).then(ventas => {
      if(Array.isArray(ventas)) {
        setVentasOriginales(ventas);
        const pendientes = ventas.filter(v => v.estado === 'Deuda');
        const agrupado = pendientes.reduce((acc, deuda) => {
          if (!acc[deuda.clienteNombre]) acc[deuda.clienteNombre] = { saldoTotal: 0, historial: [] };
          // Usa el saldo si existe, sino el total (o precio antiguo)
          const saldo = deuda.saldo !== undefined ? deuda.saldo : (deuda.total || deuda.precio);
          acc[deuda.clienteNombre].saldoTotal += saldo;
          acc[deuda.clienteNombre].historial.push(deuda);
          return acc;
        }, {});
        setDeudasAgrupadas(agrupado);
      }
      setCargando(false);
    });
  };

  useEffect(() => { cargarDeudas(); }, []);

  const abonarDeuda = async (idVenta, saldoActual) => {
    const montoRaw = prompt(`Saldo pendiente de esta compra: S/ ${saldoActual.toFixed(2)}\n\n¿Cuánto abonará el cliente hoy?`);
    if (montoRaw === null) return; 
    
    const monto = parseFloat(montoRaw);
    if (isNaN(monto) || monto <= 0) return alert("⚠️ Monto inválido.");

    try {
      await fetch('/api/ventas', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: idVenta, abono: monto })
      });
      alert(`✅ Abono registrado.`);
      cargarDeudas();
    } catch (error) {
      alert("❌ Error al procesar el abono.");
    }
  };

  const descargarCSVDeudas = () => {
    const pendientes = ventasOriginales.filter(v => v.estado === 'Deuda');
    const cabeceras = "Cliente,Fecha Venta,Productos,Total,Saldo Pendiente\n";
    const filas = pendientes.map(v => {
      const fecha = new Date(v.fecha).toLocaleDateString();
      const prods = v.items ? v.items.map(i => i.producto).join(" + ") : (v.producto || 'N/A');
      const total = v.total || v.precio || 0;
      const saldo = v.saldo !== undefined ? v.saldo : total;
      return `"${v.clienteNombre}","${fecha}","${prods}","S/ ${total}","S/ ${saldo}"`;
    }).join("\n");

    const blob = new Blob([cabeceras + filas], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'Reporte_Deudores.csv');
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
  };

  const totalGlobal = Object.values(deudasAgrupadas).reduce((acc, curr) => acc + curr.saldoTotal, 0);

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg border border-red-100">
      <div className="flex justify-between items-end mb-6 border-b pb-4">
        <h2 className="text-xl font-extrabold text-gray-800 flex items-center gap-2">
          <span className="text-red-500">⚠️</span> Control de Créditos
        </h2>
        <div className="flex items-center gap-6">
          <button onClick={descargarCSVDeudas} className="bg-green-100 text-green-700 px-4 py-2 rounded-lg font-bold hover:bg-green-600 hover:text-white transition-all text-sm">
            📊 Descargar CSV
          </button>
          <div className="text-right">
            <p className="text-xs text-gray-500 uppercase tracking-wide">Deuda Total Global</p>
            <p className="text-3xl font-black text-red-600">S/ {totalGlobal.toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {cargando ? <p>Cargando registros...</p> : Object.keys(deudasAgrupadas).length === 0 ? (
          <p className="text-emerald-600 font-bold bg-emerald-50 p-4 rounded-lg">No hay cuentas pendientes.</p>
        ) : (
          Object.entries(deudasAgrupadas).map(([nombre, datos]) => (
            <div key={nombre} className="border border-gray-200 rounded-xl p-4 bg-gray-50 shadow-sm">
              <div className="flex justify-between items-center mb-3">
                <p className="font-extrabold text-lg text-gray-800">{nombre}</p>
                <p className="font-bold text-red-600 text-lg">Deuda Total: S/ {datos.saldoTotal.toFixed(2)}</p>
              </div>
              
              <div className="pl-4 border-l-2 border-red-200 space-y-3 mt-2">
                {datos.historial.map(compra => {
                  const saldo = compra.saldo !== undefined ? compra.saldo : (compra.total || compra.precio);
                  return (
                  <div key={compra.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="text-xs text-gray-400 font-bold mb-1">🗓️ Venta: {new Date(compra.fecha).toLocaleDateString()}</p>
                        {compra.items ? compra.items.map((it, i) => (
                           <p key={i} className="text-sm text-gray-700">• {it.producto} <span className="text-gray-400">(S/{it.precio})</span></p>
                        )) : <p className="text-sm text-gray-700">• {compra.producto}</p>}
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className="font-black text-red-500 text-lg">Saldo: S/ {saldo.toFixed(2)}</span>
                        <button onClick={() => abonarDeuda(compra.id, saldo)} className="bg-emerald-100 text-emerald-700 font-bold px-4 py-1.5 rounded-lg hover:bg-emerald-600 hover:text-white transition-all text-sm">
                          Abonar 💰
                        </button>
                      </div>
                    </div>
                    {/* Historial de abonos de esta compra */}
                    {compra.abonos && compra.abonos.length > 0 && (
                      <div className="mt-3 bg-gray-50 p-2 rounded text-xs">
                        <p className="font-bold text-gray-500 mb-1">Historial de Pagos:</p>
                        {compra.abonos.map((ab, i) => (
                          <div key={i} className="flex justify-between text-gray-600">
                            <span>{new Date(ab.fecha).toLocaleDateString()} a las {new Date(ab.fecha).toLocaleTimeString()}</span>
                            <span className="text-emerald-600 font-bold">+ S/ {ab.monto.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )})}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}