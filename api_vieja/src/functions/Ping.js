const { app } = require('@azure/functions');

app.http('Ping', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        return {
            status: 200,
            jsonBody: { mensaje: "¡La API en Azure está viva y funcionando!" }
        };
    }
});