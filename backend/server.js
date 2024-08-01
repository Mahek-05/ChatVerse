const express = require("express");
const dotenv = require('dotenv');
const colors = require('colors');
const { chats } = require("./data/data");
const connectDB = require('./config/db');
const messageRoutes  = require('./routes/messageRoutes');
const userRoutes  = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const {notFound, errorHandler} = require('./middleware/errorMiddleware');

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
    res.send("api is running");
});

app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, console.log(`Server started on port ${PORT}`.yellow));