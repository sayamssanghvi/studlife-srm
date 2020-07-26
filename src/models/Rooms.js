var mongoose = require('mongoose');

var Schema = new mongoose.Schema({
    roomName: {
        type: String
    }
});

var Rooms = mongoose.model('Room', Schema);

module.exports = Rooms;