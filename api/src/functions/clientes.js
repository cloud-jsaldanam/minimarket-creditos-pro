const { app } = require('@azure/functions');
const { getContainers } = require('../db');

app.http('clientes', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        try {
            const { containerClientes } = await getContainers();

            // Guardar Nuevo Cliente
            if (request.method === 'POST') {
                const data = await request.json();
                data.id = Date.now().toString(); 
                const { resource } = await containerClientes.items.create(data);
                return { status: 201, jsonBody: resource };
            } 
            
            // Leer todos los clientes
            if (request.method === 'GET') {
                const { resources } = await containerClientes.items.query("SELECT * from c").fetchAll();
                return { status: 200, jsonBody: resources };
            }
            
        } catch (error) {
            context.log("Error en BD:", error);
            return { status: 500, jsonBody: { error: error.message } };
        }
    }
});