const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
//para google
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.CLIENT_ID);
//para google

const Usuario = require("../models/usuario");

app.post("/login", (req, res) => {
  let body = req.body;
  Usuario.findOne({ email: body.email }, (err, usuarioBD) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }

    if (!usuarioBD) {
      if (err) {
        return res.status(400).json({
          ok: false,
          mensaje: "(usuario) o contraseña incorrecta",
          err,
        });
      }
    }

    if (!bcrypt.compareSync(body.password, usuarioBD.password)) {
      return res.status(400).json({
        ok: false,
        mensaje: "usuario o (contraseña) incorrecta",
        err,
      });
    }

    let token = jwt.sign(
      {
        usuario: usuarioBD,
      },
      process.env.SEED,
      { expiresIn: '48h' }
    );

    res.json({
      ok: true,
      usuario: usuarioBD,
      token,
    });
  });
});

//===========================
//CONFIGURACIONES DE GOOGLE
//===========================

async function verify(token) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.CLIENT_ID,
  });
  const payload = ticket.getPayload();

  return {
    nombre: payload.name,
    email: payload.email,
    img: payload.picture,
    google: true,
  };
}

app.post("/google", async (req, res) => {
  let token = req.body.idtoken;

  let googleUser = await verify(token).catch((e) => {
    res.status(503).json({
      ok: false,
      err: e,
    });
  });

  Usuario.findOne({ email: googleUser.email }, (err, usuarioBD) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }

    if (usuarioBD) {
      if (usuarioBD.google === false) {
        return res.status(400).json({
          ok: false,
          mensaje: "use sus credenciales de identificacion",
          err,
        });
      } else {
        let token = jwt.sign(
          {
            usuario: usuarioBD,
          },
          process.env.SEED,
          { expiresIn: '48h' }
        );

        return res.json({
          ok: true,
          token,
          usuario: usuarioBD,
        });
      }
    } else {
      let usuario = new Usuario();
        usuario.nombre = googleUser.nombre,
        usuario.img = googleUser.img,
        usuario.email = googleUser.email,
        usuario.google = true,
        usuario.password = ":)"

      usuario.save((err, usuarioBD) => {
        if (err) {
          return res.status(400).json({
            ok: false,
            err,
          });
        }
        let token = jwt.sign(
          {
            usuario: usuarioBD,
          },
          process.env.SEED,
          { expiresIn: '48h' }
        );

        return res.json({
          ok: true,
          usuario: usuarioBD,
          token,

        });
      });
    }
  });
});

module.exports = app;
