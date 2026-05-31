const { app } = require('@azure/functions');
const { getDatabase } = require('../db');

app.http('CrearAbono', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log('Procesando registro de abono/pago...');

        try {
            const payload = await request.json();
            const database = getDatabase();
            const container = database.container("clientes");

            // Documento NoSQL estructurado para el abono
            const nuevoAbono = {
                id: "abn_" + Date.now().toString(),
                tipo: "abono",
                cliente: payload.cliente,
                monto: parseFloat(payload.monto),
                fechaRegistro: new Date().toISOString()
            };

            const { resource } = await container.items.create(nuevoAbono);

            return {
                status: 201,
                jsonBody: {
                    mensaje: "Abono guardado exitosamente",
                    recibo: resource
                }
            };

        } catch (error) {
            context.log.error("Error al guardar abono en Cosmos DB:", error);
            return {
                status: 500,
                jsonBody: { error: "No se pudo registrar el abono", detalle: error.message }
            };
        }
    }
});