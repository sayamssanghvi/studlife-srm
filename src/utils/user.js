var AllUser = 0;
var User = {};
var Rooms = [];
var Collection = new Map();

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

var addMessage = (id, username, room,message) => {
    var data = {
        sent:username,
        message
    }
    if (!Collection.has(room))
    {
        var Messages = [];
        Messages.push(data);
        Collection.set(room, Messages);
    } else {
        var Messages = Collection.get(room);
        if (Messages.length < 10) {
            Messages.push(data);
            // Collection.set(room, Messages);
        }else if (Messages.length == 10) {
            Messages.shift();
            Messages.push(data);
            // Collection.set(room, Messages);
        }
    }
}

var removeUser = (id) => {
    if(User[id]) delete User[id];
}

module.exports = {
    AllUser,
    User,
    Rooms,
    Collection,
    addUser,
    removeUser,
    addMessage
}
