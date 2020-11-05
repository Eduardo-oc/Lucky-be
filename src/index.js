const express = require('express');
require ('./config/db');

const apiRoutes = require('./routes/index.routes');

const server = express();

// MIDDLEWARE DE EXPRESS, ES LO QUE HAY COMPAY
server.use(express.urlencoded({ extended: false}))
// MIDDLEWARE PARA PARSEAR EL BODY EN JSON
server.use(express.json());

server.use(apiRoutes) // MIDDLEWARE



const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
    console.log(`Conectados a http://localhost:${PORT}`)
});
