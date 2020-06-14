const express = require("express");
require('./db/mongoose');
var admin = require("firebase-admin");
var serviceAccount = require("../serviceAccountKey.json");
const adminRouter = require('./routers/adminRouter');
const teacherRouter=require('./routers/teacherRouter');
const userRouter=require('./routers/userRouter');
const cors = require('cors');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "studlifesrm.appspot.com",
});

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(cors());
app.use(adminRouter);
app.use(teacherRouter);
app.use(userRouter);

app.get("*",(req,res)=>{
    res.send("Page does not exsist");
})

app.listen(port, () => {
    console.log("Server is up and running");
});



