const asyncHandler = require('express-async-handler');
const User = require('../models/userModel.js');
const generateToken = require('../utils/generateToken')
const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && (await user.checkPassword(password))) {
        generateToken(res, user._id);
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
        });
    }
    else {
        res.status(401);
        throw new Error('Invalid email or password');
    }
})
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }
    const user = await User.create({ ...req.body });
    if (user) {
        generateToken(res, user._id);
        res.status(201).json({ _id: user._id, name: user.name, email: user.email })
    }
    else {
        res.status(400);
        throw new Error('Invalid user data')
    }
})

const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email
        console.log(req.body.name);
        
        if (req.body.password) {
            user.password = req.body.password;
        }
        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email
        })
    }
    else {
        res.status(404);
        throw new Error('User not found');
    }

})
const logoutUser = asyncHandler(async (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0),
    })
    res.status(200).json({ message: "Logged out successfully" })
})
const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findOne(req.user._id);
    if (user) {
        res.json(
            {
                _id: user._id,
                name: user.name,
                email: user.email
            });
    }
    else {
        res.status(404);
        throw new Error("User not found");
    }
})



module.exports = { authUser, registerUser, updateUserProfile, logoutUser, getUserProfile }   