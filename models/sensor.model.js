const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const sensorSchema = Schema ({
    serial: {
        type: String,
    },
    type:{
        type: String,
    },
    units:{
        type: String,
    },
    token: {
        type: String,
        default: '1234'
    },
    latlong: {
        type: String,
        default: '22.149631, -101.035683'
    },
    metadata: {
        type: String,
    },
    data:  [{
        datetime : String,
        val : String
    }]
    
})


//Sobrescribir metodos 

sensorSchema.methods.toJSON = function (){
    const { __v, ...data } = this.toObject();
    return data ; 
}


//Crea el modelo correespondiente a la coleccion 'sensor' 
module.exports = mongoose.model("sensor", sensorSchema, 'sensor');