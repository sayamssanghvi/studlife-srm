const jwt=require('jsonwebtoken');
const Admin=require('../models/Admin')


const Auth=async(req,res,next)=>{

    try{
        var token = req.get("Authorization");
        var atoken = token.toString().split(" ");
        atoken = atoken[1];
        var id = await jwt.verify(atoken, process.env.AUTH_SECRET_KEY);
        var admin = await Admin.findOne({ _id: id._id , 'tokens.token':atoken });
        if(!admin)
            res.status(404).send("Invalid Authentication");
        req.admin = admin;
        next();
    }catch(e){
        console.log(e);
        res.status(401).send("Invalid Authentication");
    }
   
}

module.exports=Auth;