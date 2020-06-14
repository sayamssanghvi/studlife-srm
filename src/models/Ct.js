const mongoose=require('mongoose');

let Schema=new mongoose.Schema({
    file:{
        type:String,
        required:true
    },
    filename:{
        type: String,
        unique:true,
        required:true,
        trim:true
    },
    courseid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Course'
    }
},{
    timestamps:true
})

let Ct=mongoose.model('Ct',Schema);

module.exports=Ct;