// response me puede servir para definir el tipo, por ejemplo, si no viene la res (response), ponemos un valor por default
const { response } = require('express');

const Usuario = require('../models/usuario');
const Medico = require('../models/medico');
const Hospital = require('../models/hospital');
const Noticia = require('../models/noticia');


const getTodo = async(req, res = response) => {

    const busqueda = req.params.busqueda;
    // console.log(busqueda);
    const regex = new RegExp( busqueda, 'i' );

    // const usuarios = await Usuario.find( { nombre: regex } );
    // const medicos = await Medico.find( { nombre: regex } );
    // const hospitales = await Hospital.find( { nombre: regex } );

    const [ usuarios, medicos, hospitales, noticias ] = await Promise.all([
        Usuario.find( { nombre: regex } ),
        Medico.find( { nombre: regex } ),
        Hospital.find( { nombre: regex } ),
        Noticia.find( { titulo: regex } ),
    ]);

    res.json({
        ok: true,
        msg: 'GET Busqueda',
        // busqueda,
        usuarios,
        medicos,
        hospitales,
        noticias,
        // uid: req.uid, // Usuario que consultó, gracias a token válido
        // total
    })
}


const getDocumentoColeccion = async(req, res = response) => {

    const tabla = req.params.tabla;
    const busqueda = req.params.busqueda;
    // console.log(busqueda);
    const regex = new RegExp( busqueda, 'i' );

    let data = [];

    switch ( tabla ) {
        case 'medicos':
            data = await Medico.find( { nombre: regex } )
                                .populate( 'usuario', 'nombre img' )
                                .populate( 'hospital', 'nombre img' );
            break;
        case 'hospitales':
            data = await Hospital.find( { nombre: regex } )
                                .populate( 'usuario', 'nombre img' );
            break;
        case 'noticias':
            data = await Noticia.find( { titulo: regex } )
                                .populate( 'usuario', 'nombre img' );
            break;
        case 'usuarios':
            data = await Usuario.find( { nombre: regex } );
            break;
        default:
            res.status(400).json({
                ok: false,
                msg: 'La tabla tiene que ser medicos/hospitales/usuarios/noticias'
            });
    }

    // const [ usuarios, medicos, hospitales ] = await Promise.all([
    //     Usuario.find( { nombre: regex } ),
    //     Medico.find( { nombre: regex } ),
    //     Hospital.find( { nombre: regex } )
    // ]);

    res.json({
        ok: true,
        msg: 'GET Busqueda',
        resultado: data
    })
}


module.exports = {
    getTodo,
    getDocumentoColeccion
}