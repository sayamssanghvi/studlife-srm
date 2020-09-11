const admin = require("firebase-admin");
const express = require("express");
const Auth = require("../middleware/Auth");
const multer = require('../middleware/multer');
const Course = require("../models/Course");
const Ct = require("../models/Ct");
const Finalpaper = require("../models/Finalpaper");
const User = require("../models/User");
const Rooms = require('../models/Rooms');
const Maintenance = require('../models/Maintenance');
const Event = require('../models/Event');
const Announcement = require('../models/Announcement');
const Utils = require('../utils/user');
const FileStorage = require('../utils/fileStorage');

const router = express.Router();

var bucketName = "studlifesrm.appspot.com";

//Storing user on MongoDB
router.post('/user/signup', async (req, res) => {
  try {
    let payload = await admin.auth().verifyIdToken(req.headers.token);
    if (!payload.email)
      return res.status(401).send({ status: "Please Authenticate" });
    var userNames = await User.findOne({ username: req.body.username });
    if (userNames!=undefined)
      return res.status(409).send({ status: "Please enter Unique username" });
    var user = new User({
      username:req.body.username,
      email:payload.email,
      mode:req.body.mode
    });
    if (!user)
      return res.status(400).send({ error: "Please enter valid details" });
    await user.save();
    res.send({ status: "User Saved" });
  } catch (e) {
    console.log(e);
    res.status(500).send(e.toString());
  }
});

//Creating official Rooms
router.post('/user/createRoom',Auth,async (req, res) => {
  try {
    var user = req.user;
    if (!user)
      return res.status(404).send({ error: "User does not exist" });
    if (user.mode != "Head")
      return res.status(404).send({ error: "User is not Head" });
    var room = new Rooms({ 
      roomName: req.body.room
    });
    await room.save();
    res.send({ "status": 200 });
  } catch (e) {
    console.log(e);
    res.status(500).send(e.toString());
  }
});

