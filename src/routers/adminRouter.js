const express=require('express');
const Admin = require('../models/Admin');
const Auth = require('../middleware/Auth');
const Teacher = require('../models/Teacher');

var router=express.Router();


// router.post("/admin/signup", async (req, res) => {

//     try{
//         const admin = new Admin(req.body);
//         const token = await admin.generateAuthToken();
//         res.send({ admin, token });
//     }catch(e){
//         console.log(e);
//         res.status(500).send(e.toString());
//     }

// });

router.post("/admin/login", async (req, res) => {

    try {
        var admin = await Admin.findByCredentials(req.body.email, req.body.password);
        if (!admin)
            res.status(404).send({ result: "Unable to login" });
        console.log("Welcome Insider");
        const token = await admin.generateAuthToken();
        res.send({ status: "Welcome StormShadow" });
    } catch (e) {
        console.log(e);
        res.status(500).send(e.toString());
    }

});


router.post("/admin/logout", Auth, async (req, res) => {

    try {
        req.admin.tokens = [];
        req.admin.save();
        res.send({ status: "Logged out of all devices" })
    } catch (e) {
        console.log(e);
        res.status(500).send(e.toString());
    }

});

router.get("/admin/users/:email", Auth, async (req, res) => {

    try {
        var user = await User.findOne({ email: req.params.email });
        await user.save();
        res.send({ user });
    } catch (e) {
        console.log(e);
        res.status(500).send(e.toString());
    }
});

module.exports=router