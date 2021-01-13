// Ver documentación de dotenv. Lee variables de entonrno en archivo .env y las establece en las var de entorno de NODE.
require('dotenv').config();

const express = require('express');
const cors = require('cors');

const { dbConnection } = require('./database/config');

// console.log('Hola mundo! Desde backend');

// Crear el servidor de Express
const app = express();

// Configurar CORS
app.use(cors()); // middleware

// Lectura y parseo del body ::: Esto va antes de las rutas
app.use( express.json() ); // middleware

// Base de datos
dbConnection();
// process.env: Esto ya existe en NODE, pero leerá el archivo y establecerá las var.de entonrno de manera global en node.
// console.log( process.env );

// Rutas + controlador
app.use( '/api/usuarios', require('./routes/usuarios') ); // middleware
app.use( '/api/login', require('./routes/auth') ); // middleware

// app.get( '/api/usuarios', (req, res) => {
//     res.json({
//         ok: true,
//         msg: 'Hola mundo!',
//         usuarios: [{
//             id: 123,
//             nombre: 'Gonzalo'
//         }]
//     })
// });


app.listen( process.env.PORT, () => {
    console.log(`Servidor corriendo en puerto ${process.env.PORT} `);
} );