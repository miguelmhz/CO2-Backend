//Para que nos complete los comandos en VS Code 
const {response, request} = require('express');

const Sensor = require('../models/sensor.model');



const addSensor = async(req=request, res=response ) => {
    const {serial,
        type,
        units,
        token,
        latlong,
        metadata
    } = req.body;
    if (!serial || !type || !units) {
        return res.send(
            "Datos incompletos"
       )
    }else {
        try {
            const sensor = await Sensor.findOne({serial, type})
            if (sensor) {
                
                return res.send(
                     "Sensor '" + type + "' in '" + serial + "' is already in the database."
                )
                
            } else {
                
                const newSensor = new Sensor({
                    serial,
                    type,
                    units,
                    token,
                    latlong,
                    metadata:metadata || type
                })
                await newSensor.save()
    
                return res.send(
                    "Sensor '" + type + "' in '" + serial +  "' added succefully"
                )
            }
            
        } catch (error) {
            return res.json({
                data: [],
                error: error
            })
        }
    }

}
const uploadmeasurement = async(req=request, res=response ) => {
    const {serial, data} = req.body;
    console.log(data)
    try {
        const sensor = await Sensor.findOne({serial})
        if (!sensor) {
            
            return res.send(
                 "Error: Sensor '" + serial +  "' not find"
            )
            
        } else {
            if (typeof data == "object" && Array.isArray(data)) {
                const sensorUpdate = await Sensor.findOneAndUpdate({serial}, {
                    $push: {
                      data: { $each: data },
                    },
                },)
                console.log(sensorUpdate)
            }else{
                const sensorUpdate = await Sensor.findOneAndUpdate({serial}, {
                    $push: {
                      data: data ,
                    },
                },)
                console.log(sensorUpdate)

            }
            return res.send(
                "OK"
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







module.exports = { addSensor, uploadmeasurement}