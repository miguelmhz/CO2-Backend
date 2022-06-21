//Para que nos complete los comandos en VS Code 
const {response, request} = require('express');
const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { generarJWT } = require('../helpers/generarJWT');
const sensorModel = require('../models/sensor.model');
const uuidv1 = require('uuid').v1;




const newUser = async(req=request, res=response ) => {
    
    const {name, username, password } = req.body; 
    if (!name || !username || !password) {
        return res.json({
            error:true,
            msg:"Faltan datos"
        })
    }
    try {
        const user = await User.findOne( { username } )
        if (user) {
            return res.json({
                error:true,
                msg:"Correo ya existe"
            })
        }
        //Crear una instacia 
        const newUser = new User({name, username, password} ); 
        //encriptar password 
        const salt = bcrypt.genSaltSync(); 
        newUser.password =bcrypt.hashSync(password, salt);
        newUser.uuid = uuidv1(); 
        //Guardar en DB
    
        await newUser.save(); 
        const token = await generarJWT( newUser._id );
        return res.json({
            user:newUser,
            token
        })
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: "Error en servidor",
            error: error
        })
    }
}

const loginUser = async(req=request, res=response ) => {

    const {username, password} = req.body
    try {
        const user = await User.findOne( { username } )
        if (!user) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos',
                error: true
            });
        }
        const match = bcrypt.compareSync(password, user.password)
        
        if (match){
            const token = await generarJWT( user._id );
            res.status(200).json({
                token,
                user
            })
        }else{
            return res.json({
                msg: "Usuario / Password no son correctos",
                error: true
            })
        }
        
    } catch (error) {
        return res.status(500).json({
            user:{},
            error: error
        })
    }

}

const validarTokenUsuario = async (req, res = response ) => {

    // Generar el JWT
    const token = await generarJWT( req.usuario._id );
    
    res.json({
        usuario: req.usuario,
        token: token,
    })

}

const getUsers =async(req=request, res=response)=> {
    try {
        const users = await User.find();
        res.status(200).json({
            data:users
        })
    } catch (error) {
        res.status(500).json({
            data:error
        })
    }

    
}

const uploadAvatar = async(req=request, res)=>{
    const {user} = req.body
    console.log(req.body)
    console.log(user)
    await User.findByIdAndUpdate(user,{avatar:true});
    try {
        res.status(200).json({
            ok: true
        })
        
    } catch (error) {
        res.status(500).json({
            error: error
        })
    }
}
const updateName = async(req, res)=>{
    const {name} = req.body
    try {

        const newName = await User.findByIdAndUpdate(req.usuario._id,{name:name});
        if (newName) {
            return res.json({
                msg: 'Nombre actualizado con exito'
            })
        }else{
            return res.status(401).json({
                msg: 'Usuario no encontrado',
                error: true
            })
        }
    } catch (error) {
        res.status(500).json({
            error: error
        })
    }
}

const getUserInfo = async(req=request, res)=>{
    const {id} = req.params;
    try {
        const user = await User.findOne({_id:id});
        return res.json({
            data: user
        })
    } catch (error) {
        res.status(500).json({
            error: error
        })
    }
}
const addSensorUser =async(req=request, res)=>{
    const {serial,
        token,
        metadata:name
        } = req.body; 
    const userID = req.usuario._id;
       try {
           const sensor = await sensorModel.find( { serial } )
           console.log(sensor)
           const user = await User.findById( userID )
        if (user) {
            
           
            const userSensors = user?.sensors.map(s=> s.serial)
           if (!sensor.length) {
               return res.json({
                   error: "Sensor no encontrado"
               })
           }else if(token != sensor[0].token){
               return res.json({
                   error: "Token incorrecto"
               })
           }else if(user && userSensors.includes(serial)){
               return res.json({
                   error: "Sensor previamente registrado"
               })
           }else{
               if (name) {
                   user.sensors.push({serial, name})
                }else{
                   user.sensors.push({serial, name:sensor.metadata})
               }
       
               
                await user.save()
               
               return res.json({
                   msg: "Sensor agregado con exito"
               })
           }
        }else{
            return res.json({
                msg: "Usuario o token incorrecto"
            })
        }
           
       } catch (error) {
           console.log(error);
           res.json({
               error: "Error en servidor, intente mas tarde"
           })
       } 
}

const changeSensorName = async(req=request, res)=>{
    const {serial,
        metadata:name,
    } = req.body; 
    try {
        const {_id} = req.usuario; 
        const user = await User.findById( _id )
        if (user && JSON.stringify(user).includes(serial)) {
            await User.updateOne({ _id, "sensors.serial":serial }, {
                $set:{
                    "sensors.$.name": name,
                }
            });
            return res.json({
                msg: "Sensor actualizado con exito"
            })
        }else{
            return res.json({
                data:[],
                error: "No se encontró sensor en este usuario"
            })
        }
        
    } catch (error) {
        console.log(error);
           res.json({
               error: "Error en servidor, intente mas tarde"
           })
    }
}

const deleteSensor = async(req=request, res=response ) => {
    const {_id} = req.usuario; 
    const {serial} = req.body;
    try {
        const user = await User.findById( _id )
        
        if (user && JSON.stringify(user.sensors).includes(serial)) {
            await User.findOneAndUpdate({ _id }, {
                $pull: {
                    sensors: {serial},
                },
            });
  
            return res.json({
                msg: "Sensor borrado con exito"
            })
        }else{
            return res.json({
                data:[],
                error: "No se encontró sensor en este usuario"
            })
        }
        
    } catch (error) {
        console.log(error);
           res.json({
               error: "Error en servidor, intente mas tarde"
           })
    }
    

}
const changeRol = async(req=request, res=response ) => {
    const {_id} = req.usuario; 
    const {rol} = req.body;
    try {
        const user = await User.findById( _id )
        
        if (user) {
            if (rol == 'admin') {
                await User.findOneAndUpdate({ _id }, {
                    rol: 'admin'
                });
            }else if (rol == 'user') {
                await User.findOneAndUpdate({ _id }, {
                    rol: 'user'
                });
            }
  
            return res.json({
                msg: "rol actualizado correctamente"
            })
        }else{
            return res.json({
                data:[],
                error: "No se encontró este usuario"
            })
        }
        
    } catch (error) {
        console.log(error);
           res.json({
               error: "Error en servidor, intente mas tarde"
           })
    }
    

}

module.exports = {
    newUser,
    loginUser,
    uploadAvatar,
    updateName,
    getUsers,
    getUserInfo,
    changeSensorName,
    validarTokenUsuario,
    addSensorUser,
    deleteSensor,
    changeRol
}