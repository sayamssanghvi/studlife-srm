const express = require("express");
const Course = require("../models/Course");
const Ct = require("../models/Ct");
const Finalpaper = require("../models/Finalpaper");
const User = require("../models/User");

const router = express.Router();

router.post("/user/signup", async (req, res) => {
  let user = new User();
});

router.get("/course", async (req, res) => {
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

router.get("/course/:course/ct", async (req, res) => {
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

router.get("/course/:course/finalpaper", async (req, res) => {
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

router.get("/download/ct/:ctid", async (req, res) => {
  try {
    let ct = await Ct.findOne({ _id:req.params.ctid });
    res.redirect(ct.file);  
  } catch (e) {
    console.log(e);
    res.status(500).send(e.toString());
  }
});

router.get("/download/finalpaper/:finalpaperid", async (req, res) => {
  try {
    let finalPaper = await Finalpaper.findOne({ _id: req.params.finalpaperid });
    res.redirect(finalPaper.file);
    } catch (e) {
    console.log(e);
    res.status(500).send(e.toString());
  }
});

module.exports = router;
