const { Router } = require('express');
const {getDataBySerial,getDataBySensor, getSensors} = require('../controllers/api.controller');

const router = Router();


router.get('/sensor' , getSensors);
router.get('/:serial' , getDataBySerial);
router.get('/:serial/:sensor' , getDataBySensor);


module.exports = router