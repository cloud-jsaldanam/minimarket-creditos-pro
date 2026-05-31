const { CosmosClient } = require("@azure/cosmos");

// Variable global vacía. No nos conectamos hasta que sea estrictamente necesario.
let client = null;

function getDatabase() {
    // Si es la primera vez que consultan algo, creamos la conexión
    if (!client) {
        const endpoint = process.env.COSMOS_ENDPOINT;
        const key = process.env.COSMOS_KEY;

        // Si faltan las variables en la nube, lanzamos un error controlado sin apagar el servidor
        if (!endpoint || !key) {
            console.error("🛑 ERROR CRÍTICO: Faltan variables de entorno en Azure (COSMOS_ENDPOINT o COSMOS_KEY)");
            throw new Error("Credenciales de base de datos no configuradas.");
        }

        client = new CosmosClient({ endpoint, key });
    }
    
    // Retornamos la base de datos (usará la variable o 'MinimarketDB' por defecto)
    const databaseId = process.env.COSMOS_DATABASE_ID || "MinimarketDB";
    return client.database(databaseId);
}

module.exports = { getDatabase };