//Para que nos complete los comandos en VS Code 
const {response, request} = require('express');
const Sensor = require('../models/sensor.model');


const greetsensor = async(req=request, res=response ) => {
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
            const sensor = await Sensor.findOne({serial})
            if (sensor) {
                
                return res.send(
                     "Sensor '" + serial +  "' is already in the data base."
                )
                
            } else {
    
                const newSensor = new Sensor({
                    serial,
                    type,
                    units,
                    token,
                    latlong,
                    metadata
                })
                await newSensor.save()
    
                return res.send(
                     "Sensor '" + serial +  "' added succefully"
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
const downloadjson = async(req=request, res=response ) => {
    const {serial} = req.params;
    
    try {
        const sensor = await Sensor.findOne({serial})
        if (!sensor) {
            
            return res.send(
                 "Error: Sensor '" + serial +  "' not found"
            )
            
        } else {
            return res.json(
                sensor
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






module.exports = { greetsensor, uploadmeasurement,downloadjson}