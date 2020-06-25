var AllUser = 0;
var User = [];
var Rooms = [];

var addUser = (id, username, room) => {
    var user = {
        id,
        username,
        room
    };
    User.push(user);
    if (Rooms.length == 0 || !Rooms.includes(room))
        Rooms.push(user.room);
}

var removeUser = (id) => {
    var index = User.findIndex((value) => {
        if (value.id == id)
            return value;
    });
    User.splice(index, 1);
}

module.exports = {
    AllUser,
    User,
    Rooms,
    addUser,
    removeUser
}