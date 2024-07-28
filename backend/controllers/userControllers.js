const asyncHandler = require("express-async-handler");
const User = require('../models/userModel');
const generateToken = require("../config/generateToken");

const registerUser = asyncHandler( async(req, res) => {
    const { name,email,password,pic } = req.body;

    if(!name || !password || !email) {
        res.status(400);
        throw new Error("Please enter all the deatils in all the fields");
    }

    const userExist = await User.findOne({email});

    if(userExist) {
        res.status(400);
        throw new Error("User already exists.")
    }

    const createUser = await User.create({
        name,
        email,
        password,
        pic
    })

    if(createUser) {
        res.status(201).json({
            _id: createUser._id,
            name: createUser.name,
            email: createUser.email,
            isAdmin: createUser.isAdmin,
            pic: createUser.pic,
            token: generateToken(createUser._id),
        });
    } else {
        res.status(400);
        throw new Eroor("Failed to register new user");
    }
});

const authenticateUser = asyncHandler(async(req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.verifyPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            pic: user.pic,
            token: generateToken(user._id),
        });
    } else {
        res.status(401);
        throw new Error("Invalid Email or Password");
    }
});

// /api/user?search=mahek
const allUsers = asyncHandler( async(req, res) => {
    const keyword = req.query.search 
        ? {
            $or: [
                {name: {$regex:req.query.search, $options: "i"}},
                {email: {$regex:req.query.search, $options: "i"}},
            ]
        }
        : {};
    const users = await User.find(keyword).find({_id:{$ne:req.user._id}});
    res.send(users);
    // console.log(keyword);
});

module.exports = {registerUser, authenticateUser, allUsers};