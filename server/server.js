require('./config/config');

const express = require('express');
const mongoose = require('mongoose');
const app = express();
const path = require("path");

const bodyParser = require('body-parser');

const cors  = require('cors');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());


// habilitar la carpeta public
app.use(express.static(path.resolve(__dirname, "../public")));

// enable CORS - Cross Origin Resource Sharing
app.use(cors());

//Configuración global de rutas
app.use(require('./routes/index'));

mongoose.connect(process.env.URLBD, (err, res) => {
    if (err) throw err;

    console.log("Base de datos ONLINE");

});

app.listen(process.env.PORT, () => console.log(`Escuchando el puerto ${process.env.PORT}`));