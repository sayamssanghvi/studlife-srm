const express=require('express');
const Admin = require('../models/Admin');
const User = require('../models/User');
const Utils = require('../utils/user');
const Auth = require('../middleware/Auth');
const Teacher = require('../models/Teacher');
const Maintenance = require("../models/Maintenance");
const fs = require('fs');

var router = express.Router();

async function writeRoomData(fileName, data) {
  try {
    fs.writeFileSync(fileName, JSON.stringify(data));
    return Promise.resolve(true);
  } catch (err) {
    return Promise.reject(`failed ${err}`);
  }
}

async function readRoomData(fileName)
{
    try {
        let data = fs.readFileSync(fileName);
        return Promise.resolve(data);
    } catch (err)
    {
        return Promise.reject(`failed ${err}`);
    }
}

router.post('/admin/statistics', Auth, async (req, res) => {

    try {
        var stats = {
            totalUsers: await User.count(),
            rooms: Utils.Collection.size(),
            Users: Utils.AllUser,
        };
        res.send(stats);
    } catch (e) {
        console.log(e);
        res.status(500).send(e.toString());
    }

});

router.post('/admin/premaintenance',Auth, async (req, res) => {

    try {
        var data = new Maintenance({
            maintenance: true
        })
        await data.save();
        await writeRoomData('./backup-messages');
        res.send({ status: "Room Data Saved Successfully and Maintenance ON" });        
    } catch (e) {
        console.log(e.toString());
        res.status(500).send(e.toString());
    }
});

router.get('/admin/postmaintenance',Auth ,async (req, res) => {
    
    try {
        var data = await RoomData.find();
        let backupMessages = new Map(Object.entries(JSON.parse(await readRoomData('./backup-messages'))));
        Utils.setCollectionAfterMaintenance(backupMessages);
        roomData[0].maintenance = false;
        await roomData.save();
        res.send({ status: "Room Data Collected, Set Successfully and Maintenance OFF" });    
    } catch (e) {
        console.log(e);
        res.status(500).send(e.toString());
    }
});

module.exports = router;