const express = require("express");
const { Schema } = require("mongoose");

const app = express();
const { verificarToken } = require("../middlewares/autenticacion");

let Producto = require("../models/producto");

app.get("/producto", verificarToken, (req, res) => {
  Producto.find()
    .limit(5)
    .populate("usuario")
    .populate("categoria")
    .exec((err, productoBD) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }
      res.json({
        ok: true,
        producto: productoBD,
      });
    });
});

app.get("/producto/:id", verificarToken, (req, res) => {
  let id = req.params.id;
  Producto.findById(id, (err, productoBD) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }
    res.json({
      ok: true,
      producto: productoBD,
    });
  })
    .populate("usuario")
    .populate("categoria");
});

//===========================
//busqueda mas eficiente usando REGEXP
//=========================== 
app.get("/producto/buscar/:termino", verificarToken, (req, res) => {

  let termino = req.params.termino;
  let regex = new RegExp(termino,'i');
  Producto.find({nombre: regex})
    .limit(5)
    .populate("usuario")
    .populate("categoria")
    .exec((err, productoBD) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }
      res.json({
        ok: true,
        producto: productoBD,
      });
    });
});


app.post("/producto", verificarToken, (req, res) => {
  let body = req.body;

  let producto = new Producto({
    nombre: body.nombre,
    precioUni: body.precioUni,
    descripcion: body.descripcion,
    categoria: body.categoria,
    usuario: req.usuario._id,
  });

  producto.save((err, productoBD) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }
    res.json({
      ok: true,
      producto: productoBD,
    });
  });
});

app.put("/producto/:id", verificarToken, (req, res) => {
  let id = req.params.id;
  let body = req.body;

  let actualizar = {
    nombre: body.nombre,
    precioUni: body.precioUni,
    descripcion: body.descripcion,
    disponible: body.disponible,
    categoria: body.categoria,
  };

  Producto.findByIdAndUpdate(
    id,
    actualizar,
    { new: true, runValidators: true },
    (err, productoBD) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }
      res.json({
        ok: true,
        producto: productoBD,
      });
    }
  );
});

app.delete("/producto/:id", verificarToken, (req, res) => {
  let id = req.params.id;
  let disponible = {
    disponible: false,
  };

  Producto.findByIdAndUpdate(
    id,
    disponible,
    { new: true, runValidators: true },
    (err, productoBorrado) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }
      res.json({
        ok: true,
        producto: productoBorrado,
      });
    }
  );
});

module.exports = app;
