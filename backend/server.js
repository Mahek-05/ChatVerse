const express = require("express");
const dotenv = require('dotenv');
const colors = require('colors');
const connectDB = require('./config/db');
const messageRoutes  = require('./routes/messageRoutes');
const userRoutes  = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const {notFound, errorHandler} = require('./middleware/errorMiddleware');
const path = require("path");

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 5000;

// app.get("/", (req, res) => {
//     res.send("api is running");
// });

app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes);

// ------ configuring for deployment -------

const  __dirname1 = path.resolve();

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname1, "/frontend/build")));

    app.get("*", (req, res) =>
        res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"))
    );
} else {
    app.get("/", (req, res) => {
        res.send("API is running..");
    });
}

// --------- deployment ---------

app.use(notFound);
app.use(errorHandler);

const server = app.listen(
    PORT,
    console.log(`Server running on PORT ${PORT}...`.yellow.bold)
);

const io = require("socket.io")(server, {
    pingTimeout: 60000,
    cors: {
        origin: "http://localhost:3000",
        // credentials: true,
    },
});

io.on("connection", (socket) => {
    
    console.log("Connected to socket.io.".yellow.bold);
    
    socket.on("setup", (userData) => {
        socket.join(userData._id);
        socket.emit("connected");
    });

    socket.on("join chat", (room) => {
        socket.join(room);
        console.log("User Joined Room: " + room);
    });
    
    socket.on("typing", (room) => socket.in(room).emit("typing"));
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

    socket.on("new message", (newMessageRecieved) => {
        var chat = newMessageRecieved.chat;

        if (!chat.users) return console.log("chat.users not defined");

        chat.users.forEach((user) => {
            if (user._id == newMessageRecieved.sender._id) return;

            socket.in(user._id).emit("message recieved", newMessageRecieved);
        });
    });

    socket.off("setup", () => {
        console.log("USER DISCONNECTED".red.bold);
        socket.leave(userData._id);
    });
});