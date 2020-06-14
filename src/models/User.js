const mongoose = require('mongoose');
const validator = require('validator');

const Schema = new mongoose.Schema({
    username: {
        type: String,
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

const User = mongoose.model('User', Schema);


module.exports = User;