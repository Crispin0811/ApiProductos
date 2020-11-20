const express = require("express");
const app = express();
const bcrypt = require('bcrypt');
const _ = require('underscore');

// USANDO EL MODELO USUARIO
let Usuario = require('../models/usuario');

const {verificarToken,isAdminRol} = require('../middlewares/autenticacion');





app.get('/usuarios',verificarToken, (req, res) => {
    // lo que va en las comillas filtran los campos que queremos mandar
    // en este caso solo estamos mostrando 'nombre email'
    Usuario.find({}, 'nombre email img')
        .sort({ nombre: -1 })
        .limit(100)
        // para ejecutar la sentencia
        .exec((err, usuarioBD) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                usuario: usuarioBD
            });
        });
});

app.post('/usuarios',[verificarToken,isAdminRol],(req, res) => {

    // usando el BODY-PARSER
    let body = req.body;

    // instanciando al modelo
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role,
        estado: body.estado,
        google: body.google
    });

    //PARA GUARGAR EN LA BASE DE DATOS

    usuario.save((err, usuarioBD) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            usuario: usuarioBD
        });
    });

});
app.put('/usuarios/:id',[verificarToken, isAdminRol], (req, res) => {
    let id = req.params.id;
    let body = req.body;

    //para editar solo los elementos seleccionados del arreglo
    body = _.pick(body, ['nombre', 'email', ' img', 'role', 'estado']);


    // las opciones se ponen entre {}
    Usuario.findOneAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioBD) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            usuario: usuarioBD
        });
    });

});



app.delete('/usuarios/:id',[verificarToken, isAdminRol], (req, res) => {

    let id = req.params.id;

    let cambiaEstado = {
        estado: true
    };

    Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, usuarioBorrado) => {
        if (err) {
            res.status(400).json({
                ok: false,
                err
            })
        }

        if (!usuarioBorrado) {
            res.json({
                ok: false,
                err: 'no se encotro usuario'
            })
        }
        res.json({
            ok: true,
            usuarioBorrado
        })

    })
})



module.exports = app;