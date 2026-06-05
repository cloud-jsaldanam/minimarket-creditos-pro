import React, { useState, useEffect } from 'react';

export default function Deudores() {
  const [deudasAgrupadas, setDeudasAgrupadas] = useState({});
  const [ventasOriginales, setVentasOriginales] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [clienteExpandido, setClienteExpandido] = useState(null);

  const cargarDeudas = () => {
    fetch('/api/ventas').then(res => res.json()).then(ventas => {
      if(Array.isArray(ventas)) {
        setVentasOriginales(ventas);
        const pendientes = ventas.filter(v => v.estado === 'Deuda');
        
        const agrupado = pendientes.reduce((acc, deuda) => {
          if (!acc[deuda.clienteNombre]) acc[deuda.clienteNombre] = { saldoTotal: 0, historial: [] };
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

  const toggleDetalles = (nombre) => setClienteExpandido(clienteExpandido === nombre ? null : nombre);

  const abonarDeudaGlobal = async (nombreCliente, historial, deudaTotal) => {
    const montoRaw = prompt(`ESTADO DE CUENTA: ${nombreCliente}\nDeuda Total: S/ ${deudaTotal.toFixed(2)}\n\n¿Cuánto abonará el cliente?`);
    if (montoRaw === null) return; 
    
    let abonoPendiente = parseFloat(montoRaw);
    if (isNaN(abonoPendiente) || abonoPendiente <= 0) return alert("⚠️ Monto inválido.");
    if (abonoPendiente > deudaTotal) return alert(`⚠️ El abono no puede superar la deuda total.`);

    try {
      const ventasOrdenadas = [...historial].sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

      for (const venta of ventasOrdenadas) {
        if (abonoPendiente <= 0) break; 
        const saldoVenta = venta.saldo !== undefined ? venta.saldo : (venta.total || venta.precio);
        
        if (saldoVenta > 0) {
          const montoAAplicar = Math.min(abonoPendiente, saldoVenta);
          abonoPendiente -= montoAAplicar; 

          await fetch('/api/ventas', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: venta.id, abono: montoAAplicar })
          });
        }
      }

      alert(`✅ Abono registrado exitosamente.`);
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
    <div className="bg-white p-5 md:p-8 rounded-2xl shadow-lg border border-red-100">
      
      {/* Cabecera Responsiva */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 border-b pb-4 gap-4">
        <h2 className="text-xl md:text-2xl font-extrabold text-gray-800 flex items-center gap-2">
          <span className="text-red-500">⚠️</span> Control de Créditos
        </h2>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full md:w-auto">
          <button onClick={descargarCSVDeudas} className="w-full sm:w-auto bg-emerald-50 text-emerald-700 border border-emerald-200 px-4 py-3 md:py-2 rounded-lg font-bold hover:bg-emerald-600 hover:text-white transition-all shadow-sm text-sm">
            📊 Descargar CSV
          </button>
          <div className="text-left md:text-right w-full sm:w-auto border-t sm:border-none pt-3 sm:pt-0 border-red-100">
            <p className="text-xs md:text-sm text-gray-500 font-bold uppercase tracking-wide">Deuda Total Global</p>
            <p className="text-3xl md:text-4xl font-black text-red-600">S/ {totalGlobal.toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {cargando ? <p className="text-gray-500 animate-pulse text-sm">Consultando BD...</p> : Object.keys(deudasAgrupadas).length === 0 ? (
          <p className="text-emerald-600 font-bold bg-emerald-50 p-6 rounded-xl border border-emerald-100 text-center text-sm md:text-lg">🎉 No hay cuentas pendientes.</p>
        ) : (
          Object.entries(deudasAgrupadas).map(([nombre, datos]) => (
            <div key={nombre} className="border border-gray-200 rounded-2xl bg-white shadow-sm overflow-hidden transition-all duration-300 hover:border-red-300">
              
              {/* Acordeón Responsivo */}
              <div onClick={() => toggleDetalles(nombre)} className="bg-red-50 p-4 md:p-5 flex flex-col md:flex-row justify-between md:items-center cursor-pointer hover:bg-red-100 transition-colors gap-4">
                <div>
                  <p className="font-black text-lg md:text-xl text-gray-800 flex items-center gap-2">
                    <span>{clienteExpandido === nombre ? '📂' : '📁'}</span> <span className="break-words">{nombre}</span>
                  </p>
                  <p className="text-xs md:text-sm text-red-400 font-bold mt-1 ml-7">
                    {clienteExpandido === nombre ? 'Ocultar historial' : 'Ver detalle de compras'}
                  </p>
                </div>
                
                <div className="text-left md:text-right flex flex-col md:items-end gap-3 w-full md:w-auto ml-7 md:ml-0">
                  <div>
                    <p className="text-[10px] md:text-xs text-red-500 font-bold uppercase mb-1">Deuda Acumulada</p>
                    <p className="font-black text-red-600 text-xl md:text-2xl">S/ {datos.saldoTotal.toFixed(2)}</p>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); abonarDeudaGlobal(nombre, datos.historial, datos.saldoTotal); }} className="w-full md:w-auto bg-emerald-500 text-white font-bold px-5 py-3 md:py-2 rounded-xl hover:bg-emerald-600 transition-all shadow-md text-sm">
                    Abonar 💰
                  </button>
                </div>
              </div>
              
              {clienteExpandido === nombre && (
                <div className="p-4 md:p-6 bg-gray-50 space-y-3 border-t border-red-100">
                  <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Desglose de tickets</p>
                  {datos.historial.map(compra => {
                    const saldo = compra.saldo !== undefined ? compra.saldo : (compra.total || compra.precio);
                    return (
                    <div key={compra.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row justify-between gap-3">
                      <div>
                        <p className="text-xs text-indigo-400 font-bold mb-2">🗓️ {new Date(compra.fecha).toLocaleDateString()}</p>
                        {compra.items ? compra.items.map((it, i) => (
                             <p key={i} className="text-xs md:text-sm font-semibold text-gray-700 break-words">• {it.producto} <span className="text-gray-400 ml-1 font-normal block sm:inline">(S/{it.precio.toFixed(2)})</span></p>
                          )) : <p className="text-xs md:text-sm font-semibold text-gray-700">• {compra.producto}</p>}
                      </div>
                      <div className="text-left sm:text-right bg-red-50 sm:bg-transparent p-2 sm:p-0 rounded-lg">
                        <p className="text-[10px] md:text-xs text-gray-400 mb-1 font-bold">Saldo del ticket</p>
                        <span className="font-black text-red-500 text-base md:text-lg">S/ {saldo.toFixed(2)}</span>
                      </div>
                    </div>
                  )})}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}