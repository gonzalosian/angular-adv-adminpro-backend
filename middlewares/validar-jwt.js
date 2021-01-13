const { response } = require('express')
const jwt = require('jsonwebtoken');

const validarJWT = ( req, res = response, next ) => {

    // Leer el token
    const token = req.header('x-token');
    console.log(token);

    if( !token ){
        res.status(401).json({
            ok: false,
            msg: 'No hay token en la petición'
        })
    }
    
    try {
        const { uid } = jwt.verify( token, process.env.JWT_SECRET );
        // Si nos muestra el ID del user, es porque el token se verificó correctamente
        console.log(uid);
        // en la request devolveremos el usuario que hace la petición, para mostrarlo
        req.uid = uid;

    } catch (error) {
        console.error(error);
        res.status(401).json({
            ok: false,
            msg: 'Token no válido'
        });
    }

    next();

}

module.exports = {
    validarJWT,
}