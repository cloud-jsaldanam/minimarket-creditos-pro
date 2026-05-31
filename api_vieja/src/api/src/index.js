// Punto de entrada principal para Azure Functions V4
const { app } = require('@azure/functions');

// Registramos cada función explícitamente para que Azure no tenga que escanear
require('./functions/CrearAbono.js');
require('./functions/CrearCliente.js');
require('./functions/CrearVenta.js');
require('./functions/GetClientes.js');
require('./functions/GetDashboard.js');
require('./functions/GetDeudaCliente.js');

console.log("Todas las funciones han sido registradas correctamente.");