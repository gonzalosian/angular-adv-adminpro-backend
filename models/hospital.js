const { Schema, model } = require('mongoose');

const HospitalSchema = Schema({

    nombre: {
        type: String,
        required: true
    },
    img: {
        type: String
    },
    usuario: {
        required: true,
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }
}, { collection: 'hospitales' }); // esta es la forma de renombrarlo, porque por default mongo pondría hospitals

// Esto es para fines visuales. No afecta a la DB.
HospitalSchema.method('toJSON', function(){
    const { __v, ...object } = this.toObject();

    return object;
})

// Mongoose tomará el nombre y lo llevará a plural
module.exports = model( 'Hospital', HospitalSchema );