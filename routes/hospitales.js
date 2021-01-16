/*
    Ruta: '/api/hospitales'
*/

const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { getHospitales, crearHospital, actualizaHospital, borrarHospital } = require('../controllers/hospitales');

const router = Router();

router.get( '/', [], getHospitales);

router.post( '/', 
    [
        validarJWT,
        check('nombre', 'El nombre del hospital es obligatorio').not().isEmpty(),
        validarCampos
    ], 
    crearHospital
);


router.put( '/:id', 
    [
        // validarJWT,
        // check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        // // check('email', 'El email es obligatorio').isEmail(),
        // // check('role', 'El rol es obligatorio').not().isEmpty(),
        // validarCampos
    ], 
    actualizaHospital );


router.delete( '/:id', [], borrarHospital);


module.exports = router;