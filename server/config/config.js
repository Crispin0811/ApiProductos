
// para el puerto
process.env.PORT = process.env.PORT || 3000;

// para el emtorno
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

// para la bade de datos


let baseDatos;
if(process.env.NODE_ENV==='dev'){
    baseDatos= 'mongodb://localhost:27017/cafe'
}else {
    
    baseDatos='mongodb+srv://kevin:9Lgv6jJRyBSakVab@cluster0.jyvdq.mongodb.net/cafe'
}

process.env.URLBD = baseDatos;

