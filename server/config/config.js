// para el puerto
process.env.PORT = process.env.PORT || 3000;

// para el emtorno
process.env.NODE_ENV = process.env.NODE_ENV || "dev";

// para la bade de datos

//para el token
process.env.SEED = process.env.SEED || "este-es-el-seed-desarrollo";

let baseDatos;
if (process.env.NODE_ENV === "dev") {
  baseDatos = "mongodb://mongo/cafe";
} else {
  baseDatos = process.env.MONGO_URI;
}

process.env.URLBD = baseDatos;

//para el id del cliente

process.env.CLIENT_ID =
  process.env.CLIENT_ID ||
  "871166051076-vjif4qs0t71lupim9pfqphopr4enc13k.apps.googleusercontent.com";
