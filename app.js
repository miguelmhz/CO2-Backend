const express = require('express');
const cors = require('cors');
require('encoding')

const bodyParser = require('body-parser')
//routes
const sensorRoute = require('./routes/sensor.route');

const { dbConnection } = require('./database/configDB');
const  Mongoose  = require('mongoose');

const app = express(); 

const port =  3005; 


app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json()); 

//DB connection 
const databaseConnection  = async() =>  {
    await dbConnection()
    //console.log(Mongoose.Connection);
}
databaseConnection()

//Rutas 
// /aerialsync
app.use("/sensors", sensorRoute)



app.listen(port, ()=> {
    console.log('listening on ', port)
});
