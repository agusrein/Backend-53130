const express = require("express");
const router = express.Router();
const ProductManager = require('../controllers/ProductManager');
const productsManager = new ProductManager();

router.get('/products', async (request,response) =>{
    try {
        const products = await productsManager.getProducts();
        response.render('home', {products: products.products});
    } catch (error) {
        response.status(500).send({ message: error.message});
    }
   
})


// const finalProducts = products.map( e =>{
                //     const{_id,...rest} = e.toObject({getters: false});
                //     return rest;
                // })

router.get("/realtimeproducts", (request, response) => {
    try {
        response.render('realtimeproducts')
    } catch (error) {
        response.status(500).send({ message: error.message });
    }
})

router.get("/chat", async (req, res) => {
    res.render("messages");
})

module.exports = router;