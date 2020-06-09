const mongoose=require('mongoose');

let Schema=new mongoose.Schema({
    file:{
        type:Buffer,
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

Schema.methods.getPublicProfile=async function(){
    var finalpaper=this;
    var object=finalpaper.toObject();
    delete object.file;
    return  object;
}

let Ct=mongoose.model('Ct',Schema);

module.exports=Ct;