const express = require('express');
var admin = require("firebase-admin");
const Teacher=require('../models/Teacher');
const Ct=require('../models/Ct');
const Course=require('../models/Course');
const Finalpaper=require('../models/Finalpaper');
const teacherAuth = require('../middleware/teacherAuth');
const { upload } = require('../middleware/multer');
const multer = require("../middleware/multer");
const fs = require('fs');

var router=express.Router();
var bucketName = "studlifesrm.appspot.com";

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
            res.status(404).send("Invalid username or password");
        let token=await teacher.generateAuthToken();
        res.send({teacher:teacher.getPublicProfile(),token});
    }catch(e){
        console.log(e);
        res.status(500).send(e.toString());
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
            return res.send("Enter a valid course");
        await course.save();
        res.send({status:"Course Saved"});
    }catch(e){
        console.log(e);
        res.status(500).send(e.toString());
    }
})

router.post("/teacher/upload/:coursename/ct",teacherAuth,upload.single('paper'),async (req,res)=>{
    try {
        if (!req.file.destination)
            return res.send("Please attach a valid file");
        
        var courseid = await Course.findOne({ coursename: req.params.coursename });
        if(!courseid)
            return res.send("PLease enter a valid course");
    
        var filename = multer.Filename();
        var bucket = admin.storage().bucket(bucketName);
        var status = await bucket.upload(filename, {
          gzip: true,
          metadata: {
            cacheControl: "public, max-age=31536000",
          },
        });

        if (!status)
            return res.status(500).send({ status: "File not uploaded" });
        
        var url = "https://firebasestorage.googleapis.com/v0/b/" + admin.storage().bucket().name + "/o/" + req.file.originalname + "?alt=media";
        
        var ct=new Ct({file:url,courseid:courseid._id,filename:req.file.originalname});
        await ct.save();
        
        fs.unlink(filename, (e) => {
          if (e) console.log(e);
        });

        res.send({ct});
    }catch(e){
        console.log(e);
        res.status(500).send(e.toString());
    }
},(error,req,res,next)=>{
    res.status(400).send({error:error.message});
})

router.post("/teacher/upload/:coursename/finalpaper",teacherAuth,upload.single('paper'),async (req,res)=>{
    try {
        if(!req.file.destination)
            return res.send("Please attach a valid file");
        
        var courseid = await Course.findOne({ coursename: req.params.coursename });
        if(!courseid)
            return res.send("PLease enter a valid course");
        
        var filename = multer.Filename();
        var bucket = admin.storage().bucket(bucketName);
        var status = await bucket.upload(filename, {
          gzip: true,
          metadata: {
            cacheControl: "public, max-age=31536000",
          },
        });

        if (!status)
            return res.status(500).send({ status: "File not uploaded" });
        
        var url = "https://firebasestorage.googleapis.com/v0/b/" + admin.storage().bucket().name + "/o/" + req.file.originalname + "?alt=media";

        var finalpaper=new Finalpaper({file:url,courseid:courseid._id,filename:req.file.originalname});
        await finalpaper.save();
        
        fs.unlink(filename, (e) => {
            if (e)
                console.log(e);
        });

        res.send({finalpaper});
    }catch(e){
        console.log(e);
        res.status(500).send({e});
    }
},(error,req,res,next)=>{
    res.status(400).send({error:error.message});
});

router.delete('/teacher/delete/ct/:ctid',teacherAuth,async (req,res)=>{
    try{
        let ct=await Ct.findOne({_id:req.params.ctid});
        if(!ct)
            res.status(404).send("The requested Ct paper does not exist.")        
        await admin.storage().bucket(bucketName).file(ct.filename).delete();
        await ct.remove();
        res.send({ct});
    }catch(e){
        console.log(e);
        res.status(400).send(e.toString());
    }
});

router.delete('/teacher/delete/finalpaper/:finalpaperid',teacherAuth,async (req,res)=>{
    try{
        let finalPaper=await Finalpaper.findOne({_id:req.params.finalpaperid});
        if (!finalPaper)
            res.status(404).send("The requested FinalPaper does not exist.")
        await admin.storage().bucket(bucketName).file(finalPaper.filename).delete();
        await finalPaper.remove();
        res.send({finalPaper});
    }catch(e){
        console.log(e);
        res.status(400).send(e.toString());
    }
});

module.exports=router;