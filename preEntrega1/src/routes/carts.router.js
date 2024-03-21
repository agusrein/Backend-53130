const express = require('express');
const router = express.Router();
const CartManager = require('../controllers/CartManager');

const cartManager = new CartManager('./src/models/cart.json');

router.post('/carts', async (request,response)=>{
    try {
        let newCart = await cartManager.createCart();
        response.status(200).send({message:`CARRITO CREADO :${newCart}`});
        
    } catch (error) {
        response.status(500).send({ message: `FILE NOT FOUND ${error}` });
    }
    
})

// router.get('/carts/:cid', async (request,response)=>{
//     try {
//        const id = parseInt(request.params.cid);
//        const cart = await cartManager.getProductsByCart(id);
//        if(cart){
//         return response.status(200).send(newCart);
//        } 
//        return response.status(404).send(`ERROR PRODUCT (${id}) NOT FOUND`);
//     } catch (error) {
//         response.status(500).send({ message: `FILE NOT FOUND ${error}` });
//     }
// })



module.exports = router;