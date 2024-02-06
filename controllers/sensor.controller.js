const { response, request } = require('express');
const Sensor = require('../models/sensor.model');


const addSensor = async (req, res) => {
    const {
        serial,
        type,
        units,
        token,
        latlong,
        metadata,
        data,
        val,
        datetime
    } = req.body;


    // Comprobación de datos incompletos
    if (!serial || !type) {
        console.log("Datos incompletos");
        return res.send("Datos incompletos");
    }

    // Extracción de la parte MAC de serial
    const mac = serial.slice(0, 17);

    try {
        // Buscar si el sensor ya existe en la base de datos
        const sensor = await Sensor.findOne({ serial: mac, type });

        if (sensor) {
            // Si el sensor ya existe, actualizar los datos si están presentes
            if (!data) {
                if (val && datetime) {
                    await Sensor.findOneAndUpdate(
                        { serial: mac, type },
                        { $push: { data: { val, datetime } } }
                    );
                    console.log( "Datos agregados");
                    return res.send(`Datos '${type}' en '${mac}' agregados correctamente`);
                }
                return res.send("Sensor previamente registrado");
            }

            // Si hay datos, agregarlos al sensor
            if (Array.isArray(data)) {
                await Sensor.findOneAndUpdate(
                    { serial: mac, type },
                    { $push: { data: { $each: data } } }
                );
            } else {
                await Sensor.findOneAndUpdate(
                    { serial: mac, type },
                    { $push: { data: data } }
                );
            }
            console.log(data.length + " Datos agregados");

            return res.send(`Datos '${type}' en '${mac}' agregados correctamente`);
        } else {
            // Si el sensor no existe, crear uno nuevo con los datos proporcionados
            const newSensor = new Sensor({
                serial: mac,
                type,
                units,
                token,
                latlong,
                metadata: metadata || type,
                data: data || []
            });

            await newSensor.save();

            return res.send(`Sensor '${type}' de '${mac}' agregado correctamente`);
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Error al agregar el sensor" });
    }
};


const uploadmeasurement = async (req = request, res = response) => {
    const { serial, data } = req.body;

    try {
        // Verificar si el sensor existe
        const sensor = await Sensor.findOne({ serial });
        if (!sensor) {
            return res.status(404).send(`Error: Sensor '${serial}' not found`);
        }

        // Construir la consulta de actualización según el tipo de datos
        const updateQuery = Array.isArray(data)
            ? { $push: { data: { $each: data } } }
            : { $push: { data: data } };

        // Actualizar el sensor con los datos recibidos
        const sensorUpdate = await Sensor.findOneAndUpdate({ serial }, updateQuery);

        return res.send(`Datos en '${serial}' agregados correctamente`);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
}
const changeName = async (req = request, res = response) => {
    const { serial, metadata } = req.body;
    const { id } = req.params;
    try {
        let sensor = id && id.length == 24 ? await Sensor.findById(id) : await Sensor.findOne({ serial })
        if (sensor) {
            const data = id && id.length == 24 ? await Sensor.findByIdAndUpdate(id, { metadata }) : await Sensor.findOneAndUpdate({ serial }, { metadata });
            return res.json({
                msg: "metadata editado correctamente"
            })
        }
        return res.json({
            msg: "serial no encontrado",
            error: true
        })
    } catch (error) {
        console.log(error)
        return res.json({
            data: [],
            error: error
        })

    }
}







module.exports = { addSensor, uploadmeasurement, changeName }
