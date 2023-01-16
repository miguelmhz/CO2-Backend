const { Router } = require('express');
const { addSensor, uploadmeasurement, changeName} = require('../controllers/sensor.controller');

const router = Router();


router.post('/' , addSensor);
router.post('/measures' , uploadmeasurement);
router.post('/name/:id?' , changeName);



module.exports = router
