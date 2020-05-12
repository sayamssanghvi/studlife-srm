const express = require("express");
require('./db/mongoose');
const Admin=require('./models/Admin');
const Auth=require('./middleware/Auth');
const Teacher=require('./models/Teacher');
const adminRouter=require('./routers/adminRouter');
const teacherRouter=require('./routers/teacherRouter');
const userRouter=require('./routers/userRouter');
const cors = require('cors');

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



