const express = require("express")
const app = express();
const http = require("http");
const { Server } = require("socket.io")
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

const usernames = {}
const rooms = [
    { name: "globalChat", creator: "anonymous" },
    { name: "chess", creator: "anonymous" },
    { name: "javascript", creator: "anonymous" }
];

io.on("connection", function (socket) {
    socket.on("createUser", function (username) {
        socket.username = username
        usernames[username] = username
        socket.currentRoom = "globalChat"
        socket.join("globalChat")
        socket.emit("updateChat", "INFO", "You have joined globalChat")
    });

    socket.on("sendMessage", function (data) {
        io.sockets.to(socket.currentRoom).emit("updateChat", socket.username, data)
    });

    socket.on("updateRooms", function (room) {
        socket.broadcast.to(socket.currentRoom).emit("updateChat", "INFO", socket.username + " left room");

        socket.leave(socket.currentRoom);
        socket.currentRoom = room;
        socket.join(room);
        socket.emit("updateChat", "INFO", 'You have joined ' + room);
        socket.broadcast.to(socket.currentRoom).emit("updateChat", "INFO", socket.username + " has joined " + room);
    });
})

server.listen(4000, () => {
    console.log("server running at port 4000")
})