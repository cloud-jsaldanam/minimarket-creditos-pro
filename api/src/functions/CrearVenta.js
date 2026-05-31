const { app } = require('@azure/functions');
const { getDatabase } = require('../db');

app.http('CrearVenta', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log('Procesando registro de venta con múltiples productos...');

        try {
            // Recibimos los datos desde React
            const payload = await request.json();
            
            const database = getDatabase();
            const container = database.container("clientes");

            // Armamos el "Recibo" completo (Documento NoSQL)
            const nuevaVenta = {
                id: Date.now().toString(), // Generamos un ID único con la fecha exacta
                tipo: "venta",             // Etiqueta para diferenciarlo de los abonos
                cliente: payload.cliente,
                clienteBuscador: payload.cliente.trim().toLowerCase(), // Todo en minúsculas para facilitar búsquedas futuras
                productos: payload.productos, // ¡Aquí va el carrito completo con el detalle!
                total: payload.total,
                fechaRegistro: new Date().toISOString()
            };

            // Insertamos el documento en Cosmos DB
            const { resource } = await container.items.create(nuevaVenta);

            return {
                status: 201,
                jsonBody: {
                    mensaje: "Crédito guardado exitosamente",
                    recibo: resource
                }
            };

        } catch (error) {
            context.log.error("Error fatal al guardar en Cosmos DB:", error);
            return {
                status: 500,
                jsonBody: { error: "No se pudo registrar la venta", detalle: error.message }
            };
        }
    }
});