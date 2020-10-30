require('./config/config')
const express = require("express");
const app = express();
const mongoose = require('mongoose');

// const bodyParser = require('body-parser');
const bodyParser = require('body-parser');


//usando application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// mediaware
app.use(require('./controller/usuarioController'));

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
// coneccion a la base de datos


//process.env.PORT viene del archuvi config
app.listen(process.env.PORT, () => {
    console.log(process.env.PORT);
});