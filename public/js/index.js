var socket = io();

socket.emit('join', ({ room }, callback) => {
    console.log("connected");
});