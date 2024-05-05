const CartManager = require('../controllers/CartManager');
const express = require('express');


const router = express.Router();

const cartManager = new CartManager();

router.post('/carts', async (request, response) => {
    try {
        let result = await cartManager.createCart();
        if (result.status) {
            response.status(200).send({ message: result.message, cart: result.cart });
        } else {
            response.status(500).send({ message: 'No se pudo crear el carrito' });
        }
    } catch (error) {
        response.status(500).send({ message: `Error al crear el carrito:   ${error.message}` });
    }

})

router.get('/carts/:cid', async (request, response) => {
    const id = request.params.cid;
    try {
        const cart = await cartManager.getProductsByCart(id);
        cart.status ? response.status(200).send({ message: cart.message, cart: cart.cart }) : response.status(404).send({ message: cart.message });

    } catch (error) {
        response.status(500).send(error.message);
    }
})

router.post('/carts/:cid/products/:pid', async (request, response) => {
    const pid = request.params.pid;
    const cid = request.params.cid;
    const quantity = request.body.quantity;
    try {
        const updateCart = await cartManager.addProductToCart(cid, pid, quantity);
            updateCart.status ? response.status(200).send({ message: updateCart.message }) : response.status(404).send({ message: updateCart.message })
    
    } catch (error) {
        response.status(500).send(error.message);
    }
})

router.delete('/carts/:cid/products/:pid', async (request,response) =>{
    const pid = request.params.pid;
    const cid = request.params.cid;
    let quantity;
    try {
        const productDelete = await cartManager.deleteProduct(cid,pid,quantity);
        if(productDelete.status){
            return response.status(200).send({ message: productDelete.message })
        }
    } catch (error) {
        response.status(500).send(error.message);
    }
})
router.delete('/carts/:cid', async (request, response)=>{
    const cid = request.params.cid;
    try {
        const emptyCart = await cartManager.emptyCart(cid)
        emptyCart.status ? response.status(200).send({ message: emptyCart.message}) : response.status(404).send({ message: emptyCart.message });
    } catch (error) {
        response.status(500).send(error.message);
    }
})

router.put('/carts/:cid/products/:pid' , async (request,response) =>{
    const pid = request.params.pid;
    const cid = request.params.cid;
    let quantity;
    try {
        const updateQuantity = await cartManager.updateQuantity(cid,pid,quantity)
        updateQuantity.status ? response.status(200).send({ message: updateQuantity.message}) : response.status(404).send({ message: updateQuantity.message });
    } catch (error) {
        response.status(500).send(error.message);
    }
})

router.put('/carts/:cid', async (request,response) =>{
    const cid = request.params.cid;
    const data = request.body;
    try {
        const newFormat = await cartManager.updateCart(cid,data)
        newFormat.status ? response.status(200).send({message: newFormat.message}) : response.status(404).send({message: newFormat.message})
    } catch (error) {
        response.status(500).send(error.message);
    }
})

module.exports = router;