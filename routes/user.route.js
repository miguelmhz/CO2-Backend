const { Router } = require('express');
const { newUser, loginUser, uploadAvatar, updateName,changeRol, addSensorUser, getUserInfo, changeSensorName, validarTokenUsuario, deleteSensor } = require('../controllers/user.controller');
const multer = require('multer');
const mimeTypes = require('mime-types');
const { validarJWT } = require('../middlewares/validarJWT');


const storage =  multer.diskStorage({
    destination: 'public/avatars/',
    filename: function(req, file, callback){
        console.log(file)
        callback("", req.body.user + ".jpeg"  );
        // callback("", req.body.user + "." + mimeTypes.extension(file.mimetype) );
    }
});
const upload =  multer({
    storage:storage
});

const router = Router();

router.post('/login', loginUser)
router.post('/register' , newUser)
router.post('/avatar', upload.single('avatar') , uploadAvatar);
router.post('/name' ,validarJWT ,updateName);
router.post('/addSensorUser',validarJWT ,addSensorUser)
router.post('/changeSensorName', validarJWT , changeSensorName);
router.post('/deleteSensor', validarJWT , deleteSensor);
router.post('/rol', validarJWT , changeRol);
router.get('/:id' , getUserInfo);
router.get('/',[
    validarJWT
], validarTokenUsuario );
module.exports = router