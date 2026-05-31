const { app } = require('@azure/functions');

app.http('Ping', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        return {
            status: 200,
            jsonBody: { mensaje: "¡VICTORIA! La API de Azure está viva y el despliegue funciona." }
        };
    }
});

console.log("Servidor encendido correctamente sin dependencias faltantes.");