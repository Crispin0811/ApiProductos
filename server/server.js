require('./config/config')
const express = require("express");
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//===========================
//habilitando la carpeta pulic
//===========================
app.use(express.static(path.resolve(__dirname , '../public')));


// configuracion de rutas
app.use(require('./controller/rutasController'));

// coneccion a la base de datos
mongoose.connect(process.env.URLBD, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}, (e) => {
    if (e) throw e;
    console.log("todo es ok");
});


app.listen(process.env.PORT, () => {
    console.log(process.env.PORT);
});