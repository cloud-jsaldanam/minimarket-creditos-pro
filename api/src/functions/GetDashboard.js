const { app } = require('@azure/functions');
const { getDatabase } = require('../db');

app.http('GetDashboard', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log('Calculando métricas del Dashboard...');

        try {
            const database = getDatabase();
            const container = database.container("clientes");

            // Ejecutamos sumatorias directas en la base de datos (Súper rápido y barato)
            const { resources: ventas } = await container.items
                .query("SELECT VALUE SUM(c.total) FROM c WHERE c.tipo = 'venta'")
                .fetchAll();
                
            const { resources: abonos } = await container.items
                .query("SELECT VALUE SUM(c.monto) FROM c WHERE c.tipo = 'abono'")
                .fetchAll();

            const totalVentas = ventas[0] || 0;
            const totalAbonos = abonos[0] || 0;
            const deudaEnLaCalle = totalVentas - totalAbonos;

            return {
                status: 200,
                jsonBody: {
                    ventas: totalVentas,
                    abonos: totalAbonos,
                    deuda: deudaEnLaCalle
                }
            };

        } catch (error) {
            context.log.error("Error en Dashboard:", error);
            return { status: 500, jsonBody: { error: "Error al calcular métricas" } };
        }
    }
});