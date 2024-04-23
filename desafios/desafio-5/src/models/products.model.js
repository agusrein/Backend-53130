const mongoose = require('mongoose');

const productsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    price:{
        type: Number,
        required: true
    },
    thumbnail: {
        type: [String],
    },
    code: {
        type: String,
        unique: true,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    status: {
        type: Boolean,
        required: true
    },
    img:{
        type: String,
    },
    category: {
        type: String,
        required: true
    }
});

const productsModel = mongoose.model("products", productsSchema);
module.exports = productsModel;