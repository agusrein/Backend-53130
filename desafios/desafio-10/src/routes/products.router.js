const ProductManager = require('../controllers/ProductManager');
const express = require('express');
const router = express.Router();
const roleCheck = require('../middleware/checkrole.js');
const jwtAuth = require('../middleware/jwtAuthenticate.js');

const productManager = new ProductManager();
router.get('/mockingproducts',jwtAuth, productManager.createProducts);

router.get('/products', productManager.getProducts);

router.get('/products/:pid',jwtAuth,roleCheck('admin'), productManager.getProductsById);

router.post('/products',jwtAuth,roleCheck('admin'), productManager.addProduct);

router.put('/products/:pid',jwtAuth,roleCheck('admin'), productManager.updateProduct);

router.delete('/products/:pid',jwtAuth,roleCheck('admin'), productManager.deleteProduct);


module.exports = router;