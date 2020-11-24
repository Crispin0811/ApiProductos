const express = require("express");
const fileUpload = require("express-fileupload");
const app = express();
const fs = require("fs");
const path = require("path");

let Usuario = require("../models/usuario");
let Producto = require("../models/producto");


app.use(fileUpload());

app.put("/upload/:tipo/:id", (req, res) => {
  let tipo = req.params.tipo;
  let id = req.params.id;

  let nombreArchivo;
  let archivo;

  let tiposValidados = ["usuarios", "productos"];
  let extencioneValidas = ["png", "jpg", "gif", "jpeg"];

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({
      ok: false,
      err: {
        mensaje: "seleciona un archivo",
      },
    });
  }

  //validar tipo
  if (tiposValidados.indexOf(tipo) < 0) {
    return res.status(400).json({
      ok: false,
      err: {
        mensaje:
          "solo se puede agregar fotos de  " + tiposValidados.join(" , "),
      },
    });
  }

  archivo = req.files.archivo;

  //Extenciones permitidas

  let nombreCortado = archivo.name.split(".");
  let extencion = nombreCortado[nombreCortado.length - 1];

  if (extencioneValidas.indexOf(extencion) < 0) {
    return res.status(400).json({
      ok: false,
      err: {
        mensaje:
          "las extenciones permiidas son: " + extencioneValidas.join(", "),
      },
    });
  }

  //cambiando nombre del archivo
  nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extencion}`;

  archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }
    if (tipo == 'usuarios') {
      guardarFotoUsuario(id, res, nombreArchivo);
    }else{
      guardarFotoProducto(id, res, nombreArchivo)
    }

  });
});

function guardarFotoUsuario(id, res, nombreArchivo) {
  Usuario.findById(id, (err, usuarioBD) => {
    if (err) {
      borrarDuplicados('usuarios', nombreArchivo);
      return res.status(500).json({
        ok: false,
        err,
      });
    }
    if (!usuarioBD) {
      borrarDuplicados('usuarios', nombreArchivo);
      return res.status(500).json({
        mensaje:'usuario no existe'
      });
    }

    borrarDuplicados('usuarios', usuarioBD.img);

    usuarioBD.img = nombreArchivo;
    usuarioBD.save((err, usuarioBD) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }

      res.json({
        ok: true,
        usuarioBD,
      });
    });
  });
}
function guardarFotoProducto(id, res, nombreArchivo) {
  Producto.findById(id, (err, productoBD) => {
    if (err) {
      borrarDuplicados('productos', nombreArchivo);
      return res.status(500).json({
        ok: false,
        err,
      });
    }
    if (!productoBD) {
      borrarDuplicados('productos', nombreArchivo);
      return res.status(500).json({
        mensaje:'producto no existe'
      });
    }

    borrarDuplicados('productos', productoBD.img);

    productoBD.img = nombreArchivo;
    productoBD.save((err, productoBD) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }

      res.json({
        ok: true,
        productoBD,
      });
    });
  });
}

function borrarDuplicados(tipo, nombreArchivo) {
  let pathURL = path.resolve(
    __dirname,
    `../../uploads/${tipo}/${nombreArchivo}`
  );
  if (fs.existsSync(pathURL)) {
    fs.unlinkSync(pathURL);
  }
}

module.exports = app;
