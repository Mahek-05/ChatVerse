const asyncHandler = require("express-async-handler");
const User = require('../models/userModel');
const generateToken = require("../config/generateToken");
const axios = require("axios")

const registerUser = asyncHandler( async(req, res) => {
    if(req.body.googleAccessToken) {
        const {googleAccessToken} = req.body;

        axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
            headers: {
                "Authorization": `Bearer ${googleAccessToken}`
            }   
        }).then(async response => {
            console.log("Google OAuth response:", response.data);

            const firstName = response.data.given_name;
            const lastName = response.data.family_name;
            const name = `${firstName} ${lastName}`;
            const email = response.data.email;
            const pic = response.data.picture;
            console.log(name);
            
            if (!firstName || !lastName || !email || !pic) {
                throw new Error("Missing required fields from Google OAuth response");
            }

            const existingUser = await User.findOne({email});

            if(existingUser)
                return res.status(400).json({message: "User already exist."});

            const createdUser = await User.create({
                name,
                email,
                pic,
            });

            res.status(200).json({
                _id: createdUser._id,
                name: createdUser.name,
                email: createdUser.email,
                isAdmin: createdUser.isAdmin,
                pic: createdUser.pic,
                token: generateToken(createdUser._id),
            });
        }).catch(err => {
            console.error("Error in Google signup:", err.message);
            res.status(400).json({message: "Invalid access token"});
        })
    } else {
        const { name,email,password,pic } = req.body;
        try {
            if(!name || !password || !email || name === "" || email === "" || password === "") {
                res.status(400).json({message: "Please enter all the details in all the fields"});
            }

            const existingUser = await User.findOne({email});

            if(existingUser) {
                res.status(400).json({message: "User already exists."});
            }

            const createdUser = await User.create({
                name,
                email,
                password,
                pic
            })

            if(createdUser) {
                res.status(200).json({
                    _id: createdUser._id,
                    name: createdUser.name,
                    email: createdUser.email,
                    isAdmin: createdUser.isAdmin,
                    pic: createdUser.pic,
                    token: generateToken(createdUser._id),
                });
            }
        }catch(err){
            console.error("Error in user registration:", err.message);
            res.status(500).json({message: "Something went wrong"});
        }
    }
});

const authenticateUser = asyncHandler(async(req, res) => {
    if(req.body.googleAccessToken){
        const {googleAccessToken} = req.body;

        axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
            headers: {
                "Authorization": `Bearer ${googleAccessToken}`
            }
        }).then(async response => {
            const email = response.data.email;

            const existingUser = await User.findOne({email})

            if(!existingUser)
                return res.status(404).json({meassage: "User doesn't exist"});
            
            res.status(200).json({
                _id: existingUser._id,
                name: existingUser.name,
                email: existingUser.email,
                isAdmin: existingUser.isAdmin,
                pic: existingUser.pic,
                token: generateToken(existingUser._id),
            })           
        }).catch(err => {
            res.status(400).json({message: "Invalid access token"})
        })
    } else {
        const { email, password } = req.body;
        
        if (email === "" || password === "") 
            return res.status(400).json({message: "Invalid field!"});
        
        try{
            const existingUser = await User.findOne({ email });
            if(!existingUser) 
                return res.status(404).json({message: "User doesnt exist"});

            const verified = await existingUser.verifyPassword(password);

            if(!verified) 
                return res.status(400).json({message: "Incorrect Password"});

            res.status(200).json({
                _id: existingUser._id,
                name: existingUser.name,
                email: existingUser.email,
                isAdmin: existingUser.isAdmin,
                pic: existingUser.pic,
                token: generateToken(existingUser._id),
            });
        } catch(err) {
            res.status(500).json({message: "Something went wrong"});
        }
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