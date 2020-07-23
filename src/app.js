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
var { AllUser,User,Rooms,Collection,addUser, removeUser,addMessage } = require('./utils/user');

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
  AllUser++;
  console.log("TotalUsers="+AllUser);

  socket.on('join', ({ username, room }) => {
    console.log(`JOIN ${username} in ${room}`);
    
    socket.join(room);
    if (Collection.has(room))
      socket.emit("OldMessages", Collection.get(room));
    let user = User[socket.id];
    if(user && user.room){
      //user connected but due to some bug hasn't left the previous room
      //this will auto leave from his prev rooms if any
      socket.leave(user.room);
      console.log(`${user} left room ${user.room}`); //log
      socket.broadcast.to(user.room).emit("Welcome", user.username + " has left the room"); //broadcast 'left' to #welcome
      removeUser(socket.id); //removeUser from global maintained for stats
      io.to(user.room).emit("roomData", User);
    }
    addUser(socket.id, username, room);
    io.to(room).emit("roomData", User);
  }); 

  socket.on('privateMessage', ({ toid, message }) => {
    console.log(`PRIVATE_MSG ${toid}, ${message}`);
    socket.to(toid).emit(filter.clean(message));
  });  

  socket.on('sendMessage', ({ username, message}) => {
    let user = User[socket.id];
    //null check
    if(!user || !user.room) {console.log('sendmessage: nullcheck failed'); return;}
    console.log(`SEND_MSG ${username} ${message} ${user}`);
    addMessage(socket.id, username, user.room, message);
    socket.broadcast.to(user.room).emit("receiveMessage", { username, message:filter.clean(message) });
  });

  socket.on('leave', () => {
    let user = User[socket.id];
    if(!user || !user.room) return;
    socket.leave(user.room);
    console.log(`${user} left`); //log
    socket.broadcast.to(user.room).emit("Welcome", user.username + " has left the room"); //broadcast 'left' to #welcome
    removeUser(socket.id); //delete User[socket.id]
    io.to(user.room).emit("roomData", User); 
  });

  socket.on('disconnect', () => {
    AllUser--;
    console.log("Total User=", AllUser);
  });
});

app.get("*", (req, res) => {
  res.send("Page does not exist");
});

server.listen(port, () => {
  console.log("Server is up and running");
});
