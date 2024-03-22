const CartManager = require('../controllers/CartManager');
const express = require('express');
const router = express.Router();


const cartManager = new CartManager('./src/models/cart.json');

router.post('/carts', async (request,response)=>{
    try {
        await cartManager.createCart();
        response.status(200).send({message:`CARRITO CREADO`});
        
    } catch (error) {
        response.status(500).send({ message: `FILE NOT FOUND ${error}` });
    }
    
})

router.get('/carts/:cid', async (request,response)=>{
    const id = parseInt(request.params.cid);
    try {
       const cart = await cartManager.getProductsByCart(id);
       if(cart){
        return response.status(200).send(cart);
       } 
       return response.status(404).send(`ERROR PRODUCT (${id}) NOT FOUND`);
    } catch (error) {
        response.status(500).send({ message: `FILE NOT FOUND ${error}` });
    }
})

router.post('/carts/:cid/products/:pid', async (request,response)=>{
    const pid = parseInt(request.params.pid);
    const cid = parseInt(request.params.cid);
    const quantity = request.body.quantity;
    try {
        const updateCart = await cartManager.addProductToCart(cid,pid,quantity);
        response.status(200).send({message: `SUCCESS PRODUCTO ACTUALIZADO`})
        
    } catch (error) {
        response.status(500).send({ message: `FILE NOT FOUND ${error}` });
    }
})



module.exports = router;