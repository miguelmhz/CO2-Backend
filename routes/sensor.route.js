const { Router } = require('express');
const { addSensor, uploadmeasurement} = require('../controllers/sensor.controller');

const router = Router();


router.post('/' , addSensor);
router.post('/uploadmeasurement' , uploadmeasurement);


module.exports = router