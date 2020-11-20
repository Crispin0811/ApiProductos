const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");


let Schema = mongoose.Schema;

let categoriaSchema = new Schema({
  descripcion: {
    type: String,
    unique: true,
    require: [true, 'el rol es necesario'],
  },
  usuario: {
    type: Schema.Types.ObjectId,
    ref: 'Usuario',
  }
});

categoriaSchema.plugin(uniqueValidator, { message: 'Error, el {PATH}: {VALUE} ya existe.' });

module.exports = mongoose.model('Categoria',categoriaSchema)
