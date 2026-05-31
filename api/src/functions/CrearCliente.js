const { app } = require('@azure/functions');
const { getDatabase } = require('../db');

app.http('CrearCliente', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log('Registrando nuevo cliente en la base de datos...');

        try {
            const payload = await request.json();
            
            if (!payload.nombre) {
                return { status: 400, jsonBody: { error: "El nombre es obligatorio" } };
            }

            const database = getDatabase();
            const container = database.container("clientes");

            // Documento NoSQL estructurado para el cliente
            const nuevoCliente = {
                id: "cli_" + Date.now().toString(), // Prefijo claro para IDs de clientes
                tipo: "cliente",                    // Separación por tipo de documento
                nombre: payload.nombre,
                telefono: payload.telefono || '',
                saldoDeuda: 0,                      // Todos empiezan en cero
                fechaRegistro: new Date().toISOString()
            };

            const { resource } = await container.items.create(nuevoCliente);

            return {
                status: 201,
                jsonBody: {
                    mensaje: "Cliente registrado con éxito",
                    cliente: resource
                }
            };

        } catch (error) {
            context.log.error("Error al guardar cliente en Cosmos DB:", error);
            return {
                status: 500,
                jsonBody: { error: "Error interno del servidor", detalle: error.message }
            };
        }
    }
});