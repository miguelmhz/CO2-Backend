const { Router } = require('express');
const {getDataBySerial,getDataBySensor} = require('../controllers/api.controller');

const router = Router();


router.get('/:serial' , getDataBySerial);
router.get('/:serial/:sensor' , getDataBySensor);


module.exports = router