const express = require("express");
const app = express();

let Categoria = require("../models/categoria");
let { verificarToken, isAdminRol } = require("../middlewares/autenticacion");


app.get("/categoria", verificarToken, (req, res) => {
  
  Categoria.find()
    //para ver los usuaros que se relacionan (si quieres restringir con campos los pasas con 2do arg)
    .populate("usuario", "nombre email")
    .sort({ descripcion: -1 })
    .exec((err, categoriaBD) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }
      res.json({
        ok: true,
        categoria: categoriaBD,
      });
    });
});

app.get("/categoria/:id", verificarToken, (req, res) => {
  let id = req.params.id;
  Categoria.findById(id, (err, categoriaBD) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }
    res.json({
      ok: true,
      categoria: categoriaBD,
    });
  });
});

app.post("/categoria", verificarToken, (req, res) => {
  let body = req.body;

  let categoria = new Categoria({
    descripcion: body.descripcion,
    usuario: req.usuario._id,
  });

  categoria.save((err, categoriaBD) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }

    if (!categoriaBD) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }
    res.json({
      ok: true,
      categoria: categoriaBD,
    });
  });
});

app.put("/categoria/:id", verificarToken, (req, res) => {
  let id = req.params.id;
  let body = req.body;

  let desCategoria = {
    descripcion: body.descripcion,
  };

  Categoria.findByIdAndUpdate(
    id,
    desCategoria,
    { new: true, runValidators: true, context: "query" },
    (err, categoriaBD) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }
      if (!categoriaBD) {
        return res.status(500).json({
          ok: false,
          mensaje: "no existe esa categoria",
          err,
        });
      }
      res.json({
        ok: true,
        categoria: categoriaBD,
      });
    }
  );
});

app.delete("/categoria/:id", [verificarToken, isAdminRol], (req, res) => {
  let id = req.params.id;

  Categoria.findByIdAndDelete(id, { new: true }, (err, categoriaBorrado) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }
    if (!categoriaBorrado) {
      return res.status(400).json({
        ok: false,
        err,
        mensaje: "no existe esa categoria",
      });
    }

    res.json({
      ok: true,
      mensaje: "categoria borrado",
      categoria: categoriaBorrado,
    });
  });
});

module.exports = app;
