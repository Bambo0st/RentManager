const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String, required: true
    }
}, {
    timestamps: true,
})

userSchema.methods.checkPassword = async function (password) //cannot use arrow function when we use "this"
{
    return await bcrypt.compare(password, this.password)
}

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) { //not sure why we did this
        next();
    }

    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

const User = mongoose.model('User', userSchema);
module.exports = User;