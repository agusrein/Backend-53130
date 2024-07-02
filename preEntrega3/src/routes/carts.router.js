const CartManager = require('../controllers/CartManager');
const express = require('express');
const jwtAuth = require('../middleware/jwtAuthenticate.js');
const router = express.Router();

const cartManager = new CartManager();

router.post('/carts',jwtAuth,cartManager.createCart);

router.get('/carts/:cid',jwtAuth, cartManager.getProductsByCart);

router.post('/carts/:cid/products/:pid',jwtAuth, cartManager.addProductToCart);

router.delete('/carts/:cid/products/:pid',jwtAuth, cartManager.deleteProduct);

router.delete('/carts/:cid',jwtAuth, cartManager.emptyCart);

router.put('/carts/:cid/products/:pid',jwtAuth, cartManager.updateQuantity);

router.put('/carts/:cid',jwtAuth, cartManager.updateCart);

router.put('/carts/:cid/purchase',jwtAuth, cartManager.confirmPurchase);


module.exports = router;