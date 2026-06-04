const { app } = require('@azure/functions');
const { getContainers } = require('../db');

app.http('ventas', {
    methods: ['GET', 'POST', 'DELETE'], // Agregamos DELETE
    authLevel: 'anonymous',
    handler: async (request, context) => {
        try {
            const { containerVentas } = await getContainers();

            if (request.method === 'POST') {
                const data = await request.json();
                data.id = Date.now().toString(); 
                data.fecha = new Date().toISOString();
                const { resource } = await containerVentas.items.create(data);
                return { status: 201, jsonBody: resource };
            } 
            
            if (request.method === 'GET') {
                const { resources } = await containerVentas.items.query("SELECT * from c").fetchAll();
                return { status: 200, jsonBody: resources };
            }

            // NUEVO: Permiso para eliminar una venta/deuda
            if (request.method === 'DELETE') {
                const id = request.query.get('id');
                await containerVentas.item(id, id).delete();
                return { status: 200, jsonBody: { message: "Registro eliminado exitosamente." } };
            }
        } catch (error) {
            return { status: 500, jsonBody: { error: error.message } };
        }
    }
});