const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");

const accessChat = asyncHandler( async(req, res) => {
    console.log(req.body);
    const { userId } = req.body;

    if (!userId) {
        console.log("UserId param not sent with the rerquest");
        return res.sendStatus(400);
    }

    // finds the list of documents in the Chat model satifying the following two conditions:
    // 1. isgroupChat : false,  
    // 2. users array contains req.user._id(client id) and userId(id requested by client)
    // after finding populate the users and latestMessage field of the found documents with the 
    // corresponding object from the referenced (ref field) model

    // isChat will be an array of Chat documents where:
    // The users field is populated with User documents (excluding password).
    // The latestMessage field is populated with a Message document.
    var isChat = await Chat.find({
        isGroupChat: false,
        $and : [
            {users: {$elemMatch: { $eq: req.user._id}}},
            {users: {$elemMatch: { $eq: userId}}},
        ],
    }).populate("users", "-password")
        .populate("latestMessage");
    
    // populate all the documents in the isChat array using the User model
    // the sender field inside latestMessage field will be populated with nam , pic and email of the corresponding 
    // document from the user model    
    isChat = await User.populate(isChat, {
        path: "latestMessage.sender",
        select: "name pic email",
    });

    if (isChat.length > 0) {
        res.send(isChat[0]);
    } else {
        var chatData = {
        chatName: "sender",
        isGroupChat: false,
        users: [req.user._id, userId],
        };

        try {
        const createdChat = await Chat.create(chatData);
        const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
            "users",
            "-password"
        );
        res.status(200).json(FullChat);
        } catch (error) {
        res.status(400);
        throw new Error(error.message);
        }
    }
});


module.exports = { accessChat }