const CartManager = require('../controllers/CartManager');
const express = require('express');

const router = express.Router();

const cartManager = new CartManager();

router.post('/carts', cartManager.createCart);

router.get('/carts/:cid', cartManager.getProductsByCart);

router.post('/carts/:cid/products/:pid', cartManager.addProductToCart);

router.delete('/carts/:cid/products/:pid', cartManager.deleteProduct);

router.delete('/carts/:cid', cartManager.emptyCart);

router.put('/carts/:cid/products/:pid', cartManager.updateQuantity);

router.put('/carts/:cid', cartManager.updateCart);

router.post('/carts/:cid/purchase', cartManager.confirmPurchase);


module.exports = router;