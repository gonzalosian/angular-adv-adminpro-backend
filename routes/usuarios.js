/*
    Ruta: /api/usuarios
*/

const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { getUsuarios, crearUsuario, actualizaUsuario, borrarUsuario } = require('../controllers/usuarios');

const router = Router();

router.get( '/', validarJWT, getUsuarios);

// router.post( '/', crearUsuario);
router.post( '/', 
    [  
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('password', 'El password es obligatorio').not().isEmpty(),
        check('email', 'El email no es válido').isEmail(),
        validarCampos
    ], 
    crearUsuario
);


router.put( '/:id', 
    [
        validarJWT,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        check('role', 'El rol es obligatorio').not().isEmpty(),
        validarCampos
    ], 
    actualizaUsuario );


router.delete( '/:id', validarJWT, borrarUsuario);


module.exports = router;