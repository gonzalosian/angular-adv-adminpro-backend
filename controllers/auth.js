const { response } = require('express');
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');


const login = async( req, res = response ) => {

    const { email, password } = req.body;

    try {
        // Verificar email
        const usuarioDB = await Usuario.findOne({email});

        if( !usuarioDB ){
            res.status(404).json({
                ok: false,
                msg: '1-Email o contraseña no válida.'
            })
        };

        // Verificar contraseña
        const validPass = bcrypt.compareSync( password, usuarioDB.password );
        
        if( !validPass ){
            res.status(400).json({
                ok: false,
                msg: '2-Email o contraseña no válida.'
            })
        };

        // Generar el token - JWT
        const token = await generarJWT( usuarioDB.id );
        

        res.json({
            ok: true,
            msg: 'Logueado',
            token
        })
        
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'Comunicarse con el Administrador'
        })
    }
}


module.exports = {
    login,
}