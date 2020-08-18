const express = require('express');
var admin = require("firebase-admin");
const Teacher = require('../models/Teacher');
const User=require('../models/User')
const Ct=require('../models/Ct');
const Course=require('../models/Course');
const Finalpaper = require('../models/Finalpaper');
const Auth = require('../middleware/Auth');
const { upload } = require('../middleware/multer');
const multer = require("../middleware/multer");
const fs = require('fs');

var router=express.Router();
var bucketName = "studlifesrm.appspot.com";

//Signing up teachers and Store in MongoDB
router.post('/teacher/signup', async (req, res) => {
    
    try {
        var teacher = new Teacher(req.body);
        await teacher.save();
        res.send({status:"Teacher Saved"})
    } catch (e) {
        console.log(e);
        res.status(500).send(e.toString());
    }
})

//Assigning the HEAD position to student STUDENT position to head 
router.post('/teacher/student/mode/:mode', Auth, async (req, res) => {
    try {
        var user = await User.findOne({ email: req.body.email });
        if (!user)
            return res.status(404).send({ "error": "Please Enter a valid Address" });
        user.mode = req.body.params;
        await user.save();
        res.send(user.getPublicProfile());
    } catch (e) {
        console.log(e);
        res.status(500).send(e.toString());
    }
});

router.post('/teacher/upload/course', Auth, async (req, res) => {
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

router.post("/teacher/upload/:coursename/ct",Auth,upload.single('paper'),async (req,res)=>{
    try {
        if (!req.file.destination)
            return res.send("Please attach a valid file");
        
        var courseid = await Course.findOne({ coursename: req.params.coursename });
        if(!courseid)
            return res.send("PLease enter a valid course");
    
        var filename = req.file.originalname;
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

router.post("/teacher/upload/:coursename/finalpaper",Auth,upload.single('paper'),async (req,res)=>{
    try {
        if(!req.file.destination)
            return res.send("Please attach a valid file");
        
        var courseid = await Course.findOne({ coursename: req.params.coursename });
        if(!courseid)
            return res.send("PLease enter a valid course");
        
        var filename = req.file.originalname;
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

router.delete('/teacher/delete/ct/:ctid',Auth,async (req,res)=>{
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

router.delete('/teacher/delete/finalpaper/:finalpaperid',Auth,async (req,res)=>{
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