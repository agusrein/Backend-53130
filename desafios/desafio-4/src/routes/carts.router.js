const CartManager = require('../controllers/CartManager');
const ProductManager = require('../controllers/ProductManager');
const express = require('express');
const router = express.Router();

const productManager = new ProductManager('./src/models/products.json')
const cartManager = new CartManager('./src/models/cart.json');

router.post('/carts', async (request, response) => {
    try {
        let result = await cartManager.createCart();
        if (result.status) {
            response.status(200).send({ message: result.message });
        } else {
            response.status(500).send({ message: 'No se pudo crear el carrito' });
        }
    } catch (error) {
        response.status(500).send({ message: `Error al crear el carrito:   ${error.message}` });
    }

})

router.get('/carts/:cid', async (request, response) => {
    const id = parseInt(request.params.cid);
    try {
        const cart = await cartManager.getProductsByCart(id);
        cart.status ? response.status(200).send({ message: cart.message, cart: cart.cart }) : response.status(404).send({ message: cart.message });

    } catch (error) {
        response.status(500).send(error.message);
    }
})

router.post('/carts/:cid/products/:pid', async (request, response) => {
    const pid = parseInt(request.params.pid);
    const cid = parseInt(request.params.cid);
    const quantity = request.body.quantity;
    try {
        const totalProducts = await productManager.getProducts();
        if (totalProducts.status) {
            const products = totalProducts.products.length;
            if (products >= pid) { //Corroboro que el id de producto que quiero agregar exista en la longitud del array;
                const updateCart = await cartManager.addProductToCart(cid, pid, quantity);
                updateCart.status ? response.status(200).send({ message: updateCart.message }) : response.status(404).send({ message: updateCart.message })
            }
            else{
                response.status(404).send({message: 'El producto que intenta agregar no existe'});
            }
        }
        
    } catch (error) {
        response.status(500).send(error.message);
    }
})



module.exports = router;