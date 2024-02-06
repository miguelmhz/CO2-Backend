const express = require('express');
const cors = require('cors');
require('encoding')

const bodyParser = require('body-parser')
//routes
const sensorRoute = require('./routes/sensor.route');
const apiRoute = require('./routes/api.route');
const userRoute = require('./routes/user.route');

const { dbConnection } = require('./database/configDB');
const  Mongoose  = require('mongoose');

const app = express(); 

const port =  3005; 

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json({ limit: '10mb' }));
app.use(express.static( 'public'));
//DB connection 
const databaseConnection  = async() =>  {
    await dbConnection()
    //console.log(Mongoose.Connection);
}
databaseConnection()

//Rutas 
// /co2-bkn
app.use("/sensor", sensorRoute)
app.use("/user", userRoute)
app.use("/api", apiRoute)



app.listen(port, ()=> {
    console.log('listening on ', port)
});
