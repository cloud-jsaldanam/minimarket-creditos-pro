const { app } = require('@azure/functions');
const { getContainers } = require('../db');

app.http('clientes', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        try {
            const { containerClientes } = await getContainers();

            if (request.method === 'POST') {
                const data = await request.json();
                
                // REGLA DE NEGOCIO: Bloquear duplicados
                const query = `SELECT * FROM c WHERE LOWER(c.nombre) = '${data.nombre.toLowerCase().trim()}'`;
                const { resources: existentes } = await containerClientes.items.query(query).fetchAll();
                
                if (existentes.length > 0) {
                    return { status: 400, jsonBody: { error: "El cliente ya existe en la base de datos." } };
                }

                data.id = Date.now().toString(); 
                const { resource } = await containerClientes.items.create(data);
                return { status: 201, jsonBody: resource };
            } 
            
            if (request.method === 'GET') {
                const { resources } = await containerClientes.items.query("SELECT * from c").fetchAll();
                return { status: 200, jsonBody: resources };
            }
        } catch (error) {
            return { status: 500, jsonBody: { error: error.message } };
        }
    }
});