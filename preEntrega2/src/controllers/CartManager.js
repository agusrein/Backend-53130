const CartModel = require('../models/carts.model.js')


class CartManager {

    async createCart() {
        try {
            const newCart = new CartModel({ products: [] });
            await newCart.save();
            return { status: true, message: `Carrito Creado`, cart: newCart }

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
                const existingProduct = cartFound.products.find(e => e.product.toString() == productId);
                existingProduct ? existingProduct.quantity += quantity : cartFound.products.push({ product: productId, quantity });
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

    async deleteProduct(id, productId, quantity = 1) {
        try {
            const cartFound = await CartModel.findById(id);
            if (cartFound) {
                const existingProduct = cartFound.products.find(e => e.product.toString() == productId);
                const existingProductIndex = cartFound.products.findIndex(e => e.product.toString() == productId);
                if (existingProduct) {
                    existingProduct.quantity -= quantity;
                    if (existingProduct.quantity == 0) {
                        cartFound.products.splice(existingProductIndex, 1)
                    }
                    cartFound.markModified("products");
                    await cartFound.save();
                    return { status: true, message: 'Producto Eliminado' }
                } else {
                    return { status: false, message: `ERROR Not Found : ${productId}` }
                }
            }
            else {
                return { status: false, message: `ERROR Not Found : ${id}` }
            }
        } catch (error) {
            return { status: false, message: `LO SENTIMOS, HA OCURRIDO UN ERROR ${error}` }
        }

    }

    async emptyCart(id){
        try {
            const cartFound = await CartModel.findById(id);
            if (cartFound) {
                cartFound.products = []
                cartFound.__v = 0;
                await cartFound.save();
                return { status: true, message: 'Carrito Eliminado:'};
            }
            return { status: false, message: `ERROR Not Found : ${id}` }
        } catch (error) {
            return { status: false, message: `LO SENTIMOS, HA OCURRIDO UN ERROR ${error}` }
        }
    }

}

module.exports = CartManager;