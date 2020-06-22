const mongoose=require('mongoose');
const validator=require('validator');
const bcrypt = require('bcrypt');
const jwt=require('jsonwebtoken');

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
    password:{
        required:true,
        type:String,
        trim:true,
        minlength:6,
        validate(value){
            if(value.toLowerCase().includes("password"))
                throw new Error("Your password cannot be  \"passwor\" ");
        }
    }
});

Schema.statics.findByCredentials=async(email,password)=>{

    var admin=await Admin.findOne({email});
    if(!admin)
        throw new Error("Unable to Login");

    var isMatch=await bcrypt.compare(password,admin.password);

    if(!isMatch)
        throw new Error("Unable to Login");

    return admin;
}

Schema.pre('save',async function(next){

    var user=this;
    if(user.isModified('password'))
        user.password=await bcrypt.hash(user.password,8);
    next();
})

var Admin=mongoose.model('Admin',Schema);

module.exports=Admin;