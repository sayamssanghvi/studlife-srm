const mongoose=require('mongoose');
const validator=require('validator');
const jwt=require('jsonwebtoken');
const bcrypt=require('bcrypt');

const Schema=new mongoose.Schema({
    email:{
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        trim: true,
        validate(value) {
            if (!validator.isEmail(value))
                throw new Error("Enter a valid mail ID");
        }
    }
});

Schema.methods.getPublicProfile=function(){
    const teacher=this;
    const teacherObject=teacher.toObject();
    delete teacherObject.password;
    delete teacherObject.tokens;
    return teacherObject;
}

Schema.statics.findByCredentials=async function(email,password){
    let teacher=await Teacher.findOne({email});
    
    if(!teacher)
        throw new Error("Invalid Login");
    
    let isMatch=await bcrypt.compare(password,teacher.password);
    console.log(isMatch);
    if(!isMatch)
        throw new Error("Invalid Login");

    return teacher;
}

var Teacher=mongoose.model('Teacher',Schema);

module.exports=Teacher;