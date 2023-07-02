const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler')
const User = require("../models/userModel")

const protect = asyncHandler(async (req, res, next) => {
    let token;
    token = req.cookies.jwt;

    if (token) {
        try {
            const payload = jwt.verify(token, process.env.JWT_SECRET);

            req.user = await User.findById(payload.userId).select('-password'); //selects everything other than password
            // req.user = { userId: payload.userId, name: payload.name }  This is alternate syntax

            next();
        } catch (error) {
            console.error(error);
            res.status(401);
            throw new Error('Not authorized, token failed');
        }
    } else {
        res.status(401);
        throw new Error('Not authorized, no token');
    }
})

module.exports = protect;