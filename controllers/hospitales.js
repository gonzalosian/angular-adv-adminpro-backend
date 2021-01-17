// response me puede servir para definir el tipo, por ejemplo, si no viene la res (response), ponemos un valor por default
const { response } = require('express');
const bcrypt = require('bcryptjs');

const Hospital = require('../models/hospital');
const { generarJWT } = require('../helpers/jwt');


const getHospitales = async(req, res = response) => {

    // const hospitales = await Hospital.find({}, 'nombre img usuario');
    const hospitales = await Hospital.find()
                                    .populate('usuario', 'nombre img');

    res.json({
        ok: true,
        msg: 'GET Hospitales',
        hospitales,
        // uid: req.uid, // Usuario que consultó, gracias a token válido
    })
}


const crearHospital = async(req, res = response) => {

    // console.log(req.body);
    const { nombre } = req.body;

    try {
        const existeHospital = await Hospital.findOne({ nombre });

        if( existeHospital ){
            return res.status(400).json({
                ok: false,
                msg: 'El nombre del hospital ya está registrado'
            });
        }

        // Después de pasar por la validación del token, siempre tendremos el uid
        const uid = req.uid;
        const hospital = new Hospital( {
            usuario: uid,
            ...req.body
        } );
    
        // // Encriptar contraseña
        // const salt = bcrypt.genSaltSync();
        // usuario.password = bcrypt.hashSync( password, salt );

        // Guardar usuario
        await hospital.save();

        // // Generar el token - JWT
        // const token = await generarJWT( usuario.id );
    
        // En Express, el res.json() solo se puede llamar una única vez.
        res.json({
            ok: true,
            msg: 'POST Hospital',
            hospital,
            // token
        })
        
    } catch (error) {
        console.error(error);
        // gracias a definirle valor por default, me ayuda con el intellisense
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado...revisar logs'
        });
    }
    
}

const actualizaHospital = async(req, res = response) => {
    // TODO: Validar token y comprobar si es el usuario correcto
    
    const id = req.params.id;
    const uid = req.uid;

    try {

        const hospitalDB = await Hospital.findById( id );

        if( !hospitalDB ){
            return res.status(404).json({
                ok: false,
                msg: 'No existe un hospital con ese id'
            });
        }

        // Actualizaciones
        const cambiosHospital = {
            ...req.body,
            usuario: uid
        }

        // findByIdAndUpdate: tenemos la opción de pedir que siempre nos devuelva el usuario actualizado { new: true }
        const hospitalActualizado = await Hospital.findByIdAndUpdate( id, cambiosHospital, { new: true } );

        res.json({
            ok: true,
            // msg: 'PUT Hospital',
            hospital: hospitalActualizado
        })
        
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado al actualizar...revisar logs'
        });
    }
}


// Esto se implementa a mero ejemplo, ya que conviene dar de baja al usuario, modificarlo, para no perder referencias.
const borrarHospital = async(req, res = response) => {
    
    const id = req.params.id;

    try {

        const hospitalDB = await Hospital.findById( id );

        if( !hospitalDB ){
            return res.status(404).json({
                ok: false,
                msg: 'No existe un hospital con ese id'
            });
        }

        await Hospital.findByIdAndDelete( id );
        
        res.json({
            ok: true,
            msg: 'Hospital eliminado'
        })

    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'No se pudo eliminar el hospital'
        })
    }
}


module.exports = {
    getHospitales,
    crearHospital,
    actualizaHospital,
    borrarHospital
}