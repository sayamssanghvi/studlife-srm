const mongoose=require('mongoose');
const validator=require('validator');

let Schema=new mongoose.Schema({
    coursename:{
        type:String,
        unique:true,
        required:true,
        validate(value){
            if(!validator.isAlphanumeric(value))
                throw new Error("Enter a valid course name");
        }
    }
})

Schema.virtual('ct',{
    ref:'Ct',
    localField:'_id',
    foreignField:'courseid'
});

Schema.virtual('finalpaper',{
    ref:'Finalpaper',
    localField:'_id',
    foreignField:'courseid'
})

let Course=mongoose.model('Course',Schema);

module.exports=Course;