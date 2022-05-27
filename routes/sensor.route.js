const { Router } = require('express');
const { greetsensor, uploadmeasurement,downloadjson
    // greetsensorjson, downloadjson,registersensor, removesensor 
} = require('../controllers/sensor.controller');

const router = Router();

//Middelware de una ruta va como segundo argumento 
//Si son mas de uno, va como un arreglo 
router.post('/greetsensor' , greetsensor);
// router.post('/greetsensorjson' , greetsensorjson);
router.post('/uploadmeasurement' , uploadmeasurement);
router.get('/:serial' , downloadjson);
// router.post('/registersensor' , registersensor);
// router.post('/removesensor' , removesensor);


module.exports = router