//Uploading a event with images minimum 1 image and maximum 6 images
router.post("/user/create/event", Auth,multer.uploadImages.array("images", 6),async (req, res) => {
  try {
    
    var user = req.user;
    
    if (!user)
      return res.status(404).send({ error: "User does not exist" });
    if (user.mode != "Head")
      return res.status(404).send({ error: "User is not Head" });
    
    let images = await FileStorage.storeFile("Events", bucketName, req.files, req.body.eventname);

    var event = new Event({
      eventName: req.body.eventname,
      startDate: req.body.startdate,
      endDate: req.body.enddate,
      description:req.body.description,
      images,
      associatedClub: req.body.associatedclub,
      associatedFestival: req.body.associatedfestival,
      rules: req.body.rules,
      googleFormLink:req.body.googleformlink
    });

    await event.save();

    res.send({ event });
    } catch (e) {
      console.log(e);
      res.status(500).send(e.toString());
    }
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

router.post('/user/create/announcement', Auth, multer.uploadImages.array('images', 1), async (req, res) => {
  try {
    
    var user = req.user;
    
    if (!user)
      return res.status(404).send({ error: "User does not exist" });
    if (user.mode != "Head")
      return res.status(404).send({ error: "User is not Head" });
    
    let name = req.body.title + new Date().getTime(); 
    let images = await FileStorage.storeFile("Announcements", bucketName, req.files, name);

    var announcement = new Announcement({
      title: req.body.title,
      message: req.body.message,
      images,
      userName: user.username
    });

    await announcement.save();

    res.send({ announcement });

  } catch (e) {
    console.log(e);
    res.status(500).send(e.toString());
  }
});

const LATEST_VERSION = 1; // this should be changed if front-end also has to change in a breaking way
router.get('/user/appmode/:appversion', Auth, async (req, res) => {
  try {
    var roomData = await Maintenance.find();
    var bool = req.params.appVersion >= LATEST_VERSION;
    res.send({ toUpgrade: bool, maintenance: roomData[0].maintenance });
  } catch (e) {
    console.log(e);
    res.status(500).send(e.toString());
  }
});

//This route gives All the Data of Official Rooms(Rooms,usersInEachRoom,Total User) returns an object
router.get("/user/rooms/official", Auth, async (req, res) => {
  try {
    var rooms = await Rooms.find();
    if (!rooms.length) {
      return res.status(400).send({ Rooms: 0, TotalUsers: Utils.getTotalUser() });
    }
    var officialRooms = [];

    rooms.forEach((room) => {
      let length = Utils.UsersInCurrentRoom(room.roomName).length;
      let temp = {
        roomName:room.roomName,
        userInRoom:length
      };
      officialRooms.push(temp);
    });

    var data = {
      Rooms:officialRooms ,
      TotalUsers: Utils.getTotalUser(),
    };
    res.send( data );
  } catch (e) {
    console.log(e);
    res.status(500).send(e.toString());
  }
});

//This route gives All the Data of Secondary Rooms(Rooms,usersInEachRoom,Total User) return an object
router.get('/user/rooms/secondary', Auth, async (req, res) => {
  
  try {
    
    var secondaryRooms = [];

    if (!Utils.Rooms.length)
      return res.status(400).send({ Rooms: 0, userInEachRoom: 0 });
    
    
    Utils.Rooms.forEach((room) => {
      if (!room.official)
      {
        let length = Utils.UsersInCurrentRoom(room.roomName).length;
        let temp = {
          roomName:room.roomName,
          userInRoom: length
        }
        secondaryRooms.push(temp);
      }
    })

    var data = {
      Rooms:secondaryRooms,
      TotalUsers: Utils.getTotalUser()
    };
    res.send( data );
  } catch (e){
    console.log(e);
    res.status(500).send(e.toString());
  }
});

router.get('/user/events', Auth, async (req, res) => {
  try {
    let events = await Event.find().sort({ startDate: 1 });
    res.send({events});
  } catch (e) {
    console.log(e);
    res.status(500).send(e.toString());
  }
});

router.get("/user/announcements", Auth, async (req, res) => {
  try {
    let announcement = await Announcement.find().sort({createdAt: -1 });
    res.send({ announcement });
  } catch (e) {
    console.log(e);
    res.status(500).send(e.toString());
  }
});

//get All Users in Database
router.get('/user', Auth, async (req, res) => {
  try {
    var users = await User.find();
    var userPublicProfiles = [];
    users.forEach((user) => {
      userPublicProfiles.push(user.getPublicProfile());
    });
    res.send(userPublicProfiles);
  } catch (e) {
    console.log(e);
    res.status(500).send(e.toString());
  }
});

//Get All Course
router.get("/user/course", Auth, async (req, res) => {
  try {
    let course = await Course.find();
    if (!course.length)
      res.status(400).send({ status: "This folder is currently emprty" });
    res.send({ course });
  } catch (e) {
    console.log(e);
    res.status(500).send(e.toString());
  }
});

//All the avialable Ct papers
router.get("/user/course/:course/ct",Auth,async (req, res) => {
  try {
    var match = {};
    var sort = {};
    if (req.query.sortBy) {
      part = req.query.sortBy.slice(":");
      sort[part[0]] = part[1] === "desc" ? -1 : 1;
    }
    let course = await Course.findOne({ coursename: req.params.course });

    if (!course)
      return res.send({
        status: "Sorry but this course is not yet added to the database",
      });

    await course
      .populate({
        path: "ct",
        match,
        options: {
          limit: req.query.limit,
          skip: req.query.skip,
          sort,
        },
      })
      .execPopulate();

    if (!course.ct.length)
      return res.status(400).send({ status: "This folder is currently empty" });

      course.ct.forEach((value) => {
          value.file = undefined;
    });
    res.send(course.ct);
  } catch (e) {
    console.log(e);
    res.status(500).send(e.toString());
  }
});

//All the avialable FinalPaper
router.get("/user/course/:course/finalpaper",Auth,async (req, res) => {
  try {
    var match = {};
    var sort = {};
    if (req.query.sortBy) {
      part = req.query.sortBy.slice(":");
      sort[part[0]] = part[1] === "desc" ? -1 : 1;
    }

    let course = await Course.findOne({ coursename: req.params.course });

    await course
      .populate({
        path: "finalpaper",
        match,
        options: {
          limit: req.query.limit,
          skip: req.query.skip,
          sort,
        },
      })
      .execPopulate();

    if (!course.finalpaper.length)
      return res.status(400).send({ status: "This folder is currently empty" });

    course.finalpaper.forEach((value) => {
      value.file = undefined;
    });
    res.send(course.finalpaper);
  } catch (e) {
    console.log(e);
    res.status(500).send(e.toString());
  }
});

//Specific CT paper
router.get("/user/download/ct/:ctid",Auth,async (req, res) => {
  try {
    let ct = await Ct.findOne({ _id:req.params.ctid });
    res.redirect(ct.file);  
  } catch (e) {
    console.log(e);
    res.status(500).send(e.toString());
  }
});

//Specific FinalPaper
router.get("/user/download/finalpaper/:finalpaperid",Auth, async (req, res) => {
  try {
    let finalPaper = await Finalpaper.findOne({ _id: req.params.finalpaperid });
    res.redirect(finalPaper.file);
    } catch (e) {
    console.log(e);
    res.status(500).send(e.toString());
  }
});

module.exports = router;
