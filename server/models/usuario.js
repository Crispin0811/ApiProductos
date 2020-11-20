const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');



let Schema = mongoose.Schema;


let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'el nombre es requerido']
    },
    email: {
        type: String,
        unique: [true, `el correo ya existe`],
        required: 'el correo es necesario'
            // required: [true, 'el correo es necesario']  ==> AMBOS ESTAN BIEN
    },
    password: {
        type: String,
        required: [true, 'la contraseña es necesario ']
    },
    img: {
        type: String
    },
    role: {
        type: String,
        enum: {
            values: ['ROL_USUARIO', 'ROL_ADMIN'],
            message: '{VALUE} no es un rol definido, por favor cambiarlo'
        },
        required: [true, 'el rol es necesario'],
        default: 'ROL_USUARIO'
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }

});

usuarioSchema.methods.toJSON =function(){
    let user = this;
    let objetoUsuario = user.toObject();
    delete objetoUsuario.password;
    return objetoUsuario;
}

usuarioSchema.plugin(uniqueValidator, { message: 'Error, el {PATH}: {VALUE} ya existe.' });

module.exports = mongoose.model('Usuario', usuarioSchema);