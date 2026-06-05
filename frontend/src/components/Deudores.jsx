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

  // LÓGICA CONTABLE AVANZADA: Pago Global repartido en los tickets más antiguos (FIFO)
  const abonarDeudaGlobal = async (nombreCliente, historial, deudaTotal) => {
    const montoRaw = prompt(`ESTADO DE CUENTA: ${nombreCliente}\nDeuda Total Actual: S/ ${deudaTotal.toFixed(2)}\n\n¿Cuánto dinero abonará el cliente en este momento?`);
    if (montoRaw === null) return; 
    
    let abonoPendiente = parseFloat(montoRaw);
    if (isNaN(abonoPendiente) || abonoPendiente <= 0) return alert("⚠️ Monto inválido. Ingresa un número mayor a 0.");
    if (abonoPendiente > deudaTotal) return alert(`⚠️ El abono (S/ ${abonoPendiente}) no puede ser mayor a la deuda total (S/ ${deudaTotal}).`);

    try {
      // 1. Ordenar el historial de compras de la más antigua a la más nueva
      const ventasOrdenadas = [...historial].sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

      // 2. Repartir el dinero ingresado
      for (const venta of ventasOrdenadas) {
        if (abonoPendiente <= 0) break; // Si ya se acabó el dinero del abono, paramos

        const saldoVenta = venta.saldo !== undefined ? venta.saldo : (venta.total || venta.precio);
        
        if (saldoVenta > 0) {
          // Calculamos cuánto podemos pagarle a esta venta específica
          const montoAAplicar = Math.min(abonoPendiente, saldoVenta);
          abonoPendiente -= montoAAplicar; // Descontamos del fajo de dinero que nos dio el cliente

          // Enviamos a la base de datos el pago de este pedacito
          await fetch('/api/ventas', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: venta.id, abono: montoAAplicar })
          });
        }
      }

      alert(`✅ Abono de S/ ${parseFloat(montoRaw).toFixed(2)} registrado exitosamente. Los saldos se han actualizado.`);
      cargarDeudas();
    } catch (error) {
      alert("❌ Error al procesar el abono en la base de datos.");
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
      {/* CABECERA PRINCIPAL */}
      <div className="flex justify-between items-end mb-8 border-b pb-4">
        <h2 className="text-2xl font-extrabold text-gray-800 flex items-center gap-2">
          <span className="text-red-500">⚠️</span> Control de Créditos
        </h2>
        <div className="flex items-center gap-6">
          <button onClick={descargarCSVDeudas} className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-4 py-2 rounded-lg font-bold hover:bg-emerald-600 hover:text-white transition-all shadow-sm">
            📊 Descargar CSV
          </button>
          <div className="text-right">
            <p className="text-sm text-gray-500 font-bold uppercase tracking-wide">Deuda Total Global</p>
            <p className="text-4xl font-black text-red-600">S/ {totalGlobal.toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {cargando ? <p className="text-gray-500 animate-pulse">Consultando base de datos...</p> : Object.keys(deudasAgrupadas).length === 0 ? (
          <p className="text-emerald-600 font-bold bg-emerald-50 p-6 rounded-xl border border-emerald-100 text-center text-lg">🎉 ¡Cuentas sanas! No tienes cuentas pendientes por cobrar.</p>
        ) : (
          Object.entries(deudasAgrupadas).map(([nombre, datos]) => (
            <div key={nombre} className="border border-gray-200 rounded-2xl bg-white shadow-sm overflow-hidden">
              
              {/* PERFIL DEL CLIENTE CON DEUDA RESALTADA */}
              <div className="bg-red-50 p-6 flex justify-between items-center border-b border-red-100">
                <div>
                  <p className="font-black text-2xl text-gray-800">{nombre}</p>
                  <p className="text-sm text-red-400 font-bold mt-1">Cuenta Corriente Activa</p>
                </div>
                <div className="text-right flex flex-col items-end gap-3">
                  <div>
                    <p className="text-xs text-red-500 font-bold uppercase mb-1">Deuda Acumulada</p>
                    <p className="font-black text-red-600 text-3xl">S/ {datos.saldoTotal.toFixed(2)}</p>
                  </div>
                  <button 
                    onClick={() => abonarDeudaGlobal(nombre, datos.historial, datos.saldoTotal)}
                    className="bg-emerald-500 text-white font-bold px-6 py-2 rounded-xl hover:bg-emerald-600 transition-all shadow-md transform hover:-translate-y-1"
                  >
                    Abonar a la Cuenta 💰
                  </button>
                </div>
              </div>
              
              {/* DESGLOSE DE COMPRAS */}
              <div className="p-6 bg-gray-50 space-y-3">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Desglose de compras pendientes</p>
                {datos.historial.map(compra => {
                  const saldo = compra.saldo !== undefined ? compra.saldo : (compra.total || compra.precio);
                  return (
                  <div key={compra.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between">
                    <div>
                      <p className="text-xs text-indigo-400 font-bold mb-1">🗓️ Ticket del {new Date(compra.fecha).toLocaleDateString()}</p>
                      {compra.items ? compra.items.map((it, i) => (
                           <p key={i} className="text-sm font-semibold text-gray-700">• {it.producto} <span className="text-gray-400 ml-1 font-normal">(S/{it.precio.toFixed(2)})</span></p>
                        )) : <p className="text-sm font-semibold text-gray-700">• {compra.producto}</p>}
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400 mb-1">Saldo del ticket</p>
                      <span className="font-black text-red-500 text-lg">S/ {saldo.toFixed(2)}</span>
                    </div>
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