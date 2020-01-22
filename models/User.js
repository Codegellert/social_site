const mongoose = require('mongoose');
const userSchema = new mongoose.Schema ({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    fullName : {
        type: String,
        default: undefined
    },
    admin: {
        type: Boolean,
        default: false
    },
    date: {
        type: Date,
        required: true,
        default: Date.now 
    }
});

const User = mongoose.model('user', userSchema);

module.exports = User;