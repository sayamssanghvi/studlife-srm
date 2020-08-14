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
    images: [
        {
            url: {
                type: String,
            }
        }
    ],
    associatedClub: {
        type: String,
    },
    associatedFestival: {
        type: String
    }
});

var Event = mongoose.model('Event', Schema);

module.exports = Event;


