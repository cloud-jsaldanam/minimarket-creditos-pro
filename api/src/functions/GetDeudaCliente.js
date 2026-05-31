const { app } = require('@azure/functions');
const { getDatabase } = require('../db');

app.http('GetDeudaCliente', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        try {
            const { cliente } = await request.json();
            if (!cliente) return { status: 400, jsonBody: { error: "Cliente requerido" } };

            const container = getDatabase().container("clientes");

            // Sumar solo las ventas de este cliente
            const { resources: ventas } = await container.items.query({
                query: "SELECT VALUE SUM(c.total) FROM c WHERE c.tipo = 'venta' AND c.cliente = @cliente",
                parameters: [{ name: "@cliente", value: cliente }]
            }).fetchAll();

            // Sumar solo los abonos de este cliente
            const { resources: abonos } = await container.items.query({
                query: "SELECT VALUE SUM(c.monto) FROM c WHERE c.tipo = 'abono' AND c.cliente = @cliente",
                parameters: [{ name: "@cliente", value: cliente }]
            }).fetchAll();

            const totalVentas = ventas[0] || 0;
            const totalAbonos = abonos[0] || 0;

            return {
                status: 200,
                jsonBody: { cliente, deuda: totalVentas - totalAbonos }
            };
        } catch (error) {
            context.log.error("Error al calcular deuda:", error);
            return { status: 500, jsonBody: { error: "Error al calcular deuda" } };
        }
    }
});