/*
    Ruta: '/api/noticias'
*/

const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { getNoticias, crearNoticia, actualizaNoticia, borrarNoticia } = require('../controllers/noticias');

const router = Router();

router.get( '/', [], getNoticias);

router.post( '/', 
    [
        validarJWT,
        check('titulo', 'El titulo de la noticia es obligatorio').not().isEmpty(),
        validarCampos
    ], 
    crearNoticia
);


router.put( '/:id', 
    [
        validarJWT,
        check('titulo', 'El titulo es obligatorio').not().isEmpty(),
        validarCampos
    ], 
    actualizaNoticia );


router.delete( '/:id', validarJWT, borrarNoticia);


module.exports = router;