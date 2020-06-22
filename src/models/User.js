const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const Schema = new mongoose.Schema({
    username: {
        type: String,
        lowercase:true,
        required: true,
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        validate(value) {
            if (!validator.isEmail(value))
                throw new Error("Please Enter a valid Email id");
        }
    },
    password: {
        type: String,
        required: true,
        trim:true
    }
});

Schema.methods.getPublicProfile = function () {
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  delete userObject.tokens;
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

Schema.pre("save", async function (next) {
  var user = this;
  if (user.isModified("password"))
    user.password = await bcrypt.hash(user.password, 8);
  next();
});

const User = mongoose.model('User', Schema);


module.exports = User;