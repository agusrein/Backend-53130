const express = require("express");
const router = express.Router();
const ProductManager = require('../controllers/ProductManager');
const productsManager = new ProductManager('./src/models/products.json');

router.get('/', async (request,response) =>{
    try {
        const products = await productsManager.getProducts();
        response.render('home', {products: products.products});
    } catch (error) {
        response.status(500).send({ message:error.message});
    }
   
})


router.get("/realtimeproducts", (request,response)=>{
    try {
        response.render('realtimeproducts')
    } catch (error) {
        response.status(500).send({ message:error.message});
    }
})
module.exports = router;