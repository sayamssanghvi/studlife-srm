const admin = require("firebase-admin");
var firebase = require('firebase');
var auth = require('firebase/auth');
const Admin = require('../../models/Admin');
const Teacher = require('../../models/Teacher');
const User = require('../../models/User');

var firebaseConfig = {
  apiKey: "AIzaSyD9s3PS2xfCb1vp7Z8mvFHpsg-_P_ggKYo",
  authDomain: "studlifesrm.firebaseapp.com",
  databaseURL: "https://studlifesrm.firebaseio.com",
  projectId: "studlifesrm",
  storageBucket: "studlifesrm.appspot.com",
  messagingSenderId: "499210001566",
  appId: "1:499210001566:web:84323ef0477f66936d6f8f",
  measurementId: "G-5M80F8L5D3",
};
app=firebase.initializeApp(firebaseConfig);

const Auth=async(req,res,next)=>{

    try {
        let route = req.route.path.split('/');
        // let credential = await app.auth().signInWithEmailAndPassword('s3sanghvi@gmail.com', '9381001171');
        // let jwt = await credential.user.getIdToken();
        // req.headers.token = jwt;
        if (req.body.special == process.env.AUTH_SECRET_KEY) {
            return next();
        }
        
        let payload = await admin.auth().verifyIdToken(req.headers.token);
        

        if (!payload.email)
            throw new Error("Please Authenticate");
        req.body.owner = payload.email;
        
        var user;

        if (route[1] == "teacher") {
            user = await Teacher.findOne({ email: payload.email });
            req.teacher = user;
        } 
        else if (route[1] == "user") {
            user = await User.findOne({ email: payload.email });
            req.user = user;
        } 
        if(!user)
            return res.status(404).send("Invalid Authentication");
        next();
    }catch(e){
        console.log(e);
        res.status(401).send("Invalid Authentication");
    }
}

module.exports=Auth;