
// para el puerto
process.env.PORT = process.env.PORT || 3000;

// para el emtorno
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

// para la bade de datos


let baseDatos;
if(process.env.NODE_ENV==='dev'){
    baseDatos= 'mongodb://localhost:27017/cafe'
}else {
    
    baseDatos= process.env.MONGO_URI  //tienes que crear una varible de entorno con el link que te dan para conertar
    // mongo atlas
}

process.env.URLBD = baseDatos;

