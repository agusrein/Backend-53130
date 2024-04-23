const mongoose = require('mongoose');

const messagesSchema = new mongoose.Schema({
    user: {
        tyoe: String,
        required: true
    },
    message: {
        type: String,
        required: true
    }
});

const messagesModel = mongoose.model("Messages", messagesSchema);
module.exports = messagesModel;