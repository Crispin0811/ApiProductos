//===========================
//verificar token
//===========================

const jwt = require('jsonwebtoken');

let verificarToken = (req, res, next) => {
    let token = req.get('token');

    jwt.verify(token,process.env.SEED,(err, decoded)=>{
        if(err){
            return res.status(401).json({
                ok: false,
                err: "TOKEN INVALIDO"
            });
       }

       req.usuario = decoded.usuario;
       next(); 
    });
    
};

//===========================
//Verifica rol ADMINISTRADOR
//===========================

const isAdminRol = (req, res, next)=>{
    let rol = req.usuario.role;
    if(rol==='ROL_ADMIN'){
        next();
    }else{
        res.status(500).json({
            ok: false,
            rol: rol,
            mensaje: 'no tienes permiso para hacer esta tareas'
            
        })
    }
    
}

const verificarTokenImg = (req, res, next)=>{
    let token = req.query.token;

    jwt.verify(token,process.env.SEED,(err, decoded)=>{
        if(err){
            return res.status(401).json({
                ok: false,
                err: "TOKEN INVALIDO"
            });
       }

       req.usuario = decoded.usuario;
       next(); 
    });
}

module.exports={
    verificarToken,
    isAdminRol,
    verificarTokenImg
}
