const mongoose = require('mongoose');

const cartsSchema = new mongoose.Schema({
    products : [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true
            },
            quantity:{
                type: Number,
                required: true
            }
        }
    ]
});

const cartsModel = mongoose.model("carts", cartsSchema);
module.exports = cartsModel;