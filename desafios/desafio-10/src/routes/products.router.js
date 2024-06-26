const ProductManager = require('../controllers/ProductManager');
const express = require('express');
const router = express.Router();


const productManager = new ProductManager();
router.get('/products', productManager.getProducts);

router.get('/products/:pid', productManager.getProductsById);

router.post('/products', productManager.addProduct);

router.put('/products/:pid', productManager.updateProduct);

router.delete('/products/:pid', productManager.deleteProduct);


module.exports = router;