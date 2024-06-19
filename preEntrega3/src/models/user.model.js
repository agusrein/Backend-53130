const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    first_name:{
        type: String,
        required: true
    } ,
    last_name: {
        type: String
    },
    email: {
        type: String,
        required: true,
        index: true,
        unique: true
    },
    pass: {
        type: String
    },
    age: {
        type: Number
    },
    role: {
        type: String,
        default: 'user',
        enum: ['admin', 'user']
    }

});

const userModel = mongoose.model("users", userSchema);
module.exports = userModel;