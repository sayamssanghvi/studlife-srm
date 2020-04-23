const jwt=require('jsonwebtoken');
const Teacher=require('../models/Teacher')


const Auth=async(req,res,next)=>{

    try{
        var token = req.get("Authorization");
        var atoken = token.toString().split(" ");
        atoken = atoken[1];
        var id = await jwt.verify(atoken,process.env.AUTH_SECRET_KEY);
        var teacher = await Teacher.findOne({ _id: id._id , 'tokens.token':atoken });
        if(!teacher)
            res.status(404).send("Invalid Authentication");
        req.teacher = teacher;
        next();
    }catch(e){
        console.log(e);
        res.status(401).send("Please Authenticate");
    } 
}

module.exports=Auth;