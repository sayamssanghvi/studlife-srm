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
var { AllUser,User,Rooms,addUser, removeUser } = require('./utils/user');

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
  
    socket.emit("Welcome", "Welcome to server");
    socket.broadcast.to(room).emit("Welcome", username + " has joined the room");
    socket.join(room);
    addUser(socket.id, username, room);
    io.to(room).emit("roomData", User);
  }); 

  socket.on('privateMessage', ({ toid, message }) => {
    socket.to(toid).emit(filter.clean(message));
  });  

  socket.on('sendMessage', ({ username, message}) => {
    let user = User[socket.id];
    socket.broadcast.to(user.room).emit("receiveMessage", { username, message:filter.clean(message) });
  });

  socket.on('leave', () => {
    let user = User[socket.id];
    removeUser(socket.id);
    socket.broadcast.to(user.room).emit("Welcome", user.username + " has left the room");
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
