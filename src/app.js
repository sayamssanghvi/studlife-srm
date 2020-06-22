const express = require("express");
require("./db/mongoose");
var admin = require("firebase-admin");
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
var serviceAccount = require("../serviceAccountKey.json");
const adminRouter = require("./routers/adminRouter");
const teacherRouter = require("./routers/teacherRouter");
const userRouter = require("./routers/userRouter");
const cors = require("cors");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "studlifesrm.appspot.com",
});

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const port = process.env.PORT;

const publicDirectory = path.join(__dirname, "../public");

app.use(express.static(publicDirectory));

app.use(express.json());
app.use(cors());
app.use(adminRouter);
app.use(teacherRouter);
app.use(userRouter);

io.on('connection', (socket) => {
  console.log("Connecnted-" + socket.id);
  socket.on('join', ({ username, room }, callback) => {
    socket.join(room);
    io.in(room).emit("Welcome", username + " has joined the room");
  })
});

app.get("*", (req, res) => {
  res.send("Page does not exist");
});

server.listen(port, () => {
  console.log("Server is up and running");
})
