const express=require('express');
const Admin = require('../models/Admin');
const Auth = require('../middleware/Auth');
const Teacher = require('../models/Teacher');

var router = express.Router();

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

module.exports = router;