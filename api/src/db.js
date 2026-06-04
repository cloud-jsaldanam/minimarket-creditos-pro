const { CosmosClient } = require("@azure/cosmos");

const endpoint = process.env.COSMOS_ENDPOINT;
const key = process.env.COSMOS_KEY;

const client = new CosmosClient({ endpoint, key });

async function getContainers() {
    // Crea la BD y las tablas si no existen (Costo $0 por creación)
    const { database } = await client.databases.createIfNotExists({ id: "MinimarketDB" });
    
    const { container: containerClientes } = await database.containers.createIfNotExists({ 
        id: "Clientes", 
        partitionKey: "/id" 
    });
    
    const { container: containerVentas } = await database.containers.createIfNotExists({ 
        id: "Ventas", 
        partitionKey: "/id" 
    });
    
    return { containerClientes, containerVentas };
}

module.exports = { getContainers };