const express = require("express");
require("./db/mongoose");
var admin = require("firebase-admin");
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const adminRouter = require("./routers/adminRouter");
const teacherRouter = require("./routers/teacherRouter");
const userRouter = require("./routers/userRouter");
const cors = require("cors");
const Filter = require('bad-words');
var serviceAccount = require("../serviceAccountKey.json");
var { User,Collection,addUser, removeUser,addMessage,addUsertoTotal,removeUserFromTotal,UsersInCurrentRoom,getCollectionAfterMaintenance } = require('./utils/user');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "studlifesrm.appspot.com",
});

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const port = process.env.PORT;
const filter = new Filter();

app.use(express.json());
app.use(cors());
app.use(adminRouter);
app.use(teacherRouter);
app.use(userRouter);

io.on('connection', (socket) => {
  
  addUsertoTotal();

  socket.on('join', ({ username, roomName ,official}) => {
    console.log(`JOIN ${username} in ${roomName}`);
    socket.join(roomName);
    Collection=getCollectionAfterMaintenance();
    if (Collection.has(roomName))
      socket.emit("OldMessages", Collection.get(roomName));
    let user = User.get(socket.id);
    if(user && user.roomName){
      //user connected but due to some bug hasn't left the previous room
      //this will auto leave from his prev rooms if any
      socket.leave(user.roomName);
      console.log(`${user.username} left room ${user.roomName}`); //log
      socket.broadcast.to(user.roomName).emit("Welcome", user.username + " has left the room"); //broadcast 'left' to #welcome
      removeUser(socket.id); //removeUser from global maintained for stats
      io.to(user.roomName).emit("roomData", UsersInCurrentRoom(user.roomName));
    }
    addUser(socket.id, username, roomName,official);
    io.to(roomName).emit("roomData", UsersInCurrentRoom(roomName));
  }); 

  socket.on('privateMessage', ({ toid, message }) => {
    console.log(`PRIVATE_MSG ${toid}, ${message}`);
    socket.to(toid).emit(filter.clean(message));
  });  

  socket.on('sendMessage', ({ username, message}) => {
    let user = User.get(socket.id);
    //null check
    if(!user || !user.roomName) {console.log('sendmessage: nullcheck failed'); return;}
    console.log(`SEND_MSG ${username} ${message} `);
    addMessage(socket.id, username, user.roomName, filter.clean(message));
    socket.broadcast.to(user.roomName).emit("receiveMessage", { username, message:filter.clean(message)});
  });

  socket.on('leave', () => {
    let user = User.get(socket.id);
    if(!user || !user.roomName) return;
    socket.leave(user.roomName);
    console.log(`${user.username} left`); //log
    socket.broadcast.to(user.roomName).emit("Welcome", user.username + " has left the room"); //broadcast 'left' to #welcome
    removeUser(socket.id); //delete User[socket.id]
    io.to(user.roomName).emit("roomData", UsersInCurrentRoom(user.roomName)); 
  });

  socket.on('disconnect', () => {
    removeUserFromTotal();
  });
});

app.get("*", (req, res) => {
  res.send("Page does not exist");
});

server.listen(port, () => {
  console.log("Server is up and running");
});
