const CartModel = require('../models/carts.model.js')


class CartManager {

    async createCart() {
        try {
            const newCart = new CartModel({products: []});
            await newCart.save();
            return { status: true, message: `Carrito Creado` }

        } catch (error) {
            return { status: false, message: `LO SENTIMOS, HA OCURRIDO UN ERROR ${error}` }
        }

    }

    async getProductsByCart(id) {
        try {
            const cartFound = await CartModel.findById(id);
            if (cartFound) {
                return { status: true, message: 'Carrito encontrado:', cart: cartFound };
            }
            return { status: false, message: `ERROR Not Found : ${id}` }
        } catch (error) {
            return { status: false, message: `LO SENTIMOS, HA OCURRIDO UN ERROR ${error}` }
        }
    }

    async addProductToCart(id, productId, quantity) {
        try {
            const cartFound = await CartModel.findById(id);
            if (cartFound) {
                const existingProduct = cartFound.products.find(e => e.id == productId);
                existingProduct ? existingProduct.quantity += quantity : cartFound.products.push({ id: productId, quantity: quantity });
                cartFound.markModified("products");
                await cartFound.save();
                return { status: true, message: 'Producto Agregado' }
            }
            else {
                return { status: false, message: `ERROR Not Found : ${id}` }
            }
        }
        catch (error) {
            return { status: false, message: `LO SENTIMOS, HA OCURRIDO UN ERROR ${error}` }
        }

    }

}

module.exports = CartManager;