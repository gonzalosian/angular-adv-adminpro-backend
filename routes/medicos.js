/*
Ruta: '/api/medicos'
*/

const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { getMedicos, crearMedico, actualizaMedico, borrarMedico, getMedicoById } = require('../controllers/medicos');

const router = Router();

router.get( '/', validarJWT, getMedicos);

router.get( '/:id', validarJWT, getMedicoById);

router.post( '/', 
    [
        validarJWT,
        check('nombre', 'El nombre del médico es obligatorio').not().isEmpty(),
        check('hospital', 'El id del hospital debe ser válido').isMongoId(),
        validarCampos
    ],
    crearMedico
);


router.put( '/:id', 
    [
        validarJWT,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('hospital', 'El id del hospital debe ser válido').isMongoId(),
        validarCampos
    ], 
    actualizaMedico );


router.delete( '/:id', validarJWT, borrarMedico);


module.exports = router;