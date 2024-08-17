const mongoose = require('mongoose');
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
        type: String,
    },
    pic: {
        type: String,
        default:
        "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false,
    },
},
    {
        timestamps: true,
    }
);

userSchema.methods.verifyPassword = async function(inputPassword) {
    return await bcrypt.compare(inputPassword, this.password);
}

userSchema.pre('save', async function (next) {
    if (!this.isModified) {
        next();
    }

    if(this.password) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }

});

const User = mongoose.model("User", userSchema);
module.exports = User;