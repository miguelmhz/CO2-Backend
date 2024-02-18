const { Router } = require('express');
const {getDataBySerial,getDataBySensor, getSensors} = require('../controllers/api.controller');

const router = Router();


router.get('/' , (req, res)=>{
    const externalURL = 'https://documenter.getpostman.com/view/19825496/2sA2r3b6tY';
    res.redirect(externalURL);
});
router.get('/sensor' , getSensors);
router.get('/:serial' , getDataBySerial);
router.get('/:serial/:sensor' , getDataBySensor);


module.exports = router