const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const Schema = new mongoose.Schema({
  username: {
    type: String,
    lowercase: true,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    validate(value) {
      if (!validator.isEmail(value))
        throw new Error("Please Enter a valid Email id");
    },
  },
  mode: {
    type: String,
    default: "Student",
  },
});

Schema.methods.getPublicProfile = function () {
  var user = this;
  var userObject = user.toObject();
  delete userObject.__v;
  delete userObject._id;
  return userObject;
};

Schema.statics.findByCredentials = async function (email, password) {
  let user = await User.findOne({ email });

  if (!user) throw new Error("Invalid Login");

  let isMatch = await bcrypt.compare(password, user.password);
  console.log(isMatch);
  if (!isMatch) throw new Error("Invalid Login");

  return user;
};

const User = mongoose.model("User", Schema);

module.exports = User;
