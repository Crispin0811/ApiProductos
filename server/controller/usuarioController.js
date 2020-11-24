const express = require("express");
const app = express();
const bcrypt = require('bcrypt');
const _ = require('underscore');

let Usuario = require('../models/usuario');

const {verificarToken,isAdminRol} = require('../middlewares/autenticacion');





app.get('/usuarios',verificarToken, (req, res) => {
   
    Usuario.find({}, 'nombre email img')
        .sort({ nombre: -1 })
        .limit(100)
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

    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role,
        estado: body.estado,
        google: body.google
    });


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

    body = _.pick(body, ['nombre', 'email', ' img', 'role', 'estado']);


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