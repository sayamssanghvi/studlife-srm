const mongoose=require('mongoose');
const validator=require('validator');

var Schema=new mongoose.Schema({
    email:{
        type: String,
        unique: true,
        required:true,
        lowercase:true,
        trim:true,
        validate(value){
            if(!validator.isEmail(value))
                throw new Error("Enter a valid mail ID");
        }
    },
});

var Admin=mongoose.model('Admin',Schema);

module.exports=Admin;