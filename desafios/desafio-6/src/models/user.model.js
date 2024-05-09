const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    first_name:{
        type: String,
        required: true
    } ,
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        index: true,
        unique: true
    },
    pass: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    }

});

const userModel = mongoose.model("users", userSchema);
module.exports = userModel;