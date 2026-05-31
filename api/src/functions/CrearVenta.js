const { app } = require('@azure/functions');
const { getDatabase } = require('../db');

app.http('CrearVenta', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        try {
            const payload = await request.json();
            const container = getDatabase().container("clientes");
            
            const nuevaVenta = {
                id: "ven_" + Date.now().toString(),
                tipo: "venta",
                cliente: payload.cliente,
                productos: payload.productos || [],
                total: parseFloat(payload.total),
                fechaRegistro: new Date().toISOString()
            };

            const { resource } = await container.items.create(nuevaVenta);

            return {
                status: 201,
                jsonBody: { mensaje: "Venta registrada", venta: resource }
            };

        } catch (error) {
            context.log.error("Error al guardar la venta:", error);
            return {
                status: 500,
                jsonBody: { error: "Error al procesar", detalle: error.message }
            };
        }
    }
});