var User = [];
var Rooms = [];

var addUser = (id,username,room) => {
    var user = {
        id,
        username,
        room
    };
    User.push(user);
    Rooms.push(user.room);
}

module.exports = {
    User,
    Rooms
}