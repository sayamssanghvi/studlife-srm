var AllUser = 0;
var User = {};
var Rooms = [];

var addUser = (id, username, room) => {
    var user = {
        id,
        username,
        room
    };
    User[user.id]=user;
    if (Rooms.length == 0 || !Rooms.includes(room))
        Rooms.push(user.room);
}

var removeUser = (id) => {
    if(User[id]) delete User[id];
}

module.exports = {
    AllUser,
    User,
    Rooms,
    addUser,
    removeUser
}
