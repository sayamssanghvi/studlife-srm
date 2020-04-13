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
    },
    password: {
        required: true,
        type: String,
        trim: true,
        minlength: 6,
        validate(value) {
            if (value.toLowerCase().includes("password"))
                throw new Error("Your password cannot be  \"password\" ");
        }
    },
    tokens:[
        {
            token:{
                type:String
            }
        }
    ]
});

Schema.methods.generateAuthToken=async function(){
    let teacher =this;
    let token=await jwt.sign({_id:teacher._id.toString()},process.env.AUTH_SECRET_KEY);
    teacher.tokens = teacher.tokens.concat({ token });
    await teacher.save();
    return token;
}

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

Schema.pre('save',async function(next){

    var teacher=this;
    if (teacher.isModified('password'))
        teacher.password = await bcrypt.hash(teacher.password, 8);
    next();
});

var Teacher=mongoose.model('Teacher',Schema);

module.exports=Teacher;