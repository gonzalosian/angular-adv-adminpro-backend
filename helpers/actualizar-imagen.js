const fs = require('fs');

const Usuario = require('../models/usuario');
const Medico = require('../models/medico');
const Hospital = require('../models/hospital');

const borrarImagen = ( path ) => {
    if( fs.existsSync( path ) ){
        // borrar la imagen anterior
        fs.unlinkSync( path );
    }
}

const actualizarImagen = async( tipo, id, nombreArchivo ) => {

    let pathViejo = '';

    switch (tipo) {
        case 'medicos':
            const medico = await Medico.findById( id );

            if( !medico ){
                console.log('No es un medico por id');
                return false
            }

            // Establecemos un path
            pathViejo = `./uploads/medicos/${ medico.img }`;

            borrarImagen( pathViejo );

            // A la instancia del medico le establecemos la img
            medico.img = nombreArchivo;
            await medico.save();
            return true;

            break;
        case 'hospitales':
            const hospital = await Hospital.findById( id );

            if( !hospital ){
                console.log('No es un hospital por id');
                return false
            }

            // Establecemos un path
            pathViejo = `./uploads/hospitales/${ hospital.img }`;

            borrarImagen( pathViejo );

            // A la instancia del hospital le establecemos la img
            hospital.img = nombreArchivo;
            await hospital.save();
            return true;
            
            break;
        case 'usuarios':
            const usuario = await Usuario.findById( id );

            if( !usuario ){
                console.log('No es un usuario por id');
                return false
            }

            // Establecemos un path
            pathViejo = `./uploads/usuarios/${ usuario.img }`;

            borrarImagen( pathViejo );

            // A la instancia del usuario le establecemos la img
            usuario.img = nombreArchivo;
            await usuario.save();
            return true;
            
            break;
    
        default:
            break;
    }
}

module.exports = {
    actualizarImagen
}