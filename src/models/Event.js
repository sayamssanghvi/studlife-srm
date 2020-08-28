const mongoose = require('mongoose');
const validator = require('validator');

var Schema = new mongoose.Schema({
    eventName: {
        type: String,
        required: true,
    },
    startDate: {
        type: Date,
        required: true,
        validate(value) {
            if (value.getTime() < new Date().getTime())
                throw new Error("Please enter a valid Date");
        }
    },
    endDate: {
        type: Date,
        required: true,
        validate(value) {
            if (value.getTime() < new Date().getTime())
                throw new Error("Please enter a valid Date");
        }
    },
    description:{
        type:String
    },
    images: {
        type: Array
    },
    associatedClub: {
        type: String,
    },
    associatedFestival: {
        type: String
    },
    rules: {
        type:String   
    },
    googleFormLink: {
        type:String
    }
},{
    timestamps:true
});

var Event = mongoose.model('Event', Schema);

module.exports = Event;


