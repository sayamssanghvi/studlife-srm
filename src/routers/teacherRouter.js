const express=require('express');
const Teacher=require('../models/Teacher');
const Ct=require('../models/Ct');
const Course=require('../models/Course');
const Finalpaper=require('../models/Finalpaper');
const teacherAuth=require('../middleware/teacherAuth');
const multer=require('multer');

var upload=multer({
    limits:{
        fileSize:5000000
    },fileFilter(req,file,cb){
        if(!file.originalname.match(/\.pdf/)){
            return cb(new Error("Please upload a pdf file"))
        }
        cb(undefined,true);
    }
})

var router=express.Router();

router.post("/teacher/signup",async (req,res)=>{

    try{
        const teacher=new Teacher(req.body);
        const token=await teacher.generateAuthToken();
        res.send({teacher:teacher.getPublicProfile(),token});
    }catch(e){
        console.log(e);
        res.status(500).send(e.toString());
    }
});

router.post("/teacher/login",async (req,res)=>{
    try{
        const teacher=await Teacher.findByCredentials(req.body.email,req.body.password);
        if(!teacher)
            res.send("Invalid username or password");
        let token=await teacher.generateAuthToken();
        res.send({teacher:teacher.getPublicProfile(),token});
    }catch(e){
        console.log(e);
        res.send(e.toString());
    }
})

router.post('/teacher/logout',teacherAuth,async(req,res)=>{
    try{
        req.teacher.tokens=[];
        await req.teacher.save();
        res.send({status:"Logged out"});
    }catch(e){
        console.log(e);
        res.status(500).send(e.toString());
    }
})

router.post('/teacher/upload/course',teacherAuth,async(req,res)=>{
    try{
        var course=new Course(req.body);
        if(!course)
            res.send("Enter a valid course");
        await course.save();
        res.send({status:"Course Saved"});
    }catch(e){
        console.log(e);
        res.status(500).send(e.toString());
    }
})

router.post("/teacher/upload/:coursename/ct",teacherAuth,upload.single('paper'),async (req,res)=>{
    try{
        var file=req.file.buffer;
        if(!file)
            res.send("Please attach a valid file");
        var courseid=await Course.findOne({coursename:req.params.coursename});
        if(!courseid)
            res.send("PLease enter a valid course");
        var ct=new Ct({file,courseid:courseid._id,filename:req.file.originalname});
        await ct.save();
        let publicProfile=await ct.getPublicProfile();
        res.send(publicProfile);
    }catch(e){
        console.log(e);
        res.status(500).send(e.toString());
    }
},(error,req,res,next)=>{
    res.status(400).send({error:error.message});
})

router.post("/teacher/upload/:coursename/finalpaper",teacherAuth,upload.single('paper'),async (req,res)=>{
    try{
        var file=req.file.buffer;
        if(!file)
            res.send("Please attach a valid file");
        var courseid=await Course.findOne({coursename:req.params.coursename});
        if(!courseid)
            res.send("PLease enter a valid course");
        var finalpaper=new Finalpaper({file,courseid:courseid._id,filename:req.file.originalname});
        await finalpaper.save();
        let publicProfile=await finalpaper.getPublicProfile();
        res.send(publicProfile);
    }catch(e){
        console.log(e);
        res.status(500).send(e.toString());
    }
},(error,req,res,next)=>{
    res.status(400).send({error:error.message});
});

module.exports=router;