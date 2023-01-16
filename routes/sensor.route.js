const { Router } = require('express');
const {changeName, addSensor, uploadmeasurement} = require('../controllers/sensor.controller');

const router = Router();


router.post('/' , addSensor);
router.post('/uploadmeasurement' , uploadmeasurement);
router.post('/name/:id?' , changeName);


module.exports = router
