const express=require('express');
const User = require('../models/User');
const Utils = require('../utils/user');
const Auth = require('../middleware/Auth');
const Teacher = require('../models/Teacher');
const Maintenance = require("../models/Maintenance");
const fs = require('fs');

var router = express.Router();

router.post('/admin/premaintenance',Auth, async (req, res) => {

    try {
        let checkIfBackUpExists = await Maintenance.updateOne({
          maintenance: true,
          chatBackup: Utils.getCollectionAfterMaintenance(),
        });
        if (checkIfBackUpExists.nModified==0)
        {
            var data = new Maintenance({
              maintenance: true,
              college: "SRM",
              campus: "Ramapuram",
              chatBackup: Utils.getCollectionAfterMaintenance(),
            });
            await data.save();   
        }
        res.send({ status: "Room Data Saved Successfully and Maintenance ON" });        
    } catch (e) {
        console.log(e.toString());
        res.status(500).send(e.toString());
    }
});


router.get('/admin/postmaintenance',Auth ,async (req, res) => {
    
    try {
        await Maintenance.updateOne({ maintenance: false });
        let data = await Maintenance.find();
        Utils.setCollectionAfterMaintenance(data[0].chatBackup);
        res.send({ status: "Room Data Collected, Set Successfully and Maintenance OFF" });    
    } catch (e) {
        console.log(e);
        res.status(500).send(e.toString());
    }
});

router.get('/admin/statistics', Auth, async (req, res) => {

    try {
        let totalUsers = await User.estimatedDocumentCount();
        var stats = {
            totalUsers,
            rooms: Utils.Collection.size,
            Users: Utils.getTotalUser(),
        };
        res.send(stats);
    } catch (e) {
        console.log(e);
        res.status(500).send(e.toString());
    }

});

module.exports = router;