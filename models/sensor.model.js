const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const sensorSchema = Schema ({
    serial: {
        type: String,
        unique: true
    },
    type:{
        type: String,
    },
    units:{
        type: String,
    },
    token: {
        type: String,
    },
    latlong: {
        type: String,
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