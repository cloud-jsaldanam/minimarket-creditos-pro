const { app } = require('@azure/functions');

app.http('ping', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        return { 
            status: 200, 
            jsonBody: { mensaje: "¡La API V4 nativa esta viva!" } 
        };
    }
});
