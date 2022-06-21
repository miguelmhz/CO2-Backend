const jwt = require('jsonwebtoken');
const { SECRETORPRIVATEKEY } = require('../env.js');



const generarJWT = ( uid = '' ) => {

    return new Promise( (resolve, reject) => {

        const payload = { uid };

        jwt.sign( payload, SECRETORPRIVATEKEY, {
            expiresIn: '7d'
        }, ( err, token ) => {

            if ( err ) {
                console.log(err);
                reject( 'No se pudo generar el token' )
            } else {
                resolve( token );
            }
        })

    })
}




module.exports = {
    generarJWT
}

