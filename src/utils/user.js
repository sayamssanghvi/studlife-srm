var AllUser=0;
var User = new Map();
var Rooms = [];
var duplicateRooms = [];
var Collection = new Map();

var addUsertoTotal = () => {
    AllUser++;
    return AllUser;
}

var addUser = (id, username, roomName,official) => {
    var user = {
        id,
        username,
        roomName
    };
    User.set(user.id, user);
    if (duplicateRooms.length == 0 || !duplicateRooms.includes(roomName)) {
        let rooms = {
            roomName,
            official
        }
        duplicateRooms.push(roomName);
        Rooms.push(rooms);
    }
}

var UsersInCurrentRoom = (roomName) => {

    let userRoomData = [];
        User.forEach((value) => {
            if (value.roomName == roomName)
                userRoomData.push(value);
    });
    return userRoomData;
}

var addMessage = (id, username, roomName,message) => {
    var data = {
        sent:username,
        message,
        timestamp:new Date().getTime()
    }
    if (!Collection.has(roomName))
    {
        var Messages = [];
        Messages.push(data);
        Collection.set(roomName, Messages);
    } else {
        var Messages = Collection.get(roomName);
        if (Messages.length < 10) {
            Messages.push(data);
        }else if (Messages.length == 10) {
            Messages.shift();
            Messages.push(data);
        }
    }
}

var removeUser = (id) => {
    if(User.get(id)) User.delete(id);
}

var removeUserFromTotal = () => {
    AllUser--;
    return AllUser;
}

var getTotalUser = () => {
    return AllUser;
}

var setCollectionAfterMaintenance = (data) => {
    if (Collection.size == 0)
    {
        console.log("Collection is Empty");
        console.log("Setting Collection");
        Collection = data;
    }

}
module.exports = {
    AllUser,
    User,
    Rooms,
    Collection,
    addUsertoTotal,
    addUser,
    removeUser,
    addMessage,
    removeUserFromTotal,
    getTotalUser,
    UsersInCurrentRoom,
    setCollectionAfterMaintenance
}
