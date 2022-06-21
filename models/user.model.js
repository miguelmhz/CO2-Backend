const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = Schema ({
    name: {
        type: String,
    },
    username: {
        type: String,
        unique: true
    },
    password: {
        type: String,
    },
    avatar:{
        type: Boolean,
    },
    token:{
        type: String,
    },
    uuid:{
        type: String,
    },
    rol:{
        type: String,
        default: 'user'
    },
    sensors: {
        type: [{
            serial : String,
            name : String
             }],
    },
    
})


//Sobrescribir metodos 

UserSchema.methods.toJSON = function (){
    const { __v, ...evidence } = this.toObject();
    return evidence ; 
}


module.exports = mongoose.model("user", UserSchema, 'user');