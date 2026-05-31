const { CosmosClient } = require("@azure/cosmos");

const endpoint = process.env.COSMOS_ENDPOINT;
const key = process.env.COSMOS_KEY;
const databaseId = process.env.COSMOS_DATABASE_ID;

let client;

function getDatabase() {
    if (!client) {
        if (!endpoint || !key) {
            throw new Error("Faltan las credenciales de Cosmos DB en local.settings.json");
        }
        client = new CosmosClient({ endpoint, key });
    }
    return client.database(databaseId);
}

module.exports = { getDatabase };