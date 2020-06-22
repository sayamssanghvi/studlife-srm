const admin = require("firebase-admin");
const Admin = require('../models/Admin');
const Teacher = require('../models/Teacher');
const User = require('../models/User');

const Auth=async(req,res,next)=>{

    try {
        let route = req.route.path.split('/');
        let payload = await admin.auth().verifyIdToken(req.headers.token);
        if (!payload.email) throw new Error("Please Authenticate");
        req.body.owner = payload.email;
        
        var user;
        if (route[1] == "admin") {
            user = await Admin.findOne({ email: payload.email });
            req.admin = user;
        }
        else if (route[1] == "teacher") {
            user = await Teacher.findOne({ email: payload.email });
            req.teacher = user;
        } 
        else if (route[1] == "user") {
            user = await User.findOne({ email: payload.email });
            req.user = user;
        } 
        if(!user)
            res.status(404).send("Invalid Authentication");
        next();
    }catch(e){
        console.log(e);
        res.status(401).send("Invalid Authentication");
    }
}

module.exports=Auth;