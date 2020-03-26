const express = require("express");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");
const formatMessage = require("./utils/messages");
const botName = "Chord Bot";
const {
    userJoin,
    getCurrentUser,
    userLeaves,
    getUserRoom
} = require("./utils/user");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

//Set static folders
app.use(express.static(path.join(__dirname, "public")));

//Run when client connects
io.on("connection", socket => {
    console.log("New connection...");

    socket.on("joinRoom", ({ username, room }) => {
        const user = userJoin(socket.id, username, room);

        socket.join(room);

        socket.emit(
            "message",
            formatMessage(botName, `Welcome to Chat Chord! ${user.username}`)
        );

        socket.broadcast
            .to(user.room)
            .emit(
                "message",
                formatMessage(
                    user.username,
                    `${user.username} has joined the chat!`
                )
            );

        io.to(user.room).emit("roomUsers", {
            room: user.room,
            users: getUserRoom(user.room)
        });

        //Listen for chat message
        socket.on("chatMessage", message => {
            console.log(message);
            //Emit the recieved message to evrybody!!
            io.to(user.room).emit(
                "message",
                formatMessage(user.username, message)
            );
        });

        socket.on("disconnect", () => {
            const user = userLeaves(socket.id);
            if (user) {
                io.to(user.room).emit(
                    "message",
                    formatMessage(
                        botName,
                        `${user.username} has left the chat!`
                    )
                );
            }
        });
    });
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, "0.0.0.0", () => {
    console.log(`app listening on ${PORT}`);
});
