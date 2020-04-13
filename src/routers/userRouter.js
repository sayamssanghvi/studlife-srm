const express=require('express');
const Course=require('../models/Course');
const Ct=require('../models/Ct');
const Finalpaper=require('../models/Finalpaper');

const router=express.Router();

function deleteFile(value){
    value.file=undefined;
}

router.get('/course',async (req,res)=>{

    try{
        
        let course=await Course.find();
        res.send({course});
    }catch(e){
        console.log(e);
        res.status(500).send(e.toString());
    }
})

router.get('/course/:course/ct',async(req,res)=>{

    try{
        
        var match={};
        var sort={}
        if(req.query.sortBy){
            part=req.query.sortBy.slice(':');
            sort[part[0]]=part[1]==='desc'?-1:1
        }
        let course=await Course.findOne({coursename:req.params.course});
        
        await course.populate({
            path:'ct',
            match,
            options:{
                limit:req.query.limit,
                skip:req.query.skip,
                sort
            }
        }).execPopulate();
        
        if(!course.ct.length)
            return res.status(400).send({status:"This folder is currently empty"})
        
        course.ct.forEach(deleteFile);
        res.send(course.ct);
    }catch(e){
        console.log(e);
        res.status(500).send(e.toString());
    }
})

router.get("/course/:course/finalpaper", async (req, res) => {

    try {
        var match = {};
        var sort = {};
        if (req.query.sortBy) {
            part = req.query.sortBy.slice(":");
            sort[part[0]] = part[1] === "desc" ? -1 : 1;
        }

        let course = await Course.findOne({ coursename: req.params.course });
        
        await course.populate({
            path: "finalpaper",
            match,
            options: {
                limit: req.query.limit,
                skip: req.query.skip,
                sort
            }
        }).execPopulate();
        
        if(!course.finalpaper.length)
            return res.status(400).send({status:"This folder is currently empty"});
        
        course.finalpaper.forEach(deleteFile);
        res.send(course.finalpaper);
    }catch(e){
        console.log(e);
        res.status(500).send(e.toString());
    }
});

router.get('/download/ct/:ctid',async(req,res)=>{
    
    try{
        let ct=await Ct.findOne({_id:req.params.ctid});
        res.set('Content-Type','application/pdf');
        res.set('Content-Disposition',`attachment; filename=${ct.filename}`);
        res.send(ct.file);
    }catch(e){
        console.log(e);
        res.status(500).send(e.toString());
    }
});

router.get("/download/finalpaper/:finalpaperid", async (req, res) => {

    try {
        let finalPaper = await Finalpaper.findOne({ _id: req.params.finalpaperid });
        res.set("Content-Type", "application/pdf");
        res.set("Content-Disposition", `attachment; filename=${finalPaper.filename}`);
        res.send(finalPaper.file);
    } catch (e) {
        console.log(e);
        res.status(500).send(e.toString());
    }
});

module.exports=router;