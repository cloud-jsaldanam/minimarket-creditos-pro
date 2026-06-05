const { app } = require('@azure/functions');
const { getContainers } = require('../db');

app.http('ventas', {
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        try {
            const { containerVentas } = await getContainers();

            // NUEVA VENTA (Múltiples productos)
            if (request.method === 'POST') {
                const data = await request.json();
                data.id = Date.now().toString(); 
                data.fecha = new Date().toISOString(); // Fecha por default
                data.saldo = data.total; // El saldo a deber es el total
                data.abonos = []; // Empezamos sin abonos
                
                const { resource } = await containerVentas.items.create(data);
                return { status: 201, jsonBody: resource };
            } 
            
            if (request.method === 'GET') {
                const { resources } = await containerVentas.items.query("SELECT * from c ORDER BY c.fecha DESC").fetchAll();
                return { status: 200, jsonBody: resources };
            }

            // ABONAR A LA DEUDA
            if (request.method === 'PUT') {
                const { id, abono } = await request.json();
                const { resource: venta } = await containerVentas.item(id, id).read();
                
                // Compatibilidad si hay registros viejos
                if (venta.saldo === undefined) venta.saldo = venta.precio;
                if (!venta.abonos) venta.abonos = [];

                venta.saldo = venta.saldo - abono;
                
                // Guardamos el historial del abono con su fecha
                venta.abonos.push({
                    monto: abono,
                    fecha: new Date().toISOString()
                });

                if (venta.saldo <= 0) {
                    venta.saldo = 0;
                    venta.estado = 'Pagado';
                }
                
                const { resource: updated } = await containerVentas.item(id, id).replace(venta);
                return { status: 200, jsonBody: updated };
            }

            if (request.method === 'DELETE') {
                const id = request.query.get('id');
                await containerVentas.item(id, id).delete();
                return { status: 200, jsonBody: { message: "Registro eliminado." } };
            }
        } catch (error) {
            return { status: 500, jsonBody: { error: error.message } };
        }
    }
});