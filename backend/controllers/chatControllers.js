const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");
const { response } = require("express");

const accessChat = asyncHandler( async(req, res) => {
    const { userId } = req.body;

    if (!userId) {
        console.log("UserId param not sent with the request");
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

const fetchChats = asyncHandler(async (req, res) => {
    try {
        var results = Chat.find({users: {$elemMatch: {$eq: req.user._id}}})
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
            .populate("latestMessage")
            .sort({ updatedAt:-1 })
        
        results = await User.populate(results, {
            path: "latestMessage.sender",
            select: "name pic email",
        });

        res.status(200).send(results);
            
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
}) ;

const createGroupChat = asyncHandler( async(req, res) => {
    if(!req.body.users || !req.body.name) {
        return res.status(400).send({ message:"Fill the required fields."});
    }

    var users = JSON.parse(req.body.users);
    console.log(users);
    if (users.length < 2) {
        return res
            .status(400)
            .send("More than 2 users are required to form a group chat");
    }

    users.push(req.user);

    try {
        const groupChat = await Chat.create({
            chatName: req.body.name,
            users: users,
            isGroupChat: true,
            groupAdmin: req.user,
        });

        const fullGroupChat = await Chat.findOne({_id: groupChat._id})
            .populate("users", "-password")
            .populate("groupAdmin", "-password");

        res.status(200).json(fullGroupChat);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});

const renameGroup = asyncHandler (async (req, res) => {
    const { chatId, chatName } = req.body;

        const renamedChat = await Chat.findByIdAndUpdate(
            chatId,
            {chatName: chatName,},
            {new: true,}
        ).populate("users", "-password")
        .populate("groupAdmin", "-password");
        
        if(!renamedChat) {
            res.status(404);
            throw new Error("Chat Not Found");
        } else {
            res.status(200).json(renamedChat);
        }
});

const removeFromGroup = asyncHandler( async(req, res) => {
    const { chatId, userId } = req.body;

    const updatedChat = await Chat.findByIdAndUpdate(
        chatId,
        {$pull: {users: userId},},
        {new: true,}
    ).populate("users", "-password")
    .populate("groupAdmin", "-password");
    
    if(!updatedChat) {
        res.status(404);
        throw new Error("Chat Not Found");
    } else {
        res.status(200).json(updatedChat);
    }
});

const addToGroup = asyncHandler(async (req, res) => {
    const { chatId, userId } = req.body;
    const added = await Chat.findByIdAndUpdate(
        chatId,
        {
            $push: { users: userId },
        },
        {
            new: true,
        }
    )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

    if (!added) {
        res.status(404);
        throw new Error("Chat Not Found");
    } else {
        res.status(200).json(added);
    }
});

module.exports = { accessChat, fetchChats, createGroupChat, renameGroup, removeFromGroup, addToGroup };