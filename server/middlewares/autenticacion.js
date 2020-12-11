const jwt = require('jsonwebtoken');
const utf8 = require('utf8');



// =====================
// Verificar Token
// =====================
let verificaToken = (req, res, next) => {


    let token = req.get('Authorization');

    var textoUtf8 = utf8.encode(process.env.SEED);

    jwt.verify(token, textoUtf8, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            });
        }

        req.usuario = decoded;
        next();

    });



};

// =====================
// Verifica AdminRole
// =====================
let verificaAdmin_Role = (req, res, next) => {

    let usuario = req.usuario;

    if (usuario.iss === 'ADMIN_ROLE') {
        next();
    } else {

        return res.json({
            ok: false,
            err: {
                message: 'El usuario no es administrador'
            }
        });
    }
};

let verificaUser_Role = (req, res, next) => {

    let usuario = req.usuario;

    if (usuario.iss === 'USER_ROLE') {
        next();
    } else {

        return res.json({
            ok: false,
            err: {
                message: 'El usuario es administrador y no puede hacer estas funciones'
            }
        });
    }
};



module.exports = {
    verificaToken,
    verificaAdmin_Role,
    verificaUser_Role
}