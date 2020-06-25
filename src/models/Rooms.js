var mongoose = require('mongoose');

var Schema = new mongoose.Schema({
    Name: {
        type: String
    }
});

var Rooms = mongoose.model('Room', Schema);

module.exports = {
    Rooms
};