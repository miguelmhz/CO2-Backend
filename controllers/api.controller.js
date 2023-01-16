//Para que nos complete los comandos en VS Code 
const {response, request} = require('express');
const Sensor = require('../models/sensor.model');
const User = require('../models/user.model');
const  moment = require('moment');

function stripAlphaChars(source) { 
    var out = source.replace(/[^0-9]/g, ''); 
    
    return out; 
}

const getAllSensors = async(req=request, res=response ) => {
    try {
        const data = await Sensor.find()
        if (data) {
            
            return res.json({
                data
            })
            
        } else {
            return res.json({
                data:[]
            })
        }
        
    } catch (error) {
        return res.json({
            data: [],
            error: error
        })
    }
}


const getSensors = async(req=request, res=response ) => {
    const {user } = req.params

    try {
        const data = await User.findById(user)
        if (data) {
            if (data.sensors) {
                const sensorsList = data.sensors.map(sensor => sensor.serial)
                const sensors = await Sensor.find({
                    'serial' : sensorsList
                }) 
                return res.json({
                    data: sensors
                })
            }

            return res.json({
                data:[]
            })
            
        } else {
            return res.json({
                data:[]
            })
        }
        
    } catch (error) {
        console.log("error aquiii",  error);
        return res.json({
            data: [],
            error: error
        })
    }
}



const addSensorPost = async(req=request, res=response ) => {
    const {serial,
        token,
        metadata:name,
        userID,
        } = req.body; 

       try {
           const sensor = await Sensor.find( { serial } )
           console.log(sensor)
           const user = await User.findById( userID )
       
           if (!sensor) {
               return res.json({
                   error: "Sensor no encontrado"
               })
           }else if(token != sensor.token){
               return res.json({
                   error: "Token incorrecto"
               })
           }else if(user && user.sensors.includes(serial)){
               return res.json({
                   error: "Sensor previamente registrado"
               })
           }else{
               if (name) {
                   user.sensors.push({serial, name})
                }else{
                   user.sensors.push({serial, name:sensor.metadata})
               }
       
               await Promise.all([
                   await user.save(),
                   await sensor.save()
               ])
               return res.json({
                   msg: "Sensor agregado con exito"
               })
           }
           
       } catch (error) {
           console.log(error);
           res.json({
               error: "Error en servidor, intente mas tarde"
           })
       } 
}

const getMeasurements = async(req=request, res=response ) => {
    const {user:userID, sensor:serial} = req.params;
    try {
        const user = await User.findById( userID )
        
        if (user && JSON.stringify(user).includes(serial)) {
            const sensor =await Sensor.findOne({serial:serial});
            console.log(sensor.type);
            return res.json({
                data:sensor
            })
        }else{
            return res.json({
                data:[],
                error: "No se encontró sensor en este usuario"
            })
        }
        
    } catch (error) {
        console.log(error);
           res.json({
               error: "Error en servidor, intente mas tarde"
           })
    }
    

}
const deleteSensor = async(req=request, res=response ) => {
    const {user:userID} = req.params;
    const {sensor} = req.body;
    try {
        const user = await User.findById( userID )
        
        if (user && JSON.stringify(user).includes(sensor)) {
            const sesnorBorrado = await User.findOneAndUpdate({ _id:userID }, {
                $pull: {
                    sensors: {serial: sensor},
                },
            });
            console.log("sensor", sensor)
            console.log(user)
            console.log(sesnorBorrado)
            return res.json({
                msg: "Sensor borrado con exito"
            })
        }else{
            return res.json({
                data:[],
                error: "No se encontró sensor en este usuario"
            })
        }
        
    } catch (error) {
        console.log(error);
           res.json({
               error: "Error en servidor, intente mas tarde"
           })
    }
    

}

const getDataBySerial = async(req=request, res=response ) => {
    const {serial} = req.params;
    const {start, end, unix} = req.query;
    try {
        const sensor = await Sensor.find({serial })
        if (!sensor) {
            
            return res.send(
                 "Error: Sensor '" + serial +  "' not found"
            )
            
        } else {
            if (start && end) {
                sensor.forEach(d=> d.data = d.data.filter(data=> data.datetime >= parseInt(stripAlphaChars(start))  && data.datetime <= parseInt(stripAlphaChars(end))  )  )
            }else if (start) {
                sensor.forEach(d=> d.data = d.data.filter(data=> data.datetime >= parseInt(stripAlphaChars(start))) )
            }else if(end){
                sensor.forEach(d=> d.data = d.data.filter(data=>  data.datetime <= parseInt(stripAlphaChars(end))) )
            }
            if (unix === 'false' ) {
                sensor.forEach(d => {
                    d.data.forEach(res => (
                        res.datetime = moment.unix(res.datetime).format("DD/MM/YYYY hh:mm A")
                        //console.log(moment.unix(res.Tiempo).format("DD/MM/YYYY hh:mm A"))
                    ))
                })
            }
            console.log(sensor[0].data)
            return res.json({
                data: sensor
            }
           )



        }
            
    } catch (error) {
        console.log(error)
        return res.json({
            data: [],
            error: error
        })

    }
}
const getDataBySensor = async(req=request, res=response ) => {
    const {serial, sensor} = req.params;
    const {start, end, last, unix} = req.query;
    try {
        let resSensor = {};

        if (serial.length <=7 ) {
            resSensor = await Sensor.findOne({metadata:serial, type:sensor }).lean()
            
        }else{
            resSensor = await Sensor.findOne({serial, type:sensor }).lean()

        }
        //const sensors = await Sensor.find({ "serial": { "$regex": serial, "$options": "i" } })
        console.log(resSensor)
        if (!resSensor) {
            
            return res.send(
                 "Error: Sensor '"+ sensor +"' in '" + serial +  "' not found"
            )
            
        } else {
            if (resSensor) {
                let dataSensor = resSensor.data 
                console.log(dataSensor)
                if (start && end) {
                    dataSensor = dataSensor.filter(d=> d.datetime >= parseInt(stripAlphaChars(start))  && d.datetime <= parseInt(stripAlphaChars(end)) )
                }else if (start) {
                    dataSensor = dataSensor.filter(d=> d.datetime >= parseInt(stripAlphaChars(start)) )
                }else if(end){
                    dataSensor = dataSensor.filter(d=> d.datetime <= parseInt(stripAlphaChars(end)) )
                }else if(last){
                    dataSensor = dataSensor.slice(-last)
                }
                if (unix === 'false' ) {
                    dataSensor= dataSensor.map(d=> ({...d, epoch:  d.datetime , datetime : moment.unix(d.datetime).format("DD/MM/YYYY hh:mm A")}))
                }

                return res.json({
                    ...resSensor,
                    data:dataSensor
               })
            }else {
                return res.send(
                    "Error: Sensor '" + sensor +  " not found in " + serial
               )
            }

        }
            
    } catch (error) {
        console.log(error)
        return res.json({
            data: [],
            error
        })

    }
}



module.exports = {
    addSensorPost,
    getMeasurements,
    getSensors,
    getAllSensors,
    deleteSensor,
    getDataBySerial,
    getDataBySensor
}