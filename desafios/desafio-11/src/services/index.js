const ProductRepository = require('../repositories/productRepository.js');
const CartRepository = require('../repositories/cartRepository.js');

const productServices = new ProductRepository();
const cartServices = new CartRepository();

module.exports = {productServices, cartServices} 