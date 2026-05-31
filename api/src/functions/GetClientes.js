const { app } = require('@azure/functions');
const { getDatabase } = require('../db');

app.http('GetClientes', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log('Buscando clientes registrados...');

        try {
            const database = getDatabase();
            const container = database.container("clientes");

            // Filtramos en la base de datos para traer SOLO documentos tipo cliente
            const { resources: clientes } = await container.items
                .query("SELECT * FROM c WHERE c.tipo = 'cliente' ORDER BY c.nombre")
                .fetchAll();

            return {
                status: 200,
                jsonBody: {
                    total: clientes.length,
                    datos: clientes
                }
            };

        } catch (error) {
            context.log.error("Error al consultar clientes:", error.message);
            return {
                status: 500,
                jsonBody: { error: "Error al consultar la base de datos." }
            };
        }
    }
});