// response me puede servir para definir el tipo, por ejemplo, si no viene la res (response), ponemos un valor por default
const { response } = require('express');
const bcrypt = require('bcryptjs');

const Medico = require('../models/medico');
const { generarJWT } = require('../helpers/jwt');


const getMedicos = async(req, res = response) => {

    // const medicos = await Medico.find({}, 'nombre img usuario');
    const medicos = await Medico.find()
                                .populate('usuario', 'nombre img')
                                .populate('hospital', 'nombre img');

    res.json({
        ok: true,
        msg: 'GET Medicos',
        medicos,
    })
}


const crearMedico = async(req, res = response) => {

    const { nombre } = req.body;

    try {

        const existeMedico = await Medico.findOne({ nombre });

        if( existeMedico ){
            return res.status(400).json({
                ok: false,
                msg: 'El nombre del Médico ya está registrado'
            });
        }

        // Después de pasar por la validación del token, siempre tendremos el uid del usuario que lo crea.
        const uid = req.uid;
        
        const medico = new Medico( {
            usuario: uid,
            ...req.body
        } );
    
        // Guardar médico
        await medico.save();
    
        // En Express, el res.json() solo se puede llamar una única vez.
        res.json({
            ok: true,
            msg: 'POST Medico',
            medico
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

const actualizaMedico = async(req, res = response) => {
    // TODO: Validar token y comprobar si es el usuario correcto
    
    const id = req.params.id;
    // console.log(req.body)
    const uid = req.uid;

    try {

        const medicoDB = await Medico.findById( id );

        if( !medicoDB ){
            return res.status(404).json({
                ok: false,
                msg: 'No existe un medico con ese id'
            });
        }

        // Actualizaciones
        const cambiosMedico = {
            ...req.body,
            usuario: uid
        }

        // findByIdAndUpdate: tenemos la opción de pedir que siempre nos devuelva el usuario actualizado { new: true }
        const medicoActualizado = await Medico.findByIdAndUpdate( id, cambiosMedico, { new: true } );
    
        res.json({
            ok: true,
            // msg: 'PUT Medico',
            medico: medicoActualizado
        })
        
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado al actualizar...revisar logs'
        });
    }
}


// Esto se implementa a mero ejemplo, ya que conviene dar de baja al medico, modificarlo, para no perder referencias.
const borrarMedico = async(req, res = response) => {

    const id = req.params.id;

    try {

        const medicoDB = await Medico.findById( id );

        if( !medicoDB ){
            return res.status(404).json({
                ok: false,
                msg: 'No existe un Medico con ese id'
            });
        }

        await Medico.findByIdAndDelete( id );
        
        res.json({
            ok: true,
            msg: 'Medico eliminado'
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
    getMedicos,
    crearMedico,
    actualizaMedico,
    borrarMedico
}