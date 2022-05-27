const mongoose = require('mongoose')


const dbConnection = async  ()=> {
    try {
        mongoose.connect('mongodb://localhost:27017/aerialSyncSensors');
        console.log("Conexion realizada")

    } catch (error) {
        console.log(error)
        throw new Error('Error en la conexion ')
    }
}


module.exports = {
    
    dbConnection
}